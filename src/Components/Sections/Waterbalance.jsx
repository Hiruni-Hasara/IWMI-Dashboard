import { useState } from "react";

// Auto-import all images inside /assets/basin folder
const importedImages = import.meta.glob(
  "../../assets/basin/*.{jpg,png,jpeg}",
  { eager: true }
);

export default function YearImageDisplay() {
  console.log("Loaded images:", importedImages);

  // Auto-create year:image map
  const yearImages = {};

  Object.keys(importedImages).forEach((filePath) => {
    const match = filePath.match(/(\d{4})\.(jpg|png|jpeg)$/); // extract year
    if (match) {
      const year = match[1];
      const img = importedImages[filePath].default || importedImages[filePath];
      yearImages[year] = img;
    }
  });

  const [selectedYear, setSelectedYear] = useState("2016");

  return (
    <section className="year-section">
      <h2 className="year-title">Basin Water Balance</h2>

      {/* Dropdown */}
      <select
        className="year-dropdown"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {Object.keys(yearImages).sort().map((yr) => (
          <option key={yr} value={yr}>
            {yr}
          </option>
        ))}
      </select>

      {/* Image */}
      <div className="year-image-wrapper">
        {yearImages[selectedYear] ? (
          <img
            src={yearImages[selectedYear]}
            alt={selectedYear}
            className="year-image"
          />
        ) : (
          <p className="year-error">Image not found for {selectedYear}</p>
        )}
      </div>
    </section>
  );
}
