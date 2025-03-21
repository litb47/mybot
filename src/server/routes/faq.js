const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/answer/:projectId', faqController.answerQuestion);

// Protected routes
router.get('/:projectId', protect, faqController.getAllFaqs);
router.post('/', protect, faqController.createFaq);
router.put('/:id', protect, faqController.updateFaq);
router.delete('/:id', protect, faqController.deleteFaq);

module.exports = router; 