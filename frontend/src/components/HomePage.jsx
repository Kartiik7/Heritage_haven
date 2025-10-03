// src/components/HomePage.jsx
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../app.css";

export default function HomePage({ userName: propUserName = "Prannoy Chandola", onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  // allow passing username from navigation state (login)
  const stateUser = location.state?.userName;
  // fallback to prop or localStorage (if you implement remember)
  let storedUser = null;
  try {
    storedUser = localStorage.getItem("hh_userName");
  } catch {
    storedUser = null;
  }
  const userName = stateUser || propUserName || storedUser || "Guest";

  useEffect(() => {
    document.body.classList.add("home-mode");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.classList.remove("home-mode");
      document.body.style.overflow = "";
    };
  }, []);

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
          {onLogout && (
            <button
              className="text-btn"
              onClick={() => {
                // optional: clear stored user on logout
                try { 
                  localStorage.removeItem("hh_userName"); 
                } catch {
                  // Ignore localStorage errors
                }
                onLogout();
              }}
              style={{
                marginLeft: 12,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "6px 10px",
                borderRadius: 6,
              }}
            >
              Log out
            </button>
          )}
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

      <footer className="hh-footer home-footer">
        <div className="footer-left">Contact Us</div>
        <div className="footer-center">©Namaste-Techies</div>
        <div className="footer-right">namastetechies119@gmail.com</div>
      </footer>
    </div>
  );
}
