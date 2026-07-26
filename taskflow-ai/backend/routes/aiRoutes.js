const express = require('express');
const router = express.Router();
const {
  getProductivityScore,
  getPriorityAnalyzer,
  getRecommendedNextTask,
  getStudyPlanner,
  getWeeklyInsights,
  getTaskBreakdown,
  getDailyMotivation
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/productivity-score', getProductivityScore);
router.get('/priority-analyzer', getPriorityAnalyzer);
router.get('/recommended-next', getRecommendedNextTask);
router.get('/study-planner', getStudyPlanner);
router.get('/weekly-insights', getWeeklyInsights);
router.post('/task-breakdown', getTaskBreakdown);
router.get('/daily-motivation', getDailyMotivation);

module.exports = router;
