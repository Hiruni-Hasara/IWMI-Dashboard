import { useState } from "react";
import { Maximize2, Activity, Calendar, X } from "lucide-react";
import "./Waterbalance.css";

const importedImages = import.meta.glob(
  "../../assets/basin/*.{jpg,png,jpeg}",
  { eager: true }
);

export default function YearImageDisplay() {
  const yearImages = {};
  Object.keys(importedImages).forEach((filePath) => {
    const match = filePath.match(/(\d{4})\.(jpg|png|jpeg)$/);
    if (match) {
      const year = match[1];
      yearImages[year] = importedImages[filePath].default || importedImages[filePath];
    }
  });

  const availableYears = Object.keys(yearImages).sort();
  const [selectedYear, setSelectedYear] = useState(availableYears[0] || "2016");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="water-balance-card">

        {/* HEADER */}
        <div className="balance-header">
          <div className="balance-title-group">
            <Activity className="neon-pulse-icon" size={22} />
            <div>
              <h2 className="balance-main-title">Water Balance Analysis</h2>
              <p className="balance-subtitle">Basin-wide Precipitation vs Evapotranspiration</p>
            </div>
          </div>

          {/* YEAR PILLS */}
          <div className="year-pill-container">
            {availableYears.map((yr) => (
              <button
                key={yr}
                className={`year-pill ${selectedYear === yr ? "active" : ""}`}
                onClick={() => setSelectedYear(yr)}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* IMAGE AREA */}
        <div className="balance-image-container">
          {yearImages[selectedYear] ? (
            <div className="image-frame" onClick={() => setIsModalOpen(true)}>
              {/* Hover overlay — cyan bg, dark text/icon */}
              <div className="hover-overlay">
                <Maximize2 size={28} />
                <span>Expand Plot</span>
              </div>
              <img
                src={yearImages[selectedYear]}
                alt={`Water Balance ${selectedYear}`}
                className="balance-plot-img"
              />
              <div className="year-tag">{selectedYear} DATA</div>
            </div>
          ) : (
            <div className="balance-error">
              <Calendar size={48} opacity={0.3} />
              <p>No data available for {selectedYear}</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="balance-footer">
          <div className="stat-item">
            <span className="stat-label">Source</span>
            <span className="stat-value">MOD16 / CHIRPS</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Resolution</span>
            <span className="stat-value">500m</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Unit</span>
            <span className="stat-value">MCM</span>
          </div>
        </div>

      </section>

      {/* ── EXPAND MODAL ── */}
      {isModalOpen && (
        <div className="wb-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="wb-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="wb-modal-close" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            <span className="wb-modal-year-tag">{selectedYear} DATA</span>
            <img
              src={yearImages[selectedYear]}
              alt={`Water Balance ${selectedYear}`}
              className="wb-modal-img"
            />
          </div>
        </div>
      )}
    </>
  );
}