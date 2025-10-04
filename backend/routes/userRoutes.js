// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/me', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('badges').lean();
    res.json(user);
  } catch (e) { 
    console.error('Error getting user:', e);
    res.status(500).json({ error: 'server error' }); 
  }
});

module.exports = router;
