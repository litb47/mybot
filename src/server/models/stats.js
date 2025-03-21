const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    enum: ['en', 'he'],
    required: true
  },
  answered: {
    type: Boolean,
    default: false
  },
  matchedFaq: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FAQ',
    default: null
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  sessionId: {
    type: String,
    default: ''
  }
});

// Static method to get most asked questions for a project
statsSchema.statics.getMostAskedQuestions = async function(projectId, limit = 10) {
  return this.aggregate([
    { $match: { project: mongoose.Types.ObjectId(projectId) } },
    { $group: {
        _id: "$question",
        count: { $sum: 1 },
        answered: { $max: "$answered" },
        lastAsked: { $max: "$date" }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
};

// Static method to get daily/weekly/monthly stats for a project
statsSchema.statics.getStatsTimeline = async function(projectId, timeframe = 'daily') {
  let groupBy = {};
  
  switch(timeframe) {
    case 'daily':
      groupBy = {
        year: { $year: "$date" },
        month: { $month: "$date" },
        day: { $dayOfMonth: "$date" }
      };
      break;
    case 'weekly':
      groupBy = {
        year: { $year: "$date" },
        week: { $week: "$date" }
      };
      break;
    case 'monthly':
      groupBy = {
        year: { $year: "$date" },
        month: { $month: "$date" }
      };
      break;
  }
  
  return this.aggregate([
    { $match: { project: mongoose.Types.ObjectId(projectId) } },
    { $group: {
        _id: groupBy,
        totalQuestions: { $sum: 1 },
        answeredQuestions: { 
          $sum: { $cond: ["$answered", 1, 0] }
        },
        unansweredQuestions: { 
          $sum: { $cond: ["$answered", 0, 1] }
        }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.week": 1 } }
  ]);
};

module.exports = mongoose.model('Stats', statsSchema); 