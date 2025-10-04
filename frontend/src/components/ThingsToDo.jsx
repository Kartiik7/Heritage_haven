// frontend/src/components/ThingsToDo.jsx
import React, { useEffect, useState } from 'react';

export default function ThingsToDo({ lat, lon }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!lat || !lon) return;
    
    setLoading(true);
    fetch(`/api/places/nearby?lat=${lat}&lon=${lon}`)
      .then(r => r.json())
      .then(data => {
        setPlaces(data);
        setLoading(false);
      })
      .catch(() => {
        setPlaces([]);
        setLoading(false);
      });
  }, [lat, lon]);

  return (
    <div className="card">
      <h4>🎯 Things to do nearby</h4>
      
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          color: '#666' 
        }}>
          🔄 Finding nearby attractions...
        </div>
      )}
      
      {!loading && places.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px'
        }}>
          No nearby attractions found. Try a different location.
        </div>
      )}
      
      {!loading && places.length > 0 && (
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          {places.map(p => (
            <div 
              key={p.place_id} 
              style={{ 
                minWidth: '220px',
                background: 'white',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ 
                fontWeight: '600', 
                fontSize: '14px',
                color: '#2c3e50',
                marginBottom: '8px',
                lineHeight: '1.3'
              }}>
                {p.name}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#666',
                marginBottom: '12px',
                lineHeight: '1.4'
              }}>
                📍 {p.vicinity || p.formatted_address}
              </div>
              <a 
                className="btn" 
                href={`https://www.google.com/maps/search/?api=1&query=place_id:${p.place_id}`} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  textDecoration: 'none'
                }}
              >
                View on Maps
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
