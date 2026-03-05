import { useState } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine, Area
} from "recharts";
import "./BeneficialETChart.css";

const RAW = [
  { year: 2016, et_incr: 329.8, landscape_et: 872.5 },
  { year: 2017, et_incr: 335.7, landscape_et: 890.7 },
  { year: 2018, et_incr: 364.4, landscape_et: 1009.4 },
  { year: 2019, et_incr: 427.4, landscape_et: 1101.3 },
  { year: 2020, et_incr: 314.3, landscape_et: 790.7 },
  { year: 2021, et_incr: 317.4, landscape_et: 858.0 },
];

const DATA = RAW.map(d => ({
  year: String(d.year),
  beneficial_et: +d.et_incr.toFixed(2),
  non_beneficial_et: +(d.landscape_et - d.et_incr).toFixed(2),
}));

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

const CustomTooltip = ({ active, payload, label, unit, color }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div className="bet-tooltip" style={{ borderColor: `${color}44`, boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 12px ${color}22` }}>
      <div className="bet-tooltip-year">Year {label}</div>
      <div className="bet-tooltip-value" style={{ color }}>
        {typeof val === "number" ? val.toFixed(2) : val}
        <span className="bet-tooltip-unit">{unit}</span>
      </div>
    </div>
  );
};

function SingleChart({ dataKey, title, desc, color, glow, unit }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const values = DATA.map(d => d[dataKey]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, v) => a + v, 0) / values.length;
  const yMin = Math.max(0, min * 0.9);
  const yMax = max * 1.08;

  return (
    <div className="bet-card" style={{ borderColor: `${color}22`, boxShadow: `0 0 30px ${color}0a, inset 0 1px 0 rgba(255,255,255,0.04)` }}>
      <div className="bet-card-accent" style={{ background: `radial-gradient(circle at top right, ${color}15, transparent 70%)` }} />
      <div className="bet-card-header">
        <div className="bet-card-title" style={{ color }}>{title}</div>
        <div className="bet-card-desc">{desc}</div>
      </div>
      <div className="bet-stats-row">
        {[["AVG", avg.toFixed(1)], ["MIN", min.toFixed(1)], ["MAX", max.toFixed(1)]].map(([lbl, val]) => (
          <div key={lbl} className="bet-stat">
            <div className="bet-stat-label">{lbl}</div>
            <div className="bet-stat-value">{val}<span className="bet-stat-unit">{unit}</span></div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={DATA} margin={{ top: 10, right: 8, left: -20, bottom: 0 }} onMouseLeave={() => setHoveredIdx(null)}>
          <defs>
            <linearGradient id={`areaGrad_${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" vertical={false} />
          <ReferenceLine y={avg} stroke={color} strokeDasharray="4 4" strokeOpacity={0.3} strokeWidth={1} />
          <XAxis dataKey="year" tick={{ fill: "#f7f7f7", fontSize: 12 }} axisLine={{ stroke: "rgba(99,102,241,0.1)" }} tickLine={false} />
          <YAxis domain={[yMin, yMax]} tick={{ fill: "#ffffff", fontSize: 12 }} axisLine={false} tickLine={false} tickCount={4} />
          <Tooltip content={<CustomTooltip unit={unit} color={color} />} cursor={false} />
          <Area type="monotone" dataKey={dataKey} fill={`url(#areaGrad_${dataKey})`} stroke="none" animationDuration={800} />
          <Bar dataKey={dataKey} barSize={24}
            shape={(props) => <LollipopBar {...props} fill={color} glow={glow} isHovered={hoveredIdx === props.index} />}
            onMouseEnter={(_, index) => setHoveredIdx(index)}
            animationDuration={900} animationEasing="ease-out"
          >
            {DATA.map((_, i) => (
              <Cell key={i} fill={color} opacity={hoveredIdx === null || hoveredIdx === i ? 1 : 0.4} />
            ))}
          </Bar>
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} strokeOpacity={0.35} dot={false} animationDuration={1000} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function BeneficialETChart() {
  return (
    <div className="bet-wrapper">
      <SingleChart
        dataKey="beneficial_et"
        title="Beneficial ET"
        desc="Incremental ET contributing to crop production"
        color="#2dd4bf"
        glow="rgba(45,212,191,0.4)"
        unit="mm"
      />
      <SingleChart
        dataKey="non_beneficial_et"
        title="Non-Beneficial ET"
        desc="Landscape ET minus beneficial ET"
        color="#c084fc"
        glow="rgba(192,132,252,0.4)"
        unit="mm"
      />
    </div>
  );
}
