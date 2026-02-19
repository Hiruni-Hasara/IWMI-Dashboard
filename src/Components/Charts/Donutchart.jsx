import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Sector } from "recharts";
import * as XLSX from "xlsx";
import "../Sections/Sections.css"; // Ensure this path is correct!

// Custom 3D-effect active sector
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <filter id="dropshadow" height="130%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feOffset dx="2" dy="2" result="offsetblur"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.5"/></feComponentTransfer>
        <feMerge> <feMergeNode/> <feMergeNode in="SourceGraphic"/> </feMerge>
      </filter>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#f8fafc" style={{ fontSize: '16px', fontWeight: 'bold' }}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 15} textAnchor="middle" fill="#38bdf8" style={{ fontSize: '14px' }}>
        {`${value.toLocaleString()} km²`}
      </text>
      <Sector
        cx={cx} cy={cy} 
        innerRadius={innerRadius} 
        outerRadius={outerRadius + 10} 
        startAngle={startAngle} 
        endAngle={endAngle} 
        fill={fill}
        style={{ filter: "url(#dropshadow)" }}
      />
    </g>
  );
};

export default function DonutChart() {
  const [chartData, setChartData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    fetch("/data.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        setChartData(json.map(row => ({
          name: row.name || row.Name,
          value: Number(row.value || row.Value)
        })));
      })
      .catch((err) => console.error("Excel load error:", err));
  }, []);

  const COLORS = ["#38bdf8", "#818cf8", "#fbbf24", "#34d399", "#f87171"];
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  // This determines how far from the center the labels are placed
  const radius = outerRadius + 30; 
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="#cbd5e1" // Soft blue-grey for readability
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="12px"
      fontWeight="600"
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};
  return (
    <div className="performance-container">
      <div className="chart-header-glass">
        <h2 className="chart-title-modern">Land Usage (km²)</h2>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%" cy="50%"
              innerRadius="55%"  // Slightly smaller hole for balance
              outerRadius="75%"  // Reduced to 75% to prevent labels from being cut off
              paddingAngle={5}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              label={renderCustomizedLabel} // <--- Add this
              labelLine={{ stroke: '#334155', strokeWidth: 1 }} // <--- Connector lines
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: '#bad4fd', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}