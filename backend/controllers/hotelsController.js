// backend/controllers/hotelsController.js
const HotelCache = require('../models/HotelCache');
const { searchHotels } = require('../services/amadeusService');

function makeCacheKey({ lat, lon, city, checkInDate, checkOutDate, adults, currency }) {
  return `hotels:${lat||city}:${lon||''}:${checkInDate}:${checkOutDate}:${adults}:${currency}`;
}

exports.search = async (req, res) => {
  try {
    const { lat, lon, city, checkInDate, checkOutDate, adults = 1, currency } = req.query;
    const cur = currency || process.env.CURRENCY || 'INR';
    const key = makeCacheKey({ lat, lon, city, checkInDate, checkOutDate, adults, currency: cur });
    // check cache
    const cached = await HotelCache.findOne({ key });
    if (cached) return res.json({ cached: true, results: cached.response });

    const results = await searchHotels({ lat, lon, cityCode: city, checkInDate, checkOutDate, adults, currency: cur });
    // store in cache
    await HotelCache.updateOne({ key }, { $set: { response: results, createdAt: new Date() } }, { upsert: true });
    res.json({ cached: false, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed' });
  }
};
