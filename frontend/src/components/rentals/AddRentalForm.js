import React, { useState } from 'react';
import axios from 'axios';

const AddRentalForm = ({ onRentalAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: '',
    cost: '',
    contact: '',
    latitude: '',
    longitude: '',
    website: ''
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      await axios.post('http://localhost:8080/api/rentals', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      onRentalAdded(); // Refresh or reload rentals
    } catch (err) {
      alert("Failed to add rental");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h3>Add New Rental</h3>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="address" placeholder="Address" onChange={handleChange} required />
      <input name="type" placeholder="Type (Apartment or Room)" onChange={handleChange} />
      <input name="cost" type="number" placeholder="Cost" onChange={handleChange} />
      <input name="contact" placeholder="Contact" onChange={handleChange} />
      <input name="latitude" placeholder="Latitude" onChange={handleChange} />
      <input name="longitude" placeholder="Longitude" onChange={handleChange} />
      <input name="website" placeholder="Website URL" onChange={handleChange} />

      {/* Image File Upload */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <button type="submit">Add Rental</button>
    </form>
  );
};

export default AddRentalForm;
