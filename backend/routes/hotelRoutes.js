// backend/routes/hotelsRoutes.js
const express = require('express');
const router = express.Router();
const hotelsCtrl = require('../controllers/hotelsController');
const authMiddleware = require('../middleware/authMiddleware'); // optional; public or require login?

// Public search endpoint
router.get('/search', hotelsCtrl.search);

module.exports = router;
