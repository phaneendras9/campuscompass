// components/rentals/RentalMap.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const RentalMap = ({ latitude, longitude, name }) => {
  if (!latitude || !longitude) return <p style={{ color: 'gray' }}>❌ Invalid location</p>;

  return (
    <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={false} style={{ height: '200px', width: '100%', marginTop: '10px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[latitude, longitude]}>
        <Popup>📍 {name}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default RentalMap;
