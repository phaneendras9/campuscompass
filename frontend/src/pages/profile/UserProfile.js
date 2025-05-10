import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("JWT from localStorage:", token); // Debug
    
    axios.get('http://localhost:8080/api/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setUser(res.data))
      .catch((err) => {
        alert("Not authorized. Please login again.");
        console.error("/me error:", err);
      });
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome, {user.fullName}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      {/* ✅ Admin-specific UI */}
      {user.role === 'ADMIN' && (
        <div>
          <h3>🔒 Admin Controls</h3>
            <Link to="/admin">
              <button>Go to Admin Dashboard</button>
            </Link>
        </div>
)}

      {/* ✅ Student-specific UI */}
      {user.role === 'STUDENT' && (
        <div>
          <h3>🎓 Student Area</h3>
          <p>You have access to student resources.</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
