import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import * as L from "leaflet";
import shp from "shpjs";
import "./BasinMap.css";
import './water_yield.css'

export default function BasinMap() {
  const [geojson, setGeojson] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2015");

  useEffect(() => {
  shp("/shapefiles/AZ_P_ET_water_yield.zip")
    .then((data) => {
      let parsed = data;

      // CASE 1 — shpjs returned array
      if (Array.isArray(data)) {
        parsed = data[0];
      }

      // CASE 2 — shpjs returned object containing multiple layers
      if (!parsed.type && typeof parsed === "object") {
        const firstKey = Object.keys(parsed)[0];
        parsed = parsed[firstKey];
      }

      console.log("🐟 RAW SHPJS OUTPUT:", data);
      console.log("📌 NORMALIZED GEOJSON:", parsed);

      if (parsed?.features?.length > 0) {
        console.log("🧪 PROPERTIES OF FIRST FEATURE:", parsed.features[0].properties);
      } else {
        console.log("❌ No features found in shapefile");
      }

      setGeojson(parsed);
    })
    .catch((err) => console.error("Error loading shapefile:", err));
}, []);


  return (
    <div className="basin-map-container">
      <h3 className="map-title">Annual Water Yield</h3>

      {/* YEAR DROPDOWN */}
      <div className="year-selector">
        <label>Select Year: </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2015">2015</option>
          <option value="2016">2016</option>
          <option value="2017">2017</option>
          <option value="2018">2018</option>
          <option value="2019">2019</option>
          <option value="2020">2020</option>
        </select>
      </div>

      <MapContainer
        center={[31.5, 36.2]}        // Jordan center
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: "450px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {geojson && (
          <DynamicLayer geojson={geojson} selectedYear={selectedYear} />
        )}
      </MapContainer>
    </div>
  );
}

/* -----------------------------------------
   DYNAMIC LAYER  +  FIT BOUNDS
------------------------------------------- */
function DynamicLayer({ geojson, selectedYear }) {
  const map = useMap();

  useEffect(() => {
    const gj = L.geoJSON(geojson);
    map.fitBounds(gj.getBounds());
  }, [geojson, map]);

  const yearField = `P_ET_${selectedYear}`;


  // 🔥 FIX: Convert ANY weird string (spaces/commas) to number
  const cleanNumber = (raw) => {
    if (!raw) return null;

    // remove commas, trim spaces
    let val = String(raw).replace(/,/g, "").trim();

    // convert to number
    val = Number(val);

    if (isNaN(val)) return null;
    return val;
  };


  /* COLOR STYLE */
  const style = (feature) => {
    const val = cleanNumber(feature.properties[yearField]);

    const color =
      val > 300 ? "#084594" :
      val > 200 ? "#2171b5" :
      val > 100 ? "#4292c6" : "#6baed6";

    return {
      color: "#003c8f",
      weight: 2,
      fillColor: color,
      fillOpacity: 0.55,
    };
  };


  /* TOOLTIP DISPLAY */
  const onEach = (feature, layer) => {
    const watershed = feature.properties["Watershed"];
    const raw = feature.properties[yearField];
    const value = cleanNumber(raw);

    const displayValue = value !== null ? value.toFixed(2) : "No Data";

    const tooltipHTML =
      
       `<b>Water Yield:</b> ${displayValue}`;

    layer.bindTooltip(tooltipHTML, { sticky: true });
  };


  return (
    <GeoJSON
      data={geojson}
      style={style}
      onEachFeature={onEach}
    />
  );
}
