// frontend/src/components/HotelList.jsx
import React, { useState } from 'react';
import HotelCard from './HotelCard';
import { getApiBaseUrl } from '../utils/api';

export default function HotelList({ lat, lon, city }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [dates, setDates] = useState({
    checkIn: "",
    checkOut: ""
  });
  const [adults, setAdults] = useState(2);

  const search = async () => {
    if (!dates.checkIn || !dates.checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }
    
    setLoading(true);
    setError(null);
    setHotels([]);
    
    try {
      const params = new URLSearchParams({
        lat, 
        lon, 
        city: city || "", 
        checkInDate: dates.checkIn, 
        checkOutDate: dates.checkOut, 
        adults
      });
      const apiBaseUrl = getApiBaseUrl();
      const res = await fetch(`${apiBaseUrl}/api/hotels/search?${params.toString()}`);
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API did not return JSON");
      }
      
      const json = await res.json();
      setHotels(json.results || []);
      
      if (!json.results || json.results.length === 0) {
        setError('No hotels found for the selected dates');
      }
    } catch (err) {
      console.error("Hotel search error:", err);
      setError('Failed to load hotels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>🏨 Hotels & Accommodation</h3>
      <div className="hotel-search-form" style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '140px' }}>
          <label style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Check-in</label>
          <input 
            type="date" 
            value={dates.checkIn} 
            onChange={e => setDates({...dates, checkIn: e.target.value})}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '140px' }}>
          <label style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Check-out</label>
          <input 
            type="date" 
            value={dates.checkOut} 
            onChange={e => setDates({...dates, checkOut: e.target.value})}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '80px' }}>
          <label style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Adults</label>
          <input 
            type="number" 
            min="1" 
            max="9" 
            value={adults} 
            onChange={e => setAdults(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <button 
          className="btn" 
          onClick={search}
          disabled={!dates.checkIn || !dates.checkOut || loading}
          style={{ 
            alignSelf: 'flex-end',
            opacity: (!dates.checkIn || !dates.checkOut || loading) ? 0.6 : 1,
            padding: '8px 16px',
            borderRadius: '4px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Searching...' : 'Search Hotels'}
        </button>
      </div>
      
      {error && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '6px', 
          marginBottom: '16px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}
      
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          color: '#666' 
        }}>
          🔄 Searching for the best hotels...
        </div>
      )}
      
      {hotels.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '16px',
          marginTop: '16px'
        }}>
          {hotels.map((h, i) => <HotelCard key={i} hotel={h} />)}
        </div>
      )}
      
      {!loading && hotels.length === 0 && dates.checkIn && dates.checkOut && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          marginTop: '16px'
        }}>
          No hotels found for the selected dates. Try different dates or check your location.
        </div>
      )}
    </div>
  );
}
