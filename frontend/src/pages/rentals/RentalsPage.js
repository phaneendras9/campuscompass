import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddRentalForm from '../../components/rentals/AddRentalForm';
import EditRentalForm from '../../components/rentals/EditRentalForm';
import RentalMap from '../../components/rentals/RentalMap'; // ✅ new map component

import './RentalsPage.css';

const RentalsPage = () => {
  const [rentals, setRentals] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [user, setUser] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [costFilter, setCostFilter] = useState('');
  const [editRental, setEditRental] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`http://localhost:8080/api/rentals?page=${page}&size=${size}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setRentals(res.data.content);
      setFilteredRentals(res.data.content);
      setTotalPages(res.data.totalPages);
    });

    axios.get('http://localhost:8080/api/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setUser(res.data));
  }, [page]);

  useEffect(() => {
    let filtered = [...rentals];
    if (typeFilter) filtered = filtered.filter(r => r.type === typeFilter);
    if (costFilter) filtered = filtered.filter(r => r.cost <= parseFloat(costFilter));
    setFilteredRentals(filtered);
  }, [typeFilter, costFilter, rentals]);

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:8080/api/rentals/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setRentals(rentals.filter(r => r.id !== id));
    }).catch(err => alert("Failed to delete rental"));
  };

  return (
    <div>
      <h2>🏠 Rental Listings</h2>

      {user?.role === 'ADMIN' && (
        <AddRentalForm onRentalAdded={() => window.location.reload()} />
      )}

      <div className="filters">
        <label>
          Type:
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Apartment">Apartment</option>
            <option value="Room">Room</option>
          </select>
        </label>

        <label>
          Max Cost:
          <input
            type="number"
            value={costFilter}
            onChange={(e) => setCostFilter(e.target.value)}
            placeholder="e.g. 700"
          />
        </label>
      </div>

      <div className="rental-grid">
        {filteredRentals.length === 0 ? (
          <p>No rentals match your filters.</p>
        ) : (
          filteredRentals.map(r => (
            <div key={r.id} className="rental-card">
              {r.imageUrl && (
                <img
                  src={`http://localhost:8080${r.imageUrl}`}
                  alt={r.name}
                  className="rental-img"
                />
              )}
              <h3>{r.name}</h3>
              {r.type && <p><strong>Type:</strong> {r.type}</p>}
              {r.address && <p><strong>Address:</strong> {r.address}</p>}
              {r.cost > 0 && <p><strong>Cost:</strong> ${r.cost}</p>}
              {r.contact && <p><strong>Contact:</strong> {r.contact}</p>}
              {r.website && (
                <p><strong>Website:</strong> <a href={r.website} target="_blank" rel="noreferrer">{r.website}</a></p>
              )}

              {/* 🗺️ Show location using component */}
              <RentalMap latitude={r.latitude} longitude={r.longitude} name={r.name} />

              {user?.role === 'ADMIN' && (
                <div className="admin-controls">
                  <button onClick={() => setEditRental(r)}>Edit</button>
                  <button onClick={() => handleDelete(r.id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="pagination-controls">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>⬅ Prev</button>
        <span>Page {page + 1} of {totalPages}</span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next ➡</button>
      </div>

      {editRental && (
        <EditRentalForm
          rental={editRental}
          onClose={() => setEditRental(null)}
          onUpdated={() => {
            setEditRental(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default RentalsPage;
