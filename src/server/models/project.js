const mongoose = require('mongoose');
const crypto = require('crypto');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true
  },
  domain: {
    type: String,
    trim: true
  },
  apiKey: {
    type: String,
    unique: true,
    select: false
  },
  settings: {
    language: {
      type: String,
      default: 'he',
      enum: ['he', 'en']
    },
    primaryColor: {
      type: String,
      default: '#007bff'
    },
    logo: {
      type: String,
      default: null
    },
    welcomeMessage: {
      type: String,
      default: 'שלום! אני כאן כדי לעזור לך. איך אוכל לסייע?'
    },
    fallbackMessage: {
      type: String,
      default: 'מצטער, לא הצלחתי למצוא תשובה לשאלה שלך. אנא נסה לנסח אותה אחרת או פנה לצוות התמיכה שלנו.'
    },
    // Appearance settings
    chatIcon: {
      type: String,
      default: '/images/default-chat-icon.png'
    },
    secondaryColor: {
      type: String,
      default: '#e9ecef'
    },
    fontFamily: {
      type: String,
      default: 'Arial, sans-serif'
    },
    fontSize: {
      type: String,
      default: '14px'
    },
    direction: {
      type: String,
      enum: ['rtl', 'ltr'],
      default: 'rtl'
    },
    position: {
      type: String,
      enum: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
      default: 'bottom-right'
    }
  },
  statistics: {
    totalQuestions: {
      type: Number,
      default: 0
    },
    answeredQuestions: {
      type: Number,
      default: 0
    },
    unansweredQuestions: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  active: {
    type: Boolean,
    default: true
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

// Generate API key before saving
projectSchema.pre('save', function(next) {
  if (!this.apiKey) {
    this.apiKey = crypto.randomBytes(32).toString('hex');
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema); 