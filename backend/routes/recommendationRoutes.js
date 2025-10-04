const express = require('express');
const router = express.Router();
const { getRecommendationsForSite, getPersonalizedForUser } = require('../controllers/recommendationController');
const protect = require('../middleware/authMiddleware');

// Get content-based recommendations for a specific site (for guests or as a fallback)
router.get('/site/:siteId', getRecommendationsForSite);

// Get personalized recommendations for a logged-in user
router.get('/user', protect, getPersonalizedForUser);

module.exports = router;
