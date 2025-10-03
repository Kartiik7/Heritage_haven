// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginCard from "./components/LoginCard.jsx";
import SignupCard from "./components/SignupCard.jsx";
import HomePage from "./components/HomePage.jsx";
import Discover from "./components/Discover.jsx";
import ARTour from "./components/ARTour.jsx";
import SocialProfiles from "./components/SocialProfiles.jsx";
import SiteDetail from "./components/SiteDetail.jsx";

import "./app.css";

export default function App() {
  return (
    <Routes>
      {/* 👇 Landing page goes to Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login & Signup pages (first two screens) */}
      <Route path="/login" element={<LoginCard />} />
      <Route path="/signup" element={<SignupCard />} />

      {/* After login → Home */}
      <Route path="/home" element={<HomePage userName="Prannoy Chandola" />} />

      {/* Feature pages */}
      <Route path="/discover" element={<Discover />} />
      <Route path="/ar-tour" element={<ARTour />} />
      <Route path="/social" element={<SocialProfiles />} />
      <Route path="/site/:siteId" element={<SiteDetail />} />
    </Routes>
  );
}
