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

/**
 * Create default FAQs for a project
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.createDefaultFAQs = async (req, res) => {
  try {
    const { projectId, language } = req.body;
    
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }
    
    // Default FAQs in Hebrew or English based on language parameter
    const defaultFAQs = language === 'he' ? [
      {
        question: 'מה שעות הפעילות שלכם?',
        answer: 'אנחנו פתוחים בימים א\'-ה\' בין השעות 9:00-17:00.',
        category: 'כללי',
        keywords: ['שעות', 'פתיחה', 'פעילות', 'עובדים']
      },
      {
        question: 'כיצד אוכל לפנות אליכם?',
        answer: 'ניתן לפנות אלינו בטלפון 03-1234567 או באימייל info@example.co.il.',
        category: 'יצירת קשר',
        keywords: ['טלפון', 'מייל', 'אימייל', 'קשר', 'פניה']
      },
      {
        question: 'האם אתם מציעים משלוח חינם?',
        answer: 'כן, משלוח חינם להזמנות מעל 200 ש"ח.',
        category: 'משלוחים',
        keywords: ['משלוח', 'חינם', 'דואר', 'שליח']
      }
    ] : [
      {
        question: 'What are your business hours?',
        answer: 'We are open Monday to Friday, 9 AM to 5 PM.',
        category: 'General',
        keywords: ['hours', 'open', 'business', 'time']
      },
      {
        question: 'How can I contact you?',
        answer: 'You can reach us at (123) 456-7890 or by email at info@example.com.',
        category: 'Contact',
        keywords: ['phone', 'email', 'contact', 'support']
      },
      {
        question: 'Do you offer free shipping?',
        answer: 'Yes, we offer free shipping on orders over $50.',
        category: 'Shipping',
        keywords: ['shipping', 'free', 'delivery', 'orders']
      }
    ];
    
    // Create FAQs in database
    const faqPromises = defaultFAQs.map(faq => {
      return new FAQ({
        projectId,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        keywords: faq.keywords,
        language: language || 'en'
      }).save();
    });
    
    await Promise.all(faqPromises);
    
    res.status(201).json({
      success: true,
      message: 'Default FAQs created successfully',
      count: defaultFAQs.length
    });
  } catch (error) {
    console.error('Error creating default FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating default FAQs',
      error: error.message
    });
  }
}; 