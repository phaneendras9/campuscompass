import React, { useState } from 'react';
import axios from 'axios';

const EditRentalForm = ({ rental, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    name: rental.name || '',
    address: rental.address || '',
    type: rental.type || '',
    cost: rental.cost || '',
    contact: rental.contact || '',
    latitude: rental.latitude || '',
    longitude: rental.longitude || '',
    website: rental.website || '',
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
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
      alert("⚠️ Invalid coordinates.");
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      await axios.put(`http://localhost:8080/api/rentals/${rental.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      onUpdated();
    } catch (err) {
      alert("Update failed");
      console.error(err);
    }
  };

  return (
    <div className="edit-form-container">
      <h3>Edit Rental</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
        <input name="type" value={formData.type} onChange={handleChange} placeholder="Type" />
        <input name="cost" type="number" value={formData.cost} onChange={handleChange} placeholder="Cost" />
        <input name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact" />
        <input name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" />
        <input name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" />
        <input name="website" value={formData.website} onChange={handleChange} placeholder="Website URL" />

        <input type="file" accept="image/*" onChange={handleFileChange} />

        <div className="form-buttons">
          <button type="submit">💾 Save</button>
          <button type="button" onClick={onClose}>❌ Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditRentalForm;
