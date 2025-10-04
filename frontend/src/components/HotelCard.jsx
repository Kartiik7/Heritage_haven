// frontend/src/components/HotelCard.jsx
import React from 'react';

export default function HotelCard({ hotel }) {
  // Amadeus hotel-offers structure: hotel property under hotel or hotel: { name, rating, amenities }
  const hotelInfo = hotel.hotel || hotel || {};
  const name = hotelInfo.name || hotelInfo?.hotel?.name || 'Unknown Hotel';
  const thumbnail = hotelInfo?.hotel?.media?.[0]?.uri || hotelInfo?.media?.[0]?.uri || '';
  const offers = hotel.offers || hotel.hotelOffers || hotel.offers || [];
  const bestOffer = offers[0] || {};
  const price = bestOffer?.price?.total || bestOffer?.price?.base || (bestOffer?.room?.price ? bestOffer.room.price.total : null);
  const currency = bestOffer?.price?.currency || 'INR';
  const rating = hotelInfo?.rating || hotelInfo?.hotel?.rating;

  // fallback booking link: use offer.hotels? or externalUrl
  const bookingLink = bestOffer?.self || bestOffer?.id || '#';

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #e0e0e0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ 
          width: '100px', 
          height: '80px', 
          backgroundColor: '#f5f5f5',
          borderRadius: '6px',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={name} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }} 
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: '24px'
            }}>
              🏨
            </div>
          )}
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#2c3e50',
            lineHeight: '1.3'
          }}>
            {name}
          </h4>
          
          {rating && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              marginBottom: '8px',
              fontSize: '14px',
              color: '#666'
            }}>
              <span>⭐</span>
              <span>{rating} stars</span>
            </div>
          )}
          
          {price && (
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '700',
              color: '#e74c3c',
              marginBottom: '12px'
            }}>
              {currency} {price}
              <span style={{ fontSize: '12px', color: '#666', fontWeight: '400' }}> /night</span>
            </div>
          )}
          
          <div style={{ marginTop: 'auto' }}>
            <a 
              className="btn" 
              href={bookingLink} 
              target="_blank" 
              rel="noreferrer"
              style={{
                textDecoration: 'none',
                fontSize: '12px',
                padding: '8px 16px'
              }}
            >
              View Details
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
