import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:8080/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setMessage(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("❌ Access denied. Only ADMINs can view this page.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading admin dashboard...</p>;

  return (
    <div>
      <h2>🔐 Admin Dashboard</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {message && (
        <>
          <p>{message}</p>
          <h4>🛠 Admin Tools:</h4>
          <ul>
            <li>🏠 Manage Rentals</li>
            <li>💼 Post Jobs & GA</li>
            <li>🛒 Add Grocery Listings</li>
            <li>🗓 Manage Events</li>
          </ul>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
