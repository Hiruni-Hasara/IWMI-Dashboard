import React from "react";
import { Calendar } from "lucide-react";
import "./YearBar.css";

const YearBar = ({ years, selectedYear, onYearChange }) => {
  return (
    <div className="year-bar-container">
      <div className="year-bar-header">
        <Calendar size={16} className="year-icon" />
        <span className="year-label">Temporal Filter</span>
      </div>
      
      <div className="year-track">
        {years.map((year) => (
          <button
            key={year}
            className={`year-item ${selectedYear === year ? "active" : ""}`}
            onClick={() => onYearChange(year)}
          >
            <span className="year-text">{year}</span>
            {selectedYear === year && <div className="active-glow-dot" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default YearBar;