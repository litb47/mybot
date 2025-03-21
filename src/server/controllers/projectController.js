const Project = require('../models/project');
const FAQ = require('../models/faq');
const Stats = require('../models/stats');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { generateEmbedCode, generateMinimalEmbedCode } = require('../utils/generateEmbedCode');

// Generate unique API key
const generateApiKey = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Get all projects for a user
exports.getUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const projects = await Project.find({ owner: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific project
exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, domain, userId } = req.body;
    
    const apiKey = generateApiKey();
    
    const newProject = new Project({
      name,
      domain,
      apiKey,
      owner: userId
    });
    
    const savedProject = await newProject.save();
    res.status(201).json({ success: true, data: savedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, domain, settings, active } = req.body;
    
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Update fields
    if (name) project.name = name;
    if (domain) project.domain = domain;
    if (active !== undefined) project.active = active;
    
    // Update settings if provided
    if (settings) {
      // Merge with existing settings rather than replace
      project.settings = {
        ...project.settings,
        ...settings
      };
    }
    
    const updatedProject = await project.save();
    res.status(200).json({ success: true, data: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Delete all related FAQs and stats
    await FAQ.deleteMany({ project: id });
    await Stats.deleteMany({ project: id });
    
    // Delete project icon if custom
    if (project.settings.chatIcon && !project.settings.chatIcon.includes('default-icon')) {
      const iconPath = path.join(__dirname, '../../uploads', path.basename(project.settings.chatIcon));
      
      try {
        if (fs.existsSync(iconPath)) {
          fs.unlinkSync(iconPath);
        }
      } catch (err) {
        console.error('Error deleting icon:', err);
      }
    }
    
    await Project.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload project chat icon
exports.uploadChatIcon = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const { id } = req.params;
    
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Delete old icon if not default
    if (project.settings.chatIcon && !project.settings.chatIcon.includes('default-icon')) {
      const iconPath = path.join(__dirname, '../../uploads', path.basename(project.settings.chatIcon));
      
      try {
        if (fs.existsSync(iconPath)) {
          fs.unlinkSync(iconPath);
        }
      } catch (err) {
        console.error('Error deleting old icon:', err);
      }
    }
    
    // Update icon path
    project.settings.chatIcon = `/uploads/${req.file.filename}`;
    await project.save();
    
    res.status(200).json({ 
      success: true, 
      data: { 
        iconPath: project.settings.chatIcon 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get project by API key
exports.getProjectByApiKey = async (req, res) => {
  try {
    const { apiKey } = req.params;
    
    const project = await Project.findOne({ apiKey, active: true });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found or inactive' });
    }
    
    const publicProjectData = {
      id: project._id,
      name: project.name,
      settings: {
        chatIcon: project.settings.chatIcon,
        primaryColor: project.settings.primaryColor,
        secondaryColor: project.settings.secondaryColor,
        fontFamily: project.settings.fontFamily,
        fontSize: project.settings.fontSize,
        direction: project.settings.direction,
        position: project.settings.position,
        welcomeMessage: project.settings.welcomeMessage
      }
    };
    
    res.status(200).json({ success: true, data: publicProjectData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get embed code for a project
exports.getEmbedCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'minimal' } = req.query;
    
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Get API URL from request
    const apiUrl = `${req.protocol}://${req.get('host')}`;
    
    // Generate embed code
    let embedCode;
    if (type === 'full') {
      embedCode = generateEmbedCode(project.apiKey, apiUrl);
    } else {
      embedCode = generateMinimalEmbedCode(project.apiKey, apiUrl);
    }
    
    res.status(200).json({
      success: true,
      data: {
        embedCode,
        apiUrl,
        apiKey: project.apiKey
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new default project
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.createDefaultProject = async (req, res) => {
  try {
    const { name, primaryColor, language } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required'
      });
    }
    
    // Generate API key
    const apiKey = crypto.randomBytes(16).toString('hex');
    
    // Create default project with basic settings
    const newProject = new Project({
      name,
      apiKey,
      settings: {
        primaryColor: primaryColor || '#3498db',
        secondaryColor: '#ecf0f1',
        direction: language === 'he' ? 'rtl' : 'ltr',
        position: 'bottom-right',
        fontFamily: language === 'he' ? 'Arial, sans-serif' : 'Segoe UI, sans-serif',
        fontSize: '14px',
        welcomeMessage: language === 'he' ? 'שלום! כיצד אוכל לעזור לך היום?' : 'Hello! How can I help you today?',
        fallbackMessage: language === 'he' ? 'אני מצטער, אני לא מבין את השאלה. האם תוכל לנסח אותה אחרת?' : 'I\'m sorry, I don\'t understand that question. Could you try asking something else?',
        language: language || 'en'
      },
      faqs: []
    });
    
    await newProject.save();
    
    res.status(201).json({
      success: true,
      message: 'Default project created successfully',
      data: {
        projectId: newProject._id,
        apiKey: newProject.apiKey,
        settings: newProject.settings
      }
    });
  } catch (error) {
    console.error('Error creating default project:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating default project',
      error: error.message
    });
  }
}; 