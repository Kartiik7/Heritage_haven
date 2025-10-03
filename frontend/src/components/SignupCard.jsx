// src/components/SignupCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../app.css";

export default function SignupCard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // TODO: Insert actual signup logic here
    if (remember && username) {
      try {
        localStorage.setItem("hh_userName", username);
      } catch (err) {
        // ignore localStorage errors
      }
    }

    // After signup, redirect to Home with username
    navigate("/home", { state: { userName: username } });
  };

  return (
    <div className="auth-page">
      <header className="hh-header auth-header">
        <div className="logo-box" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          <img src="/images/heritage-haven-logo.jpg" alt="Heritage Haven" className="logo-img" />
          <div>
            <div className="brand-title">HERITAGE HAVEN</div>
            <div className="brand-sub">A new way to connect with culture</div>
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 className="page-title">Join Us</h1>
        </div>

        <div className="header-right">
          <div className="user-name" style={{ opacity: 0.6 }}>Guest</div>
          <div className="user-avatar" />
        </div>
      </header>

      <main className="auth-main">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: 8 }}>Sign Up</h2>

          <label className="login-label">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label className="login-label">Username</label>
          <input
            className="input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            required
          />

          <label className="login-label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
          />

          <label className="login-label">Confirm Password</label>
          <input
            className="input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="confirm password"
            required
          />

          <div className="row between center" style={{ marginTop: 12 }}>
            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ width: 14, height: 14 }}
              />
              Remember Me
            </label>

            <button
              type="button"
              className="text-btn"
              onClick={() => navigate("/login")}
              style={{ textDecoration: "underline" }}
            >
              Already have an account? Log In
            </button>
          </div>

          <div className="signup-wrap" style={{ marginTop: 18 }}>
            <button type="submit" className="signup-btn">
              Sign Up
            </button>
          </div>
        </form>
      </main>

      <footer className="hh-footer auth-footer">
        <div className="footer-left">Contact Us</div>
        <div className="footer-center">©Namaste-Techies</div>
        <div className="footer-right">namastetechies119@gmail.com</div>
      </footer>
    </div>
  );
}
