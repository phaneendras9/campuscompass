import React, { useState } from 'react';
import axios from 'axios';

const EditTransportForm = ({ service, onCancel, onUpdated }) => {
  const [formData, setFormData] = useState({
    transportType: service.transportType,
    serviceName: service.serviceName,
    routeDetails: service.routeDetails,
    estimatedCost: service.estimatedCost,
    contactInfo: service.contactInfo,
    latitude: service.latitude,
    longitude: service.longitude
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
    const token = localStorage.getItem('token');

    const lat = parseFloat(formData.latitude);
    const lon = parseFloat(formData.longitude);

    if (!isValidCoordinates(lat, lon)) {
      alert("⚠️ Latitude must be between -90 and 90. Longitude must be between -180 and 180.");
      return;
    }

    const payload = {
      ...formData,
      estimatedCost: parseFloat(formData.estimatedCost),
      latitude: lat,
      longitude: lon,
    };

    try {
      await axios.put(`http://localhost:8080/api/transport/${service.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("✅ Transport service updated!");
      onUpdated();
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '10px' }}>
      <h4>✏️ Edit Transport</h4>
      <input name="transportType" value={formData.transportType} onChange={handleChange} placeholder="Type" required /><br />
      <input name="serviceName" value={formData.serviceName} onChange={handleChange} placeholder="Name" required /><br />
      <input name="routeDetails" value={formData.routeDetails} onChange={handleChange} placeholder="Route" required /><br />
      <input name="estimatedCost" type="number" value={formData.estimatedCost} onChange={handleChange} placeholder="Cost" required /><br />
      <input name="contactInfo" value={formData.contactInfo} onChange={handleChange} placeholder="Contact" /><br />
      <input name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} placeholder="Latitude (-90 to 90)" /><br />
      <input name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} placeholder="Longitude (-180 to 180)" /><br />

      <button type="submit">💾 Save</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>❌ Cancel</button>
    </form>
  );
};

export default EditTransportForm;
