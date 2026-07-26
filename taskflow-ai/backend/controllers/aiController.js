const Assignment = require('../models/Assignment');

// Helper: Calculate days/hours left
const getHoursLeft = (deadline) => {
  const diffMs = new Date(deadline) - new Date();
  return Math.max(0, diffMs / (1000 * 60 * 60));
};

// @desc    Get AI Productivity Score & Summary
// @route   GET /api/ai/productivity-score
const getProductivityScore = async (req, res) => {
  try {
    const assignments = await Assignment.find({ user: req.user._id });

    if (assignments.length === 0) {
      return res.json({
        success: true,
        data: {
          score: 100,
          grade: 'A+',
          summary: 'No assignments created yet. Outstanding clean slate!',
          details: { completed: 0, pending: 0, overdue: 0, completionRate: 0 }
        }
      });
    }

    const total = assignments.length;
    const completed = assignments.filter((a) => a.status === 'Completed').length;
    const now = new Date();
    const overdue = assignments.filter((a) => a.status !== 'Completed' && new Date(a.deadline) < now).length;
    const pending = total - completed;

    const completionRate = (completed / total) * 100;
    
    // Base score = completion rate * 0.7
    let score = completionRate * 0.75;
    
    // Bonus for high priority completed
    const highCompleted = assignments.filter((a) => a.status === 'Completed' && a.priority === 'High').length;
    score += Math.min(15, highCompleted * 5);

    // Penalty for overdue
    score -= overdue * 10;

    // Clamp between 0 and 100
    score = Math.max(0, Math.min(100, Math.round(score)));

    let grade = 'B';
    if (score >= 90) grade = 'A+';
    else if (score >= 80) grade = 'A';
    else if (score >= 70) grade = 'B+';
    else if (score >= 60) grade = 'B';
    else if (score >= 50) grade = 'C';
    else grade = 'D';

    let advice = 'Keep executing! Focus on clearing overdue tasks first.';
    if (score >= 85) advice = 'Phenomenal productivity! You are staying ahead of all academic deadlines.';
    else if (score < 50) advice = 'Warning: Overdue assignments are building up. Use the Study Planner to catch up.';

    res.json({
      success: true,
      data: {
        score,
        grade,
        summary: advice,
        details: {
          total,
          completed,
          pending,
          overdue,
          completionRate: Math.round(completionRate)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI Priority Analyzer
// @route   GET /api/ai/priority-analyzer
const getPriorityAnalyzer = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      user: req.user._id,
      status: { $ne: 'Completed' }
    });

    const now = new Date();

    const analyzed = assignments.map((task) => {
      const hoursLeft = (new Date(task.deadline) - now) / (1000 * 60 * 60);
      const isOverdue = hoursLeft < 0;

      // Priority Weight
      const pWeight = task.priority === 'High' ? 3 : task.priority === 'Medium' ? 2 : 1;
      
      // Urgency score calculation
      let urgencyScore = 0;
      if (isOverdue) {
        urgencyScore = 100 + Math.abs(hoursLeft);
      } else {
        urgencyScore = (pWeight * 50) / Math.max(1, hoursLeft / 24);
      }

      let riskLevel = 'Low';
      if (isOverdue || urgencyScore > 75) riskLevel = 'Critical';
      else if (urgencyScore > 40) riskLevel = 'High';
      else if (urgencyScore > 20) riskLevel = 'Medium';

      return {
        _id: task._id,
        title: task.title,
        subject: task.subject,
        deadline: task.deadline,
        priority: task.priority,
        estimatedHours: task.estimatedHours,
        hoursLeft: Math.round(hoursLeft),
        isOverdue,
        urgencyScore: Math.round(urgencyScore),
        riskLevel,
        recommendation: isOverdue
          ? 'Immediate submission required! Prioritize this above all else.'
          : hoursLeft <= 24
          ? 'Due within 24 hours. Start working on this immediately.'
          : `Allocate ${task.estimatedHours} hours over the next ${Math.max(1, Math.floor(hoursLeft / 24))} days.`
      };
    });

    // Sort by highest urgency score first
    analyzed.sort((a, b) => b.urgencyScore - a.urgencyScore);

    res.json({ success: true, count: analyzed.length, data: analyzed });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI Recommended Next Task
// @route   GET /api/ai/recommended-next
const getRecommendedNextTask = async (req, res) => {
  try {
    const pendingTasks = await Assignment.find({
      user: req.user._id,
      status: { $ne: 'Completed' }
    });

    if (pendingTasks.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'No pending tasks! You are completely caught up.'
      });
    }

    const now = new Date();

    // Find the task with highest urgency
    const ranked = pendingTasks.map((task) => {
      const hoursLeft = (new Date(task.deadline) - now) / (1000 * 60 * 60);
      const isOverdue = hoursLeft < 0;
      const pWeight = task.priority === 'High' ? 3 : task.priority === 'Medium' ? 2 : 1;
      const urgency = isOverdue ? 1000 + Math.abs(hoursLeft) : (pWeight * 100) / Math.max(0.5, hoursLeft / 24);

      return { task, urgency, isOverdue, hoursLeft };
    });

    ranked.sort((a, b) => b.urgency - a.urgency);

    const top = ranked[0];
    const recommendedTask = top.task;

    let reason = '';
    if (top.isOverdue) {
      reason = `This assignment is OVERDUE by ${Math.abs(Math.round(top.hoursLeft))} hours. Immediate action required.`;
    } else if (top.hoursLeft <= 48) {
      reason = `Deadline is approaching in ${Math.round(top.hoursLeft)} hours with ${top.task.priority} priority.`;
    } else {
      reason = `Highest priority (${top.task.priority}) task with upcoming deadline. Best ROI on your study time.`;
    }

    res.json({
      success: true,
      data: {
        task: recommendedTask,
        reason,
        suggestedAction: `Focus for ${recommendedTask.estimatedHours} hours today using 25-minute Pomodoro sessions.`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI Study Planner for Next 7 Days
// @route   GET /api/ai/study-planner
const getStudyPlanner = async (req, res) => {
  try {
    const pendingTasks = await Assignment.find({
      user: req.user._id,
      status: { $ne: 'Completed' }
    }).sort({ deadline: 1 });

    const planDays = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const dateStr = currentDate.toISOString().split('T')[0];
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      // Find tasks relevant to this day
      const dayTasks = pendingTasks.filter((t) => {
        const d = new Date(t.deadline);
        return d >= currentDate || i === 0; // Include overdue on today
      });

      // Allocate up to 3 study sessions per day
      const sessions = dayTasks.slice(0, 3).map((t, idx) => ({
        timeSlot: idx === 0 ? '09:00 AM - 11:00 AM' : idx === 1 ? '02:00 PM - 04:00 PM' : '07:00 PM - 08:30 PM',
        subject: t.subject,
        taskTitle: t.title,
        priority: t.priority,
        recommendedHours: Math.min(2, t.estimatedHours)
      }));

      planDays.push({
        date: dateStr,
        dayName,
        isToday: i === 0,
        totalStudyHours: sessions.reduce((acc, s) => acc + s.recommendedHours, 0),
        sessions
      });
    }

    res.json({ success: true, data: planDays });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI Weekly Insights
// @route   GET /api/ai/weekly-insights
const getWeeklyInsights = async (req, res) => {
  try {
    const assignments = await Assignment.find({ user: req.user._id });

    const total = assignments.length;
    const completed = assignments.filter((a) => a.status === 'Completed').length;
    const pending = assignments.filter((a) => a.status === 'Pending').length;
    const inProgress = assignments.filter((a) => a.status === 'In Progress').length;

    // Subject breakdown
    const subjectMap = {};
    assignments.forEach((a) => {
      subjectMap[a.subject] = (subjectMap[a.subject] || 0) + 1;
    });

    const topSubject = Object.entries(subjectMap).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

    const insights = [
      `You have completed ${completed} out of ${total} total assignments (${total > 0 ? Math.round((completed / total) * 100) : 0}% completion rate).`,
      `Your most assignment-heavy subject is "${topSubject[0]}" with ${topSubject[1]} tasks.`,
      inProgress > 0 ? `You currently have ${inProgress} tasks in progress. Keep the momentum going!` : 'No tasks currently marked "In Progress". Start working on your highest priority task.',
      pending > 3 ? 'You have multiple pending assignments. Consider dedicating a 2-hour block today to make progress.' : 'Your task queue is under control!'
    ];

    res.json({
      success: true,
      data: {
        summary: insights,
        topSubject: topSubject[0],
        totalAssignments: total,
        completedCount: completed,
        pendingCount: pending,
        inProgressCount: inProgress
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI Task Breakdown for specific assignment
// @route   POST /api/ai/task-breakdown
const getTaskBreakdown = async (req, res) => {
  try {
    const { assignmentId, customTitle } = req.body;

    let title = customTitle || 'Academic Assignment';
    let subject = 'General';
    let estimatedHours = 3;

    if (assignmentId) {
      const found = await Assignment.findOne({ _id: assignmentId, user: req.user._id });
      if (found) {
        title = found.title;
        subject = found.subject;
        estimatedHours = found.estimatedHours;
      }
    }

    const hoursPerStep = Math.max(0.5, (estimatedHours / 5).toFixed(1));

    const steps = [
      {
        step: 1,
        title: 'Requirements & Scope Review',
        description: `Read grading criteria and outline requirements for "${title}" in ${subject}.`,
        estimatedMinutes: Math.round(hoursPerStep * 60 * 0.5)
      },
      {
        step: 2,
        title: 'Research & Information Gathering',
        description: 'Collect reference materials, lecture notes, textbook chapters, or dataset sources.',
        estimatedMinutes: Math.round(hoursPerStep * 60 * 1.2)
      },
      {
        step: 3,
        title: 'Core Drafting / Problem Solving',
        description: 'Execute the main work: write initial draft code, solve mathematical models, or compose essay sections.',
        estimatedMinutes: Math.round(hoursPerStep * 60 * 2)
      },
      {
        step: 4,
        title: 'Review, Testing & Formatting',
        description: 'Verify accuracy, check citation style, review calculation steps, or test code edge cases.',
        estimatedMinutes: Math.round(hoursPerStep * 60 * 1)
      },
      {
        step: 5,
        title: 'Final Polish & Submission Prep',
        description: 'Export as required format (PDF/Zip), complete final proofread, and submit to portal.',
        estimatedMinutes: Math.round(hoursPerStep * 60 * 0.3)
      }
    ];

    res.json({
      success: true,
      data: {
        title,
        subject,
        totalEstimatedHours: estimatedHours,
        steps
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI Daily Motivation
// @route   GET /api/ai/daily-motivation
const getDailyMotivation = async (req, res) => {
  try {
    const quotes = [
      { quote: "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success.", author: "Dwayne Johnson" },
      { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
      { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
      { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
      { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" },
      { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" }
    ];

    const todayIndex = new Date().getDate() % quotes.length;
    const selected = quotes[todayIndex];

    res.json({ success: true, data: selected });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProductivityScore,
  getPriorityAnalyzer,
  getRecommendedNextTask,
  getStudyPlanner,
  getWeeklyInsights,
  getTaskBreakdown,
  getDailyMotivation
};
