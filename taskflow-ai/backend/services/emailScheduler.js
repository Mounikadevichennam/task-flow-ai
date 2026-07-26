const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const { sendReminderEmail } = require('./emailService');

let isProcessing = false;

/**
 * Scan database for due reminders that haven't received an email notification yet
 */
const processDueReminders = async () => {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const now = new Date();
    // Find uncompleted reminders whose due date is reached and email has not been sent yet
    const dueReminders = await Reminder.find({
      dueDate: { $lte: now },
      emailSent: false,
      isCompleted: false
    })
      .populate('user', 'email fullName')
      .populate('assignment', 'title subject priority category');

    if (dueReminders.length > 0) {
      console.log(`[Email Scheduler] Found ${dueReminders.length} pending due reminder(s) to process.`);
    }

    for (const reminder of dueReminders) {
      if (!reminder.user || !reminder.user.email) {
        console.warn(`[Email Scheduler] Skipping reminder ID ${reminder._id}: No registered user email found.`);
        continue;
      }

      const toEmail = reminder.user.email;
      const studentName = reminder.user.fullName;
      const reminderTitle = reminder.title || reminder.assignment?.title || 'Academic Task';
      const subjectName = reminder.assignment?.subject || 'General Coursework';
      const priority = reminder.assignment?.priority || 'Medium';

      try {
        await sendReminderEmail({
          toEmail,
          studentName,
          reminderTitle,
          subjectName,
          dueDate: reminder.dueDate,
          priority,
          reminderType: reminder.reminderType || 'Deadline'
        });

        // Mark reminder as email sent to prevent duplicate notifications
        reminder.emailSent = true;
        reminder.emailSentAt = new Date();
        await reminder.save();

        console.log(`[Email Scheduler] Successfully marked reminder "${reminderTitle}" for ${toEmail} as Email Sent.`);
      } catch (sendErr) {
        console.error(`[Email Scheduler] Failed to deliver email for reminder ID ${reminder._id}:`, sendErr.message);
      }
    }
  } catch (err) {
    console.error('[Email Scheduler] Error scanning due reminders:', err.message);
  } finally {
    isProcessing = false;
  }
};

/**
 * Initialize automated cron job scheduler (Runs every minute)
 */
const initScheduler = () => {
  console.log('[Email Scheduler] Initializing automated email reminder cron scheduler (every 60s)...');

  // Trigger immediate check on server start (handles server restarts gracefully)
  processDueReminders();

  // Schedule cron job to run every minute
  cron.schedule('* * * * *', () => {
    processDueReminders();
  });
};

module.exports = {
  initScheduler,
  processDueReminders
};
