import React, { useState } from "react";

export default function HotelsList({ lat, lon, city }) {
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
      </div>
    </div>
  );
}
