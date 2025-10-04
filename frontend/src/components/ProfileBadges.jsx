// frontend/src/components/ProfileBadges.jsx
import React, { useEffect, useState } from 'react';
import { getApiBaseUrl } from '../utils/api';

export default function ProfileBadges() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('token');
      if (!token) return;
      const apiBaseUrl = getApiBaseUrl();
      const res = await fetch(`${apiBaseUrl}/api/user/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      setUser(data);
    }
    load();
  }, []);

  if (!user) return <div className="card">Loading profile…</div>;

  return (
    <div className="card">
      <h3>{user.name}'s Badges</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {user.badges && user.badges.length ? user.badges.map(b => (
          <div key={b._id} className="badge" title={b.description}>
            <div style={{ fontSize: 20 }}>{b.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{b.name}</div>
          </div>
        )) : <div>No badges yet</div>}
      </div>
    </div>
  );
}
