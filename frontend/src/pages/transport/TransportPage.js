import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddTransportForm from '../../components/transport/AddTransportForm';
import EditTransportForm from '../../components/transport/EditTransportForm';
import TransportMap from '../../components/transport/TransportMap';

const TransportPage = () => {
  const [transportList, setTransportList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('ALL'); // 🔁 New state
  const role = localStorage.getItem('role');

  const fetchTransportList = (type) => {
    const token = localStorage.getItem('token');
    setLoading(true);

    let url = 'http://localhost:8080/api/transport';
    if (type === 'BUS') url += '/bus-services';
    else if (type === 'CAB') url += '/cab-services';

    axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setTransportList(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error fetching transport:', err);
        if (err.response && err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
        } else {
          setError('Something went wrong while fetching transport data.');
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view transport services.');
      setLoading(false);
      return;
    }
    fetchTransportList(filter);
  }, [filter]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this transport service?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/transport/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("✅ Deleted successfully!");
      fetchTransportList(filter);
    } catch (err) {
      console.error("❌ Error deleting:", err);
      alert("Failed to delete. Are you logged in as ADMIN?");
    }
  };

  if (loading) return <p>Loading transport services...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>🚍 Transport Services</h2>

      {/* 🎛️ Filter buttons */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setFilter('ALL')} style={{ marginRight: '10px' }}>All</button>
        <button onClick={() => setFilter('BUS')} style={{ marginRight: '10px' }}>Bus Only</button>
        <button onClick={() => setFilter('CAB')}>Cab Only</button>
      </div>

      {/* ➕ Add Form (ADMIN only) */}
      {role === 'ADMIN' && <AddTransportForm onAdded={() => fetchTransportList(filter)} />}

      {transportList.length === 0 ? (
        <p>No transport services found.</p>
      ) : (
        <ul>
          {transportList.map(service => (
            <li key={service.id} style={{ marginBottom: '20px' }}>
              {editingId === service.id ? (
                <EditTransportForm
                  service={service}
                  onCancel={() => setEditingId(null)}
                  onUpdated={() => {
                    setEditingId(null);
                    fetchTransportList(filter);
                  }}
                />
              ) : (
                <>
                  <strong>{service.serviceName}</strong> ({service.transportType})<br />
                  Route: {service.routeDetails}<br />
                  Cost: ${service.estimatedCost}<br />
                  Contact: {service.contactInfo}<br />

                  <TransportMap
                    latitude={parseFloat(service.latitude)}
                    longitude={parseFloat(service.longitude)}
                    serviceName={service.serviceName}
                  />

                  {role === 'ADMIN' && (
                    <>
                      <button onClick={() => setEditingId(service.id)} style={{ marginRight: '10px' }}>✏️ Edit</button>
                      <button onClick={() => handleDelete(service.id)} style={{ color: 'red' }}>❌ Delete</button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransportPage;
