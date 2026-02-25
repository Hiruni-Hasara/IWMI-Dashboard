import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import shp from "shpjs";
import "leaflet/dist/leaflet.css";
import "./BasinMap.css";

export default function BasinMap() {
  const [basinData, setBasinData] = useState(null);
  const [networkData, setNetworkData] = useState(null);
  const mapRef = useRef(null);

  // High-end color palette
  const colors = {
    boundary: "#2563eb",      // Deep Blue
    boundaryFill: "#3b82f6",  // Blue fill
    highlight: "#00f2ff",     // Neon Cyan
    network: "#0ea5e9"        // Electric Sky Blue
  };

  useEffect(() => {
    Promise.all([
      shp("/shapefiles/AZ_Basin.zip"),
      shp("/shapefiles/AZ_basin_network.zip")
    ])
      .then(([basin, network]) => {
        setBasinData(basin);
        setNetworkData(network);
      })
      .catch((err) => console.error("Loading error:", err));
  }, []);

  useEffect(() => {
    if (basinData && mapRef.current) {
      const layer = L.geoJSON(basinData);
      mapRef.current.fitBounds(layer.getBounds(), { padding: [10, 10] });
    }
  }, [basinData]);

  const onEachBasin = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          weight: 5,
          color: colors.highlight,
          fillOpacity: 0.4,
        });
        target.bringToBack(); // Ensures network stays visible on top
      },
      mouseout: (e) => {
        e.target.setStyle({
          weight: 3,
          color: colors.boundary,
          fillOpacity: 0.25,
        });
      }
    });
  };

 return (
  <div className="map-tile-inner-wrapper">
    {/* --- Interactive Floating Title --- */}
    <div className="map-header-glass">
      <div className="accent-line"></div>
      <div className="title-stack">
        <h4 className="main-map-title">Amman–Zarqa Basin Network</h4>
        <div className="status-indicator">
          <span className="dot"></span>
          <span className="status-text">Interactive Map</span>
        </div>
      </div>
    </div>

    <MapContainer
      ref={mapRef}
      center={[32.1, 36.1]}
      zoom={9}
      scrollWheelZoom={false}
      zoomControl={true}
      className="fill-container-map"
    >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {basinData && (
          <GeoJSON 
            data={basinData} 
            onEachFeature={onEachBasin}
            style={{
              color: colors.boundary,
              weight: 3,
              fillColor: colors.boundaryFill,
              fillOpacity: 0.25,
            }} 
          />
        )}
        
        {networkData && (
          <GeoJSON 
            data={networkData} 
            interactive={false} // Prevents network from stealing hover from boundary
            style={{
              color: colors.network,
              weight: 1.8,
              opacity: 0.9
            }} 
          />
        )}
      </MapContainer>
    </div>
  );
}