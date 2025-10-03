import React, { useState, useEffect } from "react";
import { fetchHeritageSites } from "../utils/api";

export default function HeritageSites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSites = async () => {
      try {
        setLoading(true);
        const heritageSites = await fetchHeritageSites();
        setSites(heritageSites);
        setError(null);
      } catch (err) {
        console.error('Failed to load heritage sites:', err);
        setError('Failed to load heritage sites. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadSites();
  }, []);

  if (loading) {
    return <div>Loading heritage sites...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {sites.map((site) => (
        <div key={site._id}>{site.name}</div>
      ))}
    </div>
  );
}
