const Stats = require('../models/stats');
const Project = require('../models/project');

// Get most asked questions for a project
exports.getMostAskedQuestions = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 10, language } = req.query;
    
    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Create match query
    const matchQuery = { project: projectId };
    if (language) {
      matchQuery.language = language;
    }
    
    const mostAskedQuestions = await Stats.aggregate([
      { $match: matchQuery },
      { $group: {
          _id: "$question",
          count: { $sum: 1 },
          answered: { $max: "$answered" },
          lastAsked: { $max: "$date" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) }
    ]);
    
    res.status(200).json({ success: true, data: mostAskedQuestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get statistics timeline (daily/weekly/monthly)
exports.getStatsTimeline = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { timeframe = 'daily', startDate, endDate } = req.query;
    
    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Create match query with date range if provided
    const matchQuery = { project: projectId };
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }
    
    // Set group by format based on timeframe
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
      default:
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid timeframe. Use daily, weekly, or monthly.' 
        });
    }
    
    const timeline = await Stats.aggregate([
      { $match: matchQuery },
      { $group: {
          _id: groupBy,
          totalQuestions: { $sum: 1 },
          answeredQuestions: { $sum: { $cond: ["$answered", 1, 0] } },
          unansweredQuestions: { $sum: { $cond: ["$answered", 0, 1] } }
        }
      },
      { $sort: { 
          "_id.year": 1, 
          "_id.month": 1, 
          "_id.day": 1, 
          "_id.week": 1 
        } 
      }
    ]);
    
    // Format the response for easier consumption
    const formattedTimeline = timeline.map(item => {
      let date;
      if (timeframe === 'daily') {
        date = new Date(item._id.year, item._id.month - 1, item._id.day);
      } else if (timeframe === 'weekly') {
        // Calculate first day of the week (approximate)
        const janFirst = new Date(item._id.year, 0, 1);
        date = new Date(janFirst.getTime() + (item._id.week * 7 * 24 * 60 * 60 * 1000));
      } else if (timeframe === 'monthly') {
        date = new Date(item._id.year, item._id.month - 1, 1);
      }
      
      return {
        date: date.toISOString().split('T')[0],
        totalQuestions: item.totalQuestions,
        answeredQuestions: item.answeredQuestions,
        unansweredQuestions: item.unansweredQuestions,
        successRate: item.totalQuestions > 0 
          ? Math.round((item.answeredQuestions / item.totalQuestions) * 100) 
          : 0
      };
    });
    
    res.status(200).json({ success: true, data: formattedTimeline });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get recent question history
exports.getQuestionHistory = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 50, offset = 0, language } = req.query;
    
    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Create query
    let query = { project: projectId };
    if (language) {
      query.language = language;
    }
    
    // Get total count for pagination
    const total = await Stats.countDocuments(query);
    
    // Get question history with pagination
    const history = await Stats.find(query)
      .sort({ date: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .populate('matchedFaq', 'question answer');
    
    res.status(200).json({ 
      success: true, 
      data: {
        history,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 