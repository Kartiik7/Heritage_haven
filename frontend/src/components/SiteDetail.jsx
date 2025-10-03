// src/components/SiteDetail.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import heritageSites from "../assets/heritageSites.json"; // adjust path if you put JSON elsewhere
import "../app.css";

export default function SiteDetail() {
  const { siteId } = useParams(); // expects /site/H001
  const navigate = useNavigate();

  const site = heritageSites.find((s) => s.site_id === siteId || s._id === siteId);

  if (!site) {
    return (
      <div className="home-page" style={{ padding: 28 }}>
        <header className="hh-header">
          <div className="logo-box" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
            <img src="/images/heritage-haven-logo.jpg" alt="logo" className="logo-img" />
            <div>
              <div className="brand-title">HERITAGE HAVEN</div>
              <div className="brand-sub">A new way to connect with culture</div>
            </div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <h1 className="page-title">Site Not Found</h1>
          </div>
          <div className="header-right">
            <div className="user-name">Prannoy Chandola</div>
            <div className="user-avatar" />
          </div>
        </header>

        <main style={{ padding: 28 }}>
          <h2>Site not found</h2>
          <p>No site matches <strong>{siteId}</strong>. Return to home to choose another site.</p>
          <button className="signup-btn small" onClick={() => navigate("/home")}>Back to Home</button>
        </main>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="hh-header">
        <div className="logo-box" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
          <img src="/images/heritage-haven-logo.jpg" alt="logo" className="logo-img" />
          <div>
            <div className="brand-title">HERITAGE HAVEN</div>
            <div className="brand-sub">A new way to connect with culture</div>
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 className="page-title">{site.name}</h1>
        </div>

        <div className="header-right">
          <div className="user-name">Prannoy Chandola</div>
          <div className="user-avatar" />
        </div>
      </header>

      <main style={{ padding: 28 }}>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <div style={{ minWidth: 320 }}>
            <img
              src={site.image_array?.[0] || "/images/heritage-haven-logo.jpg"}
              alt={site.name}
              style={{ width: "100%", borderRadius: 12, objectFit: "cover" }}
            />
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(site.image_array || []).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${site.name}-${idx}`}
                  style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8 }}
                />
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ marginTop: 0 }}>{site.name}</h2>
            <p style={{ color: "rgba(255,255,255,0.95)" }}>{site.description}</p>

            <p><strong>Location:</strong> {site.location}</p>
            <p><strong>Coordinates:</strong> {site.geotag?.latitude}, {site.geotag?.longitude}</p>

            {site.youtube_video_id && (
              <div style={{ marginTop: 18 }}>
                <h3>Video</h3>
                <iframe
                  title={site.name}
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${site.youtube_video_id}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div style={{ marginTop: 22 }}>
              <button className="signup-btn small" onClick={() => navigate("/discover")} style={{ marginRight: 8 }}>
                Back to Discover
              </button>
              <button
                className="text-btn"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${site.geotag?.latitude},${site.geotag?.longitude}`, "_blank")}
              >
                Open in Maps
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
