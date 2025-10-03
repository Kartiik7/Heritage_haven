// src/components/SiteDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import heritageSites from "../assets/heritageSites.json";
=======
import { fetchHeritageSiteById } from "../utils/api";
>>>>>>> e856b4935bb7d735bad2e7b3fbd55e8d8700ce4e
import "../app.css";

export default function SiteDetail() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

<<<<<<< HEAD
  const site = heritageSites.find((s) => s.site_id === siteId);

  if (!site) {
    return <div style={{ padding: 20 }}>Site not found</div>;
=======
  useEffect(() => {
    const loadSite = async () => {
      try {
        setLoading(true);
        const siteData = await fetchHeritageSiteById(siteId);
        setSite(siteData);
        setError(null);
      } catch (err) {
        console.error('Failed to load heritage site:', err);
        setError('Failed to load heritage site. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (siteId) {
      loadSite();
    }
  }, [siteId]);

  if (loading) {
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
            <h1 className="page-title">Loading...</h1>
          </div>
          <div className="header-right">
            <div className="user-name">Prannoy Chandola</div>
            <div className="user-avatar" />
          </div>
        </header>
        <main style={{ padding: 28 }}>
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            Loading heritage site details...
          </div>
        </main>
      </div>
    );
  }

  if (error || !site) {
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
          <p>{error || `No site matches ${siteId}. Return to home to choose another site.`}</p>
          <button className="signup-btn small" onClick={() => navigate("/home")}>Back to Home</button>
        </main>
      </div>
    );
>>>>>>> e856b4935bb7d735bad2e7b3fbd55e8d8700ce4e
  }

  return (
    <div className="site-page">
      <main className="site-main">
        <article className="site-card">
          {/* Left Image */}
          <div className="site-left">
            <img
              src={site.image_array[0]}
              alt={site.name}
              className="site-main-image"
            />
          </div>

          {/* Right Info */}
          <div className="site-right">
            <h2>{site.name}</h2>
            <p>{site.description}</p>
            <p>
              <strong>Location:</strong> {site.location}
            </p>
            <p>
              <strong>Coordinates:</strong> {site.geotag.latitude},{" "}
              {site.geotag.longitude}
            </p>

            {/* Video Section */}
            <div className="site-video">
              <h3>Video</h3>
              <iframe
                width="100%"
                height="250"
                src={`https://www.youtube.com/embed/${site.youtube_video_id}`}
                title={site.name}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>

            {/* Action Buttons */}
            <div className="site-actions">
              <button
                className="site-btn"
                onClick={() => navigate("/discover")}
              >
                Back to Discover
              </button>
              <button
                className="site-btn"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${site.geotag.latitude},${site.geotag.longitude}`,
                    "_blank"
                  )
                }
              >
                Open in Maps
              </button>
            </div>
          </div>
        </article>

        {/* Thumbnails Section */}
        <div className="site-thumbnails">
          {site.image_array.map((img, i) => (
            <img key={i} src={img} alt={`${site.name}-${i + 1}`} />
          ))}
        </div>
      </main>
    </div>
  );
}
