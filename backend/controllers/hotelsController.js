// backend/controllers/hotelsController.js
const HotelCache = require('../models/HotelCache');
const { searchHotels } = require('../services/amadeusService');

function makeCacheKey({ city, checkInDate, checkOutDate, adults, currency }) {
  return `hotels:${city || ''}:${checkInDate}:${checkOutDate}:${adults}:${currency}`;
}

function normalizeAmadeusEntry(entry) {
  // entry is one element from resp.data (Amadeus hotel-offers)
  const hotel = entry.hotel || entry.hotel?.hotel || {};
  const name = hotel.name || hotel.hotel?.name || 'Unknown';
  const hotelId = hotel.hotelId || hotel.id || null;
  const image = hotel.media?.[0]?.uri || null;
  const offers = entry.offers || [];
  const best = offers[0] || {};
  const price = best?.price?.total || best?.price?.base || null;
  const currency = best?.price?.currency || process.env.CURRENCY || 'INR';
  const bookingUrl = best?.self || (best?.guarantee?.url) || null;
  return {
    source: 'amadeus',
    id: hotelId,
    name,
    address: hotel.address || hotel.hotel?.address || null,
    rating: hotel.rating || null,
    thumbnail: image,
    price,
    currency,
    bookingUrl,
    raw: entry
  };
}

async function safeCacheWrite(key, response) {
  const shouldCache = Array.isArray(response) ? response.length > 0 : (response && Object.keys(response).length > 0);
  if (!shouldCache) return;
  try {
    await HotelCache.updateOne({ key }, { $set: { response, createdAt: new Date() } }, { upsert: true });
  } catch (e) {
    console.warn('[hotelsController] cache write failed', e?.message || e);
  }
}

exports.search = async (req, res) => {
  try {
    const { city, checkInDate, checkOutDate, adults = 1, currency } = req.query;
    const cur = currency || process.env.CURRENCY || 'INR';
    if (!city) return res.json({ cached: false, source: 'none', results: [], note: 'city param required' });

    const key = makeCacheKey({ city, checkInDate, checkOutDate, adults, currency: cur });
    const cached = await HotelCache.findOne({ key }).lean();
    if (cached) return res.json({ cached: true, source: 'cache', results: cached.response });

    // run search (uses batches internally)
    const { offers, triedHotelIdsCount, batchesTried, error } = await searchHotels({
      cityCode: city,
      checkInDate,
      checkOutDate,
      adults: Number(adults),
      currency: cur,
      maxHotelIds: 120,
      batchSize: 12
    });

    if (error) {
      console.warn('[hotelsController] amadeus search error', error);
    }

    if (!offers || offers.length === 0) {
      // no offers found; don't cache empty results (let callers try other dates)
      return res.json({ cached: false, source: 'amadeus', results: [], triedHotelIdsCount, batchesTried });
    }

    // normalize and cache
    const normalized = offers.map(normalizeAmadeusEntry);
    await safeCacheWrite(key, normalized);
    return res.json({ cached: false, source: 'amadeus', results: normalized, triedHotelIdsCount, batchesTried });
  } catch (err) {
    console.error('[hotelsController] fatal', err?.response?.data || err?.message || err);
    return res.status(500).json({ error: 'hotel search failed', detail: err?.message || err });
  }
};
