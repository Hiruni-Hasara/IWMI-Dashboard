import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/Sections/Hero";
import Contact from "./Components/Sections/Contact";
import ShapefileMap from "./Components/Maps/ShapefileMap";
import RastermapWY from "./Components/Maps/Rastermap-wy";
import Wateravailablecharts from "./Components/Charts/wateravailablecharts";

import "./Components/Sections/Sections.css";
import "./Components/Animations/NatureAnimations.css";  // ← Add animation CSS here
import "./index.css";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ---------- HOME PAGE ----------- */}
        <Route
          path="/"
          element={
            <>
              
              <Hero />
              <RastermapWY/>
              
              <Wateravailablecharts/>
              <Contact />
            </>
          }
        />

        {/* ---------- SHAPEFILE MAP PAGE ---------- */}
        <Route path="/shapefile" element={<ShapefileMap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
