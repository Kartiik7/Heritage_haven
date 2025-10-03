// backend/models/HotelCache.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelCacheSchema = new Schema({
  key: { type: String, unique: true }, // e.g. "hotels:lat:lon:checkIn:checkOut:adults"
  response: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});
HotelCacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * parseInt(process.env.HOTEL_CACHE_TTL_MIN || '15') }); // TTL
module.exports = mongoose.model('HotelCache', HotelCacheSchema);
