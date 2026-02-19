import React from "react";
import { Map, Users, Droplets, Thermometer, Database, CloudRain } from "lucide-react";
import "./BasinInsights.css";

const BasinInsights = ({ selectedYear }) => {
  const insightData = {
    2016: { area: "414,055", pop: "14.74 M", water: "1719.5", stress: "80", future: "2.6", precip: "816.3" },
    2017: { area: "414,055", pop: "14.95 M", water: "1680.2", stress: "82", future: "2.4", precip: "790.1" },
    2018: { area: "414,055", pop: "15.12 M", water: "1650.0", stress: "84", future: "2.2", precip: "805.5" },
    2019: { area: "414,055", pop: "15.30 M", water: "1620.4", stress: "85", future: "2.1", precip: "830.0" },
    2020: { area: "414,055", pop: "15.55 M", water: "1590.1", stress: "88", future: "1.9", precip: "770.8" },
    2021: { area: "414,055", pop: "15.80 M", water: "1550.8", stress: "90", future: "1.7", precip: "750.2" },
  };

  const current = insightData[selectedYear] || insightData[2016];

  const cards = [
    { icon: <Map size={24} />, title: "Basin Area", value: current.area, unit: "km²", color: "#38bdf8" },
    { icon: <Users size={24} />, title: "Population", value: current.pop, unit: "", color: "#60a5fa" },
    { icon: <Droplets size={24} />, title: "Per Capita", value: current.water, unit: "L/yr", color: "#00f2ff" },
    { icon: <Thermometer size={24} />, title: "Stress Level", value: current.stress, unit: "%", color: "#fb7185" },
    { icon: <Database size={24} />, title: "Future Water", value: current.future, unit: "BMC", color: "#c084fc" },
    { icon: <CloudRain size={24} />, title: "Annual Precip.", value: current.precip, unit: "MCM", color: "#22d3ee" },
  ];

  return (
    <div className="insights-grid-container">
      {cards.map((card, index) => (
        <div key={index} className="insight-glass-card" style={{ "--glow-color": card.color }}>
          <div className="card-glow-effect"></div>
          <div className="insight-card-header">
            <div className="icon-box" style={{ color: card.color }}>
              {card.icon}
            </div>
            <span className="insight-label">{card.title}</span>
          </div>
          <div className="insight-body">
            <h3 className="insight-val">{card.value}</h3>
            <span className="insight-unit">{card.unit}</span>
          </div>
          <div className="card-progress-bar">
            <div className="progress-fill" style={{ width: `${card.title === "Stress Level" ? current.stress : 100}%`, backgroundColor: card.color }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BasinInsights;