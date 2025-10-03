import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ userName = "Guest" }) {
  const navigate = useNavigate();

  return (
    <header className="hh-header">
      <div className="logo-box" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
        {/* Replace emoji with your logo image */}
        <img src="/heritage-haven-logo.png" alt="Heritage Logo" className="logo-img" />
        <div>
          <div className="brand-title">HERITAGE</div>
          <div className="brand-sub">A new way to connect with culture</div>
        </div>
      </div>

      <div style={{ textAlign: "center", flex: 1 }}>
        <h1 className="page-title">Home Page</h1>
      </div>

      <div className="header-right">
        <div className="user-name">{userName}</div>
        <div className="user-avatar" />
      </div>
    </header>
  );
}
