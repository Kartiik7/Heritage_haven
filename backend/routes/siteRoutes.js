const express = require('express');
const router = express.Router();
const { getAllSites, trackVisit } = require('../controllers/siteController');
const { getRecommendationsForSite } = require('../controllers/recommendationController'); // <-- 1. IMPORT THIS
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/sites
// @desc    Get all heritage sites
// @access  Public
router.get('/', getAllSites);

// @route   POST /api/sites/:siteId/visit
// @desc    Track a user visiting a site
// @access  Private
router.post('/:siteId/visit', protect, trackVisit);

// @route   GET /api/sites/:siteId/recommendations  <-- 2. ADD THIS NEW ROUTE
// @desc    Get content-based recommendations for a specific site
// @access  Public
router.get('/:siteId/recommendations', getRecommendationsForSite);


module.exports = router;

