const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

// Mock data for development
let chatbots = [
    {
        id: '1',
        name: 'Support Bot',
        description: 'Customer support chatbot',
        type: 'support',
        language: 'he',
        isActive: true,
        welcomeMessage: 'שלום! כיצד אוכל לעזור?'
    }
];

// Get all chatbots
router.get('/', protect, chatbotController.getAllChatbots);

// Get single chatbot
router.get('/:id', protect, chatbotController.getChatbot);

// Create chatbot
router.post('/', protect, chatbotController.createChatbot);

// Update chatbot
router.put('/:id', protect, chatbotController.updateChatbot);

// Delete chatbot
router.delete('/:id', protect, chatbotController.deleteChatbot);

module.exports = router; 