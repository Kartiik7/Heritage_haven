// backend/services/amadeusService.js
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const AMADEUS_TOKEN_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token'; // use test for dev
const AMADEUS_BASE = 'https://test.api.amadeus.com';

let tokenCache = { token: null, expiresAt: 0 };

async function getToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt - 60000) return tokenCache.token;
  const res = await axios.post(AMADEUS_TOKEN_URL,
    qs.stringify({ grant_type: 'client_credentials', client_id: process.env.AMADEUS_CLIENT_ID, client_secret: process.env.AMADEUS_CLIENT_SECRET }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  tokenCache.token = res.data.access_token;
  tokenCache.expiresAt = Date.now() + (res.data.expires_in * 1000);
  return tokenCache.token;
}

// Search hotels by geocode (latitude, longitude) or city code
async function searchHotels({ lat, lon, cityCode, checkInDate, checkOutDate, adults = 1, currency = 'INR', radiusKm = 5 }) {
  const token = await getToken();
  // Step 1: get hotel list by geocode
  if (lat && lon) {
    const locRes = await axios.get(`${AMADEUS_BASE}/v1/reference-data/locations/pois`, {
      params: { lat: lat, lon: lon, radius: Math.round(radiusKm * 1000) },
      headers: { Authorization: `Bearer ${token}` }
    }).catch(()=>null);

    // Use hotels by geocode endpoint (alternative endpoints exist depending on Amadeus version)
    // Fallback: call hotel list by geocode
    const hotels = locRes?.data?.data || [];
    // Map to hotel IDs
    const hotelIds = hotels.slice(0, 10).map(h => h?.hotelId || h?.id).filter(Boolean).join(',');
    if (!hotelIds) return [];
    // Step 2: get hotel offers (rates)
    const offersRes = await axios.get(`${AMADEUS_BASE}/v3/shopping/hotel-offers`, {
      params: { hotelIds, adults, checkInDate, checkOutDate, currency },
      headers: { Authorization: `Bearer ${token}` }
    }).catch(()=>null);
    return offersRes?.data?.data || [];
  }

  // If we have city code:
  if (cityCode) {
    const res = await axios.get(`${AMADEUS_BASE}/v3/shopping/hotel-offers`, {
      params: { cityCode, checkInDate, checkOutDate, adults, currency },
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data || [];
  }

  return [];
}

module.exports = { searchHotels };
