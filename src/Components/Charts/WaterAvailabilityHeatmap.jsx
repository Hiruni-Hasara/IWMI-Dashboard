import { useState, useCallback } from "react";

// ─── High-Vibrancy Colour Scale ──────────────────────────────────
function getColor(value, min, max, alpha = 1) {
  if (max === min) return `rgba(200, 255, 240, ${alpha})`;
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  let r, g, b;
  if (t < 0.5) {
    const s = t / 0.5;
    // Bright Mint to Electric Teal
    r = Math.round(140 + s * (0 - 140));
    g = Math.round(255 + s * (240 - 255));
    b = Math.round(210 + s * (255 - 210));
  } else {
    const s = (t - 0.5) / 0.5;
    // Electric Teal to Deep Vivid Blue
    r = Math.round(0 + s * (30 - 0));
    g = Math.round(240 + s * (100 - 240));
    b = Math.round(255 + s * (255 - 255));
  }
  return alpha < 1 ? `rgba(${r},${g},${b},${alpha})` : `rgb(${r},${g},${b})`;
}

// FORCE ALL CELL LABELS TO BLACK
function getTextColor() { return "#000000"; }

// ─── CSV Parser ───────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split("\n").filter(l => l.trim());
  const rows = lines.slice(1).map(line => {
    const p = line.split(",").map(s => s.trim());
    return { year: +p[0], month: +p[1], value: +p[2] };
  }).filter(r => !isNaN(r.year) && !isNaN(r.month) && !isNaN(r.value));

  const years  = [...new Set(rows.map(r => r.year))].sort((a,b)=>a-b);
  const months = [...new Set(rows.map(r => r.month))].sort((a,b)=>a-b);
  const dataMap = {};
  rows.forEach(({ year, month, value }) => {
    if (!dataMap[year]) dataMap[year] = {};
    dataMap[year][month] = value;
  });
  const colAvgs = {}, rowAvgs = {};
  months.forEach(m => {
    const v = years.map(y => dataMap[y]?.[m]).filter(x=>x!==undefined);
    colAvgs[m] = v.reduce((a,x)=>a+x,0)/v.length;
  });
  years.forEach(y => {
    const v = months.map(m => dataMap[y]?.[m]).filter(x=>x!==undefined);
    rowAvgs[y] = v.reduce((a,x)=>a+x,0)/v.length;
  });
  const allVals = rows.map(r => r.value);
  return { years, months, dataMap, colAvgs, rowAvgs,
    globalMin: Math.min(...allVals), globalMax: Math.max(...allVals) };
}

const ML = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const FONT = "'Segoe UI Variable','Segoe UI',sans-serif";

const DEMO = `yr_csv,mon_csv,value
2016,1,2.98
2016,2,3.70
2016,3,3.90
2016,4,4.25
2016,5,4.33
2016,6,4.84
2016,7,5.39
2016,8,5.47
2016,9,5.27
2016,10,4.38
2016,11,3.25
2016,12,3.00
2017,1,2.57
2017,2,4.10
2017,3,4.04
2017,4,4.55
2017,5,4.42
2017,6,4.22
2017,7,4.35
2017,8,4.40
2017,9,5.65
2017,10,4.88
2017,11,4.11
2017,12,3.86
2018,1,2.61
2018,2,2.53
2018,3,3.98
2018,4,3.72
2018,5,4.20
2018,6,4.10
2018,7,4.48
2018,8,4.51
2018,9,4.35
2018,10,3.73
2018,11,3.25
2018,12,2.90
2019,1,3.10
2019,2,3.85
2019,3,4.20
2019,4,4.90
2019,5,5.10
2019,6,5.30
2019,7,5.60
2019,8,5.80
2019,9,5.40
2019,10,4.70
2019,11,3.90
2019,12,3.20
2020,1,2.80
2020,2,3.10
2020,3,3.60
2020,4,3.90
2020,5,4.10
2020,6,4.50
2020,7,4.80
2020,8,4.90
2020,9,4.60
2020,10,4.00
2020,11,3.30
2020,12,2.75
2021,1,2.65
2021,2,3.20
2021,3,3.75
2021,4,4.10
2021,5,4.45
2021,6,4.70
2021,7,5.00
2021,8,5.20
2021,9,4.85
2021,10,4.15
2021,11,3.40
2021,12,2.90`;

