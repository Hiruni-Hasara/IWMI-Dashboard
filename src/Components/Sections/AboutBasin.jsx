
import React from "react";
import "./Sections.css";

export default function AboutBasin() {
  return (
    <section id="aboutbasin" className="about-section">
      <h1 className="about-title">Amman–Zarqa Basin</h1>
      <p className="about-subtitle">Sustainable Water Insights for a Resilient Future</p>

      <div className="about-content">
        <p>
          This web-based dashboard was developed to enhance stakeholder engagement 
          and strengthen collaborative efforts in managing water resources within 
          the Amman–Zarqa Basin. The region faces increasing pressure from rapid 
          population growth, agricultural expansion, and rising demand for 
          irrigation—factors that contribute significantly to water scarcity 
          challenges.
        </p>

        <p>
          Understanding the basin’s water resource dynamics is essential to ensure 
          sustainable allocation and long-term resilience. To support this goal, the 
          dashboard integrates remote sensing technologies with the 
          <strong> Scale-Invariant Water Accounting (SIWA+)</strong> framework, 
          providing reliable, evidence-based insights into the current 
          state of water availability, use, and trends.
        </p>

        <p>
          These insights play a critical role in guiding informed, data-driven 
          water management decisions that promote sustainability, efficiency, and 
          equitable resource distribution across the basin.
        </p>
      </div>
    </section>
  );
}
