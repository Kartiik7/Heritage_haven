// src/components/MonumentsPhotography.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../app.css";

export default function MonumentsPhotography() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = user?.username || "Guest";
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const categories = [
    { id: "all", name: "All Photos", icon: "📸" },
    { id: "temples", name: "Temples", icon: "🏛️" },
    { id: "forts", name: "Forts & Palaces", icon: "🏰" },
    { id: "caves", name: "Caves", icon: "🕳️" },
    { id: "tombs", name: "Tombs & Mausoleums", icon: "⚱️" }
  ];

  const photos = [
    {
      id: 1,
      photographer: "PhotoPro_Raj",
      location: "Taj Mahal, Agra",
      category: "tombs",
      image: "/images/sites/taj-mahal.jpg",
      caption: "Golden hour at the Taj Mahal - the marble glows like silk in this light! Shot with 85mm lens.",
      likes: 127,
      time: "3 hours ago",
      camera: "Canon EOS R5",
      settings: "f/2.8, 1/250s, ISO 100"
    },
    {
      id: 2,
      photographer: "Heritage_Lens",
      location: "Amber Fort, Jaipur",
      category: "forts",
      image: "/images/sites/amber-fort.jpeg",
      caption: "The intricate mirror work in Sheesh Mahal captures light beautifully. Patience paid off for this shot!",
      likes: 89,
      time: "6 hours ago",
      camera: "Sony A7III",
      settings: "f/4.0, 1/60s, ISO 800"
    },
    {
      id: 3,
      photographer: "Monument_Hunter",
      location: "Ajanta Caves, Maharashtra",
      category: "caves",
      image: "/images/sites/ajanta-caves.jpg",
      caption: "2000-year-old frescoes still vibrant! Natural lighting creates this mystical atmosphere.",
      likes: 156,
      time: "1 day ago",
      camera: "Nikon D850",
      settings: "f/5.6, 1/30s, ISO 1600"
    },
    {
      id: 4,
      photographer: "Culture_Clicks",
      location: "Brihadeeshwara Temple, Thanjavur",
      category: "temples",
      image: "/images/sites/brihadeeshwara.jpg",
      caption: "The massive vimana towers over everything - shot from the perfect angle to show its grandeur.",
      likes: 203,
      time: "2 days ago",
      camera: "Canon 5D Mark IV",
      settings: "f/8.0, 1/125s, ISO 200"
    },
    {
      id: 5,
      photographer: "Desert_Frames",
      location: "Jaisalmer Fort, Rajasthan",
      category: "forts",
      image: "/images/sites/jaisalmer fort.jpg",
      caption: "Living fort bathed in golden sandstone - the 'Golden City' lives up to its name at sunset!",
      likes: 178,
      time: "3 days ago",
      camera: "Fujifilm X-T4",
      settings: "f/11, 1/200s, ISO 100"
    },
    {
      id: 6,
      photographer: "Temple_Tales",
      location: "Golden Temple, Amritsar",
      category: "temples",
      image: "/images/sites/golden temple.jpg",
      caption: "Reflection in the sacred pool creates perfect symmetry. Early morning light is magical here.",
      likes: 245,
      time: "4 days ago",
      camera: "Sony A7R IV",
      settings: "f/7.1, 1/80s, ISO 400"
    }
  ];

  const filteredPhotos = selectedCategory === "all" 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  const handleLike = (photoId) => {
    // In real app, this would update the backend
    console.log(`Liked photo ${photoId}`);
  };

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
          <h1 className="page-title">Monument Photography</h1>
          <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
            Showcase your heritage photography skills
          </p>
        </div>

        <div className="header-right">
          <div className="user-name">{userName}</div>
          <div className="user-avatar" />
          <button 
            className="back-btn"
            onClick={() => navigate("/social")}
            style={{ marginLeft: "10px", padding: "8px 16px", borderRadius: "20px", border: "1px solid #ddd", backgroundColor: "white" }}
          >
            ← Back
          </button>
        </div>
      </header>

      <main style={{ padding: "28px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Group Info Banner */}
        <div style={{ 
          backgroundColor: "#f8f9fa", 
          padding: "20px", 
          borderRadius: "12px", 
          marginBottom: "24px",
          border: "1px solid #e9ecef"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img 
                src="/images/photography.jpg" 
                alt="Monument Photography" 
                style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover" }}
              />
              <div>
                <h2 style={{ margin: "0 0 8px 0", color: "#333" }}>Monument Photography</h2>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                  892 members • 89 photos this week • Share your best heritage shots!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              style={{
                padding: "12px 24px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              📸 Upload Photo
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div style={{ 
          display: "flex", 
          gap: "12px", 
          marginBottom: "24px", 
          flexWrap: "wrap",
          padding: "16px",
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid #e9ecef"
        }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: "8px 16px",
                backgroundColor: selectedCategory === category.id ? "#007bff" : "#f8f9fa",
                color: selectedCategory === category.id ? "white" : "#333",
                border: "1px solid #ddd",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {/* Photography Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
          gap: "24px" 
        }}>
          {filteredPhotos.map((photo) => (
            <article 
              key={photo.id} 
              style={{ 
                backgroundColor: "white", 
                borderRadius: "12px", 
                border: "1px solid #e9ecef",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                overflow: "hidden"
              }}
            >
              {/* Photo */}
              <div style={{ position: "relative" }}>
                <img 
                  src={photo.image} 
                  alt={photo.location} 
                  style={{ 
                    width: "100%", 
                    height: "250px", 
                    objectFit: "cover"
                  }}
                />
                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px"
                }}>
                  {categories.find(c => c.id === photo.category)?.icon} {categories.find(c => c.id === photo.category)?.name}
                </div>
              </div>

              {/* Photo Info */}
              <div style={{ padding: "16px" }}>
                {/* Photographer Header */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ 
                    width: "32px", 
                    height: "32px", 
                    borderRadius: "50%", 
                    backgroundColor: "#007bff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "12px",
                    marginRight: "8px"
                  }}>
                    {photo.photographer.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>{photo.photographer}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>{photo.time}</div>
                  </div>
                </div>

                {/* Location */}
                <h3 style={{ 
                  margin: "0 0 8px 0", 
                  fontSize: "16px", 
                  fontWeight: "600",
                  color: "#333"
                }}>
                  📍 {photo.location}
                </h3>

                {/* Caption */}
                <p style={{ 
                  margin: "0 0 12px 0", 
                  fontSize: "14px", 
                  lineHeight: "1.4",
                  color: "#555"
                }}>
                  {photo.caption}
                </p>

                {/* Camera Info */}
                <div style={{ 
                  backgroundColor: "#f8f9fa", 
                  padding: "8px", 
                  borderRadius: "6px", 
                  marginBottom: "12px",
                  fontSize: "12px",
                  color: "#666"
                }}>
                  <div>📷 {photo.camera}</div>
                  <div>⚙️ {photo.settings}</div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", paddingTop: "8px", borderTop: "1px solid #f0f0f0" }}>
                  <button
                    onClick={() => handleLike(photo.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      backgroundColor: "transparent",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    ❤️ {photo.likes}
                  </button>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      backgroundColor: "transparent",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    💬 Comment
                  </button>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      backgroundColor: "transparent",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    📤 Share
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              maxWidth: "500px",
              width: "90%"
            }}>
              <h3 style={{ margin: "0 0 16px 0" }}>Upload Your Monument Photo</h3>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
                Share your best heritage photography with the community!
              </p>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Close (Coming Soon!)
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}