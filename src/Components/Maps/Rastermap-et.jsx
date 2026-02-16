import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";

export default function ETMap() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const rasterRef = useRef(null);
  const abortControllerRef = useRef(null);

  const [selectedYear, setSelectedYear] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const years = Array.from({ length: 18 }, (_, i) => 2004 + i);

  // ------------------------------------------------
  // Initialize Map
  // ------------------------------------------------
  useEffect(() => {
    if (mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [10, -2],
      zoom: 6,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    mapRef.current = map;
  }, []);

  const removeRaster = () => window.location.reload();

  // ------------------------------------------------
  // MAGMA COLOR RAMP
  // ------------------------------------------------
  const magmaRamp = (t) => {
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

  // ------------------------------------------------
  // Load Raster
  // ------------------------------------------------
  const loadRaster = async () => {
    if (!selectedYear) return;

    setStatus(`Loading ${selectedYear}...`);
    setError("");

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const map = mapRef.current;
    const url = `/tiff/et/${selectedYear}.tif?cache=${Date.now()}`;

    try {
      const res = await fetch(url, { signal: controller.signal });
      const arrayBuffer = await res.arrayBuffer();
      const georaster = await parseGeoraster(arrayBuffer);

      const min = georaster.mins[0];
      const max = georaster.maxs[0];
      const range = max - min;

      const layer = new GeoRasterLayer({
        georaster,
        opacity: 0.9,
        resolution: 256,
        pixelValuesToColorFn: (values) => {
          const val = values[0];
          if (val == null) return null;

          const t = (val - min) / range;
          const { r, g, b } = magmaRamp(t);

          return `rgba(${r}, ${g}, ${b}, 0.9)`;
        },
      });

      layer.addTo(map);
      rasterRef.current = layer;

      map.fitBounds(layer.getBounds());

      // ------------------------------------------------
      // LEGEND (Magma)
      // ------------------------------------------------
      if (map.legendControl) map.removeControl(map.legendControl);

      const legend = L.control({ position: "bottomright" });
      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "legend");
        div.innerHTML = `
          <div style="
            background:white;
            padding:10px;
            border-radius:8px;
            box-shadow:0 0 6px rgba(0,0,0,0.3);
            font-size:13px;
          ">
            <b>ET (Magma)</b><br>
            <div style="
              margin-top:6px;
              width:160px;
              height:15px;
              background: linear-gradient(to right,
                rgb(0,0,4),
                rgb(28,16,68),
                rgb(79,18,123),
                rgb(129,37,129),
                rgb(229,80,100),
                rgb(251,135,77),
                rgb(254,194,63),
                rgb(254,231,92),
                rgb(252,254,164),
                rgb(253,253,253)
              );
              border:1px solid #7a1212ff;
            "></div>
            <div style="display:flex; justify-content:space-between;">
              <span>Low</span>
              <span>High</span>
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
      <h3>ET Raster (Magma Color Ramp)</h3>

      <div ref={containerRef} style={{ width: "100%", height: "500px" }} />

      <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
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