// ─── Sub-Components ───────────────────────────────────────────────
function Sparkline({ values, color, width = 180, height = 40 }) {
  if (!values || values.length < 2) return null;
  const min = Math.min(...values), max = Math.max(...values);
  const pad = 4;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / (max - min || 1)) * (height - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}

function RichTooltip({ tip, globalMin, globalMax }) {
  if (!tip) return null;
  const color = getColor(tip.value, globalMin, globalMax);
  return (
    <div style={{
      position: "fixed", left: tip.x + 16, top: tip.y - 70,
      background: "#1e293b", borderRadius: 12, padding: "12px 16px",
      pointerEvents: "none", zIndex: 9999, border: `2px solid ${color}`,
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)", fontFamily: FONT,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>{ML[tip.month]} {tip.year}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{tip.value.toFixed(2)}</div>
    </div>
  );
}

function StatsPanel({ selection }) {
  if (!selection) return <div style={{ color: "#475569", fontSize: 12 }}>Select a cell...</div>;
  const { label, values, color } = selection;
  const avg = values.reduce((a, v) => a + v, 0) / values.length;
  return (
    <div style={{ background: "#111827", padding: 15, borderRadius: 12, border: `1px solid ${color}` }}>
      <div style={{ color: "#fff", fontWeight: 700, marginBottom: 10 }}>Analysis: {label}</div>
      <Sparkline values={values} color={color} width={170} height={40} />
      <div style={{ fontSize: 18, fontWeight: 800, color: color, marginTop: 10 }}>AVG: {avg.toFixed(2)}</div>
    </div>
  );
}

// ─── Main Heatmap Component ──────────────────────────────────────
export default function WaterAvailabilityHeatmap() {
  const [data, setData] = useState(() => parseCSV(DEMO));
  const [tooltip, setTip] = useState(null);
  const [hoverYear, setHoverY] = useState(null);
  const [hoverMonth, setHoverM] = useState(null);
  const [locked, setLocked] = useState(null);
  const [selection, setSelection] = useState(null);

  const { years, months, dataMap, colAvgs, rowAvgs, globalMin, globalMax } = data;
  const maxColAvg = Math.max(...Object.values(colAvgs));

  const handleCellClick = (year, month, value) => {
    setLocked({ key: `${year}-${month}` });
    const rowVals = months.map(m => dataMap[year]?.[m] ?? 0);
    setSelection({ label: year, values: rowVals, color: getColor(value, globalMin, globalMax) });
  };

  const handleMonthClick = (m) => {
    setLocked({ key: `m-${m}` });
    const vals = years.map(y => dataMap[y]?.[m] ?? 0);
    setSelection({ label: ML[m], values: vals, color: getColor(colAvgs[m], globalMin, globalMax) });
  };

  const isColHl = (m) => hoverMonth === m || locked?.key === `m-${m}`;
  const isRowHl = (y) => hoverYear === y;

  return (
    <>
      <style>{`
        @keyframes barRise { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .hm-bar { transform-origin: bottom; animation: barRise 0.6s ease-out; transition: all 0.3s ease; }
        .hm-cell { transition: all 0.2s ease; cursor: pointer; }
        .hm-cell:hover { transform: scale(1.1); z-index: 10; filter: saturate(1.5) brightness(1.2) !important; }
      `}</style>

      <div style={{ background: "#0d1322", padding: "30px", borderRadius: "20px", fontFamily: FONT, width: "100%", boxSizing: "border-box" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 25 }}>
          <div style={{ color: "#fff", fontSize: 24, fontWeight: 800 }}>Water Availability Monitor</div>
          <div style={{ color: "#64748b", fontSize: 13 }}>Spatio-temporal analysis of water resources</div>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            
            {/* Top Bar Chart Section */}
            <div style={{ display: "flex", height: 200, alignItems: "flex-end", gap: "6px", marginBottom: 15 }}>
              <div style={{ width: 50 }} />
              {months.map((m) => {
                const avg = colAvgs[m];
                const hl = isColHl(m);
                const col = getColor(avg, globalMin, globalMax);
                const barH = (avg / maxColAvg) * 160;
                
                return (
                  <div key={m} onClick={() => handleMonthClick(m)} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", cursor: "pointer" }}>
                    <div style={{ textAlign: "center", fontSize: 11, fontWeight: 800, color: hl ? "#fff" : col, marginBottom: 5 }}>{avg.toFixed(1)}</div>
                    <div className="hm-bar" style={{
                      height: barH, width: "100%",
                      background: hl ? `linear-gradient(0deg, ${col} 0%, #fff 200%)` : col,
                      borderRadius: "6px 6px 2px 2px",
                      position: "relative",
                      filter: hl ? `drop-shadow(0 0 10px ${col}) drop-shadow(0 0 20px ${col})` : "none",
                    }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.6)", borderRadius: "6px 6px 0 0" }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ width: 100 }} />
            </div>

            {/* X-Axis Labels */}
            <div style={{ display: "flex", marginBottom: 10 }}>
              <div style={{ width: 50 }} />
              {months.map(m => (
                <div key={m} style={{ flex: 1, textAlign: "center", color: isColHl(m) ? "#38bdf8" : "#475569", fontSize: 12, fontWeight: 800 }}>{ML[m]}</div>
              ))}
              <div style={{ width: 100 }} />
            </div>

            {/* Heatmap Grid */}
            {years.map((y) => (
              <div key={y} style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                <div onMouseEnter={() => setHoverY(y)} onMouseLeave={() => setHoverY(null)} 
                     style={{ width: 50, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 10, color: isRowHl(y) ? "#38bdf8" : "#475569", fontSize: 12, fontWeight: 700 }}>{y}</div>
                
                <div style={{ flex: 1, display: "flex", gap: "4px" }}>
                  {months.map(m => {
                    const val = dataMap[y]?.[m] ?? 0;
                    const col = getColor(val, globalMin, globalMax);
                    const isCellHl = isColHl(m) || isRowHl(y);
                    return (
                      <div key={m} className="hm-cell"
                        onClick={() => handleCellClick(y, m, val)}
                        onMouseEnter={(e) => { setHoverM(m); setHoverY(y); setTip({ x: e.clientX, y: e.clientY, value: val, year: y, month: m }); }}
                        onMouseLeave={() => { setHoverM(null); setHoverY(null); setTip(null); }}
                        style={{
                          flex: 1, height: 45, background: col, borderRadius: 4,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, fontWeight: 800, 
                          color: "#000000", // FORCE BLACK LABELS INSIDE
                          filter: isCellHl ? "brightness(1.1) saturate(1.2)" : "brightness(1)",
                          boxShadow: isCellHl ? `0 0 15px ${col}88` : "none",
                          outline: locked?.key === `${y}-${m}` ? "2px solid #fff" : "none"
                        }}>{val.toFixed(1)}</div>
                    );
                  })}
                </div>

                {/* Row Averages */}
                <div style={{ width: 100, display: "flex", alignItems: "center", paddingLeft: 10, gap: 8 }}>
                  <div style={{ flex: 1, height: 10, background: "#1e293b", borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ width: `${(rowAvgs[y] / globalMax) * 100}%`, height: "100%", background: getColor(rowAvgs[y], globalMin, globalMax) }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: getColor(rowAvgs[y], globalMin, globalMax), width: 30 }}>{rowAvgs[y].toFixed(1)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div style={{ width: 200 }}>
            <div style={{ color: "#475569", fontSize: 10, fontWeight: 800, letterSpacing: "1px", marginBottom: 15 }}>INSPECTOR</div>
            <StatsPanel selection={selection} />
            
            <div style={{ marginTop: 25, padding: 15, background: "#111827", borderRadius: 12, border: "1px solid #1e293b" }}>
              <div style={{ color: "#64748b", fontSize: 10, marginBottom: 10 }}>VALUE SCALE</div>
              <div style={{ height: 10, borderRadius: 5, background: `linear-gradient(90deg, ${getColor(globalMin, globalMin, globalMax)}, ${getColor(globalMax, globalMin, globalMax)})` }} />
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: 10, marginTop: 5, fontWeight: 700 }}>
                <span>{globalMin.toFixed(1)}</span>
                <span>{globalMax.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RichTooltip tip={tooltip} globalMin={globalMin} globalMax={globalMax} />
    </>
  );
}