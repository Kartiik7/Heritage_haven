// backend/test_amadeus_batch_offers.js
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
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000 }
  );
  return res.data.access_token;
}

async function hotelsByCity(token, cityCode) {
  const url = `${BASE}/v1/reference-data/locations/hotels/by-city`;
  const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` }, params: { cityCode }, timeout: 15000 });
  return (res.data && res.data.data) || [];
}

async function offersByIds(token, idsCsv, checkInDate, checkOutDate, adults = 2, currency = 'INR') {
  const url = `${BASE}/v3/shopping/hotel-offers`;
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
    params: { hotelIds: idsCsv, checkInDate, checkOutDate, adults, currency, bestRateOnly: true },
    timeout: 20000
  });
  return res.data;
}

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

(async () => {
  try {
    const cityCode = process.argv[2] || 'DEL';
    const checkIn = process.argv[3] || '2025-10-10';
    const checkOut = process.argv[4] || '2025-10-11';
    const lat = process.argv[5];
    const lon = process.argv[6];
    const adults = Number(process.argv[7] || 2);
    const batchSize = Number(process.argv[8] || 10);
    const maxHotelIds = Number(process.argv[9] || 100);

    const token = await getToken();
    console.log('Token OK (len):', token.length);

    console.log(`Fetching hotel list by cityCode=${cityCode} ...`);
    let hotels = await hotelsByCity(token, cityCode);
    console.log('Total hotels returned by city-list:', hotels.length);

    // optionally sort/unique and limit
    hotels = hotels.map(h => ({ id: h.hotelId, name: h.name })).filter(h => h.id).slice(0, maxHotelIds);
    console.log(`Using ${hotels.length} hotelIds (max ${maxHotelIds})`);

    const chunks = chunkArray(hotels.map(h => h.id), batchSize);
    console.log(`Trying ${chunks.length} batches (batchSize=${batchSize})`);

    let foundOffers = [];
    for (let i = 0; i < chunks.length; i++) {
      const idsCsv = chunks[i].join(',');
      try {
        console.log(`Trying batch ${i+1}/${chunks.length} (ids: ${chunks[i].slice(0,5).join(',')}${chunks[i].length>5? ',...' : ''})`);
        const resp = await offersByIds(token, idsCsv, checkIn, checkOut, adults, process.env.CURRENCY || 'INR');
        if (resp && Array.isArray(resp.data) && resp.data.length > 0) {
          console.log(`  -> FOUND ${resp.data.length} offers in this batch`);
          // collect minimal info
          resp.data.forEach(d => {
            const hotelName = d.hotel?.name || d.hotel?.hotel?.name || '[unknown]';
            const hotelId = d.hotel?.hotelId || d.hotel?.id || null;
            const price = d.offers?.[0]?.price?.total || null;
            const currency = d.offers?.[0]?.price?.currency || null;
            foundOffers.push({ hotelId, hotelName, price, currency, raw: d });
          });
        } else {
          console.log('  -> no offers for this batch');
        }
      } catch (e) {
        console.log('  -> batch error:', e.response ? (e.response.data || e.response.status) : e.message);
      }
      // small sleep to be polite to API (100-300ms)
      await new Promise(r => setTimeout(r, 250));
    }

    console.log('=== SUMMARY ===');
    console.log('batches tried:', chunks.length);
    console.log('offers found total:', foundOffers.length);
    if (foundOffers.length > 0) {
      console.log('Sample found offers (first 10):');
      foundOffers.slice(0,10).forEach(o => console.log(`${o.hotelId} | ${o.hotelName} | ${o.price} ${o.currency}`));
    } else {
      console.log('No offers found in sandbox for provided city/dates.');
      console.log('Tips: try different dates (nearer), increase maxHotelIds, or test another city code like PAR, MAD, NYC.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
})();
