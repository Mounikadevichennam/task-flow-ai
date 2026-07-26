const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline date is required']
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    estimatedHours: {
      type: Number,
      default: 1,
      min: 0.5
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },
    category: {
      type: String,
      enum: ['Homework', 'Project', 'Lab', 'Exam Prep', 'Quiz', 'Other'],
      default: 'Homework'
    },
    notes: {
      type: String,
      default: ''
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
