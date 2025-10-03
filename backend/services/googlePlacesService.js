// backend/services/googlePlacesService.js
const axios = require('axios');
const API_KEY = process.env.GOOGLE_API_KEY;
const PLACES_BASE = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

async function nearbyPlaces({ lat, lon, radius = 2000, type = 'tourist_attraction', limit = 10 }) {
  const params = { location: `${lat},${lon}`, radius, type, key: API_KEY };
  const res = await axios.get(PLACES_BASE, { params });
  return (res.data.results || []).slice(0, limit);
}

module.exports = { nearbyPlaces };
