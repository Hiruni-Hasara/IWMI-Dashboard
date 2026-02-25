import React, { useEffect, useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { Calendar, Droplets, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import shp from "shpjs";
import "leaflet/dist/leaflet.css";
import "./Monthly_WA.css";

const DATASETS = {
  rainfall: {
    name: "Rainfall",
    icon: "🌧",
    path: "/shapefiles/AZ_Rainfall.zip", 
    unit: "mm",
    accent: "#60a5fa",
    getColor: (v) => {
      if (v > 50) return "#9ad1f7"; // High
      if (v > 40)  return "#1574a0";
      if (v > 30)  return "#46a3e0";
      if (v > 20)  return "#0a85cc";
      if (v > 10)  return "#194bf1";
      if (v > 0)  return "#3579f8"; // Low
      return "#9bbdfd";
    },
    // Legend ordered from lowest value (0) to highest (>15)
    legend: ["#3579f8", "#194bf1", "#0a85cc", "#46a3e0", "#1574a0", "#9ad1f7"],
  },
  blue_et: {
    name: "Blue ET",
    icon: "💧",
    path: "/shapefiles/AZ_ET.zip",
    unit: "mm",
    accent: "#60a5fa",
    getColor: (v) => {
      if (v > 30) return "#4cb6fd"; // High
      if (v > 20) return "#4bbce9";
      if (v > 10) return "#1589d6";
      if (v > 5)  return "#0946ee";
      if (v > 2)  return "#2d72da";
      if (v > 0)  return "#88aff8"; // Low
      return "#afcbff";
    },
    // Legend ordered from lowest value (0) to highest (>30)
    legend: ["#88aff8", "#2d72da", "#0946ee", "#1589d6", "#4bbce9", "#4cb6fd"],
  },
  rain_et: {
    name: "Rainfall ET",
    icon: "🌿",
    path: "/shapefiles/AZ_Rain_ET.zip",
    unit: "mm",
    accent: "#00BFFF",
    getColor: (v) => {
      if (v > 20) return "#08af4e"; // High (Green)
      if (v > 15) return "#3febce";
      if (v > 10) return "#00BFFF";
      if (v > 5)  return "#007FFF";
      if (v > 0)  return "#0047AB"; // Low (Navy)
      return "#93a6fc";
    },
    // Legend matches the "Swimming through the fish bowl" palette + your Green additions
    legend: ["#0047AB", "#007FFF", "#00BFFF", "#3febce", "#08af4e"],
  },
};

const YEARS  = ["2016","2017","2018","2019","2020","2021","2022"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function FitBounds({ geojson }) {
  const map = useMap();
  useEffect(() => {
    if (!geojson) return;
    try {
      const layer = window.L.geoJSON(geojson);
      const bounds = layer.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    } catch (e) {}
  }, [geojson, map]);
  return null;
}

export default function InteractiveExplorer() {
  const [geojson, setGeojson]           = useState(null);
  const [dataset, setDataset]           = useState("rainfall");
  const [year, setYear]                 = useState("2016");
  const [month, setMonth]               = useState("Jan");
  const [loading, setLoading]           = useState(false);
  const [hoveredVal, setHoveredVal]     = useState(null);
  const [hoveredName, setHoveredName]   = useState(null);
  // Track the currently highlighted layer so we can keep border on it
  const activeLayerRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setGeojson(null);
    activeLayerRef.current = null;
    shp(DATASETS[dataset].path)
      .then((d) => { setGeojson(Array.isArray(d) ? d[0] : d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [dataset]);

  const propertyKey = useMemo(() => `${month}_${year}`, [month, year]);
  const ds = DATASETS[dataset];

  const normalStyle = (feature) => ({
    fillColor: ds.getColor(Number(feature.properties[propertyKey] || 0)),
    weight: 1.2,
    opacity: 1,
    color: "#000000",
    fillOpacity: 0.87,
  });

  const hoverStyle = {
    weight: 3,
    color: "#ffffff",     // bright white border — stays while mouse is on it
    fillOpacity: 1,
  };

  const onEachFeature = (feature, layer) => {
    const val  = Number(feature.properties[propertyKey] || 0).toFixed(1);
    const name = feature.properties.Watershed || feature.properties.SUB_NAME || "Basin";

    layer.bindTooltip(
      `<div class="map-tooltip">
        <div class="tt-basin">${name}</div>
        <div class="tt-value">${val} <span>${ds.unit}</span></div>
       </div>`,
      { sticky: true, className: "clean-tip" }
    );

    layer.on({
      mouseover: (e) => {
        // Reset previously hovered layer back to normal
        if (activeLayerRef.current && activeLayerRef.current !== e.target) {
          activeLayerRef.current.setStyle(normalStyle(activeLayerRef.current.feature));
        }
        // Apply white border — stays until another basin is hovered
        e.target.setStyle(hoverStyle);
        e.target.bringToFront();
        activeLayerRef.current = e.target;
        setHoveredVal(val);
        setHoveredName(name);
      },
      // NO mouseout reset — border stays on current basin
    });
  };

  const monthIdx = MONTHS.indexOf(month);
  const prevMonth = () => setMonth(MONTHS[(monthIdx - 1 + 12) % 12]);
  const nextMonth = () => setMonth(MONTHS[(monthIdx + 1) % 12]);

  return (
    <div className="explorer-root">

      {/* ══ SIDEBAR ══ */}
      <aside className="sidebar">

        <div className="sb-brand">
          <Droplets size={26} style={{ color: ds.accent, filter: `drop-shadow(0 0 8px ${ds.accent})` }} />
          <div>
            <div className="sb-title">Basin Explorer</div>
            <div className="sb-sub">Amman Zarqa · Monthly WA</div>
          </div>
        </div>

        {/* DATASET */}
        <div className="sb-block">
          <div className="sb-block-label"><Layers size={13}/> Dataset</div>
          <div className="ds-list">
            {Object.entries(DATASETS).map(([id, info]) => (
              <button
                key={id}
                className={`ds-btn ${dataset === id ? "ds-btn--on" : ""}`}
                style={dataset === id ? { "--a": info.accent } : {}}
                onClick={() => setDataset(id)}
              >
                <span className="ds-emoji">{info.icon}</span>
                <span className="ds-label">{info.name}</span>
                {dataset === id && (
                  <span className="ds-pip" style={{ background: info.accent, boxShadow: `0 0 8px ${info.accent}` }}/>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="divider"/>

        {/* YEAR */}
        <div className="sb-block">
          <div className="sb-block-label"><Calendar size={13}/> Year</div>
          <div className="yr-grid">
            {YEARS.map(y => (
              <button
                key={y}
                className={`yr-btn ${year === y ? "yr-btn--on" : ""}`}
                style={year === y ? { borderColor: ds.accent, color: ds.accent, boxShadow: `0 0 10px ${ds.accent}44`, background: `${ds.accent}14` } : {}}
                onClick={() => setYear(y)}
              >{y}</button>
            ))}
          </div>
        </div>

        <div className="divider"/>

        {/* MONTH */}
        <div className="sb-block">
          <div className="sb-block-label">Month</div>
          <div className="month-hero">
            <button className="month-arrow" onClick={prevMonth}><ChevronLeft size={18}/></button>
            <div className="month-center">
              <div className="month-name">{month}</div>
              <div className="month-yr">{year}</div>
            </div>
            <button className="month-arrow" onClick={nextMonth}><ChevronRight size={18}/></button>
          </div>
          <div className="month-grid">
            {MONTHS.map(m => (
              <button
                key={m}
                className={`month-chip ${month === m ? "month-chip--on" : ""}`}
                style={month === m ? { background: `${ds.accent}22`, borderColor: ds.accent, color: ds.accent } : {}}
                onClick={() => setMonth(m)}
              >{m}</button>
            ))}
          </div>
        </div>

        <div className="divider"/>

        {/* LEGEND */}
        <div className="sb-block">
          <div className="sb-block-label">Intensity Scale</div>
          <div className="legend-bar" style={{ background: `linear-gradient(to right, ${ds.legend.join(",")})` }}/>
          <div className="legend-ticks">
            <span>0</span><span>10</span><span>20</span><span>40</span><span>60</span><span>80+</span>
          </div>
          <div className="legend-unit">{ds.unit}</div>
        </div>

        {/* LIVE READOUT */}
        {hoveredVal !== null && (
          <div className="readout" style={{ borderColor: `${ds.accent}55` }}>
            <div className="readout-name">{hoveredName}</div>
            <div className="readout-val" style={{ color: ds.accent }}>{hoveredVal}<span> {ds.unit}</span></div>
          </div>
        )}

      </aside>

      {/* ══ MAP ══ */}
      <div className="map-wrap">
        <div className="map-chips">
          <div className="map-chip" style={{ borderColor: `${ds.accent}55`, color: ds.accent }}>{ds.icon} {ds.name}</div>
          <div className="map-chip"><Calendar size={11}/> {month} {year}</div>
          {loading && <div className="map-chip map-chip--load"><span className="spin"/> Loading…</div>}
        </div>

        <MapContainer center={[32.0, 36.2]} zoom={9} zoomControl={true} className="the-map">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"/>
          {geojson && !loading && (
            <>
              <FitBounds geojson={geojson}/>
              <GeoJSON
                key={`${dataset}-${propertyKey}`}
                data={geojson}
                style={normalStyle}
                onEachFeature={onEachFeature}
              />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}