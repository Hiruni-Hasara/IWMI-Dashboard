import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import shp from "shpjs";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function FitBounds({ geojson }) {
  const map = useMap();

  useEffect(() => {
    if (!geojson) return;

    const layer = L.geoJSON(geojson);
    map.fitBounds(layer.getBounds());
  }, [geojson, map]);

  return null;
}

const ShapefileMap = () => {
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    shp("/shapefiles/AZ_Increm_ET_Annual.zip")
      .then((geojson) => setGeojsonData(geojson))
      .catch((err) => console.error("Error loading shapefile:", err));
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[7.0, 80.0]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {geojsonData && (
          <>
            <GeoJSON data={geojsonData} />
            <FitBounds geojson={geojsonData} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default ShapefileMap;
