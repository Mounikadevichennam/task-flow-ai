const { createCalendarEvent } = require("../services/googleCalendarService");
const Assignment = require('../models/Assignment');
const Reminder = require('../models/Reminder');
const ActivityLog = require('../models/ActivityLog');

// Helper to parse input date string as Asia/Kolkata IST if no timezone offset is provided
const parseISTDate = (inputDate) => {
  if (!inputDate) return new Date();
  if (typeof inputDate === 'string') {
    if (!inputDate.includes('Z') && !inputDate.includes('+') && !inputDate.includes('-', 10)) {
      return new Date(`${inputDate}:00+05:30`);
    }
  }
  return new Date(inputDate);
};

// @desc    Get all assignments for logged in user with search, filter, sort
// @route   GET /api/assignments
const getAssignments = async (req, res) => {
  try {
    const { search, priority, status, category, sortBy, sortOrder } = req.query;

    const query = { user: req.user._id };

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filters
    if (priority && priority !== 'All') {
      query.priority = priority;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    // Sort
    let sortOptions = { deadline: 1 }; // Default sort: soonest deadline first
    if (sortBy) {
      const order = sortOrder === 'desc' ? -1 : 1;
      if (sortBy === 'deadline') sortOptions = { deadline: order };
      else if (sortBy === 'priority') {
        sortOptions = { priority: order };
      } else if (sortBy === 'title') sortOptions = { title: order };
      else if (sortBy === 'createdAt') sortOptions = { createdAt: order };
    }

    let assignments = await Assignment.find(query).sort(sortOptions);

    // Custom Priority Sort if requested
    if (sortBy === 'priority') {
      const priorityMap = { High: 1, Medium: 2, Low: 3 };
      assignments.sort((a, b) => {
        const pA = priorityMap[a.priority] || 4;
        const pB = priorityMap[b.priority] || 4;
        return sortOrder === 'desc' ? pB - pA : pA - pB;
      });
    }

    res.json({ success: true, count: assignments.length, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new assignment
// @route   POST /api/assignments
const createAssignment = async (req, res) => {
  try {
    const {
      title,
      subject,
      description,
      deadline,
      priority,
      estimatedHours,
      status,
      category,
      notes
    } = req.body;

    if (!title || !subject || !deadline) {
      return res.status(400).json({ success: false, message: 'Title, Subject, and Deadline are required' });
    }

    const parsedDeadline = parseISTDate(deadline);

    const assignment = await Assignment.create({
      user: req.user._id,
      title,
      subject,
      description: description || '',
      deadline: parsedDeadline,
      priority: priority || 'Medium',
      estimatedHours: estimatedHours ? Number(estimatedHours) : 1,
      status: status || 'Pending',
      category: category || 'Homework',
      notes: notes || '',
      completedAt: status === 'Completed' ? new Date() : null
    });

    
    // Create Google Calendar Event
try {
  await createCalendarEvent(
    process.env.GOOGLE_REFRESH_TOKEN,
    {
      title: assignment.title,
      description: assignment.description,
      dateTime: assignment.deadline
    }
  );

  console.log("[Google Calendar] Assignment event created successfully");
} catch (error) {
  console.error("[Google Calendar]", error.message);
}
    await Reminder.create({
      user: req.user._id,
      assignment: assignment._id,
      title: `Assignment Due: ${title} (${subject})`,
      dueDate: parsedDeadline,
      reminderType: 'Deadline'
    });

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      action: 'Created Assignment',
      details: `Added "${title}" for ${subject} due on ${parsedDeadline.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
      type: 'assignment'
    });
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
const updateAssignment = async (req, res) => {
  try {
    const {
      title,
      subject,
      description,
      deadline,
      priority,
      estimatedHours,
      status,
      category,
      notes
    } = req.body;

    let assignment = await Assignment.findOne({ _id: req.params.id, user: req.user._id });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (subject) updateData.subject = subject;
    if (description !== undefined) updateData.description = description;
    if (deadline) updateData.deadline = parseISTDate(deadline);
    if (priority) updateData.priority = priority;
    if (estimatedHours) updateData.estimatedHours = Number(estimatedHours);
    if (category) updateData.category = category;
    if (notes !== undefined) updateData.notes = notes;

    if (status) {
      updateData.status = status;
      if (status === 'Completed' && assignment.status !== 'Completed') {
        updateData.completedAt = new Date();
      }
    }

    assignment = await Assignment.findByIdAndUpdate(req.params.id, updateData, { new: true });

    // Update associated reminder if deadline or title updated
    if (deadline || title) {
      await Reminder.findOneAndUpdate(
        { assignment: assignment._id },
        {
          title: `Assignment Due: ${assignment.title} (${assignment.subject})`,
          dueDate: assignment.deadline
        }
      );
    }

    res.json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Delete linked reminder
    await Reminder.deleteMany({ assignment: assignment._id });

    res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment
};
