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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  settings: {
    // Appearance settings
    chatIcon: {
      type: String,
      default: '/default-icon.png'
    },
    primaryColor: {
      type: String,
      default: '#0084ff'
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
      default: 'ltr'
    },
    position: {
      type: String,
      enum: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
      default: 'bottom-right'
    },
    welcomeMessage: {
      en: {
        type: String,
        default: 'Hello! How can I help you today?'
      },
      he: {
        type: String,
        default: 'שלום! איך אני יכול לעזור לך היום?'
      }
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

module.exports = mongoose.model('Project', projectSchema); 