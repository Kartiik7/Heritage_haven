import React from "react";

export default function FeatureCard({ title, bullets = [], onClick }) {
  return (
    <div className="feature-card" onClick={onClick}>
      <div className="feature-thumb">
        <div className="thumb-placeholder" />
      </div>

      <div>
        <div className="feature-title">{title}</div>
        <ul className="feature-bullets">
          {bullets.map((b, idx) => (
            <li key={idx}>{b}</li>
          ))}
        </ul>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="feature-go" aria-label={`Go to ${title}`}>➜</button>
      </div>
    </div>
  );
}