const Chatbot = require('../models/chatbot');

// Get all chatbots
exports.getAllChatbots = async (req, res) => {
    try {
        const chatbots = await Chatbot.find();
        res.json(chatbots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single chatbot
exports.getChatbot = async (req, res) => {
    try {
        const chatbot = await Chatbot.findById(req.params.id);
        if (!chatbot) {
            return res.status(404).json({ message: 'Chatbot not found' });
        }
        res.json(chatbot);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create chatbot
exports.createChatbot = async (req, res) => {
    try {
        const chatbot = new Chatbot(req.body);
        const newChatbot = await chatbot.save();
        res.status(201).json(newChatbot);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update chatbot
exports.updateChatbot = async (req, res) => {
    try {
        const chatbot = await Chatbot.findById(req.params.id);
        if (!chatbot) {
            return res.status(404).json({ message: 'Chatbot not found' });
        }

        Object.assign(chatbot, req.body);
        const updatedChatbot = await chatbot.save();
        res.json(updatedChatbot);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete chatbot
exports.deleteChatbot = async (req, res) => {
    try {
        const chatbot = await Chatbot.findById(req.params.id);
        if (!chatbot) {
            return res.status(404).json({ message: 'Chatbot not found' });
        }

        await chatbot.remove();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}; 