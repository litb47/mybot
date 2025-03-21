const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    enum: ['en', 'he'],
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  askCount: {
    type: Number,
    default: 0
  },
  lastAsked: {
    type: Date,
    default: null
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
faqSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Track when question is asked
faqSchema.methods.recordAsk = async function() {
  this.askCount += 1;
  this.lastAsked = new Date();
  await this.save();
};

module.exports = mongoose.model('FAQ', faqSchema); 