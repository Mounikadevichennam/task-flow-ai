const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { initScheduler } = require('./services/emailScheduler');

// Load env variables
dotenv.config();

const app = express();

// Connect to Database & Initialize Email Scheduler
connectDB().then(() => {
  initScheduler();
}).catch((err) => {
  console.error('[Database Connect Error]', err);
});

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TaskFlow AI Backend Engine operational' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[TaskFlow AI Backend] Server running on port ${PORT}`);
});
