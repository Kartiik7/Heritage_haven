// frontend/src/components/HotelCard.jsx
import React from 'react';

export default function HotelCard({ hotel }) {
  // Amadeus hotel-offers structure: hotel property under hotel or hotel: { name, rating, amenities }
  const hotelInfo = hotel.hotel || hotel || {};
  const name = hotelInfo.name || hotelInfo?.hotel?.name || 'Unknown';
  const thumbnail = hotelInfo?.hotel?.media?.[0]?.uri || hotelInfo?.media?.[0]?.uri || '';
  const offers = hotel.offers || hotel.hotelOffers || hotel.offers || [];
  const bestOffer = offers[0] || {};
  const price = bestOffer?.price?.total || bestOffer?.price?.base || (bestOffer?.room?.price ? bestOffer.room.price.total : 'N/A');
  const currency = bestOffer?.price?.currency || 'INR';
  const rating = hotelInfo?.rating || hotelInfo?.hotel?.rating || '—';

  // fallback booking link: use offer.hotaels? or externalUrl
  const bookingLink = bestOffer?.self || bestOffer?.id || '#';

  return (
    <div className="card">
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 100, height: 80, background: '#eee' }}>
          {thumbnail ? <img src={thumbnail} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>{name}</div>
          <div>Rating: {rating}</div>
          <div style={{ marginTop: 8, fontSize: 18 }}>{price} {currency}</div>
          <div style={{ marginTop: 10 }}>
            <a className="btn" href={bookingLink} target="_blank" rel="noreferrer">Book (external)</a>
          </div>
        </div>
      </div>
    </div>
  );
}
