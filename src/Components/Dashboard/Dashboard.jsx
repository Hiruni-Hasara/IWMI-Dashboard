import React, { useState } from "react";
import { Calendar } from "lucide-react";

// Components
import About from "../Sections/About";
import BasinMap from "../Maps/BasinMap";
import Donutchart from "../Charts/Donutchart";
import Waterbalance from "../Sections/Waterbalance";
import WaterYield from "../Maps/water_yield";
import BasinInsights from "../Sections/BasinInsights";
import YearBar from "../Maps/YearBar";

// Assets
import HeroImage from "../../assets/Hero2.jpg";

// Styles
import "./dashboard.css";

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(2016);
  const years = [2016, 2017, 2018, 2019, 2020, 2021];

  return (
    <div className="dashboard-container">
      {/* ── CINEMATIC HERO BANNER ── */}
      <div
        className="dashboard-banner"
        style={{ backgroundImage: `url(${HeroImage})` }}
      >
        <div className="banner-glass-overlay">
          <div className="banner-content">
            <h1 className="main-banner-title">
              Water Accounting <span className="highlight-text">Dashboard</span>
            </h1>
            <div className="banner-divider"></div>
            <p className="banner-location">Amman Zarqa River Basin</p>
            
            <div className="banner-stats-mini">
              <div className="mini-stat">
                <span className="stat-dot active"></span>
                REAL-TIME SENSING
              </div>
              <div className="mini-stat">
                <span className="stat-dot"></span>
                SIWA+ INTEGRATED
              </div>
            </div>
          </div>
        </div>
        
        {/* Brand Logo Corner */}
        <div className="banner-logo-container">
           {/* Replace with your actual logo path */}
           <div className="iwmi-logo-placeholder">IWMI | Water Management Institute</div>
        </div>
      </div>

      <div className="dashboard-main-wrapper">
        
        {/* ── LEFT COLUMN: Static Context ── */}
        <div className="left-column">
          <div className="tile description-tile">
            <div className="tile-content scrollable">
              <About />
            </div>
          </div>

          <div className="tile map-tile">
            <div className="tile-content no-padding">
              <BasinMap />
            </div>
          </div>

          <div className="tile performance-tile">
            <div className="tile-content center-content">
              <Donutchart />
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Dynamic Data ── */}
        <div className="right-column">
          <YearBar 
            years={years} 
            selectedYear={selectedYear} 
            onYearChange={setSelectedYear} 
          />

          <BasinInsights selectedYear={selectedYear} />

          <div className="tile balance-tile">
            <div className="tile-content">
              <Waterbalance selectedYear={selectedYear} />
            </div>
          </div>

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