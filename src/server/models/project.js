const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    trim: true
  },
  apiKey: {
    type: String,
    required: true,
    unique: true
  },
  settings: {
    language: {
      type: String,
      default: 'he',
      enum: ['he', 'en']
    },
    primaryColor: {
      type: String,
      default: '#3498db'
    },
    logo: {
      type: String,
      default: null
    },
    welcomeMessage: {
      type: String,
      default: 'שלום! איך אוכל לעזור לך היום?'
    },
    fallbackMessage: {
      type: String,
      default: 'מצטער, לא הצלחתי למצוא תשובה לשאלה שלך. אנא נסה לנסח אותה אחרת או פנה לצוות התמיכה שלנו.'
    },
    // Appearance settings
    chatIcon: {
      type: String,
      default: '/default-icon.png'
    },
    secondaryColor: {
      type: String,
      default: '#f0f0f0'
    },
    fontFamily: {
      type: String,
      default: 'Arial, sans-serif'
    },
    fontSize: {
      type: String,
      default: 'medium'
    },
    direction: {
      type: String,
      enum: ['ltr', 'rtl'],
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

// Update timestamps
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate API key before saving new project
projectSchema.pre('save', function(next) {
  if (this.isNew) {
    this.apiKey = require('crypto').randomBytes(32).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema); 