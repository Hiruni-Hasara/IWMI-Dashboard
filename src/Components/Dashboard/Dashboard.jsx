import React, { useState } from "react";
import { Calendar } from "lucide-react";

// Components
import About from "../Sections/About";
import BasinMap from "../Maps/BasinMap";
import Donutchart from "../Charts/Donutchart";
import Waterbalance from "../Sections/Waterbalance";
import WaterYield from "../Maps/water_yield";
import BasinInsights from "../Sections/BasinInsights";
import YearBar from "../Maps/YearBar"; // Imported separate component

// Assets
import HeroImage from "../../assets/Hero.jpg";

// Styles
import "./dashboard.css";

const Dashboard = () => {
  // State management for the global year filter
  const [selectedYear, setSelectedYear] = useState(2016);
  const years = [2016, 2017, 2018, 2019, 2020, 2021];

  return (
    <div className="dashboard-container">
      {/* ── HERO BANNER ── */}
      <div
        className="dashboard-banner"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${HeroImage})`,
        }}
      >
        <div className="banner-content">
          <h1 className="banner-title">
            Water Accounting Dashboard
            <span className="banner-subtitle">Amman Zarqa River Basin</span>
          </h1>
        </div>
      </div>

      <div className="dashboard-main-wrapper">
        
        {/* ── LEFT COLUMN: Static & Geographic Context ── */}
        <div className="left-column">
          {/* About Section Tile */}
          <div className="tile description-tile">
            <div className="tile-content scrollable">
              <About />
            </div>
          </div>

          {/* Static Basin Map Tile */}
          <div className="tile map-tile">
            <div className="tile-content no-padding">
              <BasinMap />
            </div>
          </div>

          {/* Land Usage Donut Chart Tile */}
          <div className="tile performance-tile">
            <div className="tile-content center-content">
              <Donutchart />
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Dynamic Yearly Data ── */}
        <div className="right-column">
          
          {/* SEPARATED YEAR BAR COMPONENT */}
          <YearBar 
            years={years} 
            selectedYear={selectedYear} 
            onYearChange={setSelectedYear} 
          />

          {/* BASIN INSIGHTS CARDS: Updates based on selectedYear */}
          <BasinInsights selectedYear={selectedYear} />

          {/* WATER BALANCE PLOTS: Displays images/plots for selectedYear */}
          <div className="tile balance-tile">
            <div className="tile-content">
              <Waterbalance selectedYear={selectedYear} />
            </div>
          </div>

          {/* WATER YIELD INTERACTIVE MAP: Re-renders on selectedYear change */}
          <div className="tile yield-tile">
            <div className="tile-content">
              <WaterYield selectedYear={selectedYear} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;