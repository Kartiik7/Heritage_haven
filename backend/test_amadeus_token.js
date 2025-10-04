// backend/test_amadeus_token.js
require('dotenv').config();
const axios = require('axios');
const qs = require('qs');

async function run(){
  const CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
  const CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('Missing AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET in .env');
    process.exit(1);
  }

  try {
    const res = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      qs.stringify({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 10000 }
    );
    console.log('token OK — expires_in:', res.data.expires_in);
    console.log('access_token (first 64 chars):', res.data.access_token?.slice(0,64));
  } catch (err) {
    console.error('token request failed:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
}
run();
