const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Routes
const faqRoutes = require('./routes/faq');
const projectRoutes = require('./routes/project');
const statsRoutes = require('./routes/stats');
const authRoutes = require('./routes/auth');

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com', 'https://admin.your-domain.com']
    : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../../public')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/faqchatbot')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/faq', faqRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve the chatbot script with API key
app.get('/chatbot.js', (req, res) => {
  const apiKey = req.query.key;
  
  if (!apiKey) {
    return res.status(400).send('API key is required');
  }
  
  const chatbotScriptPath = path.join(__dirname, '../client/chatbot.js');
  
  try {
    const chatbotScript = fs.readFileSync(chatbotScriptPath, 'utf-8');
    const apiUrl = `${req.protocol}://${req.get('host')}`;
    
    const modifiedScript = chatbotScript
      .replace(/{{API_KEY}}/g, apiKey)
      .replace(/{{API_URL}}/g, apiUrl);
    
    res.setHeader('Content-Type', 'application/javascript');
    res.send(modifiedScript);
  } catch (error) {
    console.error('Error serving chatbot script:', error);
    res.status(500).send('Error loading chatbot script');
  }
});

// Serve admin panel in production
if (process.env.NODE_ENV === 'production') {
  const adminBuildPath = path.join(__dirname, '../../admin/build');
  
  // Check if admin build exists
  if (fs.existsSync(adminBuildPath)) {
    app.use('/admin', express.static(adminBuildPath));
    
    app.get('/admin/*', (req, res) => {
      res.sendFile(path.join(adminBuildPath, 'index.html'));
    });
  } else {
    console.warn('Admin build directory not found. Admin panel will not be available.');
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; 