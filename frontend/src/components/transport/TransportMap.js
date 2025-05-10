import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// 📍 Custom marker fix for Leaflet
import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const TransportMap = ({ latitude, longitude, serviceName }) => {
  if (!latitude || !longitude) return <p>❌ Invalid coordinates</p>;

  return (
    <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: "200px", width: "100%", marginTop: "10px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          📍 {serviceName}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default TransportMap;
