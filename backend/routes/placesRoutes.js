// backend/routes/placesRoutes.js
const express = require('express');
const router = express.Router();
const placesCtrl = require('../controllers/placesController');
router.get('/nearby', placesCtrl.nearby);
module.exports = router;
