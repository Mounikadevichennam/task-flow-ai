const { createCalendarEvent } = require("../services/googleCalendarService");
const Reminder = require('../models/Reminder');
const Assignment = require('../models/Assignment');

// Helper to parse input date string as Asia/Kolkata IST if no timezone offset is provided
const parseISTDate = (inputDate) => {
  if (!inputDate) return new Date();
  if (typeof inputDate === 'string') {
    // If input is local ISO string without timezone e.g. "2026-07-26T21:30"
    if (!inputDate.includes('Z') && !inputDate.includes('+') && !inputDate.includes('-', 10)) {
      return new Date(`${inputDate}:00+05:30`);
    }
  }
  return new Date(inputDate);
};

// @desc    Get categorized reminders (Due Today, Due Tomorrow, Upcoming, Overdue)
// @route   GET /api/reminders
const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id })
      .populate('assignment', 'title subject status priority')
      .sort({ dueDate: 1 });

    // Compute start and end of today/tomorrow in Asia/Kolkata timezone
    const nowISTString = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD
    const startOfToday = new Date(`${nowISTString}T00:00:00+05:30`);
    const endOfToday = new Date(`${nowISTString}T23:59:59.999+05:30`);

    const tomorrowObj = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowISTString = tomorrowObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const startOfTomorrow = new Date(`${tomorrowISTString}T00:00:00+05:30`);
    const endOfTomorrow = new Date(`${tomorrowISTString}T23:59:59.999+05:30`);

    const categorized = {
      dueToday: [],
      dueTomorrow: [],
      upcoming: [],
      overdue: [],
      all: reminders
    };

    reminders.forEach((rem) => {
      const d = new Date(rem.dueDate);
      if (rem.isCompleted) return;

      if (d < startOfToday) {
        categorized.overdue.push(rem);
      } else if (d >= startOfToday && d <= endOfToday) {
        categorized.dueToday.push(rem);
      } else if (d >= startOfTomorrow && d <= endOfTomorrow) {
        categorized.dueTomorrow.push(rem);
      } else {
        categorized.upcoming.push(rem);
      }
    });

    res.json({ success: true, data: categorized });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create custom reminder
// @route   POST /api/reminders
const createReminder = async (req, res) => {
  try {
    const { title, dueDate, reminderType, assignmentId } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ success: false, message: 'Title and Due Date are required' });
    }

    const parsedDueDate = parseISTDate(dueDate);

    const reminder = await Reminder.create({
      user: req.user._id,
      title,
      dueDate: parsedDueDate,
      reminderType: reminderType || 'Custom',
      assignment: assignmentId || null
    });
    console.log("Reminder Object:", reminder);
    // Create Google Calendar Event
    try {
      await createCalendarEvent(
        process.env.GOOGLE_REFRESH_TOKEN,
        {
          title: `Reminder: ${reminder.title}`,
          description: `Reminder Type: ${reminder.reminderType}`,
          dateTime: reminder.dueDate
        }
      );

      console.log("[Google Calendar] Reminder event created successfully");
    } catch (error) {
  console.error("[Reminder Calendar Error]", error);

    }

    res.status(201).json({ success: true, data: reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  
}
};

// @desc    Toggle reminder completion
// @route   PUT /api/reminders/:id/toggle
const toggleReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user._id });
    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }

    reminder.isCompleted = !reminder.isCompleted;
    await reminder.save();

    res.json({ success: true, data: reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }

    res.json({ success: true, message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReminders,
  createReminder,
  toggleReminder,
  deleteReminder
};
