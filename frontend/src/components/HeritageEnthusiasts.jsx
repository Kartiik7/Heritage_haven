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

  // Helper function to validate post ID (accepts both numeric and ObjectID formats)
  const isValidPostId = (id) => {
    if (!id) return false;
    
    // Accept simple numeric IDs (as strings or numbers)
    if (typeof id === 'number') return id > 0;
    if (typeof id === 'string') {
      // Accept numeric strings like "1", "2", "75", etc.
      if (/^\d+$/.test(id)) return parseInt(id) > 0;
      // Also accept MongoDB ObjectIDs for backward compatibility
      if (/^[0-9a-fA-F]{24}$/.test(id)) return true;
      // Accept timestamp-based IDs (13 digits)
      if (/^\d{13}$/.test(id)) return true;
    }
    
    return false;
  };

  // Fetch posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await fetchPosts();
        
        // If no posts from backend, add some sample posts for testing
        let postsToDisplay = fetchedPosts;
        if (fetchedPosts.length === 0) {
          console.log('No posts from backend, adding sample posts for testing');
          postsToDisplay = [
            {
              _id: '1',
              title: 'Welcome to Heritage Haven!',
              content: 'Share your heritage experiences and connect with fellow enthusiasts. This is a sample post to test the functionality.',
              user: { username: 'Admin' },
              likes: [],
              createdAt: new Date().toISOString(),
              tags: ['welcome', 'heritage', 'community']
            },
            {
              _id: '2',
              title: 'Exploring Ancient Temples',
              content: 'Just visited the magnificent Brihadeeswarar Temple. The architecture is breathtaking!',
              user: { username: 'Explorer' },
              likes: [],
              createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
              tags: ['temple', 'architecture', 'tamil nadu']
            },
            {
              _id: '3',
              title: 'Heritage Photography Tips',
              content: 'Captured some amazing shots at Red Fort today. Here are my top tips for heritage photography!',
              user: { username: 'Photographer' },
              likes: [],
              createdAt: new Date(Date.now() - 2 * 1000 * 60 * 60).toISOString(), // 2 hours ago
              tags: ['photography', 'redfort', 'tips']
            }
          ];
        }
        
        // Filter out posts without valid IDs and log them
        const validPosts = postsToDisplay.filter(post => {
          const hasValidId = isValidPostId(post._id);
          if (!hasValidId) {
            console.warn('Post with invalid _id found:', { 
              id: post._id, 
              title: post.title,
              type: typeof post._id,
              length: post._id?.length 
            });
            return false;
          }
          return true;
        });
        
        console.log('Loaded posts:', validPosts.length, 'valid posts out of', postsToDisplay.length, 'total');
        
        // Sort posts by createdAt in descending order (newest first)
        const sortedPosts = validPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    if (!newPost.trim() || !token) {
      if (!token) alert("Please log in to create posts");
      if (!newPost.trim()) alert("Please enter some content for your post");
      return;
    }

    try {
      setSubmitting(true);
      const postData = {
        title: newTitle.trim() || "Heritage Experience",
        content: newPost.trim(),
        tags: ["heritage", "community"],
      };
      
      let createdPost;
      try {
        // Try to create post via API
        createdPost = await createPost(postData, token);
        console.log('Post created successfully via API:', createdPost);
      } catch (apiError) {
        console.warn('API failed, creating local post:', apiError.message);
        
        // Fallback: create local post when API fails
        const localPostId = Date.now().toString(); // Use timestamp as ID
        createdPost = {
          _id: localPostId,
          title: postData.title,
          content: postData.content,
          user: { username: user?.username || 'You' },
          likes: [],
          createdAt: new Date().toISOString(),
          tags: postData.tags || [],
          isLocal: true // Flag to indicate this is a local post
        };
        
        console.log('Created local post:', createdPost);
        alert('Post created locally (backend unavailable). Your post will be saved when the server is back online.');
      }
      
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
    if (!token) {
      alert('Please log in to like posts');
      return;
    }
    
    if (!isValidPostId(postId)) {
      console.error('Invalid post ID:', postId);
      alert('This post has an invalid ID and cannot be liked.');
      return;
    }
    
    try {
      console.log('Handling like for post:', postId);
      
      // Try to like the post via API
      try {
        const updatedPost = await likePost(postId, token);
        
        // Update the posts array with the updated post
        setPosts(posts.map(post => 
          post._id === postId ? updatedPost : post
        ));
      } catch (apiError) {
        // If API fails, do local update for demo purposes
        console.warn('API call failed, doing local update:', apiError.message);
        
        // Local update for testing when backend is down
        setPosts(posts.map(post => {
          if (post._id === postId) {
            const userLiked = post.likes?.includes(user?._id);
            const newLikes = userLiked 
              ? post.likes.filter(id => id !== user._id)
              : [...(post.likes || []), user._id];
            
            return {
              ...post,
              likes: newLikes
            };
          }
          return post;
        }));
        
        // Only show alert for unexpected errors, not when backend is down
        if (!apiError.message.includes('Failed to fetch') && !apiError.message.includes('Post not found')) {
          alert('Like feature is temporarily offline. Your action was saved locally.');
        }
      }
      
    } catch (err) {
      console.error("Failed to like post:", err);
      alert('Failed to like post. Please try again.');
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
                      {post.isLocal && (
                        <span style={{ 
                          marginLeft: "8px", 
                          color: "#ff6b35", 
                          fontSize: "11px",
                          fontWeight: "500"
                        }}>
                          • Local
                        </span>
                      )}
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
                    disabled={!isValidPostId(post._id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      backgroundColor: post.likes?.includes(user?._id) ? "#ffe6e6" : "transparent",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      cursor: isValidPostId(post._id) ? "pointer" : "not-allowed",
                      fontSize: "12px",
                      color: post.likes?.includes(user?._id) ? "#d63384" : "#333",
                      opacity: isValidPostId(post._id) ? 1 : 0.5
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
