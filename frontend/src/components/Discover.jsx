// src/components/Discover.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHeritageSites } from "../utils/api";

export default function Discover() {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSites = async () => {
      try {
        setLoading(true);
        const heritageSites = await fetchHeritageSites();
        setSites(heritageSites);
        setError(null);
      } catch (err) {
        console.error('Failed to load heritage sites:', err);
        setError('Failed to load heritage sites. Please try again later.');
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
            <h1 className="page-title">Discover</h1>
          </div>
          <div className="header-right">
            <div className="user-name">Prannoy Chandola</div>
            <div className="user-avatar" />
          </div>
        </header>
        <main className="home-main" style={{ padding: 28 }}>
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            Loading heritage sites...
          </div>
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
            <h1 className="page-title">Discover</h1>
          </div>
          <div className="header-right">
            <div className="user-name">Prannoy Chandola</div>
            <div className="user-avatar" />
          </div>
        </header>
        <main className="home-main" style={{ padding: 28 }}>
          <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
            Error: {error}
          </div>
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
          <h1 className="page-title">Discover</h1>
        </div>

        <div className="header-right">
          <div className="user-name">Prannoy Chandola</div>
          <div className="user-avatar" />
        </div>
      </header>

      <main className="home-main" style={{ padding: 28 }}>
        <div className="features-wrap" style={{ gap: 20 }}>
          {sites.map((site) => (
            <article className="feature-card" key={site._id} style={{ alignItems: "center" }}>
              <div className="feature-thumb">
                <img
                  src={site.image_array && site.image_array[0]}
                  alt={site.name}
                  style={{ width: "140px", height: "140px", borderRadius: 10, objectFit: "cover" }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div className="feature-title">{site.name}</div>
                <p style={{ color: "rgba(255,255,255,0.9)", marginTop: 6 }}>{site.description}</p>
                <div style={{ marginTop: 12 }}>
                  <button
                    className="signup-btn small"
                    onClick={() => navigate(`/site/${site.site_id}`)}
                    style={{ marginRight: 8 }}
                  >
                    View
                  </button>
                  <button
                    className="text-btn"
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${site.geotag.latitude},${site.geotag.longitude}`, "_blank")}
                  >
                    Open in Maps
                  </button>
                </div>
              </div>

              <div>
                <button
                  className="feature-go"
                  onClick={() => navigate(`/site/${site.site_id}`)}
                  aria-label={`open ${site.name}`}
                >
                  ➜
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}