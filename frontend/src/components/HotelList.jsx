// frontend/src/components/HotelList.jsx
import React, { useState } from 'react';
import HotelCard from './HotelCard';

export default function HotelList({ lat, lon, city }) {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [adults, setAdults] = useState(2);
  const [error, setError] = useState('');

  async function search() {
    setError('');
    setLoading(true);
    try {
      const params = new URLSearchParams({
        lat, lon, city, checkInDate: dates.checkIn, checkOutDate: dates.checkOut, adults
      });
      const res = await fetch(`/api/hotels/search?${params.toString()}`);
      const json = await res.json();
      setHotels(json.results || []);
    } catch { setError('Failed to load hotels. Please try again.'); }
    setLoading(false);
  }

  return (
    <div className="card">
      <h3>🏨 Hotels & Accommodation</h3>
      <div className="hotel-search-form">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Check-in</label>
          <input 
            type="date" 
            value={dates.checkIn} 
            onChange={e => setDates({...dates, checkIn: e.target.value})}
            placeholder="Check-in date" 
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Check-out</label>
          <input 
            type="date" 
            value={dates.checkOut} 
            onChange={e => setDates({...dates, checkOut: e.target.value})}
            placeholder="Check-out date" 
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Adults</label>
          <input 
            type="number" 
            min="1" 
            max="9" 
            value={adults} 
            onChange={e => setAdults(e.target.value)}
            placeholder="Adults" 
          />
        </div>
        <button 
          className="btn" 
          onClick={search}
          disabled={!dates.checkIn || !dates.checkOut || loading}
          style={{ 
            alignSelf: 'flex-end',
            opacity: (!dates.checkIn || !dates.checkOut || loading) ? 0.6 : 1 
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
