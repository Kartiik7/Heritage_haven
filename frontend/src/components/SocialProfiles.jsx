// src/components/SocialProfiles.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const mockProfiles = [
  { id: "p1", name: "Heritage Enthusiasts", desc: "Share photos and stories." },
  { id: "p2", name: "Monuments Photography", desc: "Photography group for monuments." },
  { id: "p3", name: "Festivals & Culture", desc: "Discuss festivals and traditions." },
];

export default function SocialProfiles() {
  const navigate = useNavigate();

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
          <h1 className="page-title">Social Profiles</h1>
        </div>

        <div className="header-right">
          <div className="user-name">Prannoy Chandola</div>
          <div className="user-avatar" />
        </div>
      </header>

      <main style={{ padding: 28 }}>
        <div className="features-wrap" style={{ gap: 18 }}>
          {mockProfiles.map((p) => (
            <article key={p.id} className="feature-card" style={{ alignItems: "center" }}>
              <div className="feature-thumb">
                <div className="thumb-placeholder" style={{ background: "linear-gradient(180deg,#fff,#ddd)" }} />
              </div>

              <div style={{ flex: 1 }}>
                <div className="feature-title">{p.name}</div>
                <p style={{ color: "rgba(255,255,255,0.9)" }}>{p.desc}</p>
                <div style={{ marginTop: 10 }}>
                  <button className="signup-btn small" onClick={() => alert("Open group: " + p.name)}>
                    Open Group
                  </button>
                </div>
              </div>

              <div>
                <button className="feature-go" onClick={() => alert("Visit " + p.name)}>➜</button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
