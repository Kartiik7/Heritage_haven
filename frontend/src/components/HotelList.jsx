// frontend/src/components/HotelsList.jsx
import React, { useState } from 'react';
import HotelCard from './HotelCard';

export default function HotelsList({ lat, lon, city }) {
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
    } catch (e) { setError('Failed'); }
    setLoading(false);
  }

  return (
    <div className="card">
      <h3>Hotels & compare</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input type="date" value={dates.checkIn} onChange={e => setDates({...dates, checkIn: e.target.value})} />
        <input type="date" value={dates.checkOut} onChange={e => setDates({...dates, checkOut: e.target.value})} />
        <input type="number" min="1" max="9" value={adults} onChange={e=>setAdults(e.target.value)} />
        <button className="btn" onClick={search}>Search</button>
      </div>
      {loading && <div>Loading…</div>}
      {error && <div>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 12 }}>
        {hotels.map((h, i) => <HotelCard key={i} hotel={h} />)}
      </div>
    </div>
  );
}
