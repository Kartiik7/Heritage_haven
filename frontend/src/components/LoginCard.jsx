// src/components/LoginCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { loginUser } from "../utils/api.js";
import "../app.css";

export default function LoginCard() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userData = await loginUser({ email, password });
      login(userData);
      
      // Remember user preference
      if (remember) {
        localStorage.setItem("hh_rememberUser", "true");
      } else {
        localStorage.removeItem("hh_rememberUser");
      }
      
      navigate("/home");
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <header className="hh-header auth-header">
        <div className="logo-box" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          <img src="/heritage-haven-logo.jpg" alt="Heritage Haven" className="logo-img" />
          <div>
            <div className="brand-title">HERITAGE HAVEN</div>
            <div className="brand-sub">A new way to connect with culture</div>
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 className="page-title">Welcome</h1>
        </div>

        <div className="header-right">
          <div className="user-name" style={{ opacity: 0.6 }}>Guest</div>
          <div className="user-avatar" />
        </div>
      </header>

      <main className="auth-main">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: 8 }}>Log In</h2>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <label className="login-label">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />

          <label className="login-label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
            disabled={isLoading}
          />

          <div className="row between center" style={{ marginTop: 12 }}>
            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ width: 14, height: 14 }}
                disabled={isLoading}
              />
              Remember Me
            </label>

            <button
              type="button"
              className="text-btn"
              onClick={() => navigate("/signup")}
              style={{ textDecoration: "underline" }}
              disabled={isLoading}
            >
              SignUp / Create Account
            </button>
          </div>

          <div className="signup-wrap" style={{ marginTop: 18 }}>
            <button type="submit" className="auth-btn" disabled={isLoading} data-loading={isLoading}>
              {isLoading ? "Logging In..." : "Log In"}
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
