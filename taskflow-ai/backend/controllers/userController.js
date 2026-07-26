const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Reminder = require('../models/Reminder');
const ActivityLog = require('../models/ActivityLog');

// @desc    Update user profile
// @route   PUT /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, branch, semester, institution, profilePicture } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (fullName) user.fullName = fullName;
    if (branch) user.branch = branch;
    if (semester) user.semester = semester;
    if (institution !== undefined) user.institution = institution;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    await ActivityLog.create({
      user: user._id,
      action: 'Updated Profile',
      details: 'Profile details updated',
      type: 'profile'
    });

    res.json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        branch: user.branch,
        semester: user.semester,
        institution: user.institution,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get comprehensive reports data for charts & CSV export
// @route   GET /api/user/reports
const getReportsData = async (req, res) => {
  try {
    const assignments = await Assignment.find({ user: req.user._id });

    const total = assignments.length;
    const completed = assignments.filter((a) => a.status === 'Completed').length;
    const pending = assignments.filter((a) => a.status === 'Pending').length;
    const inProgress = assignments.filter((a) => a.status === 'In Progress').length;
    
    const now = new Date();
    const overdue = assignments.filter((a) => a.status !== 'Completed' && new Date(a.deadline) < now).length;

    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Priority Distribution
    const priorityDist = { High: 0, Medium: 0, Low: 0 };
    assignments.forEach((a) => {
      if (priorityDist[a.priority] !== undefined) {
        priorityDist[a.priority]++;
      }
    });

    // Subject Distribution
    const subjectDist = {};
    assignments.forEach((a) => {
      subjectDist[a.subject] = (subjectDist[a.subject] || 0) + 1;
    });

    // Weekly progress (last 7 days completed vs created)
    const weeklyDays = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const createdCount = assignments.filter((a) => new Date(a.createdAt) >= dayStart && new Date(a.createdAt) <= dayEnd).length;
      const completedCount = assignments.filter((a) => a.completedAt && new Date(a.completedAt) >= dayStart && new Date(a.completedAt) <= dayEnd).length;

      weeklyDays.push({ label, created: createdCount, completed: completedCount });
    }

    // Monthly progress (last 4 weeks)
    const monthlyWeeks = [
      { label: 'Week 1', completed: 0 },
      { label: 'Week 2', completed: 0 },
      { label: 'Week 3', completed: 0 },
      { label: 'Week 4', completed: 0 }
    ];
    // Fill sample or computed weekly data
    assignments.forEach((a) => {
      if (a.status === 'Completed') {
        const weekIdx = Math.min(3, Math.floor((now - new Date(a.updatedAt)) / (7 * 24 * 3600 * 1000)));
        if (monthlyWeeks[3 - weekIdx]) {
          monthlyWeeks[3 - weekIdx].completed++;
        }
      }
    });

    res.json({
      success: true,
      data: {
        summary: {
          total,
          completed,
          pending,
          inProgress,
          overdue,
          completionPercentage
        },
        priorityDistribution: priorityDist,
        subjectDistribution: subjectDist,
        weeklyProgress: weeklyDays,
        monthlyProgress: monthlyWeeks,
        rawAssignments: assignments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export User Data JSON
// @route   GET /api/user/export
const exportUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const assignments = await Assignment.find({ user: req.user._id });
    const reminders = await Reminder.find({ user: req.user._id });

    const exportBundle = {
      user,
      assignments,
      reminders,
      exportedAt: new Date().toISOString()
    };

    res.json({ success: true, data: exportBundle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Import User Data JSON
// @route   POST /api/user/import
const importUserData = async (req, res) => {
  try {
    const { assignments, reminders } = req.body;

    if (Array.isArray(assignments) && assignments.length > 0) {
      const formattedAssignments = assignments.map((a) => ({
        ...a,
        _id: undefined,
        user: req.user._id,
        createdAt: undefined,
        updatedAt: undefined
      }));
      await Assignment.insertMany(formattedAssignments);
    }

    if (Array.isArray(reminders) && reminders.length > 0) {
      const formattedReminders = reminders.map((r) => ({
        ...r,
        _id: undefined,
        user: req.user._id,
        assignment: undefined,
        createdAt: undefined,
        updatedAt: undefined
      }));
      await Reminder.insertMany(formattedReminders);
    }

    res.json({ success: true, message: 'Data imported successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Application Data
// @route   POST /api/user/reset
const resetApplicationData = async (req, res) => {
  try {
    await Assignment.deleteMany({ user: req.user._id });
    await Reminder.deleteMany({ user: req.user._id });
    await ActivityLog.deleteMany({ user: req.user._id });

    await ActivityLog.create({
      user: req.user._id,
      action: 'Reset Application Data',
      details: 'User reset all application records',
      type: 'system'
    });

    res.json({ success: true, message: 'All application data has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Recent Activity Logs
// @route   GET /api/user/activity
const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateProfile,
  getReportsData,
  exportUserData,
  importUserData,
  resetApplicationData,
  getActivityLogs
};
