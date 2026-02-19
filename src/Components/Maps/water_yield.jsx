import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { Calendar, Droplets } from "lucide-react";
import shp from "shpjs";
import "leaflet/dist/leaflet.css";
import "./water_yield.css";

export default function WaterYieldMap() {
  const [geojson, setGeojson] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2015");

  useEffect(() => {
    shp("/shapefiles/AZ_P_ET_water_yield.zip")
      .then((data) => setGeojson(Array.isArray(data) ? data[0] : data))
      .catch((err) => console.error("Shapefile error:", err));
  }, []);

  /**
   * NEW VIBRANT PALETTE — warm amber → lime → emerald → teal → violet
   * Much more visually distinct and attractive than the old palette
   */
  const getColor = (v) => {
  if (v > 150)   return "#00f2ff"; // Electric Cyan (Highest Yield)
  if (v > 100)   return "#00d4ff"; // Bright Sky Blue
  if (v > 50)    return "#0099ff"; // Deep Azure
  if (v > 0)     return "#0066ff"; // Tech Blue (Lower Yield)
  if (v > -50)   return "#7000ff"; // Vivid Purple (Transition to Loss)
  if (v > -100)  return "#a911e0c2"; // Bright Magenta
  return "#974289";                // Neon Pink (Highest Loss/ET)
};
const legendItems = [
  { color: "#00f2ff", label: "> 150 mm/yr" },
  { color: "#00d4ff", label: "100 – 150 mm/yr" },
  { color: "#0099ff", label: "50 – 100 mm/yr" },
  { color: "#0066ff", label: "0 – 50 mm/yr" },
  { color: "#7000ff", label: "-50 – 0 mm/yr" },
  { color: "#a911e0c2", label: "-100 – -50 mm/yr" },
  { color: "#974289", label: "< -100 mm/yr" },
];

  const mapStyle = (feature) => {
    const val = Number(feature.properties[`P_ET_${selectedYear}`]);
    return {
      fillColor: getColor(val),
      weight: 1,
      opacity: 1,
      color: "rgba(24, 21, 21, 1)",
      fillOpacity: 0.82,
    };
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({ weight: 3, color: "#fff", fillOpacity: 1 });
        l.bringToFront();
      },
      mouseout: (e) => e.target.setStyle(mapStyle(feature)),
    });

    const val = Number(feature.properties[`P_ET_${selectedYear}`]).toFixed(1);
    layer.bindTooltip(
      `<div class="glass-tooltip">
        <span class="tt-label">${feature.properties.Watershed || "Basin"}</span>
        <span class="tt-val">${val} mm/yr</span>
      </div>`,
      { sticky: true, className: "leaflet-tooltip-own" }
    );
  };

  return (
    <div className="water-yield-wrapper">

      {/* ── HEADER — above map, no overlap ── */}
      <div className="map-overlay-header">
        <div className="brand">
          <Droplets size={18} className="neon-icon" />
          <h1>Amman Zarqa Basin Water Yield (mm/year)</h1>
        </div>

        <div className="glass-select-container">
          <Calendar size={14} color="#63d2be" />
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {["2015", "2016", "2017", "2018", "2019", "2020"].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── MAP ── */}
      <MapContainer
        center={[32.1, 36.1]}
        zoom={9}
        zoomControl={true}
        className="dark-map"
        style={{ position: "relative" }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {geojson && (
          <GeoJSON
            key={selectedYear}
            data={geojson}
            style={mapStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Legend lives inside MapContainer so it overlaps the map tiles only */}
        <div className="map-legend-neon">
          <h3>Water Yield Intensity</h3>
          {legendItems.map(({ color, label }) => (
            <div className="leg-row" key={label}>
              <i style={{ background: color }} />
              {label}
            </div>
          ))}
        </div>
      </MapContainer>

    </div>
  );
}
