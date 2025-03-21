const FAQ = require('../models/faq');
const Stats = require('../models/stats');
const Project = require('../models/project');

// Get all FAQs for a project
exports.getAllFaqs = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { language } = req.query;
    
    let query = { project: projectId };
    if (language) {
      query.language = language;
    }
    
    const faqs = await FAQ.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new FAQ
exports.createFaq = async (req, res) => {
  try {
    const { question, answer, language, projectId } = req.body;
    
    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    const newFaq = new FAQ({
      question,
      answer,
      language,
      project: projectId
    });
    
    const savedFaq = await newFaq.save();
    res.status(201).json({ success: true, data: savedFaq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an FAQ
exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, language, active } = req.body;
    
    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    
    // Update fields
    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (language) faq.language = language;
    if (active !== undefined) faq.active = active;
    
    const updatedFaq = await faq.save();
    res.status(200).json({ success: true, data: updatedFaq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an FAQ
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    
    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    
    await FAQ.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Answer a question
exports.answerQuestion = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { question, language, sessionId } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    // Validate project exists and is active
    const project = await Project.findOne({ _id: projectId, active: true });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found or inactive' });
    }
    
    // Find matching FAQ
    const matchingFaq = await FAQ.findOne({
      project: projectId,
      language,
      active: true,
      question: { $regex: new RegExp(question, 'i') }
    });
    
    // Save statistics
    const stats = new Stats({
      project: projectId,
      question,
      language,
      answered: !!matchingFaq,
      matchedFaq: matchingFaq ? matchingFaq._id : null,
      ipAddress,
      userAgent,
      sessionId
    });
    await stats.save();
    
    // Update project statistics
    await Project.findByIdAndUpdate(projectId, {
      $inc: { 
        'statistics.totalQuestions': 1,
        'statistics.answeredQuestions': matchingFaq ? 1 : 0,
        'statistics.unansweredQuestions': matchingFaq ? 0 : 1
      },
      $set: { 'statistics.lastActivity': Date.now() }
    });
    
    // If FAQ found, increment ask count
    if (matchingFaq) {
      await matchingFaq.recordAsk();
      return res.status(200).json({ 
        success: true, 
        data: {
          answer: matchingFaq.answer,
          found: true
        }
      });
    }
    
    // No match found
    res.status(200).json({ 
      success: true, 
      data: {
        answer: null,
        found: false
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 