const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  question: {
    type: String,
    required: [true, 'Please provide a question'],
    trim: true
  },
  answer: {
    type: String,
    required: [true, 'Please provide an answer'],
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
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

// Update the updatedAt timestamp before saving
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