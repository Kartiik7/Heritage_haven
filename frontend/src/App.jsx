import React, { useState } from "react";
import LoginCard from "./components/LoginCard";
import SignupCard from "./components/SignupCard";
import HomePage from "./components/HomePage";
import "./app.css";

export default function App() {
  // set initial to "home" for testing; change to "login" to start at login
  const [mode, setMode] = useState("home"); // "login" | "signup" | "home"

  if (mode === "home") {
    // render HomePage alone (full screen)
    return <HomePage userName="Prannoy Chandola" onLogout={() => setMode("login")} />;
  }

  // login/signup view using the previous split layout
  return (
    <div className="page">
      <div className="left-panel">
        <div className="welcome-small">Welcome to</div>
        <h1 className="title">Heritage Haven</h1>
        <p className="tagline">Culture Se Judne Ka Naya Tareeka...</p>
      </div>

      <div className="right-panel">
        {mode === "signup" ? (
          <SignupCard switchToLogin={() => setMode("login")} onSuccess={() => setMode("home")} />
        ) : (
          <LoginCard switchToSignup={() => setMode("signup")} onSuccess={() => setMode("home")} />
        )}
      </div>
    </div>
  );
}