const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Public routes
router.post('/register', authController.register);
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // In production, you would fetch the user from MongoDB
        if (username !== mockUser.username) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, mockUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: 'admin-user-id' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Protected routes
router.get('/me', protect, authController.getCurrentUser);

// Mock user for development
const mockUser = {
    username: 'admin',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9E0NfIQA9rmYE2' // 'password123'
};

module.exports = router; 