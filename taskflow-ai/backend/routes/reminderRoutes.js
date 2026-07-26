const express = require('express');
const router = express.Router();
const {
  getReminders,
  createReminder,
  toggleReminder,
  deleteReminder
} = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getReminders)
  .post(createReminder);

router.put('/:id/toggle', toggleReminder);
router.delete('/:id', deleteReminder);

module.exports = router;
