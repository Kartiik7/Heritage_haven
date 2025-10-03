// src/components/SiteDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import heritageSites from "../assets/heritageSites.json";
import { fetchHeritageSiteById } from "../utils/api";
import "../app.css";

export default function SiteDetail() {
  const { siteId } = useParams();
  const navigate = useNavigate();

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userName = user?.username || "Guest";

  useEffect(() => {
    let mounted = true;
    const localSite = heritageSites.find((s) => s.site_id === siteId);

    const loadSite = async () => {
      try {
        setLoading(true);
        setError(null);

        // Show local data immediately if available (fast fallback)
        if (localSite) {
          if (mounted) setSite(localSite);
        }

        // Try to fetch the canonical site data (API util)
        try {
          const remote = await fetchHeritageSiteById(siteId);
          if (mounted && remote) {
            setSite(remote);
            setError(null);
          }
        } catch (fetchErr) {
          // If fetch fails but local exists, just continue showing local.
          // Otherwise show an error
          console.warn("fetchHeritageSiteById failed:", fetchErr);
          if (!localSite && mounted) {
            setError("Failed to load heritage site. Please try again later.");
            setSite(null);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (siteId) loadSite();

    return () => {
      mounted = false;
    };
  }, [siteId]);

  // Loading state (no site yet)
  if (loading && !site) {
    return (
      <div className="home-page" style={{ padding: 28 }}>
        <header className="hh-header">
          <div className="logo-box" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
            <img src="/heritage-haven-logo.jpg" alt="logo" className="logo-img" />
            <div>
              <div className="brand-title">HERITAGE HAVEN</div>
              <div className="brand-sub">A new way to connect with culture</div>
            </div>
          </div>

          <div style={{ textAlign: "center", flex: 1 }}>
            <h1 className="page-title">Loading...</h1>
          </div>

          <div className="header-right">
            <div className="user-name">Guest</div>
            <div className="user-avatar" />
          </div>
        </header>

        <main style={{ padding: 28 }}>
          <div style={{ textAlign: "center", marginTop: 50 }}>
            Loading heritage site details...
          </div>
        </main>
      </div>
    );
  }

  // Not found / error
  if (!site) {
    return (
      <div className="home-page" style={{ padding: 28 }}>
        <header className="hh-header">
          <div className="logo-box" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
            <img src="/heritage-haven-logo.jpg" alt="logo" className="logo-img" />
            <div>
              <div className="brand-title">HERITAGE HAVEN</div>
              <div className="brand-sub">A new way to connect with culture</div>
            </div>
          </div>

          <div style={{ textAlign: "center", flex: 1 }}>
            <h1 className="page-title">Site Not Found</h1>
          </div>

          <div className="header-right">
            <div className="user-name">Guest</div>
            <div className="user-avatar" />
          </div>
        </header>

        <main style={{ padding: 28 }}>
          <h2>Site not found</h2>
          <p>{error || `No site matches ${siteId}.`}</p>
          <button
            className="signup-btn small"
            onClick={() => navigate("/discover")}
          >
            Back to Discover
          </button>
        </main>
      </div>
    );
  }

  // Main render
  return (
    <div className="site-page">
      <header className="hh-header">
        <div className="logo-box" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
          <img src="/heritage-haven-logo.jpg" alt="logo" className="logo-img" />
          <div>
            <div className="brand-title">HERITAGE HAVEN</div>
            <div className="brand-sub">A new way to connect with culture</div>
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 className="page-title">{site.name}</h1>
        </div>

        <div className="header-right">
          <div className="user-name">{userName}</div>
          <div className="user-avatar" />
        </div>
      </header>

      <main className="site-main">
        <article className="site-card">
          {/* Left: main image (vertically centered) */}
          <div className="site-left">
            <img
              src={site.image_array?.[0] || "/heritage-haven-logo.jpg"}
              alt={site.name}
              className="site-main-image"
            />
          </div>

          {/* Right: content (centered vertically so visual centers line up) */}
          <div className="site-right">
            <h2>{site.name}</h2>
            <p>{site.description}</p>

            <p>
              <strong>Location:</strong> {site.location}
            </p>
            <p>
              <strong>Coordinates:</strong> {site.geotag?.latitude},{" "}
              {site.geotag?.longitude}
            </p>

            <div className="site-video">
              <div style={{ width: "100%" }}>
                <h3 style={{ marginTop: 0 }}>Video</h3>
                <div style={{ width: "100%", height: "320px" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${site.youtube_video_id}`}
                    title={site.name}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            <div className="site-actions">
              <button className="site-btn" onClick={() => navigate("/discover")}>
                Back to Discover
              </button>

              <button
                className="site-btn"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${site.geotag?.latitude},${site.geotag?.longitude}`,
                    "_blank"
                  )
                }
              >
                Open in Maps
              </button>
            </div>
          </div>
        </article>

        {/* Thumbnails row (centered and uniform sizes) */}
        <div className="site-thumbnails">
          {site.image_array?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${site.name} - ${i + 1}`}
              onClick={() => {
                // clicking a thumbnail replaces the main image
                setSite((prev) => ({ ...prev, __selectedThumb: i, image_array: prev.image_array }));
                // simple approach: swap first element so main image updates
                const newArr = [...site.image_array];
                [newArr[0], newArr[i]] = [newArr[i], newArr[0]];
                setSite((prev) => ({ ...prev, image_array: newArr }));
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
