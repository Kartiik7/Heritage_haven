// frontend/src/components/ThingsToDo.jsx
import React, { useEffect, useState } from 'react';

export default function ThingsToDo({ lat, lon }) {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    if (!lat || !lon) return;
    fetch(`/api/places/nearby?lat=${lat}&lon=${lon}`)
      .then(r => r.json()).then(setPlaces).catch(()=>{});
  }, [lat, lon]);

  return (
    <div className="card">
      <h4>Things to do nearby</h4>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
        {places.map(p => (
          <div key={p.place_id} style={{ minWidth: 200 }}>
            <div style={{ fontWeight: 700 }}>{p.name}</div>
            <div style={{ fontSize: 12 }}>{p.vicinity || p.formatted_address}</div>
            <a className="btn" href={`https://www.google.com/maps/search/?api=1&query=place_id:${p.place_id}`} target="_blank" rel="noreferrer">View</a>
          </div>
        ))}
      </div>
    </div>
  );
}
