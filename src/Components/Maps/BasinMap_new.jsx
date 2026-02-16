import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import shp from "shpjs";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./BasinMap.css";

export default function BasinMap() {
const [basinGeojson, setBasinGeojson] = useState(null);
const [riverGeojson, setRiverGeojson] = useState(null);
const mapRef = useRef(null);

// Load Basin shapefile
useEffect(() => {
shp("/shapefiles/AZ_Basin.zip")
.then((data) => setBasinGeojson(data))
.catch((err) => console.error("Basin loading error:", err));
}, []);

// Load River network shapefile
useEffect(() => {
shp("/shapefiles/River_Network.zip")
.then((data) => setRiverGeojson(data))
.catch((err) => console.error("River loading error:", err));
}, []);

// Auto zoom to basin when loaded
useEffect(() => {
if (basinGeojson && mapRef.current) {
const layer = L.geoJSON(basinGeojson);
mapRef.current.fitBounds(layer.getBounds());
}
}, [basinGeojson]);

return ( <div className="basin-map-container"> <h3 className="map-title"> <span>River Basin</span> </h3>

```
  <MapContainer
    ref={mapRef}
    center={[0, 0]}
    zoom={5}
    scrollWheelZoom={true}
    style={{ height: "100%", width: "100%" }}
  >
    <TileLayer
      url="https://tiles.stadiamaps.com/tiles/hillshade/{z}/{x}/{y}.png"
      opacity={0.6}
    />
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

    {/* Basin polygon */}
    {basinGeojson && (
      <GeoJSON
        data={basinGeojson}
        style={{
          color: "#0057ff",
          weight: 2,
          fillColor: "#4da6ff",
          fillOpacity: 0.25,
        }}
      />
    )}

    {/* River lines */}
    {riverGeojson && (
      <GeoJSON
        data={riverGeojson}
        style={{
          color: "#00bfff",
          weight: 2,
        }}
      />
    )}
  </MapContainer>
</div>
```

);
}
