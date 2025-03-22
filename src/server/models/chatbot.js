const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['faq', 'support', 'sales'],
        default: 'faq'
    },
    language: {
        type: String,
        enum: ['he', 'en'],
        default: 'he'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    welcomeMessage: {
        type: String,
        default: 'שלום! כיצד אוכל לעזור?'
    },
    primaryColor: {
        type: String,
        default: '#6B73FF'
    },
    secondaryColor: {
        type: String,
        default: '#FFFFFF'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
chatbotSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Chatbot', chatbotSchema); 