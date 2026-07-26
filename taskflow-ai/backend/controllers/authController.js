const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'taskflow_jwt_secret_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { fullName, email, branch, semester, institution, password, confirmPassword } = req.body;

    if (!fullName || !email || !branch || !semester || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // Password Complexity Validation: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      branch,
      semester,
      institution: institution || '',
      password: hashedPassword
    });

    await ActivityLog.create({
      user: user._id,
      action: 'User Registered',
      details: `Account created for ${user.email}`,
      type: 'auth'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
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
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    await ActivityLog.create({
      user: user._id,
      action: 'User Logged In',
      details: `Logged in from IP: ${req.ip || '127.0.0.1'}`,
      type: 'auth'
    });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
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
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

// @desc    Forgot Password Request Token
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetToken = hashedResetToken;
    user.resetTokenExpire = Date.now() + 30 * 60 * 1000; // 30 mins
    await user.save();

    // Return the reset token to the frontend (simulation for secure token flow)
    res.json({
      success: true,
      message: 'Password reset token generated successfully.',
      resetToken: resetToken // In production sent via email, returned here for easy demo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { resetToken, password, confirmPassword } = req.body;

    if (!resetToken || !password) {
      return res.status(400).json({ success: false, message: 'Reset token and new password are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      });
    }

    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      resetToken: hashedResetToken,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = null;
    user.resetTokenExpire = null;
    await user.save();

    res.json({ success: true, message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe
};
