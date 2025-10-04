// backend/controllers/hotelsController.js
// Updated: prefer lat/lon -> Amadeus geocode -> Amadeus offers; fallback to city -> Amadeus; then Google Places

const HotelCache = require('../models/HotelCache');
const {
  searchHotels,            // existing function: cityCode based search
  searchHotelsByGeo        // NEW: must be implemented in services/amadeusService
} = require('../services/amadeusService');
const { nearbyPlaces, textSearchPlaces } = require('../services/googlePlacesService');

function makeCacheKey({ lat, lon, city, checkInDate, checkOutDate, adults, currency }) {
  return `hotels:${lat || city}:${lon || ''}:${checkInDate}:${checkOutDate}:${adults}:${currency}`;
}

function mapPlaceToNormalized(place) {
  const name = place.name || 'Unknown';
  const thumbnail = place.photos && place.photos.length
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_API_KEY}`
    : null;
  const address = place.vicinity || place.formatted_address || null;
  const rating = place.rating || null;
  const mapsUrl = place.place_id
    ? `https://www.google.com/maps/search/?api=1&query=place_id:${place.place_id}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + (address ? ' ' + address : ''))}`;
  const bookingSearchUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(name + (address ? ' ' + address : ''))}`;

  return {
    source: 'google_places',
    id: place.place_id || null,
    name,
    rating,
    address,
    thumbnail,
    price: null,
    currency: null,
    bookingUrl: bookingSearchUrl,
    mapsUrl,
    raw: place
  };
}

exports.search = async (req, res) => {
  const start = Date.now();
  try {
    const { lat, lon, city, checkInDate, checkOutDate, adults = 1, currency } = req.query;
    const cur = currency || process.env.CURRENCY || 'INR';
    const key = makeCacheKey({ lat, lon, city, checkInDate, checkOutDate, adults, currency: cur });

    console.log('[hotelsController] Search start', { lat, lon, city, checkInDate, checkOutDate, adults, currency: cur });

    // cache check
    const cached = await HotelCache.findOne({ key }).lean();
    if (cached) {
      console.log('[hotelsController] returning cached results');
      return res.json({ cached: true, results: cached.response });
    }

    // 1) Amadeus search by geocode if lat/lon provided
    if (lat && lon) {
      try {
        console.log('[hotelsController] attempting Amadeus search by geocode');
        const amadeusResults = await searchHotelsByGeo({
          lat: Number(lat),
          lon: Number(lon),
          checkInDate,
          checkOutDate,
          adults: Number(adults),
          currency: cur
        });

        if (Array.isArray(amadeusResults) && amadeusResults.length > 0) {
          const normalized = amadeusResults.map(item => {
            const hotel = item.hotel || item;
            const name = hotel.name || hotel.hotel?.name || 'Unknown';
            const offers = item.offers || item.hotelOffers || [];
            const price = offers[0]?.price?.total || offers[0]?.price?.base || null;
            const currencyVal = offers[0]?.price?.currency || cur;
            const thumbnail = hotel.media?.[0]?.uri || hotel.images?.[0]?.uri || null;
            return {
              source: 'amadeus',
              id: hotel.hotelId || hotel.id || null,
              name,
              price,
              currency: currencyVal,
              thumbnail,
              raw: item
            };
          });

          await HotelCache.updateOne({ key }, { $set: { response: normalized, createdAt: new Date() } }, { upsert: true });
          console.log('[hotelsController] returning amadeus-by-geo results', normalized.length);
          return res.json({ cached: false, source: 'amadeus', results: normalized });
        }
        console.log('[hotelsController] Amadeus by-geo returned no offers');
      } catch (e) {
        console.warn('[hotelsController] Amadeus by-geo error:', e.message || e);
      }
    }

    // 2) Amadeus search by cityCode fallback
    if (city) {
      try {
        console.log('[hotelsController] attempting Amadeus search by cityCode', city);
        const amadeusResults = await searchHotels({
          cityCode: city,
          checkInDate,
          checkOutDate,
          adults: Number(adults),
          currency: cur
        });

        if (Array.isArray(amadeusResults) && amadeusResults.length > 0) {
          const normalized = amadeusResults.map(item => {
            const hotel = item.hotel || item;
            const name = hotel.name || hotel.hotel?.name || 'Unknown';
            const offers = item.offers || item.hotelOffers || [];
            const price = offers[0]?.price?.total || offers[0]?.price?.base || null;
            const currencyVal = offers[0]?.price?.currency || cur;
            const thumbnail = hotel.media?.[0]?.uri || hotel.images?.[0]?.uri || null;
            return {
              source: 'amadeus',
              id: hotel.hotelId || hotel.id || null,
              name,
              price,
              currency: currencyVal,
              thumbnail,
              raw: item
            };
          });

          await HotelCache.updateOne({ key }, { $set: { response: normalized, createdAt: new Date() } }, { upsert: true });
          console.log('[hotelsController] returning amadeus-by-city results', normalized.length);
          return res.json({ cached: false, source: 'amadeus', results: normalized });
        }
        console.log('[hotelsController] Amadeus by-city returned no offers');
      } catch (e) {
        console.warn('[hotelsController] Amadeus by-city error:', e.message || e);
      }
    }

    // 3) Google Places fallback
    if (!lat || !lon) {
      console.log('[hotelsController] no coords available for Google fallback');
      return res.json({ cached: false, source: 'none', results: [] });
    }

    let places = [];
    try {
      console.log('[hotelsController] Google Places nearby (lodging)');
      places = await nearbyPlaces({ lat, lon, radius: 5000, type: 'lodging', limit: 30 });
    } catch (gpErr) {
      console.warn('[hotelsController] nearbyPlaces error:', gpErr.message || gpErr);
    }

    if (!places || places.length === 0) {
      try {
        const query = `hotels near ${lat},${lon}`;
        console.log('[hotelsController] Google Places Text Search fallback');
        places = await textSearchPlaces({ query, limit: 30 });
      } catch (txtErr) {
        console.warn('[hotelsController] textSearchPlaces error:', txtErr.message || txtErr);
      }
    }

    if (!places || places.length === 0) {
      console.log('[hotelsController] Google Places returned no results');
      await HotelCache.updateOne({ key }, { $set: { response: [], createdAt: new Date() } }, { upsert: true });
      return res.json({ cached: false, source: 'none', results: [] });
    }

    const normalizedPlaces = places.map(mapPlaceToNormalized);
    await HotelCache.updateOne({ key }, { $set: { response: normalizedPlaces, createdAt: new Date() } }, { upsert: true });
    console.log('[hotelsController] returning google_places results', normalizedPlaces.length);
    return res.json({ cached: false, source: 'google_places', results: normalizedPlaces });

  } catch (err) {
    console.error('[hotelsController] fatal:', err);
    return res.status(500).json({ error: 'hotel search failed', detail: err.message || err });
  }
};
