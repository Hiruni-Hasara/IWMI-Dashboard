import { useState } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine, Area
} from "recharts";
import "./BasinClosureChart.css";

const RAW = [
  { year: 2016, basin_closure: 87.6 },
  { year: 2017, basin_closure: 87.8 },
  { year: 2018, basin_closure: 88.1 },
  { year: 2019, basin_closure: 88.0 },
  { year: 2020, basin_closure: 86.7 },
  { year: 2021, basin_closure: 87.1 },
];

const DATA = RAW.map(d => ({
  year: String(d.year),
  basin_closure: +d.basin_closure.toFixed(2),
}));

const COLOR = "#4ade80";
const GLOW = "rgba(74,222,128,0.4)";

const LollipopBar = ({ x, y, width, height, fill, glow, isHovered }) => {
  if (!height || height <= 0) return null;
  const cx = x + width / 2;
  const r = isHovered ? 9 : 7;
  const stemW = isHovered ? 3 : 2;
  return (
    <g>
      {isHovered && <circle cx={cx} cy={y} r={16} fill={glow} opacity={0.5} />}
      <rect x={cx - stemW / 2} y={y} width={stemW} height={height} fill={fill} opacity={isHovered ? 1 : 0.7} rx={1} />
      <circle cx={cx} cy={y} r={r} fill={fill}
        stroke={isHovered ? "#0f172a" : "none"}
        strokeWidth={isHovered ? 2 : 0}
        filter={isHovered ? `drop-shadow(0 0 6px ${fill})` : undefined}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div className="bc-tooltip">
      <div className="bc-tooltip-year">Year {label}</div>
      <div className="bc-tooltip-value">
        {typeof val === "number" ? val.toFixed(2) : val}
        <span className="bc-tooltip-unit">%</span>
      </div>
    </div>
  );
};

export default function BasinClosureChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const values = DATA.map(d => d.basin_closure);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, v) => a + v, 0) / values.length;
  const yMin = Math.max(0, min * 0.98);
  const yMax = max * 1.02;

  return (
    <div className="bc-card">
      <div className="bc-card-accent" />
      <div className="bc-card-header">
        <div className="bc-card-title">Basin Closure</div>
        <div className="bc-card-desc">Basin closure percentage (utilized/available) 2016–2021</div>
      </div>
      <div className="bc-stats-row">
        {[["AVG", avg.toFixed(1)], ["MIN", min.toFixed(1)], ["MAX", max.toFixed(1)]].map(([lbl, val]) => (
          <div key={lbl} className="bc-stat">
            <div className="bc-stat-label">{lbl}</div>
            <div className="bc-stat-value">{val}<span className="bc-stat-unit">%</span></div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={DATA} margin={{ top: 10, right: 8, left: -20, bottom: 0 }} onMouseLeave={() => setHoveredIdx(null)}>
          <defs>
            <linearGradient id="bcAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLOR} stopOpacity={0.15} />
              <stop offset="100%" stopColor={COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" vertical={false} />
          <ReferenceLine y={avg} stroke={COLOR} strokeDasharray="4 4" strokeOpacity={0.3} strokeWidth={1} />
          <XAxis dataKey="year" tick={{ fill: "#f7f7f7", fontSize: 12 }} axisLine={{ stroke: "rgba(99,102,241,0.1)" }} tickLine={false} />
          <YAxis domain={[yMin, yMax]} tick={{ fill: "#ffffff", fontSize: 12 }} axisLine={false} tickLine={false} tickCount={4} />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Area type="monotone" dataKey="basin_closure" fill="url(#bcAreaGrad)" stroke="none" animationDuration={800} />
          <Bar dataKey="basin_closure" barSize={24}
            shape={(props) => <LollipopBar {...props} fill={COLOR} glow={GLOW} isHovered={hoveredIdx === props.index} />}
            onMouseEnter={(_, index) => setHoveredIdx(index)}
            animationDuration={900} animationEasing="ease-out"
          >
            {DATA.map((_, i) => (
              <Cell key={i} fill={COLOR} opacity={hoveredIdx === null || hoveredIdx === i ? 1 : 0.4} />
            ))}
          </Bar>
          <Line type="monotone" dataKey="basin_closure" stroke={COLOR} strokeWidth={1.5} strokeOpacity={0.35} dot={false} animationDuration={1000} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
