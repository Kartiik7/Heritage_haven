// backend/routes/hotelsRoutes.js
const express = require('express');
const router = express.Router();
const hotelsCtrl = require('../controllers/hotelsController');

// Public search endpoint: by lat/lon or city + dates
// Example: /api/hotels/search?lat=27.1751&lon=78.0421&checkInDate=2025-10-01&checkOutDate=2025-10-02&adults=2
router.get('/search', hotelsCtrl.search);

module.exports = router;
