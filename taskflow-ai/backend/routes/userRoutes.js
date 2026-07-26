const express = require('express');
const router = express.Router();
const {
  updateProfile,
  getReportsData,
  exportUserData,
  importUserData,
  resetApplicationData,
  getActivityLogs
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.put('/profile', updateProfile);
router.get('/reports', getReportsData);
router.get('/export', exportUserData);
router.post('/import', importUserData);
router.post('/reset', resetApplicationData);
router.get('/activity', getActivityLogs);

module.exports = router;
