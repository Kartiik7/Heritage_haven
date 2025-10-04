// src/components/SignupCard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { registerUser } from "../utils/api.js";
import "../app.css";

export default function SignupCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const from = location.state?.from?.pathname || "/home";
      navigate(from, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const userData = await registerUser({ username, email, password });
      login(userData);

      // Remember user preference
      if (remember) {
        localStorage.setItem("hh_rememberUser", "true");
      }

      // Redirect to the page they were trying to access, or home
      const from = location.state?.from?.pathname || "/home";
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

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

          <label className="login-label">Username</label>
          <input
            className="input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            required
            disabled={isLoading}
          />

          <label className="login-label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password (min 6 characters)"
            required
            disabled={isLoading}
          />

          <label className="login-label">Confirm Password</label>
          <input
            className="input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="confirm password"
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
              onClick={() => navigate("/login")}
              style={{ textDecoration: "underline" }}
              disabled={isLoading}
            >
              Already have an account? Log In
            </button>
          </div>

          <div className="signup-wrap" style={{ marginTop: 18 }}>
            <button type="submit" className="auth-btn" disabled={isLoading} data-loading={isLoading}>
              {isLoading ? "Creating Account..." : "Sign Up"}
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
