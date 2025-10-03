// src/components/SiteDetail.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import heritageSites from "../assets/heritageSites.json";
import "../app.css";

export default function SiteDetail() {
  const { siteId } = useParams();
  const navigate = useNavigate();

  const site = heritageSites.find((s) => s.site_id === siteId);

  if (!site) {
    return <div style={{ padding: 20 }}>Site not found</div>;
  }

  return (
    <div className="site-page">
      <main className="site-main">
        <article className="site-card">
          {/* Left Image */}
          <div className="site-left">
            <img
              src={site.image_array[0]}
              alt={site.name}
              className="site-main-image"
            />
          </div>

          {/* Right Info */}
          <div className="site-right">
            <h2>{site.name}</h2>
            <p>{site.description}</p>
            <p>
              <strong>Location:</strong> {site.location}
            </p>
            <p>
              <strong>Coordinates:</strong> {site.geotag.latitude},{" "}
              {site.geotag.longitude}
            </p>

            {/* Video Section */}
            <div className="site-video">
              <h3>Video</h3>
              <iframe
                width="100%"
                height="250"
                src={`https://www.youtube.com/embed/${site.youtube_video_id}`}
                title={site.name}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>

            {/* Action Buttons */}
            <div className="site-actions">
              <button
                className="site-btn"
                onClick={() => navigate("/discover")}
              >
                Back to Discover
              </button>
              <button
                className="site-btn"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${site.geotag.latitude},${site.geotag.longitude}`,
                    "_blank"
                  )
                }
              >
                Open in Maps
              </button>
            </div>
          </div>
        </article>

        {/* Thumbnails Section */}
        <div className="site-thumbnails">
          {site.image_array.map((img, i) => (
            <img key={i} src={img} alt={`${site.name}-${i + 1}`} />
          ))}
        </div>
      </main>
    </div>
  );
}
