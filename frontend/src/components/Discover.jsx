// src/components/Discover.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { fetchHeritageSites } from "../utils/api";

export default function Discover() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const userName = user?.username || "Guest";

  useEffect(() => {
    const loadSites = async () => {
      try {
        setLoading(true);
        const heritageSites = await fetchHeritageSites();
        setSites(heritageSites);
        setCurrentPage(1); // Reset to first page when new data loads
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

  // Calculate pagination
  const totalPages = Math.ceil(sites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSites = sites.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="home-page">
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
            <h1 className="page-title">Discover</h1>
          </div>
          <div className="header-right">
            <div className="user-name">{userName}</div>
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
            <h1 className="page-title">Discover</h1>
          </div>
          <div className="header-right">
            <div className="user-name">{userName}</div>
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
        <div
          className="logo-box"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
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
          <div className="user-name">{userName}</div>
          <div className="user-avatar" />
        </div>
      </header>

      {/* Pagination info at top of page */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 28px",
          backgroundColor: "rgba(0,0,0,0.2)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.9)",
        }}
      >
        <div style={{ fontSize: "16px", fontWeight: "500" }}>
          Showing {currentSites.length} of {sites.length} heritage sites
        </div>
        {totalPages > 1 && (
          <div style={{ fontSize: "16px", fontWeight: "500" }}>
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      <main className="home-main" style={{ padding: 28 }}>
        <div className="features-wrap" style={{ gap: 20 }}>
          {currentSites.map((site) => (
            <article
              className="feature-card"
              key={site._id}
              style={{ alignItems: "center" }}
            >
              <div className="feature-thumb">
                <img
                  src={site.image_array && site.image_array[0]}
                  alt={site.name}
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: 10,
                    objectFit: "cover",
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div className="feature-title">{site.name}</div>
                <p style={{ color: "rgba(255,255,255,0.9)", marginTop: 6 }}>
                  {site.description}
                </p>

                {/* action buttons — use the same signup-btn small styling for consistency */}
                <div style={{ marginTop: 12 }}>
                  <button
                    className="signup-btn small"
                    onClick={() => navigate(`/site/${site.site_id}`)}
                    style={{ marginRight: 8 }}
                  >
                    View
                  </button>

                  {/* changed to signup-btn small so it matches View button style */}
                  <button
                    className="signup-btn small"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${site.geotag.latitude},${site.geotag.longitude}`,
                        "_blank"
                      )
                    }
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

      {/* Pagination controls at bottom of page */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
            padding: "30px 28px",
            marginTop: "auto",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <button
            className="signup-btn small"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            style={{
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            ← Previous
          </button>

          <div
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "16px",
              minWidth: "120px",
              textAlign: "center",
            }}
          >
            Page {currentPage} of {totalPages}
          </div>

          <button
            className="signup-btn small"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            style={{
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
