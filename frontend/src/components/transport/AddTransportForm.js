import React, { useState } from 'react';
import axios from 'axios';

const AddTransportForm = ({ onAdded }) => {
  const [formData, setFormData] = useState({
    transportType: '',
    serviceName: '',
    routeDetails: '',
    estimatedCost: '',
    contactInfo: '',
    latitude: '',
    longitude: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidCoordinates = (lat, lon) => {
    return (
      !isNaN(lat) &&
      !isNaN(lon) &&
      lat >= -90 && lat <= 90 &&
      lon >= -180 && lon <= 180
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const lat = parseFloat(formData.latitude);
    const lon = parseFloat(formData.longitude);

    if (!isValidCoordinates(lat, lon)) {
      alert("⚠️ Latitude must be between -90 and 90. Longitude must be between -180 and 180.");
      return;
    }

    const token = localStorage.getItem("token");

    const payload = {
      ...formData,
      estimatedCost: parseFloat(formData.estimatedCost),
      latitude: lat,
      longitude: lon,
    };

    try {
      await axios.post("http://localhost:8080/api/transport", payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("✅ Transport service added!");

      setFormData({
        transportType: '',
        serviceName: '',
        routeDetails: '',
        estimatedCost: '',
        contactInfo: '',
        latitude: '',
        longitude: ''
      });

      if (onAdded) onAdded();

    } catch (err) {
      console.error("❌ Error adding transport:", err);
      alert("Failed to add transport. Are you logged in as ADMIN?");
    }
  };

  return (
    <div style={{ border: '1px solid gray', padding: '20px', marginBottom: '20px' }}>
      <h3>Add Transport Service</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="transportType" placeholder="BUS or CAB" value={formData.transportType} onChange={handleChange} required /><br /><br />
        <input type="text" name="serviceName" placeholder="Service Name" value={formData.serviceName} onChange={handleChange} required /><br /><br />
        <input type="text" name="routeDetails" placeholder="Route Details" value={formData.routeDetails} onChange={handleChange} required /><br /><br />
        <input type="number" name="estimatedCost" placeholder="Estimated Cost" value={formData.estimatedCost} onChange={handleChange} required /><br /><br />
        <input type="text" name="contactInfo" placeholder="Contact Info" value={formData.contactInfo} onChange={handleChange} required /><br /><br />
        <input type="number" step="any" name="latitude" placeholder="Latitude (-90 to 90)" value={formData.latitude} onChange={handleChange}  /><br /><br />
        <input type="number" step="any" name="longitude" placeholder="Longitude (-180 to 180)" value={formData.longitude} onChange={handleChange} /><br /><br />
        <button type="submit">➕ Add Transport</button>
      </form>
    </div>
  );
};

export default AddTransportForm;
