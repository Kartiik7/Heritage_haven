// backend/test_amadeus_poi_offers.js
require('dotenv').config();
const axios = require('axios');
const qs = require('qs');

const ENV = process.env.AMADEUS_ENV === 'prod' ? 'prod' : 'test';
const TOKEN_URL = ENV === 'prod'
  ? 'https://api.amadeus.com/v1/security/oauth2/token'
  : 'https://test.api.amadeus.com/v1/security/oauth2/token';
const BASE = ENV === 'prod' ? 'https://api.amadeus.com' : 'https://test.api.amadeus.com';

async function getToken() {
  const res = await axios.post(TOKEN_URL,
    qs.stringify({ grant_type: 'client_credentials', client_id: process.env.AMADEUS_CLIENT_ID, client_secret: process.env.AMADEUS_CLIENT_SECRET }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return res.data.access_token;
}

async function hotelPOIs(token, lat, lon, radius = 2000) {
  const url = `${BASE}/v1/reference-data/locations/pois`;
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
    params: { lat, lon, radius, category: 'HOTEL' },
    timeout: 15000
  });
  return res.data;
}

async function hotelOffersByIds(token, hotelIdsCsv, checkInDate, checkOutDate, adults = 2, currency = 'INR') {
  const url = `${BASE}/v3/shopping/hotel-offers`;
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
    params: { hotelIds: hotelIdsCsv, checkInDate, checkOutDate, adults, currency },
    timeout: 15000
  });
  return res.data;
}

(async () => {
  try {
    const token = await getToken();
    console.log('token OK — length:', token.length);

    const lat = process.argv[2] || '27.1751';   // Taj Mahal latitude
    const lon = process.argv[3] || '78.0421';   // Taj Mahal longitude
    const checkIn = process.argv[4] || '2025-10-10';
    const checkOut = process.argv[5] || '2025-10-11';

    console.log(`\nFetching POIs near ${lat},${lon} ...`);
    const pois = await hotelPOIs(token, lat, lon, 2000);
    console.log('POIs top-level keys:', Object.keys(pois));
    console.log('POIs count:', (pois.data || []).length);

    if (!pois.data || pois.data.length === 0) {
      console.log('No POIs returned. Try increasing radius or different coords or use another city code.');
      return;
    }

    const ids = pois.data.map(p => p.hotelId || p.id).filter(Boolean).slice(0, 10);
    console.log('Sample hotelIds (first 10):', ids);

    if (ids.length === 0) {
      console.log('POIs returned but no hotelId fields were found. Showing first POI for inspection:');
      console.log(JSON.stringify(pois.data[0], null, 2));
      return;
    }

    const idsCsv = ids.join(',');
    console.log(`\nRequesting offers for hotelIds: ${idsCsv}`);
    const offers = await hotelOffersByIds(token, idsCsv, checkIn, checkOut, 2, process.env.CURRENCY || 'INR');
    console.log('offers keys:', Object.keys(offers));
    console.log('offers.data length:', (offers.data || []).length);
    if ((offers.data || []).length > 0) {
      console.log('Example offer (trimmed):', JSON.stringify(offers.data[0], null, 2).slice(0, 2000));
    } else {
      console.log('No offers found for these hotel IDs. Try different dates or increase the number of hotelIds.');
    }

  } catch (err) {
    console.error('ERROR:', err.response ? err.response.data : err.message);
  }
})();
