import React, { useState } from "react";
import { Info, Target, Cpu, ChevronRight, Zap } from "lucide-react";
import "./Sections.css";

export default function About() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="about-bento-box">
      {/* Animated Glow Border */}
      <div className="glow-overlay"></div>
      
      <div className="about-content-inner">
        <div className="about-top-row">
          <div className="status-badge">
            <span className="pulse-dot"></span>
            SIWA+ ACTIVE
          </div>
          <button 
            className="modern-expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Collapse" : "Explore"}
            <ChevronRight size={14} className={isExpanded ? "rotate-icon" : ""} />
          </button>
        </div>

        <h2 className="hero-text-sm">
          Amman–Zarqa <span className="neon-text">Basin Intelligence</span>
        </h2>

        <p className="description-text-compact">
          A high-precision dashboard synchronizing <strong>remote sensing</strong> 
          with the <strong>SIWA+ framework</strong> to resolve water scarcity 
          at the sub-basin level.
        </p>

        {/* This part only shows if expanded, keeping the initial height low */}
        {isExpanded && (
          <div className="tech-specs-reveal animate-in">
            <div className="spec-item">
              <Target size={14} className="text-cyan" />
              <span>500m Resolution Analysis</span>
            </div>
            <div className="spec-item">
              <Cpu size={14} className="text-purple" />
              <span>Cross-Scalar Water Accounting</span>
            </div>
          </div>
        )}

        <div className="about-footer-mini">
          <Zap size={12} />
          <span>Sustainability & Efficiency Optimization</span>
        </div>
      </div>
    </div>
  );
}