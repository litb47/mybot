const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.get('/most-asked/:projectId', protect, statsController.getMostAskedQuestions);
router.get('/timeline/:projectId', protect, statsController.getStatsTimeline);
router.get('/history/:projectId', protect, statsController.getQuestionHistory);

module.exports = router; 