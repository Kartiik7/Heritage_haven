// src/components/FestivalsCulture.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../app.css";

export default function FestivalsCulture() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userName = user?.username || "Guest";

    const [activeTab, setActiveTab] = useState("festivals");
    const [showEventModal, setShowEventModal] = useState(false);

    const festivals = [
        {
        id: 1,
        name: "Diwali Celebrations",
        location: "Varanasi, Uttar Pradesh",
        date: "Nov 12, 2025",
        description:
            "Experience the grandest Diwali celebrations on the ghats of Varanasi. Thousands of diyas light up the ancient city.",
        image: "/images/sites/diwali.jpg",
        participants: 342,
        type: "Religious Festival",
        heritage_connection: "5000-year-old traditions of light worship",
        },
        {
        id: 2,
        name: "Durga Puja Festival",
        location: "Kolkata, West Bengal",
        date: "Oct 15-20, 2025",
        description:
            "UNESCO recognized intangible cultural heritage. Marvel at the artistic pandals and cultural performances.",
        image: "/images/sites/durga-puja.jpg",
        participants: 589,
        type: "Cultural Festival",
        heritage_connection: "400-year-old artistic traditions",
        },
        {
        id: 3,
        name: "Navratri & Garba",
        location: "Ahmedabad, Gujarat",
        date: "Oct 3-12, 2025",
        description:
            "Nine nights of traditional dance, music, and devotion. Join the largest Garba celebrations in Gujarat.",
        image: "/images/sites/garba.jpg",
        participants: 756,
        type: "Dance Festival",
        heritage_connection: "Ancient folk dance traditions",
        },
        {
        id: 4,
        name: "Christmas in Old Goa",
        location: "Goa",
        date: "Dec 24-25, 2025",
        description:
            "Celebrate Christmas in the historic churches of Old Goa, a UNESCO World Heritage Site.",
        image: "/images/sites/christmas.jpeg",
        participants: 234,
        type: "Religious Festival",
        heritage_connection: "500-year-old Portuguese heritage",
        },
    ];

    const traditions = [
        {
        id: 1,
        name: "Bharatanatyam Dance",
        region: "Tamil Nadu",
        description:
            "Classical dance form with 2000-year history. Learn about mudras, expressions, and spiritual significance.",
        image: "/images/sites/bharatnatiyam.jpg",
        age: "2000+ years",
        practitioners: "50,000+ worldwide",
        status: "UNESCO Intangible Heritage",
        },
        {
        id: 2,
        name: "Kuchipudi Dance",
        region: "Andhra Pradesh",
        description:
            "Classical dance-drama tradition combining dance, drama, and music in storytelling.",
        image: "/images/sites/kuchipudi.jpg",
        age: "1500+ years",
        practitioners: "25,000+ worldwide",
        status: "Classical Dance Form",
        },
        {
        id: 3,
        name: "Traditional Pottery",
        region: "Rajasthan & Gujarat",
        description:
            "Ancient pottery techniques passed down through generations. Functional art meets heritage craft.",
        image: "/images/sites/ancient-pottery.jpg",
        age: "5000+ years",
        practitioners: "100,000+ artisans",
        status: "Living Heritage Craft",
        },
        {
        id: 4,
        name: "Decorative Metalwork",
        region: "Rajasthan",
        description:
            "Intricate metal bowls and utensils with traditional engravings and patterns.",
        image: "/images/sites/decorated-bowl.jpg",
        age: "1000+ years",
        practitioners: "75,000+ craftsmen",
        status: "Traditional Handicraft",
        },
    ];

    const discussions = [
        {
        id: 1,
        author: "Culture_Keeper",
        time: "2 hours ago",
        topic: "Preserving Folk Music Traditions",
        content:
            "How can we ensure that traditional folk songs don't get lost in the digital age? My grandmother knows hundreds of songs that aren't recorded anywhere.",
        replies: 23,
        likes: 45,
        category: "Preservation",
        },
        {
        id: 2,
        author: "Festival_Guide",
        time: "4 hours ago",
        topic: "Best Regional Food at Festivals",
        content:
            "Just returned from Pushkar Fair in Rajasthan. The traditional dal-baati-churma there was incredible! Share your festival food recommendations.",
        replies: 31,
        likes: 67,
        category: "Food Culture",
        },
        {
        id: 3,
        author: "Dance_Enthusiast",
        time: "1 day ago",
        topic: "Learning Classical Dance as an Adult",
        content:
            "I'm 35 and want to learn Odissi dance. Is it too late to start? Any recommendations for good teachers who understand adult learners?",
        replies: 18,
        likes: 29,
        category: "Learning",
        },
        {
        id: 4,
        author: "Heritage_Scholar",
        time: "2 days ago",
        topic: "Regional Variations in Diwali Celebrations",
        content:
            "Fascinating how Diwali is celebrated differently across India. In Bengal it's Kali Puja, in South it's more about Lakshmi. What's unique in your region?",
        replies: 42,
        likes: 89,
        category: "Traditions",
        },
    ];

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
            <h1 className="page-title">Festivals & Culture</h1>
            <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                Celebrate and preserve our living heritage
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

        <main style={{ padding: "28px", maxWidth: "1200px", margin: "0 auto" }}>
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
            <div
                style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <img
                    src="/images/culture.jpg"
                    alt="Festivals & Culture"
                    style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                    objectFit: "cover",
                    }}
                />
                <div>
                    <h2 style={{ margin: "0 0 8px 0", color: "#333" }}>
                    Festivals & Culture
                    </h2>
                    <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                    1,543 members • 89 discussions • Preserve and celebrate
                    traditions together
                    </p>
                </div>
                </div>
                <button
                onClick={() => setShowEventModal(true)}
                style={{
                    padding: "12px 24px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                }}
                >
                🎉 Add Event
                </button>
            </div>
            </div>

            {/* Tab Navigation */}
            <div
            style={{
                display: "flex",
                gap: "4px",
                marginBottom: "24px",
                backgroundColor: "white",
                padding: "4px",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
            }}
            >
            {[
                {
                id: "festivals",
                name: "🎊 Upcoming Festivals",
                count: festivals.length,
                },
                {
                id: "traditions",
                name: "🎭 Living Traditions",
                count: traditions.length,
                },
                {
                id: "discussions",
                name: "💬 Discussions",
                count: discussions.length,
                },
            ].map((tab) => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                    flex: 1,
                    padding: "12px 16px",
                    backgroundColor:
                    activeTab === tab.id ? "#007bff" : "transparent",
                    color: activeTab === tab.id ? "white" : "#333",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                }}
                >
                {tab.name} ({tab.count})
                </button>
            ))}
            </div>

            {/* Festivals Tab */}
            {activeTab === "festivals" && (
            <div
                style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
                gap: "24px",
                }}
            >
                {festivals.map((festival) => (
                <article
                    key={festival.id}
                    style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #e9ecef",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    }}
                >
                    <img
                    src={festival.image}
                    alt={festival.name}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    />
                    <div style={{ padding: "20px" }}>
                    <div
                        style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "12px",
                        }}
                    >
                        <h3
                        style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}
                        >
                        {festival.name}
                        </h3>
                        <span
                        style={{
                            backgroundColor: "#e7f3ff",
                            color: "#0066cc",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                        }}
                        >
                        {festival.type}
                        </span>
                    </div>

                    <div
                        style={{
                        fontSize: "14px",
                        color: "#666",
                        marginBottom: "8px",
                        }}
                    >
                        📍 {festival.location} • 📅 {festival.date}
                    </div>

                    <p
                        style={{
                        fontSize: "14px",
                        lineHeight: "1.5",
                        marginBottom: "12px",
                        color: "#555",
                        }}
                    >
                        {festival.description}
                    </p>

                    <div
                        style={{
                        backgroundColor: "#f8f9fa",
                        padding: "10px",
                        borderRadius: "6px",
                        marginBottom: "16px",
                        fontSize: "12px",
                        color: "#666",
                        }}
                    >
                        🏛️ Heritage: {festival.heritage_connection}
                    </div>

                    <div
                        style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        }}
                    >
                        <span style={{ fontSize: "14px", color: "#666" }}>
                        👥 {festival.participants} interested
                        </span>
                        <button
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                        >
                        Join Event
                        </button>
                    </div>
                    </div>
                </article>
                ))}
            </div>
            )}

            {/* Traditions Tab */}
            {activeTab === "traditions" && (
            <div
                style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "24px",
                }}
            >
                {traditions.map((tradition) => (
                <article
                    key={tradition.id}
                    style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #e9ecef",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    }}
                >
                    <img
                    src={tradition.image}
                    alt={tradition.name}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    />
                    <div style={{ padding: "20px" }}>
                    <div
                        style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                        }}
                    >
                        <h3
                        style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}
                        >
                        {tradition.name}
                        </h3>
                        <span
                        style={{
                            backgroundColor: "#fff3cd",
                            color: "#856404",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                        }}
                        >
                        {tradition.status}
                        </span>
                    </div>

                    <div
                        style={{
                        fontSize: "14px",
                        color: "#666",
                        marginBottom: "12px",
                        }}
                    >
                        📍 {tradition.region} • ⏳ {tradition.age}
                    </div>

                    <p
                        style={{
                        fontSize: "14px",
                        lineHeight: "1.5",
                        marginBottom: "16px",
                        color: "#555",
                        }}
                    >
                        {tradition.description}
                    </p>

                    <div
                        style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "12px",
                        color: "#666",
                        }}
                    >
                        <span>👨‍🎨 {tradition.practitioners}</span>
                        <button
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#6f42c1",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                        >
                        Learn More
                        </button>
                    </div>
                    </div>
                </article>
                ))}
            </div>
            )}

            {/* Discussions Tab */}
            {activeTab === "discussions" && (
            <div
                style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
                {discussions.map((discussion) => (
                <article
                    key={discussion.id}
                    style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #e9ecef",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                >
                    <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "12px",
                    }}
                    >
                    <div style={{ flex: 1 }}>
                        <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "8px",
                        }}
                        >
                        <div
                            style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: "#007bff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "14px",
                            }}
                        >
                            {discussion.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: "600", fontSize: "14px" }}>
                            {discussion.author}
                            </div>
                            <div style={{ fontSize: "12px", color: "#666" }}>
                            {discussion.time}
                            </div>
                        </div>
                        </div>
                        <h3
                        style={{
                            margin: "0 0 8px 0",
                            fontSize: "16px",
                            fontWeight: "600",
                        }}
                        >
                        {discussion.topic}
                        </h3>
                        <p
                        style={{
                            margin: "0 0 12px 0",
                            fontSize: "14px",
                            lineHeight: "1.5",
                            color: "#555",
                        }}
                        >
                        {discussion.content}
                        </p>
                    </div>
                    <span
                        style={{
                        backgroundColor: "#e7f3ff",
                        color: "#0066cc",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "500",
                        }}
                    >
                        {discussion.category}
                    </span>
                    </div>

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
                        ❤️ {discussion.likes}
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
                        💬 {discussion.replies} replies
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
                ))}
            </div>
            )}

            {/* Event Modal */}
            {showEventModal && (
            <div
                style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                }}
            >
                <div
                style={{
                    backgroundColor: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    maxWidth: "500px",
                    width: "90%",
                }}
                >
                <h3 style={{ margin: "0 0 16px 0" }}>Add Cultural Event</h3>
                <p
                    style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "16px",
                    }}
                >
                    Share upcoming festivals, cultural events, or traditional
                    celebrations with the community!
                </p>
                <button
                    onClick={() => setShowEventModal(false)}
                    style={{
                    padding: "8px 16px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
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
