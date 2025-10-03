// src/components/ARTour.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import heritageSites from "../assets/heritageSites.json";

export default function ARTour() {
  const navigate = useNavigate();
  const withVideos = heritageSites.filter((s) => s.youtube_video_id);

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
          <h1 className="page-title">AR / Video Tour</h1>
        </div>

        <div className="header-right">
          <div className="user-name">Prannoy Chandola</div>
          <div className="user-avatar" />
        </div>
      </header>

      <main style={{ padding: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
          {withVideos.map((site) => (
            <div key={site._id} className="feature-card" style={{ padding: 16 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <img
                  src={site.image_array[0]}
                  alt={site.name}
                  style={{ width: 160, height: 100, objectFit: "cover", borderRadius: 8 }}
                />
                <div style={{ flex: 1 }}>
                  <div className="feature-title" style={{ fontSize: 18 }}>{site.name}</div>
                  <p style={{ marginTop: 6 }}>{site.description}</p>
                  <div style={{ marginTop: 8 }}>
                    <button className="signup-btn small" onClick={() => navigate(`/site/${site.site_id}`)}>
                      Details
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <iframe
                  title={site.name + " video"}
                  width="100%"
                  height="280"
                  src={`https://www.youtube.com/embed/${site.youtube_video_id}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
