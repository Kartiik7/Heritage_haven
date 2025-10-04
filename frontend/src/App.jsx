// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthProvider from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginCard from "./components/LoginCard.jsx";
import SignupCard from "./components/SignupCard.jsx";
import HomePage from "./components/HomePage.jsx";
import Discover from "./components/Discover.jsx";
import ARTour from "./components/ARTour.jsx";
import SocialProfiles from "./components/SocialProfiles.jsx";
import SiteDetail from "./components/SiteDetail.jsx";
import HeritageEnthusiasts from "./components/HeritageEnthusiasts.jsx";
import MonumentsPhotography from "./components/MonumentsPhotography.jsx";
import FestivalsCulture from "./components/FestivalsCulture.jsx";

import "./app.css";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 👇 Landing page goes to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login & Signup pages (first two screens) */}
        <Route path="/login" element={<LoginCard />} />
        <Route path="/signup" element={<SignupCard />} />

        {/* Protected routes - require authentication */}
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />

        <Route path="/discover" element={
          <ProtectedRoute>
            <Discover />
          </ProtectedRoute>
        } />

        <Route path="/ar-tour" element={
          <ProtectedRoute>
            <ARTour />
          </ProtectedRoute>
        } />

        <Route path="/social" element={
          <ProtectedRoute>
            <SocialProfiles />
          </ProtectedRoute>
        } />

        <Route path="/site/:siteId" element={
          <ProtectedRoute>
            <SiteDetail />
          </ProtectedRoute>
        } />

        {/* Social Group Pages */}
        <Route path="/social/g1" element={
          <ProtectedRoute>
            <HeritageEnthusiasts />
          </ProtectedRoute>
        } />

        <Route path="/social/g2" element={
          <ProtectedRoute>
            <MonumentsPhotography />
          </ProtectedRoute>
        } />

        <Route path="/social/g3" element={
          <ProtectedRoute>
            <FestivalsCulture />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}
