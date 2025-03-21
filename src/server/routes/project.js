const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/api-key/:apiKey', projectController.getProjectByApiKey);

// Protected routes
router.get('/user/:userId', protect, projectController.getUserProjects);
router.get('/:id', protect, projectController.getProject);
router.get('/:id/embed-code', protect, projectController.getEmbedCode);
router.post('/', protect, projectController.createProject);
router.put('/:id', protect, projectController.updateProject);
router.delete('/:id', protect, projectController.deleteProject);
router.post('/:id/upload-icon', protect, upload.single('icon'), projectController.uploadChatIcon);

module.exports = router; 