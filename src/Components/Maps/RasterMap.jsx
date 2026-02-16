import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";

export default function RasterMap({ year, type }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  
  // CHANGED: We now use a LayerGroup to hold our raster.
  // This allows us to "clear" the group without needing to know exactly which layer is currently inside.
  const layerGroupRef = useRef(null);
  
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const abortControllerRef = useRef(null);

  // 1. Initialize Map & LayerGroup
  useEffect(() => {
    if (!containerRef.current) return;

    // Create Map
    const map = L.map(containerRef.current, {
      center: [7.87, 80.77],
      zoom: 7,
      zoomControl: true,
      // Helper to prevent some tile flickering during zoom
      fadeAnimation: false 
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    // Create a LayerGroup and add it to the map ONCE.
    // We will put all future rasters inside this group.
    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    mapRef.current = map;
    setMapReady(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Load Raster Data
  useEffect(() => {
    if (!mapReady || !mapRef.current || !layerGroupRef.current) return;

    // --- CRITICAL FIX: CLEAR LAYERS IMMEDIATELY ---
    // Instead of trying to remove a specific 'layerRef.current',
    // we simply tell the group to empty itself. This removes ALL previous rasters.
    layerGroupRef.current.clearLayers();

    // Abort previous fetches
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const loadRaster = async () => {
      setStatus(`Loading ${type} ${year}...`);
      setError(null);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const timestamp = Date.now();
        const url = `/tiff/${type}/${year}.tif?t=${timestamp}`;
        
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Final check before heavy processing
        if (controller.signal.aborted) return;
        
        const georaster = await parseGeoraster(arrayBuffer);

        const min = georaster.mins?.[0] ?? 0;
        const max = georaster.maxs?.[0] ?? 1000;
        const range = max - min;
        const typeKey = String(type).trim().toLowerCase();

        // Color Logic
        const getColor = (value) => {
           if (value === null || value === undefined || value === georaster.noDataValue) return null;
           const normalized = range > 0 ? (value - min) / range : 0;
           
           switch (typeKey) {
             case "rainfall": // Blue
               return `rgba(${Math.round(240 - normalized * 240)}, ${Math.round(240 - normalized * 100)}, 255, 0.8)`;
             case "et": // Red/Orange
               return `rgba(${Math.round(255)}, ${Math.round(200 - normalized * 200)}, ${Math.round(100 - normalized * 100)}, 0.8)`;
             case "wy": // Teal/Green
               return `rgba(${Math.round(50 + normalized * 50)}, ${Math.round(255 - normalized * 50)}, ${Math.round(255)}, 0.8)`;
             default:
               const g = Math.round(normalized * 255);
               return `rgba(${g}, ${g}, ${g}, 0.8)`;
           }
        };

        const layer = new GeoRasterLayer({
          georaster,
          opacity: 0.8,
          resolution: 128, // Optimized for performance
          pixelValuesToColorFn: (values) => {
             const val = Array.isArray(values) ? values[0] : values;
             return getColor(val);
          }
        });

        // Safety check again
        if (controller.signal.aborted) return;

        // --- THE FIX ---
        // 1. Clear again right before adding (just to be 100% sure nothing snuck in)
        layerGroupRef.current.clearLayers(); 
        
        // 2. Add the new layer to the GROUP, not the map directly
        layerGroupRef.current.addLayer(layer);
        
        // 3. Fit bounds
        mapRef.current.fitBounds(layer.getBounds());
        
        setStatus("");

      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(`Failed to load: ${err.message}`);
          setStatus("");
        }
      }
    };

    loadRaster();

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      // On unmount/change, clear the group again
      if (layerGroupRef.current) layerGroupRef.current.clearLayers();
    };
  }, [type, year, mapReady]);

  // Visual Legend Colors
  const getLegendColors = () => {
    const t = String(type).trim().toLowerCase();
    if (t === "rainfall") return ["#D6EAF8", "#5DADE2", "#2E86C1"];
    if (t === "et") return ["#FCF3CF", "#F39C12", "#CB4335"];
    if (t === "wy") return ["#D1F2EB", "#76D7C4", "#117864"];
    return ["#ccc", "#888", "#444"];
  };
  const legendColors = getLegendColors();

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {status && (
        <div style={{
            position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
            zIndex: 1000, background: "rgba(0,0,0,0.7)", color: "white", padding: "5px 15px", borderRadius: 4
        }}>
          {status}
        </div>
      )}
      
      {error && (
         <div style={{
            position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
            zIndex: 1000, background: "red", color: "white", padding: "5px 15px", borderRadius: 4
        }}>
          {error}
        </div>
      )}

      <div ref={containerRef} style={{ width: "100%", height: "100%", background: "#eee" }} />

      <div style={{
        position: "absolute", bottom: 20, right: 20, zIndex: 1000,
        background: "white", padding: 10, borderRadius: 5, boxShadow: "0 0 10px rgba(0,0,0,0.2)"
      }}>
        <h4 style={{ margin: "0 0 5px 0", textTransform: "capitalize" }}>{type} Intensity</h4>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
            <span>Low</span>
            <span>High</span>
        </div>
        <div style={{
            height: 10, width: 150, marginTop: 5,
            background: `linear-gradient(to right, ${legendColors[0]}, ${legendColors[1]}, ${legendColors[2]})`
        }} />
      </div>
    </div>
  );
}