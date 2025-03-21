const express = require('express');
const router = express.Router();
const Project = require('../models/project');

// Get project by API key
router.get('/api-key/:apiKey', async (req, res) => {
    try {
        const project = await Project.findOne({ apiKey: req.params.apiKey });
        
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.json({ success: true, data: project });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ success: false, message: 'Error fetching project' });
    }
});

// Create a new project
router.post('/create-default', async (req, res) => {
    try {
        const { name, primaryColor, language } = req.body;

        const project = new Project({
            name,
            settings: {
                language: language || 'he',
                primaryColor: primaryColor || '#3498db',
                welcomeMessage: language === 'en' ? 
                    'Hello! How can I help you today?' : 
                    'שלום! איך אוכל לעזור לך היום?',
                fallbackMessage: language === 'en' ?
                    'Sorry, I couldn\'t find an answer to your question. Please try rephrasing it or contact our support team.' :
                    'מצטער, לא הצלחתי למצוא תשובה לשאלה שלך. אנא נסה לנסח אותה אחרת או פנה לצוות התמיכה שלנו.'
            }
        });

        await project.save();
        res.json({ 
            success: true, 
            data: { 
                projectId: project._id,
                apiKey: project.apiKey
            } 
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ success: false, message: 'Error creating project' });
    }
});

// Update project settings
router.put('/:id/settings', async (req, res) => {
    try {
        const { settings } = req.body;
        
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: { settings } },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.json({ success: true, data: project });
    } catch (error) {
        console.error('Error updating project settings:', error);
        res.status(500).json({ success: false, message: 'Error updating project settings' });
    }
});

// Upload project logo
router.post('/:id/logo', async (req, res) => {
    try {
        const { logoUrl } = req.body;
        
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: { 'settings.logo': logoUrl } },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.json({ success: true, data: project });
    } catch (error) {
        console.error('Error uploading project logo:', error);
        res.status(500).json({ success: false, message: 'Error uploading project logo' });
    }
});

module.exports = router; 