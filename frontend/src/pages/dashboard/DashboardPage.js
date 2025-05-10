import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // ✅ Required for routing

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:8080/api/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("/user/me error:", err);
        setMessage("Failed to load user data");
      });

    axios.get('http://localhost:8080/api/home', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setMessage(res.data))
      .catch(err => setMessage("Failed to load dashboard message"));
  }, []);

  if (!user) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h2>🏡 CampusCompass Dashboard</h2>
      <p>{message || "Welcome to your personalized home dashboard!"}</p>

      <ul>
        <li><Link to="/rentals">🏠 Rentals & Apartments</Link></li>
        <li><Link to="/transport">Transport Info</Link></li>
        <li>🛒 Groceries & Stores</li>
        <li>📍 Tourist Spots</li>
        <li>🕌 Religious Places</li>
        <li>🧺 Laundry Services</li>
        <li>💼 Jobs & GA</li>
        <li>🩺 Health & Insurance</li>
      </ul>

      {/* ✅ Admin-specific dashboard link */}
      {user.role === 'ADMIN' && (
        <div style={{ marginTop: "20px" }}>
          <h3>🔒 Admin Area</h3>
          <Link to="/admin">Go to Admin Dashboard</Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
