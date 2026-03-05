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
 // Fixed import path
import BeneficialETChart from "../Charts/BeneficialETChart";
import BasinClosureChart  from "../Charts/BasinClosureChart";
import FutureWaterAvailabilityChart from "../Charts/FutureWaterAvailabilityChart";
import NonConventionalRadialChart  from "../Charts/NonConventionalRadialChart";

import WaterAvailabilityHeatmap from "../Charts/WaterAvailabilityHeatmap";
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

    
      

{/* ── SECTION: WATER PERFORMANCE INDICATORS ── */}
<div style={{
  width: "100%",
  boxSizing: "border-box",
  background: "linear-gradient(135deg,#060d1a 0%,#0a1628 50%,#060d1a 100%)",
  borderTop: "1px solid rgba(45,212,191,0.1)",
  borderBottom: "1px solid rgba(45,212,191,0.1)",
  padding: "32px 24px 32px",
}}>
  {/* Section Header */}
  <div style={{ marginBottom: 24 }}>
    <div style={{
      width: 60, height: 3, borderRadius: 2,
      background: "linear-gradient(90deg,#2dd4bf,transparent)",
      marginBottom: 12,
    }}/>
    <h2 style={{
      fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em",
      background: "linear-gradient(90deg,#2dd4bf,#60a5fa,#c084fc)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      margin: "0 0 8px",
    }}>
      Water Performance Indicators
    </h2>
    
  </div>

  {/* ── Main Grid ── */}
  <div style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "auto auto auto",
    gap: 16,
    width: "100%",
    boxSizing: "border-box",
  }}>

    {/* LEFT col rows 1-2: Heatmap placeholder */}
    <div style={{
  gridColumn: "1/2",
  gridRow: "1/3",
  minWidth: 0,
  overflow: "hidden",
}}>
  <WaterAvailabilityHeatmap />
</div>
    {/* RIGHT col row 1: Non-Conventional Radial */}
    <div style={{ gridColumn: "2/3", gridRow: "1/2", minWidth: 0 }}>
      <NonConventionalRadialChart />
    </div>

    {/* RIGHT col row 2: ET pair */}
    <div style={{ gridColumn: "2/3", gridRow: "2/3", minWidth: 0 }}>
      <BeneficialETChart />
    </div>

    {/* LEFT col row 3: Basin Closure */}
    <div style={{ gridColumn: "1/2", gridRow: "3/4", minWidth: 0 }}>
      <BasinClosureChart />
    </div>

    {/* RIGHT col row 3: Future Water Availability */}
    <div style={{ gridColumn: "2/3", gridRow: "3/4", minWidth: 0 }}>
      <FutureWaterAvailabilityChart />
    </div>

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