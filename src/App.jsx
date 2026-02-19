import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./Components/Navbar/Navbar";
import Contact from "./Components/Sections/Contact";
import Dashboard from "./Components/Dashboard/Dashboard"; 
import ShapefileMap from "./Components/Maps/ShapefileMap";

// Styles
import "./index.css";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/shapefile" element={<ShapefileMap />} />
      </Routes>
      {/* Contact is displayed at the bottom of all pages */}
      <Contact />
    </BrowserRouter>
  );
}

export default App;