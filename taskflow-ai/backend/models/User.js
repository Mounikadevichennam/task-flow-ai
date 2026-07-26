const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    branch: {
      type: String,
      required: [true, 'Branch/Department is required'],
      trim: true
    },
    semester: {
      type: String,
      required: [true, 'Semester is required'],
      trim: true
    },
    institution: {
      type: String,
      default: '',
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    profilePicture: {
      type: String,
      default: ''
    },
    resetToken: {
      type: String,
      default: null
    },
    resetTokenExpire: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
