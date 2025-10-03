import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../app.css";

export default function HomePage({ userName = "Prannoy Chandola", onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("home-mode");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.classList.remove("home-mode");
      document.body.style.overflow = "";
    };
  }, []);

  const features = [
    {
      title: "Discover",
      route: "/discover",
      bullets: [
        "Explore India's rich heritage of festivals and monuments.",
        "Find detailed stories, history, and cultural significance.",
        "Reconnect with traditions no matter where you are."
      ],
    },
    {
      title: "AR/Video Tour",
      route: "/ar-tour",
      bullets: [
        "Step into monuments and festivals through immersive AR/VR.",
        "Experience India's beauty as if you are truly there.",
        "Travel virtually, anytime, from anywhere."
      ],
    },
    {
      title: "Social Profiles",
      route: "/social",
      bullets: [
        "Connect with others who share your cultural interests.",
        "Share your experiences, memories, and celebrations.",
        "Build a community that keeps heritage alive."
      ],
    },
  ];

  return (
    <div className="home-page">
      {/* ... header ... */}

      <main className="home-main home-main-full">
        <div className="features-wrap features-wrap-full">
          {features.map((f, i) => (
            <article className="feature-card home-feature-card" key={i}>
              <div className="feature-thumb">
                <div
                  className={`thumb-placeholder ${
                    i === 0 ? "discover-thumb" : i === 1 ? "ar-thumb" : "social-thumb"
                  }`}
                />
              </div>

              <div className="feature-body">
                <div className="feature-title">{f.title}</div>
                <ul className="feature-bullets">
                  {f.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="feature-right">
                <button
                  className="feature-go"
                  aria-label={`open ${f.title}`}
                  onClick={() => navigate(f.route)} // 🔹 navigate to route
                >
                  ➜
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* ... footer ... */}
    </div>
  );
}
