import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import shp from "shpjs";
import "leaflet/dist/leaflet.css";
import "./BasinMap.css";

export default function BasinMap() {
  const [geojson, setGeojson] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    shp("/shapefiles/AZ_Basin.zip")
      .then((data) => setGeojson(data))
      .catch((err) => console.error("Shapefile loading error:", err));
  }, []);

  // Auto-zoom when geojson loads
  useEffect(() => {
    if (geojson && mapRef.current) {
      const layer = L.geoJSON(geojson);
      mapRef.current.fitBounds(layer.getBounds());
    }
  }, [geojson]);

  return (
    <div className="basin-map-container">
      <h3 className="map-title">
        <span> River Basin </span>
      </h3>

      <MapContainer
        ref={mapRef}
        center={[0, 0]} // placeholder, overridden by fitBounds
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
  url="https://tiles.stadiamaps.com/tiles/hillshade/{z}/{x}/{y}.png"
  opacity={0.6}
/>
<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {geojson && (
          <GeoJSON
            data={geojson}
            style={{
              color: "#0057ff",
              weight: 3,
              fillColor: "#4da6ff",
              fillOpacity: 0.35,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
