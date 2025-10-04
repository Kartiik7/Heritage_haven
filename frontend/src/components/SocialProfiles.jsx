// src/components/SocialProfiles.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../app.css";

export default function SocialProfiles() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = user?.username || "Guest";
  
  const sampleGroups = [
    {
      id: "g1",
      title: "Heritage Enthusiasts",
      desc: "Share photos and stories.",
      img: "/images/enthusiast.jpg",
    },
    {
      id: "g2",
      title: "Monuments Photography",
      desc: "Photography group for monuments.",
      img: "/images/photography.jpg",
    },
    {
      id: "g3",
      title: "Festivals & Culture",
      desc: "Discuss festivals and traditions.",
      img: "/images/culture.jpg",
    },
  ];

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
          <h1 className="page-title">Social Groups</h1>
        </div>

        <div className="header-right">
          <div className="user-name">{userName}</div>
          <div className="user-avatar" />
        </div>
      </header>

      <main className="home-main" style={{ padding: 28 }}>
        <div className="features-wrap" style={{ gap: 28 }}>
          {sampleGroups.map((g) => (
            <article key={g.id} className="group-card">
              <div className="group-left">
                <img src={g.img} alt={g.title} className="group-thumb" />
              </div>

              <div className="group-body">
                <div className="group-title">{g.title}</div>
                <div className="group-desc">{g.desc}</div>

                <div style={{ marginTop: 14 }}>
                  <button
                    className="card-btn small"
                    onClick={() => {
                      /* go to group or open modal */
                      alert(`Open group ${g.title}`);
                    }}
                    aria-label={`Open ${g.title}`}
                  >
                    Open Group
                  </button>
                </div>
              </div>

              <div className="group-right">
                <button
                  className="feature-go group-go"
                  onClick={() => {
                    /* go to group page */
                    navigate(`/social/${g.id}`);
                  }}
                  aria-label={`go to ${g.title}`}
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
