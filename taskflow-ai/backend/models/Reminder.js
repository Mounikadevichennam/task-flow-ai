const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      default: null
    },
    title: {
      type: String,
      required: [true, 'Reminder title is required'],
      trim: true
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    reminderType: {
      type: String,
      enum: ['Deadline', 'Study Session', 'General', 'Custom'],
      default: 'Deadline'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    emailSent: {
      type: Boolean,
      default: false
    },
    emailSentAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Reminder', reminderSchema);
