// src/components/ARTour.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { fetchHeritageSites } from "../utils/api";

import "../app.css";

export default function ARTour() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userName = user?.username || "Guest";

  useEffect(() => {
    const loadSites = async () => {
      try {
        setLoading(true);
        const heritageSites = await fetchHeritageSites();
        const withVideos = heritageSites.filter((s) => s.youtube_video_id);
        setSites(withVideos);
        setError(null);
      } catch (err) {
        console.error("Failed to load heritage sites:", err);
        setError("Failed to load heritage sites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadSites();
  }, []);

  if (loading) {
    return (
      <div className="home-page">
        <header className="hh-header">
          <div className="logo-box" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
            <img src="/heritage-haven-logo.jpg" alt="logo" className="logo-img" />
            <div>
              <div className="brand-title">HERITAGE HAVEN</div>
              <div className="brand-sub">A new way to connect with culture</div>
            </div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <h1 className="page-title">AR / Video Tour</h1>
          </div>
          <div className="header-right">
            <div className="user-name">{userName}</div>
            <div className="user-avatar" />
          </div>
        </header>
        <main style={{ padding: 28 }}>
          <div style={{ textAlign: "center", marginTop: "50px" }}>Loading video tours...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <header className="hh-header">
          <div className="logo-box" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
            <img src="/heritage-haven-logo.jpg" alt="logo" className="logo-img" />
            <div>
              <div className="brand-title">HERITAGE HAVEN</div>
              <div className="brand-sub">A new way to connect with culture</div>
            </div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <h1 className="page-title">AR / Video Tour</h1>
          </div>
          <div className="header-right">
            <div className="user-name">{userName}</div>
            <div className="user-avatar" />
          </div>
        </header>
        <main style={{ padding: 28 }}>
          <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>Error: {error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="hh-header">
        <div className="logo-box" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
          <img src="/heritage-haven-logo.jpg" alt="logo" className="logo-img" />
          <div>
            <div className="brand-title">HERITAGE HAVEN</div>
            <div className="brand-sub">A new way to connect with culture</div>
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 className="page-title">AR / Video Tour</h1>
        </div>

        <div className="header-right">
          <div className="user-name">{userName}</div>
          <div className="user-avatar" />
        </div>
      </header>

      <main style={{ padding: 28 }}>
        {/* grid container */}
        <div className="ar-grid">
          {sites.map((site) => (
            <article key={site.site_id} className="ar-card">
              {/* top row: thumbnail + text */}
              <div className="ar-card-top">
                <img
                  src={site.image_array && site.image_array[0]}
                  alt={site.name}
                />
                <div>
                  <h3>{site.name}</h3>
                  <p>{site.description}</p>
                </div>
              </div>

              {/* video area (kept a fixed aspect area to match heights better) */}
              <div className="ar-card-video">
                <div className="video-wrap">
                  <iframe
                    title={`${site.name} video`}
                    src={`https://www.youtube.com/embed/${site.youtube_video_id}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* details button anchored at bottom */}
              <div>
                <button
                  className="details-btn"
                  onClick={() => navigate(`/site/${site.site_id}`)}
                >
                  Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
