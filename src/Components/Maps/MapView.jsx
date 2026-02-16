import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./mapview.css";

export default function MapView() {
  return (
    <div className="map-container">
      <MapContainer center={[6.9271, 79.8612]} zoom={7} scrollWheelZoom={false}>
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[6.9271, 79.8612]}>
          <Popup>Colombo, Sri Lanka</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
