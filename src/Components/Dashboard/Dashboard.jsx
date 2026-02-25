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
import MonthlyExplorerMap from "../Maps/Monthly_WA"; 
import SunburstWaterBalance from "../Charts/SunburstWaterBalance"; 
import BarCharts_waterAvailability from "../Charts/BarCharts_waterAvailability"; // Fixed import path

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
        
        <div className="banner-logo-container">
           <div className="iwmi-logo-placeholder">IWMI | Water Management Institute</div>
        </div>
      </div>

      <div className="dashboard-main-wrapper">
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

            {/* ── NEW SECTION: WATER AVAILABILITY BAR CHART ── */}
      <div className="dashboard-bottom-section right-aligned-section">
        <div className="section-header">
          <div className="header-line blue-line"></div>
          <h2 className="section-title">Amman-Zarqa Basin Water Availability</h2>
          <p className="section-subtitle">
            Annual water resource availability and trends for <span className="year-badge">{selectedYear}</span>
          </p>
        </div>
        <div className="full-width-chart-tile tall-chart">
          <BarCharts_waterAvailability selectedYear={selectedYear} />
        </div>
      </div>

      {/* ── SECTION: HIERARCHICAL WATER BALANCE (Sunburst) ── */}
      <div className="dashboard-bottom-section sunburst-bg">
        <div className="section-header">
          <div className="header-line purple-line"></div>
          <h2 className="section-title">Amman-Zarqa Basin Water Balance (km³/yr)</h2>
          <p className="section-subtitle">Categorized inflow and outflow distribution for <span className="year-badge">{selectedYear}</span></p>
        </div>
        <div className="full-width-chart-tile">
          <SunburstWaterBalance selectedYear={selectedYear} />
        </div>
      </div>

      {/* ── SECTION: SPATIAL ANALYSIS (Monthly Explorer) ── */}
      <div className="dashboard-bottom-section">
        <div className="section-header">
          <div className="header-line"></div>
          <h2 className="section-title">Spatial Water Variations</h2>
          <p className="section-subtitle">Detailed monthly variations across the Amman Zarqa Basin</p>
        </div>
        <div className="full-width-explorer-tile">
          <MonthlyExplorerMap selectedYear={selectedYear} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;