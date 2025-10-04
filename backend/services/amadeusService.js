// backend/services/amadeusService.js
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const AMADEUS_TOKEN_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token'; // use test for dev
const AMADEUS_BASE = 'https://test.api.amadeus.com';

let tokenCache = { token: null, expiresAt: 0 };

async function getToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt - 60000) return tokenCache.token;
  
  try {
    const res = await axios.post(AMADEUS_TOKEN_URL,
      qs.stringify({ 
        grant_type: 'client_credentials', 
        client_id: process.env.AMADEUS_CLIENT_ID, 
        client_secret: process.env.AMADEUS_CLIENT_SECRET 
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    
    tokenCache.token = res.data.access_token;
    tokenCache.expiresAt = Date.now() + (res.data.expires_in * 1000);
    return tokenCache.token;
  } catch (error) {
    console.error('Failed to get Amadeus token:', error.message);
    throw new Error('Amadeus authentication failed');
  }
}

// Search hotels by city code with batch processing
async function searchHotels({ cityCode, checkInDate, checkOutDate, adults = 1, currency = 'INR', maxHotelIds = 120, batchSize = 12 }) {
  try {
    const token = await getToken();
    
    // Get hotel list by city
    const hotelListRes = await axios.get(`${AMADEUS_BASE}/v1/reference-data/locations/hotels/by-city`, {
      params: { cityCode },
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const hotels = hotelListRes?.data?.data || [];
    if (hotels.length === 0) {
      return { offers: [], triedHotelIdsCount: 0, batchesTried: 0, error: 'No hotels found for city' };
    }
    
    // Process in batches
    const hotelIds = hotels.slice(0, maxHotelIds).map(h => h.hotelId).filter(Boolean);
    const offers = [];
    let batchesTried = 0;
    
    for (let i = 0; i < hotelIds.length; i += batchSize) {
      const batch = hotelIds.slice(i, i + batchSize);
      batchesTried++;
      
      try {
        const offersRes = await axios.get(`${AMADEUS_BASE}/v3/shopping/hotel-offers`, {
          params: { 
            hotelIds: batch.join(','), 
            adults, 
            checkInDate, 
            checkOutDate, 
            currency 
          },
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const batchOffers = offersRes?.data?.data || [];
        offers.push(...batchOffers);
        
        // If we got enough offers, stop processing
        if (offers.length >= 20) break;
      } catch (batchError) {
        console.warn(`Batch ${batchesTried} failed:`, batchError.message);
      }
    }
    
    return { 
      offers, 
      triedHotelIdsCount: hotelIds.length, 
      batchesTried, 
      error: null 
    };
  } catch (error) {
    console.error('Hotel search failed:', error.message);
    return { 
      offers: [], 
      triedHotelIdsCount: 0, 
      batchesTried: 0, 
      error: error.message 
    };
  }
}

// Search hotels by geocode (latitude, longitude)
async function searchHotelsByGeo({ lat, lon, checkInDate, checkOutDate, adults = 1, currency = 'INR', radiusKm = 5 }) {
  try {
    const token = await getToken();
    
    // Get hotels by geocode
    const hotelListRes = await axios.get(`${AMADEUS_BASE}/v1/reference-data/locations/hotels/by-geocode`, {
      params: { latitude: lat, longitude: lon, radius: radiusKm },
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const hotels = hotelListRes?.data?.data || [];
    if (hotels.length === 0) {
      return { offers: [], error: 'No hotels found for location' };
    }
    
    // Get offers for found hotels
    const hotelIds = hotels.slice(0, 20).map(h => h.hotelId).filter(Boolean);
    
    if (hotelIds.length === 0) {
      return { offers: [], error: 'No valid hotel IDs found' };
    }
    
    const offersRes = await axios.get(`${AMADEUS_BASE}/v3/shopping/hotel-offers`, {
      params: { 
        hotelIds: hotelIds.join(','), 
        adults, 
        checkInDate, 
        checkOutDate, 
        currency 
      },
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return { 
      offers: offersRes?.data?.data || [], 
      error: null 
    };
  } catch (error) {
    console.error('Geo hotel search failed:', error.message);
    return { 
      offers: [], 
      error: error.message 
    };
  }
}

module.exports = { 
  searchHotels, 
  searchHotelsByGeo, 
  getToken 
};
