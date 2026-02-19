import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function WaterAvailabilityHeatmap() {
  const [data, setData] = useState([]);
  const [maxValue, setMaxValue] = useState(10);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: "" });

  // Dimensions
  const chartWidth = 950;  
  const chartHeight = 600; 
  const margin = { top: 120, right: 150, bottom: 60, left: 100 }; 

  useEffect(() => {
    async function loadExcel() {
      try {
        const response = await fetch("monthly_wa_per_capita.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const formattedData = jsonData.map((row) => ({
          yr_csv: row["yr_csv"],
          mon_csv: row["mon_csv"],
          value: parseFloat(row["Water availability Per capita (m3/capita/yr)"] || 0),
        }));

        setData(formattedData);
        setMaxValue(Math.max(...formattedData.map((d) => d.value)));
        setLoading(false);
      } catch (err) {
        console.error("Excel Load Error:", err);
        setLoading(false);
      }
    }
    loadExcel();
  }, []);

  if (loading) return <div style={{color: "white", textAlign: "center", padding: "50px"}}>Loading Data...</div>;

  // Sorting
  const years = [...new Set(data.map((d) => d.yr_csv))].sort((a, b) => b - a); // 2021 top
  const months = [...new Set(data.map((d) => d.mon_csv))].sort((a, b) => a - b);

  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  const cellWidth = innerWidth / months.length;
  const cellHeight = innerHeight / years.length;

  // Aggregations
  const yearTotals = years.map(y => ({
    year: y,
    total: data.filter(d => d.yr_csv === y).reduce((sum, curr) => sum + curr.value, 0)
  }));
  const monthTotals = months.map(m => ({
    month: m,
    total: data.filter(d => d.mon_csv === m).reduce((sum, curr) => sum + curr.value, 0)
  }));

  const maxYearTotal = Math.max(...yearTotals.map(t => t.total));
  const maxMonthTotal = Math.max(...monthTotals.map(t => t.total));

  const showTooltip = (e, content) => {
    setTooltip({ visible: true, x: e.clientX, y: e.clientY, content });
  };

  return (
    <div style={{ backgroundColor: "#0f172a", padding: "30px", borderRadius: "12px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "white", textAlign: "center", marginBottom: "20px" }}>Water Availability Analysis</h2>
      
      <div style={{ position: "relative" }}>
        <svg width={chartWidth} height={chartHeight}>
          
          {/* 1. TOP BAR CHART (Column Totals) */}
          {monthTotals.map((m, idx) => {
            const barHeight = (m.total / maxMonthTotal) * (margin.top - 40);
            return (
              <rect
                key={`top-bar-${idx}`}
                x={margin.left + idx * cellWidth + 4}
                y={margin.top - 20 - barHeight}
                width={cellWidth - 8}
                height={barHeight}
                fill="#38bdf8"
                rx={2}
                style={{ cursor: "pointer", opacity: 0.8 }}
                onMouseEnter={(e) => showTooltip(e, `Month: ${m.month}\nTotal Annual Flow: ${m.total.toFixed(2)}`)}
                onMouseMove={(e) => showTooltip(e, `Month: ${m.month}\nTotal Annual Flow: ${m.total.toFixed(2)}`)}
                onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
              />
            );
          })}

          {/* 2. HEATMAP CELLS */}
          {data.map((d, idx) => {
            const xPos = margin.left + months.indexOf(d.mon_csv) * cellWidth;
            const yPos = margin.top + years.indexOf(d.yr_csv) * cellHeight;
            const intensity = Math.round((d.value / maxValue) * 255);
            return (
              <rect
                key={`cell-${idx}`}
                x={xPos + 1} y={yPos + 1}
                width={cellWidth - 2} height={cellHeight - 2}
                fill={`rgb(0, ${intensity}, 255)`}
                stroke="#1e293b"
                strokeWidth="0.5"
                rx={2}
                style={{ cursor: "crosshair" }}
                onMouseEnter={(e) => showTooltip(e, `Year: ${d.yr_csv}\nMonth: ${d.mon_csv}\nWater Availability: ${d.value} m³/capita/yr`)}
                onMouseMove={(e) => showTooltip(e, `Year: ${d.yr_csv}\nMonth: ${d.mon_csv}\nWater Availability: ${d.value} m³/capita/yr`)}
                onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
              />
            );
          })}

          {/* 3. RIGHT BAR CHART (Row Totals) */}
          {yearTotals.map((y, idx) => {
            const barWidth = (y.total / maxYearTotal) * (margin.right - 50);
            return (
              <rect
                key={`right-bar-${idx}`}
                x={chartWidth - margin.right + 10}
                y={margin.top + idx * cellHeight + 4}
                width={barWidth}
                height={cellHeight - 8}
                fill="#818cf8"
                rx={2}
                style={{ cursor: "pointer", opacity: 0.8 }}
                onMouseEnter={(e) => showTooltip(e, `Year: ${y.year}\nYearly Total: ${y.total.toFixed(2)}`)}
                onMouseMove={(e) => showTooltip(e, `Year: ${y.year}\nYearly Total: ${y.total.toFixed(2)}`)}
                onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
              />
            );
          })}

          {/* LABELS */}
          {months.map((month, idx) => (
            <text key={`xm-${idx}`} x={margin.left + idx * cellWidth + cellWidth/2} y={chartHeight - margin.bottom + 25} textAnchor="middle" fill="#94a3b8" fontSize="12">{month}</text>
          ))}
          {years.map((year, idx) => (
            <text key={`yr-${idx}`} x={margin.left - 15} y={margin.top + idx * cellHeight + cellHeight/2} textAnchor="end" alignmentBaseline="middle" fill="#94a3b8" fontSize="12">{year}</text>
          ))}
          <text x={margin.left + innerWidth/2} y={chartHeight - 10} fill="#64748b" fontSize="14" textAnchor="middle">Months</text>
        </svg>

        {/* TOOLTIP */}
        {tooltip.visible && (
          <div style={{
            position: "fixed",
            left: tooltip.x + 15,
            top: tooltip.y + 15,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            color: "white",
            padding: "10px",
            borderRadius: "6px",
            fontSize: "13px",
            whiteSpace: "pre-line",
            pointerEvents: "none",
            border: "1px solid #334155",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            zIndex: 100
          }}>
            {tooltip.content}
          </div>
        )}
      </div>

      {/* LEGEND */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
        <div style={{ width: "300px", height: "14px", background: "linear-gradient(to right, rgb(0,0,255), rgb(0,255,255))", borderRadius: "7px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", width: "310px", color: "#94a3b8", fontSize: "11px", marginTop: "8px" }}>
          <span>Low (0.00)</span>
          <span>Mid ({(maxValue/2).toFixed(1)})</span>
          <span>High ({maxValue.toFixed(1)} m³/capita)</span>
        </div>
      </div>
    </div>
  );
}