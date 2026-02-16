import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";

export default function WaterYieldMap() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const rasterRef = useRef(null);
  const abortControllerRef = useRef(null);
  const pixelHighlightRef = useRef(null); // NEW — highlight pixel
  const georasterRef = useRef(null); // NEW — store georaster

  const [selectedYear, setSelectedYear] = useState("");
  const [layerType, setLayerType] = useState("wy");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const years = Array.from({ length: 18 }, (_, i) => 2004 + i);

  // -------------------------------------------
  // INIT MAP
  // -------------------------------------------
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map(containerRef.current, { center: [10, -2], zoom: 6 });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    mapRef.current = map;

    setTimeout(() => map.invalidateSize(), 200);

    // -------------------------------------------
    // ADD CLICK HANDLER FOR PIXEL VALUE
    // -------------------------------------------
    map.on("click", (e) => {
  const rasterLayer = rasterRef.current;
  const georaster = georasterRef.current;
  if (!rasterLayer || !georaster) return;

  const { lat, lng } = e.latlng;

  // Convert lat/lng → pixel index
  const col = Math.floor((lng - georaster.xmin) / georaster.pixelWidth);
  const row = Math.floor((georaster.ymax - lat) / Math.abs(georaster.pixelHeight));

  if (
    row < 0 ||
    col < 0 ||
    row >= georaster.height ||
    col >= georaster.width
  ) {
    return;
  }

  const pixelValue = georaster.values[0][row][col];

  // Pixel bounds
  const xmin = georaster.xmin + col * georaster.pixelWidth;
  const xmax = xmin + georaster.pixelWidth;
  const ymax = georaster.ymax - row * Math.abs(georaster.pixelHeight);
  const ymin = ymax - Math.abs(georaster.pixelHeight);

  const pixelBounds = [
    [ymin, xmin],
    [ymax, xmax],
  ];

  const map = mapRef.current;

  // remove old highlight
  if (pixelHighlightRef.current) {
    map.removeLayer(pixelHighlightRef.current);
  }

  // draw highlight
  const rect = L.rectangle(pixelBounds, {
    color: "red",
    weight: 2,
  }).addTo(map);

  pixelHighlightRef.current = rect;

  // ----------------------------
  // FORCE zoom to the pixel
  // ----------------------------
  const centerLat = (ymin + ymax) / 2;
  const centerLng = (xmin + xmax) / 2;

  map.setView([centerLat, centerLng], 14, { animate: true });

  // Popup
  L.popup()
    .setLatLng([centerLat, centerLng])
    .setContent(`<b>Pixel Value:</b> ${pixelValue}`)
    .openOn(map);
});

  }, []);

  // RESET MAP (remove raster)
  const removeRaster = () => window.location.reload();

  // -------------------------------------------
  // COLOR RAMPS (unchanged)
  // -------------------------------------------
  const wyRamp = (t) => {
    if (t < 0.33) {
      const f = t / 0.33;
      return { r: 0, g: f * 255, b: 255 - f * 255 };
    } else if (t < 0.66) {
      const f = (t - 0.33) / 0.33;
      return { r: f * 255, g: 255, b: 0 };
    } else {
      const f = (t - 0.66) / 0.34;
      return { r: 255, g: 255 - f * 255, b: 0 };
    }
  };

  const etRamp = (t) => {
    const stops = [
      [0.0, 0, 0, 4],
      [0.1, 28, 16, 68],
      [0.2, 79, 18, 123],
      [0.3, 129, 37, 129],
      [0.4, 181, 54, 122],
      [0.5, 229, 80, 100],
      [0.6, 251, 135, 77],
      [0.7, 254, 194, 63],
      [0.8, 254, 231, 92],
      [0.9, 252, 254, 164],
      [1.0, 253, 253, 253],
    ];
    for (let i = 0; i < stops.length - 1; i++) {
      const [t1, r1, g1, b1] = stops[i];
      const [t2, r2, g2, b2] = stops[i + 1];
      if (t >= t1 && t <= t2) {
        const f = (t - t1) / (t2 - t1);
        return {
          r: Math.round(r1 + f * (r2 - r1)),
          g: Math.round(g1 + f * (g2 - g1)),
          b: Math.round(b1 + f * (b2 - b1)),
        };
      }
    }
    return { r: 0, g: 0, b: 0 };
  };

  const rfRamp = (t) => {
    const stops = [
      [0.0, 68, 1, 84],
      [0.25, 59, 82, 139],
      [0.5, 33, 144, 141],
      [0.75, 94, 201, 97],
      [1.0, 253, 231, 37],
    ];
    for (let i = 0; i < stops.length - 1; i++) {
      const [t1, r1, g1, b1] = stops[i];
      const [t2, r2, g2, b2] = stops[i + 1];
      if (t >= t1 && t <= t2) {
        const f = (t - t1) / (t2 - t1);
        return {
          r: Math.round(r1 + f * (r2 - r1)),
          g: Math.round(g1 + f * (g2 - g1)),
          b: Math.round(b1 + f * (b2 - b1)),
        };
      }
    }
    return { r: 0, g: 0, b: 0 };
  };

  const createLegendGradient = (rampFn, steps = 14) => {
  const colors = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const { r, g, b } = rampFn(t);
    colors.push(`rgb(${r},${g},${b})`);
  }
  return `linear-gradient(to right, ${colors.join(",")})`;
};
 
  
  // -------------------------------------------
  // LOAD RASTER TIFF
  // -------------------------------------------
  const loadRaster = async () => {
    if (!selectedYear) return;

    setStatus(`Loading ${selectedYear}...`);
    setError("");

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const map = mapRef.current;

    const url = `/tiff/${layerType}/${selectedYear}.tif?cache=${Date.now()}`;

    try {
      const res = await fetch(url, { signal: controller.signal });
      const arrayBuffer = await res.arrayBuffer();
      const georaster = await parseGeoraster(arrayBuffer);

      georasterRef.current = georaster;

      const min = georaster.mins[0];
      const max = georaster.maxs[0];
      const range = max - min;

      const ramp =
        layerType === "wy" ? wyRamp : layerType === "et" ? etRamp : rfRamp;

      if (rasterRef.current) map.removeLayer(rasterRef.current);

      const layer = new GeoRasterLayer({
        georaster,
        opacity: 0.85,
        resolution: 256,
        pixelValuesToColorFn: (values) => {
          const val = values[0];
          if (val == null) return null;
          if (val === georaster.noDataValue || val === null || isNaN(val)) {
  return null;
}

let t = (val - min) / range;

// clamp t strictly between 0–1
t = Math.max(0, Math.min(1, t));

const { r, g, b } = ramp(t);
return `rgba(${r}, ${g}, ${b}, 0.85)`;

          
        },
      });

      layer.addTo(map);
      rasterRef.current = layer;

      map.fitBounds(layer.getBounds());

      // ---------------------------
      // UPDATE LEGEND
      // ---------------------------
      // ---------------------------
// UPDATE LEGEND (REAL RANGE)
// ---------------------------
if (map.legendControl) map.removeControl(map.legendControl);

const rampFn =
  layerType === "wy" ? wyRamp : layerType === "et" ? etRamp : rfRamp;

const legendGradient = createLegendGradient(rampFn);

const legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  const div = L.DomUtil.create("div", "legend");

  const title =
    layerType === "wy"
      ? "Water Yield"
      : layerType === "et"
      ? "ET"
      : "Rainfall";

  div.innerHTML = `
    <div style="
      background: white;
      padding: 10px 12px;
      border-radius: 6px;
      box-shadow: 0 0 6px rgba(0,0,0,0.3);
      font-size: 13px;
      min-width: 200px;
    ">
      <b>${title}</b>
      <div style="
        margin: 8px 0;
        width: 100%;
        height: 14px;
        background: ${legendGradient};
        border: 1px solid #ccc;
      "></div>
      <div style="display:flex; justify-content:space-between;">
        <span>${min.toFixed(2)}</span>
        <span>${max.toFixed(2)}</span>
      </div>
    </div>
  `;
  return div;
};

legend.addTo(map);
map.legendControl = legend;


      setStatus("");
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
      setStatus("");
    }
  };

  return (
    <div>
      <h3>Raster Viewer</h3>

      <div ref={containerRef} style={{ width: "100%", height: "500px" }} />

      {/* TYPE SELECT */}
      <select value={layerType} onChange={(e) => setLayerType(e.target.value)}>
        <option value="wy">Water Yield</option>
        <option value="et">ET</option>
        <option value="rainfall">Rainfall</option>
      </select>

      {/* YEAR SELECT */}
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        <option value="">Select Year</option>
        {years.map((y) => (
          <option key={y}>{y}</option>
        ))}
      </select>

      <button onClick={loadRaster}>Load Raster</button>
      <button onClick={removeRaster}>Remove Raster</button>

      {status && <p>{status}</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}
