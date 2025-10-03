// backend/controllers/placesController.js
const { nearbyPlaces } = require('../services/googlePlacesService');

exports.nearby = async (req, res) => {
  try {
    const { lat, lon, radius, type } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat, lon required' });
    const places = await nearbyPlaces({ lat, lon, radius: radius || 2000, type: type || 'tourist_attraction' });
    res.json(places);
  } catch (err) { console.error(err); res.status(500).json({ error: 'failed' }); }
};
