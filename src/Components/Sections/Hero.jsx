import React, { useState } from "react";
import "./Sections.css";
import "./HeroInsights.css";

import BasinMap from "../Maps/BasinMap";
import WaterYield from "../Maps/water_yield";
//import RasterMap from "../Maps/RasterMap";
import About from './About'
import Donutchart from '../Charts/Donutchart'
import AboutBasin from "./AboutBasin";
import Waterbalance from './Waterbalance'

export default function Hero() {

  // ---------- STATE FOR DROPDOWNS ----------
  const [selectedType, setSelectedType] = useState("wy");
  const [selectedYear, setSelectedYear] = useState(2010);

  // ---------- AVAILABLE TYPES ----------
  const rasterTypes = [
    { id: "wy", label: "Water Yield" },
    { id: "et", label: "Evapotranspiration (ET)" },
    { id: "rainfall", label: "Rainfall" }
  ];

  // ---------- YEARS ----------
  const years = Array.from({ length: 20 }, (_, i) => 2004 + i);

  return (
    <>
      {/* HERO SECTION */}
      <section id="hero" className="section hero">
        <div className="overlay"></div>

        <div className="hero-content">
          <h1 className="hero-title">Welcome to the IWMI Water Accounting Platform</h1>
          <p className="hero-subtitle">Water • Data • Insights • Innovation</p>
          <a href="#aboutbasin" class="hero-btn">Explore Dashboard</a>

        </div>
      </section>
      <About />
      <AboutBasin/>
      
      {/* BASIN INSIGHTS */}
      <section className="insights-section">
        <h2 className="insights-heading">Basin Insights</h2>

        <div className="insights-grid">
          <div className="insight-card">
            <img src="/icons/map-blue.jpg" alt="Basin Area" />
            <p className="insight-title">Basin Area</p>
            <p className="insight-value">414,055 km²</p>
          </div>

          <div className="insight-card">
            <img src="/icons/people-blue.png" alt="Population" />
            <p className="insight-title">Population</p>
            <p className="insight-value">14.74 Million</p>
          </div>

          <div className="insight-card">
            <img src="/icons/water-drop-blue.png" alt="Water Availability" />
            <p className="insight-title">Per Capita Water Availability</p>
            <p className="insight-value">1719.5 L/person/day</p>
          </div>

          <div className="insight-card">
            <img src="/icons/plant-blue.png" alt="Environmental Stress" />
            <p className="insight-title">Environmental Water Stress</p>
            <p className="insight-value">80%</p>
          </div>

          <div className="insight-card">
            <img src="/icons/dam-blue.png" alt="Future Water" />
            <p className="insight-title">Water Availability for Future Use</p>
            <p className="insight-value">2.6 BMC</p>
          </div>
        </div>
      </section>



      <section className="hero-container">

      <div className="hero-row">


        <div className="hero-item">
          <Waterbalance />
        </div>

        <div className="hero-item">
          <Donutchart />
        </div>

      </div>

    </section>

      {/* MAP SECTIONS */}
<div
  className="map-row"
  style={{
    display: "flex",
    
    
    
  }}
>

  {/* Basin Map — 1/3 */}
  <section
    className="map-card"
    style={{
      flex: "1 1 33%",
      maxWidth: "33%"
    }}
  >
    <BasinMap />
  </section>

  {/* Water Yield Map — 1/3 */}
  <section
    className="map-card"
    style={{
      flex: "1 1 33%",
      maxWidth: "33%"
    }}
  >
    <WaterYield />
  </section>

  
</div>

    </>
  );
}
