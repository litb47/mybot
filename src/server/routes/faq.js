const express = require('express');
const router = express.Router();
const FAQ = require('../models/faq');
const Project = require('../models/project');

// Get all FAQs for a project
router.get('/project/:projectId', async (req, res) => {
    try {
        const faqs = await FAQ.find({ projectId: req.params.projectId });
        res.json({ success: true, data: faqs });
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({ success: false, message: 'Error fetching FAQs' });
    }
});

// Create a new FAQ
router.post('/', async (req, res) => {
    try {
        const { projectId, question, answer, category, keywords, language } = req.body;
        
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const faq = new FAQ({
            projectId,
            question,
            answer,
            category: category || 'General',
            keywords: keywords || [],
            language: language || 'he'
        });

        await faq.save();
        res.json({ success: true, data: faq });
    } catch (error) {
        console.error('Error creating FAQ:', error);
        res.status(500).json({ success: false, message: 'Error creating FAQ' });
    }
});

// Create default FAQs for a project
router.post('/create-default', async (req, res) => {
    try {
        const { projectId, language } = req.body;
        
        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: 'Project ID is required'
            });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // בדיקה אם כבר קיימות שאלות לפרויקט
        const existingFAQs = await FAQ.find({ projectId });
        if (existingFAQs.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'FAQs already exist for this project',
                data: existingFAQs
            });
        }

        const defaultFAQs = [
            {
                question: language === 'en' ? 'What is this chatbot?' : 'מה זה הצ\'אטבוט הזה?',
                answer: language === 'en' ? 
                    'This is an AI-powered chatbot designed to help answer your questions.' : 
                    'זהו צ\'אטבוט מבוסס בינה מלאכותית שנועד לעזור לענות על השאלות שלך.',
                category: 'General',
                keywords: ['chatbot', 'bot', 'help', 'about']
            },
            {
                question: language === 'en' ? 'How can I contact support?' : 'איך אפשר ליצור קשר עם התמיכה?',
                answer: language === 'en' ? 
                    'You can contact our support team through the contact form on our website.' : 
                    'ניתן ליצור קשר עם צוות התמיכה שלנו דרך טופס יצירת הקשר באתר.',
                category: 'Support',
                keywords: ['contact', 'support', 'help']
            }
        ];

        const faqs = await FAQ.insertMany(
            defaultFAQs.map(faq => ({
                ...faq,
                projectId,
                language: language || project.settings?.language || 'he'
            }))
        );

        res.status(201).json({
            success: true,
            message: 'Default FAQs created successfully',
            data: faqs
        });
    } catch (error) {
        console.error('Error creating default FAQs:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating default FAQs',
            error: error.message
        });
    }
});

// Update an FAQ
router.put('/:id', async (req, res) => {
    try {
        const { question, answer, category, keywords } = req.body;
        
        const faq = await FAQ.findByIdAndUpdate(
            req.params.id,
            { question, answer, category, keywords },
            { new: true }
        );

        if (!faq) {
            return res.status(404).json({ success: false, message: 'FAQ not found' });
        }

        res.json({ success: true, data: faq });
    } catch (error) {
        console.error('Error updating FAQ:', error);
        res.status(500).json({ success: false, message: 'Error updating FAQ' });
    }
});

// Delete an FAQ
router.delete('/:id', async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndDelete(req.params.id);
        
        if (!faq) {
            return res.status(404).json({ success: false, message: 'FAQ not found' });
        }

        res.json({ success: true, message: 'FAQ deleted successfully' });
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        res.status(500).json({ success: false, message: 'Error deleting FAQ' });
    }
});

module.exports = router; 