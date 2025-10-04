// src/components/SiteDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import heritageSites from '../assets/heritageSites.json';
import { fetchHeritageSiteById } from "../utils/api";
import "../app.css";
import Quiz from './Quiz';
// import { useState, useEffect } from 'react';
import HotelsList from './HotelList';
import ThingsToDo from './ThingsToDo';

export default function SiteDetail() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [userName, setUserName] = useState("Guest");

  // load site (local fallback + remote)
  useEffect(() => {
    let mounted = true;
    const localSite = heritageSites.find((s) => s.site_id === siteId);

    const loadSite = async () => {
      try {
        setLoading(true);
        setError(null);

        // Show local data immediately if available
        if (localSite && mounted) {
          setSite(localSite);
        }

        // Try to fetch canonical site data (if your API exists)
        try {
          const remote = await fetchHeritageSiteById(siteId);
          if (mounted && remote) {
            setSite(remote);
            setError(null);
          }
        } catch (fetchErr) {
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

  // fetch user profile name (if logged in)
  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && data?.name) setUserName(data.name);
      } catch (e) {
        // ignore - keep Guest
      }
    }
    loadUser();
    return () => (mounted = false);
  }, []);

  // Loading state (when no site yet)
  if (loading && !site) {
    return (
      <div className="home-page" style={{ padding: 28 }}>
        <header className="hh-header">
          <div
            className="logo-box"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            <img
              src="/heritage-haven-logo.jpg"
              alt="logo"
              className="logo-img"
            />
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
          <div
            className="logo-box"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            <img
              src="/heritage-haven-logo.jpg"
              alt="logo"
              className="logo-img"
            />
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
          <button className="signup-btn small" onClick={() => navigate("/discover")}>
            Back to Discover
          </button>
        </main>
      </div>
    );
  }

  // Main render (site is available)
  const lat = site.geotag?.latitude || site.lat || site.latitude;
  const lon = site.geotag?.longitude || site.lon || site.longitude;

  return (
    <div className="site-page">
      <header className="hh-header">
        <div
          className="logo-box"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
          <img
            src="/heritage-haven-logo.jpg"
            alt="logo"
            className="logo-img"
          />
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
          {/* Left: main image */}
          <div className="site-left">
            <img
              src={site.image_array?.[0] || "/heritage-haven-logo.jpg"}
              alt={site.name}
              className="site-main-image"
            />
          </div>

          {/* Right: content */}
          <div className="site-right">
            <h2>{site.name}</h2>
            <p>{site.description}</p>

            <p>
              <strong>Location:</strong> {site.location}
            </p>
            <p>
              <strong>Coordinates:</strong>{" "}
              {lat ? `${lat}, ${lon}` : "Not available"}
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
                    `https://www.google.com/maps/search/?api=1&query=${lat || ""},${lon || ""}`,
                    "_blank"
                  )
                }
              >
                Open in Maps
              </button>

              <button
                className="site-btn"
                onClick={() => setShowQuiz(prev => !prev)}
              >
                {showQuiz ? 'Hide Quiz' : 'Take Quiz'}
              </button>
            </div>
          </div>
        </article>

        {/* Quiz Section */}
        {showQuiz && (
          <div style={{ marginTop: 24 }}>
            <Quiz monumentId={site.slug || site._id || site.name} />
          </div>
        )}

        {/* Hotels and Activities */}
        <div style={{ marginTop: 24 }}>
          <HotelsList lat={lat} lon={lon} city={site.cityCode || site.city} />
        </div>
        <div style={{ marginTop: 16 }}>
          <ThingsToDo lat={lat} lon={lon} />
        </div>

        {/* Thumbnails row */}
        <div className="site-thumbnails">
          {site.image_array?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${site.name} - ${i + 1}`}
              onClick={() => {
                // swap clicked thumb to be the main image
                const newArr = Array.isArray(site.image_array) ? [...site.image_array] : [];
                if (newArr.length > i) {
                  [newArr[0], newArr[i]] = [newArr[i], newArr[0]];
                  setSite((prev) => ({ ...prev, image_array: newArr }));
                }
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}