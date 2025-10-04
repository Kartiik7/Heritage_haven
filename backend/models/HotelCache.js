// backend/models/HotelCache.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelCacheSchema = new Schema({
  key: { type: String, unique: true, required: true },
  response: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

// TTL index controlled by env var HOTEL_CACHE_TTL_MIN (minutes)
const ttlMinutes = parseInt(process.env.HOTEL_CACHE_TTL_MIN || '15', 10);
HotelCacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: ttlMinutes * 60 });

module.exports = mongoose.model('HotelCache', HotelCacheSchema);
