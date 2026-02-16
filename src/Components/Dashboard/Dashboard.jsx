import React from "react";
import "./dashboard.css";
import LineChart from "../Charts/LineChart";
import MapView from "../Maps/MapView";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="cards-row">
        <div className="card">Total Users: 350</div>
        <div className="card">Active Projects: 12</div>
        <div className="card">Data Points: 15,200</div>
      </div>

      <div className="dashboard-content">
        <div className="chart-box">
          <LineChart />
        </div>

        <div className="map-box">
          <MapView />
        </div>
      </div>
    </div>
  );
}
