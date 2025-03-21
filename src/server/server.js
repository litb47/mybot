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
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../../public')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/faqchatbot')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/faq', faqRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);

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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  app.use(express.static(path.join(__dirname, '../../admin/build')));
  
  app.get('/admin*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../admin/build/index.html'));
  });
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 