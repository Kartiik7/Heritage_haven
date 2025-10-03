const express = require('express');
const router = express.Router();
const { getAllSites, logSiteVisit } = require('../controllers/siteController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllSites);
router.post('/:id/visit', protect, logSiteVisit);

module.exports = router;
