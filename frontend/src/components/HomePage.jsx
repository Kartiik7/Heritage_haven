// src/components/HomePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { fetchHomeRecommendations } from "../utils/api";
import "../app.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Recommendations state
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add("home-mode");
    // Don't set overflow hidden on body to allow scrolling within components
    return () => {
      document.body.classList.remove("home-mode");
      document.body.style.overflow = "";
    };
  }, []);

  // Fetch recommendations
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setRecommendationsLoading(true);
        const recs = await fetchHomeRecommendations(12); // Get 12 recommendations for better scrolling
        setRecommendations(recs);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
        setRecommendations([]);
      } finally {
        setRecommendationsLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };



  const userName = user?.username || "Guest";

  const features = [
    {
      title: "Discover",
      bullets: [
        "Explore India's rich heritage of festivals and monuments.",
        "Find detailed stories, history, and cultural significance.",
        "Reconnect with traditions no matter where you are.",
      ],
      path: "/discover",
    },
    {
      title: "AR/Video Tour",
      bullets: [
        "Step into monuments and festivals through immersive AR/VR.",
        "Experience India's beauty as if you are truly there.",
        "Travel virtually, anytime, from anywhere.",
      ],
      path: "/ar-tour",
    },
    {
      title: "Social Profiles",
      bullets: [
        "Connect with others who share your cultural interests.",
        "Share your experiences, memories, and celebrations.",
        "Build a community that keeps heritage alive.",
      ],
      path: "/social",
    },
  ];

  return (
    <div className="home-page">
      <header className="hh-header home-header">
        <div
          className="logo-box"
          onClick={() => navigate("/home", { state: { userName } })}
          style={{ cursor: "pointer" }}
        >
          <img src="/heritage-haven-logo.png" alt="Heritage Haven" className="logo-img" />
          <div>
            <div className="brand-title">HERITAGE HAVEN</div>
            <div className="brand-sub">A new way to connect with culture</div>
          </div>
        </div>

        <h1 className="page-title">Home Page</h1>

        <div className="header-right">
          <div className="user-name">{userName}</div>
          <div className="user-avatar" />
          <button
            className="text-btn"
            onClick={handleLogout}
            style={{
              marginLeft: 12,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "6px 10px",
              borderRadius: 6,
              color: "white",
              cursor: "pointer",
              fontSize: "12px"
            }}
            title="Logout"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="home-main home-main-full">
        <div className="features-wrap features-wrap-full">
          {features.map((f, i) => (
            <article
              className="feature-card home-feature-card"
              key={i}
              // make whole card clickable (optional)
              onClick={() => navigate(f.path, { state: { userName } })}
              style={{ cursor: "pointer" }}
            >
              <div className="feature-thumb">
                <div
                  className={`thumb-placeholder ${
                    i === 0 ? "discover-thumb" : i === 1 ? "ar-thumb" : "social-thumb"
                  }`}
                />
              </div>

              <div className="feature-body">
                <div className="feature-title">{f.title}</div>
                <ul className="feature-bullets">
                  {f.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="feature-right">
                <button
                  className="feature-go"
                  aria-label={`open ${f.title}`}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent the outer onClick double-fire
                    navigate(f.path, { state: { userName } });
                  }}
                >
                  ➜
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Personalized Recommendations Section */}
      <section style={{
        backgroundColor: "rgba(0,0,0,0.4)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        padding: "30px 28px"
      }}>
        <h2 style={{
          color: "rgba(255,255,255,0.95)",
          fontSize: "24px",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "600"
        }}>
          Personalized Recommendations
        </h2>
        
        {/* Scroll hint */}
        {recommendations.length > 4 && (
          <div style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.6)",
            fontSize: "14px",
            marginBottom: "15px"
          }}>
            ← Scroll horizontally to see more →
          </div>
        )}
        
        {recommendationsLoading ? (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            color: "rgba(255,255,255,0.7)"
          }}>
            Loading recommendations...
          </div>
        ) : recommendations.length > 0 ? (
          <div 
            className="recommendations-scroll"
            style={{
              display: "flex",
              overflowX: "auto",
              overflowY: "hidden",
              gap: "20px",
              paddingBottom: "15px",
              paddingRight: "10px",
              whiteSpace: "nowrap"
            }}
          >
            {recommendations.map((site) => (
              <div
                key={site.site_id}
                onClick={() => navigate(`/site/${site.site_id}`, { state: { userName } })}
                style={{
                  minWidth: "300px",
                  maxWidth: "300px",
                  flexShrink: 0,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "16px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(255,255,255,0.1)",
                  whiteSpace: "normal"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255,255,255,0.15)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <img
                  src={site.image_array?.[0] || "/heritage-haven-logo.jpg"}
                  alt={site.name}
                  style={{
                    width: "100%",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "12px"
                  }}
                />
                <h3 style={{
                  color: "rgba(255,255,255,0.95)",
                  fontSize: "16px",
                  marginBottom: "8px",
                  fontWeight: "600",
                  lineHeight: "1.2"
                }}>
                  {site.name}
                </h3>
                <p style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "14px",
                  lineHeight: "1.4",
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {site.description}
                </p>
                <div style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "12px",
                  marginTop: "8px"
                }}>
                  📍 {site.location}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.7)",
            padding: "40px"
          }}>
            No recommendations available at the moment.
          </div>
        )}
      </section>

      <footer className="hh-footer home-footer">
        <div className="footer-left">Contact Us</div>
        <div className="footer-center">©Namaste-Techies</div>
        <div className="footer-right">namastetechies119@gmail.com</div>
      </footer>
    </div>
  );
}
