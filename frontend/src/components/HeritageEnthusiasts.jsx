// src/components/HeritageEnthusiasts.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { fetchPosts, createPost, likePost } from "../utils/api.js";
import "../app.css";

export default function HeritageEnthusiasts() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const userName = user?.username || "Guest";

  const [newPost, setNewPost] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await fetchPosts();
        // Sort posts by createdAt in descending order (newest first)
        const sortedPosts = fetchedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
        setError(null);
      } catch (err) {
        console.error("Failed to load posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Format time from ISO string to relative time
  const formatTime = (isoString) => {
    const now = new Date();
    const postTime = new Date(isoString);
    const diffInSeconds = Math.floor((now - postTime) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return postTime.toLocaleDateString();
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !token) return;

    try {
      setSubmitting(true);
      const postData = {
        title: newTitle.trim() || "Heritage Experience",
        content: newPost.trim(),
        tags: ["heritage", "community"],
      };
      
      const createdPost = await createPost(postData, token);
      
      // Add the new post to the beginning of the posts array
      setPosts([createdPost, ...posts]);
      setNewPost("");
      setNewTitle("");
    } catch (err) {
      console.error("Failed to create post:", err);
      alert("Failed to create post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    if (!token) return;
    
    try {
      const updatedPost = await likePost(postId, token);
      
      // Update the posts array with the updated post
      setPosts(posts.map(post => 
        post._id === postId ? updatedPost : post
      ));
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  // Loading state
  if (loading) {
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
            <h1 className="page-title">Heritage Enthusiasts</h1>
          </div>
          <div className="header-right">
            <div className="user-name">{userName}</div>
            <div className="user-avatar" />
          </div>
        </header>
        <main style={{ padding: "28px", textAlign: "center" }}>
          <div style={{ marginTop: "50px" }}>Loading posts...</div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
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
            <h1 className="page-title">Heritage Enthusiasts</h1>
          </div>
          <div className="header-right">
            <div className="user-name">{userName}</div>
            <div className="user-avatar" />
          </div>
        </header>
        <main style={{ padding: "28px", textAlign: "center" }}>
          <div style={{ marginTop: "50px", color: "red" }}>Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px" }}
          >
            Retry
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="hh-header">
        <div
          className="logo-box"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
          <img src="/heritage-haven-logo.jpg" alt="logo" className="logo-img" />
          <div>
            <div className="brand-title">HERITAGE HAVEN</div>
            <div className="brand-sub">A new way to connect with culture</div>
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 className="page-title">Heritage Enthusiasts</h1>
          <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
            Share photos, stories, and connect with fellow heritage lovers
          </p>
        </div>

        <div className="header-right">
          <div className="user-name">{userName}</div>
          <div className="user-avatar" />
          <button
            className="back-btn"
            onClick={() => navigate("/social")}
            style={{
              marginLeft: "10px",
              padding: "8px 16px",
              borderRadius: "20px",
              border: "1px solid #ddd",
              backgroundColor: "white",
            }}
          >
            ← Back
          </button>
        </div>
      </header>

      <main style={{ padding: "28px", maxWidth: "800px", margin: "0 auto" }}>
        {/* Group Info Banner */}
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "24px",
            border: "1px solid #e9ecef",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <img
              src="/images/enthusiast.jpg"
              alt="Heritage Enthusiasts"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
            <div>
              <h2 style={{ margin: "0 0 8px 0", color: "#333" }}>
                Heritage Enthusiasts
              </h2>
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                1,247 members • 156 posts this week • Share your heritage
                discoveries!
              </p>
            </div>
          </div>
        </div>

        {/* Create Post Section */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "24px",
            border: "1px solid #e9ecef",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <form onSubmit={handlePostSubmit}>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Post title (optional)"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "14px",
                marginBottom: "12px",
                fontFamily: "inherit",
              }}
            />
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your heritage experience, discovery, or question..."
              style={{
                width: "100%",
                minHeight: "80px",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "14px",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
              <div style={{ fontSize: "12px", color: "#666" }}>
                💡 Tip: Include photos and location tags for better engagement
              </div>
              <button
                type="submit"
                disabled={!newPost.trim() || submitting}
                style={{
                  padding: "10px 20px",
                  backgroundColor: (!newPost.trim() || submitting) ? "#ccc" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: (!newPost.trim() || submitting) ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Posting..." : "Share Post"}
              </button>
            </div>
          </form>
        </div>

        {/* Posts Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {posts.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "40px", 
              backgroundColor: "white", 
              borderRadius: "12px",
              border: "1px solid #e9ecef"
            }}>
              <p style={{ fontSize: "16px", color: "#666" }}>
                No posts yet. Be the first to share your heritage experience! 
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post._id}
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #e9ecef",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {/* Post Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#007bff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      marginRight: "12px",
                    }}
                  >
                    {(post.user?.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>
                      {post.user?.username || "Unknown User"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {formatTime(post.createdAt)}
                    </div>
                  </div>
                  {post.heritageSite?.name && (
                    <div style={{
                      marginLeft: "auto",
                      backgroundColor: "#e7f3ff",
                      color: "#0066cc",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "500"
                    }}>
                      📍 {post.heritageSite.name}
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div style={{ marginBottom: "16px" }}>
                  {post.title && post.title !== "Heritage Experience" && (
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "600" }}>
                      {post.title}
                    </h3>
                  )}
                  <p
                    style={{
                      margin: "0 0 12px 0",
                      lineHeight: "1.5",
                      fontSize: "14px",
                    }}
                  >
                    {post.content}
                  </p>
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post content"
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #e9ecef",
                      }}
                    />
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ marginTop: "12px" }}>
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            display: "inline-block",
                            backgroundColor: "#f8f9fa",
                            color: "#495057",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            marginRight: "6px",
                            marginBottom: "4px"
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    paddingTop: "12px",
                    borderTop: "1px solid #f0f0f0",
                  }}
                >
                  <button
                    onClick={() => handleLike(post._id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      backgroundColor: post.likes?.includes(user?._id) ? "#ffe6e6" : "transparent",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: post.likes?.includes(user?._id) ? "#d63384" : "#333"
                    }}
                  >
                    ❤️ {post.likes?.length || 0}
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
                      fontSize: "12px",
                    }}
                  >
                    💬 Comments
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
                      fontSize: "12px",
                    }}
                  >
                    📤 Share
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
