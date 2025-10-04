<<<<<<< HEAD
import React, { useState } from "react";
=======
// frontend/src/components/HotelList.jsx
import React, { useState } from 'react';
import HotelCard from './HotelCard';
>>>>>>> 5bfb9d3525717d17d6c7f124f9cab67c4233e62e

export default function HotelList({ lat, lon, city }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    try {
<<<<<<< HEAD
      const url = `/api/hotels/search?lat=${lat}&lon=${lon}&city=${city || ""}&checkInDate=${checkIn}&checkOutDate=${checkOut}&adults=${adults}`;
      const res = await fetch(url);
      if (!res.ok) {
        setError(`API error: ${res.status}`);
        setLoading(false);
        return;
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setError("API did not return JSON");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setError("No hotels found");
      }
    } catch (err) {
      console.error("Hotel search error:", err);
      setError("Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hotel-search-box">
      <h3>Hotels & Compare</h3>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
        <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
        <input
          type="number"
          min="1"
          value={adults}
          onChange={e => setAdults(e.target.value)}
          style={{ width: "60px" }}
        />
        <button className="btn" onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading hotels...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="hotel-grid">
        {results.map((h, i) => (
          <div key={h.id || i} className="hotel-card">
            {/* Image (Amadeus rarely returns, so fallback image if missing) */}
            {h.thumbnail ? (
              <img src={h.thumbnail} alt={h.name} />
            ) : (
              <img src="/default-hotel.jpg" alt="Hotel" />
            )}

            <h4>{h.name}</h4>

            {/* Address or fallback */}
            <p>{h.address || "No address available"}</p>

            {/* Rating */}
            {h.rating && <p>⭐ {h.rating}</p>}

            {/* Price or external link */}
            {h.price ? (
              <p><strong>{h.price} {h.currency}</strong></p>
            ) : (
              <p><a href={h.bookingUrl || h.mapsUrl} target="_blank" rel="noreferrer">View Details</a></p>
            )}

            {/* Booking / Maps Link */}
            {h.bookingUrl && (
              <a href={h.bookingUrl} target="_blank" rel="noreferrer" className="btn btn-small">
                Book Now
              </a>
            )}
          </div>
        ))}
=======
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
>>>>>>> 5bfb9d3525717d17d6c7f124f9cab67c4233e62e
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
