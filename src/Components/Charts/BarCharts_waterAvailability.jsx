import { useState } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine, Area
} from "recharts";

// ── Dataset ───────────────────────────────────────────────────────
const RAW = [
  { year: 2016, P: 1169.0, ds: -36.2,  q_gross: 1208.2, net_inflow: 1171.9, landscape_et: 872.5,  land_et_t: 760.3, et_incr: 329.8, outflow: 81.9,  exploitable: 299.5, available: 299.5, non_rec: 44.8,  consumed: 1134.9, depleted: 1090.1, basin_closure: 87.6, water_avail: 37.1 },
  { year: 2017, P: 1264.4, ds: -107.4, q_gross: 1300.5, net_inflow: 1193.1, landscape_et: 890.7,  land_et_t: 776.2, et_incr: 335.7, outflow: 81.2,  exploitable: 302.4, available: 302.4, non_rec: 44.3,  consumed: 1156.2, depleted: 1111.9, basin_closure: 87.8, water_avail: 36.9 },
  { year: 2018, P: 1539.2, ds: -236.4, q_gross: 1572.7, net_inflow: 1336.3, landscape_et: 1009.4, land_et_t: 881.0, et_incr: 364.4, outflow: 91.0,  exploitable: 326.9, available: 326.9, non_rec: 52.2,  consumed: 1297.5, depleted: 1245.3, basin_closure: 88.1, water_avail: 38.8 },
  { year: 2019, P: 1563.2, ds: -152.9, q_gross: 1598.0, net_inflow: 1445.1, landscape_et: 1101.3, land_et_t: 935.0, et_incr: 427.4, outflow: 82.8,  exploitable: 343.9, available: 343.9, non_rec: 41.6,  consumed: 1404.0, depleted: 1362.3, basin_closure: 88.0, water_avail: 41.2 },
  { year: 2020, P: 1106.7, ds: -52.0,  q_gross: 1142.2, net_inflow: 1090.2, landscape_et: 790.7,  land_et_t: 685.8, et_incr: 314.3, outflow: 90.1,  exploitable: 299.5, available: 299.5, non_rec: 50.4,  consumed: 1050.5, depleted: 1000.1, basin_closure: 86.7, water_avail: 39.7 },
  { year: 2021, P: 1283.4, ds: -164.2, q_gross: 1319.8, net_inflow: 1155.6, landscape_et: 858.0,  land_et_t: 754.2, et_incr: 317.4, outflow: 84.0,  exploitable: 297.6, available: 297.6, non_rec: 45.6,  consumed: 1117.3, depleted: 1071.7, basin_closure: 87.1, water_avail: 38.4 },
];

// Derived indicators
const DATA = RAW.map(d => ({
  year: String(d.year),
  beneficial_et:   +d.et_incr.toFixed(2),
  non_beneficial_et: +(d.landscape_et - d.et_incr).toFixed(2),
  consumed_fraction: +(d.consumed / d.net_inflow * 100).toFixed(2),
  water_avail:     +d.water_avail.toFixed(2),
  dependence_nonconv: +(d.non_rec / d.net_inflow * 100).toFixed(2),
  basin_closure:   +d.basin_closure.toFixed(2),
}));

// ── Chart configs ─────────────────────────────────────────────────
const CHARTS = [
  {
    key:   "beneficial_et",
    title: "Beneficial ET",
    unit:  "mm",
    color: "#2dd4bf",
    glow:  "rgba(45,212,191,0.4)",
    desc:  "Incremental ET contributing to crop production",
  },
  {
    key:   "non_beneficial_et",
    title: "Non-Beneficial ET",
    unit:  "mm",
    color: "#c084fc",
    glow:  "rgba(192,132,252,0.4)",
    desc:  "Landscape ET minus beneficial ET",
  },
  {
    key:   "consumed_fraction",
    title: "Consumed Fraction",
    unit:  "%",
    color: "#f472b6",
    glow:  "rgba(244,114,182,0.4)",
    desc:  "Consumed water as % of net inflow",
  },
  {
    key:   "water_avail",
    title: "Water Availability",
    unit:  "MCM",
    color: "#60a5fa",
    glow:  "rgba(96,165,250,0.4)",
    desc:  "Water available for further use",
  },
  {
    key:   "dependence_nonconv",
    title: "Non-Conventional Sources",
    unit:  "%",
    color: "#fb923c",
    glow:  "rgba(251,146,60,0.4)",
    desc:  "Dependence on non-conventional sources",
  },
  {
    key:   "basin_closure",
    title: "Basin Closure",
    unit:  "%",
    color: "#4ade80",
    glow:  "rgba(74,222,128,0.4)",
    desc:  "Basin closure percentage",
  },
];

// ── Custom Lollipop: renders stem + circle via Bar + custom shape ─
const LollipopBar = (props) => {
  const { x, y, width, height, fill, glow, isHovered } = props;
  if (!height || height <= 0) return null;
  const cx = x + width / 2;
  const r  = isHovered ? 9 : 7;
  const stemW = isHovered ? 3 : 2;
  return (
    <g>
      {/* Glow under circle when hovered */}
      {isHovered && (
        <circle cx={cx} cy={y} r={16} fill={glow} opacity={0.5} />
      )}
      {/* Stem */}
      <rect
        x={cx - stemW / 2} y={y} width={stemW} height={height}
        fill={fill} opacity={isHovered ? 1 : 0.7} rx={1}
      />
      {/* Circle head */}
      <circle
        cx={cx} cy={y} r={r}
        fill={fill}
        stroke={isHovered ? "#0f172a" : "none"}
        strokeWidth={isHovered ? 2 : 0}
        filter={isHovered ? `drop-shadow(0 0 6px ${fill})` : undefined}
      />
    </g>
  );
};

// ── Custom Tooltip ────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, unit, color }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div style={{
      background: "rgba(15,23,42,0.92)",
      border: `1px solid ${color}44`,
      borderRadius: 10,
      padding: "10px 16px",
      backdropFilter: "blur(12px)",
      boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 12px ${color}22`,
      fontFamily: "'Segoe UI Variable','Segoe UI',sans-serif",
    }}>
      <div style={{ fontSize: 11, color: "#e0e0e0", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
        Year {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color, letterSpacing: "-0.02em" }}>
        {typeof val === "number" ? val.toFixed(2) : val}
        <span style={{ fontSize: 11, color: "#d3d5d8", fontWeight: 400, marginLeft: 4 }}>{unit}</span>
      </div>
    </div>
  );
};

// ── Single Chart Card ─────────────────────────────────────────────
function ChartCard({ cfg }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const min = Math.min(...DATA.map(d => d[cfg.key]));
  const max = Math.max(...DATA.map(d => d[cfg.key]));
  const avg = DATA.reduce((a, d) => a + d[cfg.key], 0) / DATA.length;
  const yMin = Math.max(0, min * 0.9);
  const yMax = max * 1.08;

  return (
    <div style={{
      background: "linear-gradient(145deg,rgba(15,23,42,0.95),rgba(15,23,42,0.8))",
      border: `1px solid ${cfg.color}22`,
      borderRadius: 16,
      padding: "20px 16px 12px",
      boxShadow: `0 0 30px ${cfg.color}0a, inset 0 1px 0 rgba(255,255,255,0.04)`,
      backdropFilter: "blur(16px)",
      transition: "box-shadow 0.3s",
      position: "relative",
      overflow: "hidden",
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 40px ${cfg.color}22, inset 0 1px 0 rgba(255,255,255,0.06)`}
    onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 30px ${cfg.color}0a, inset 0 1px 0 rgba(255,255,255,0.04)`}
    >
      {/* Subtle background accent */}
      <div style={{
        position:"absolute", top:0, right:0, width:80, height:80,
        background:`radial-gradient(circle at top right, ${cfg.color}15, transparent 70%)`,
        borderRadius:"0 16px 0 0", pointerEvents:"none",
      }}/>

      {/* Header */}
      <div style={{ marginBottom: 4 }}>
        <div style={{
          fontSize: 15, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", color: cfg.color, marginBottom: 2,
        }}>{cfg.title}</div>
        <div style={{ fontSize: 10, color: "#475569", lineHeight: 1.4 }}>{cfg.desc}</div>
      </div>

      {/* Stats row */}
      <div style={{ display:"flex", gap:16, marginBottom:10, marginTop:8 }}>
        {[["AVG", avg.toFixed(1)], ["MIN", min.toFixed(1)], ["MAX", max.toFixed(1)]].map(([lbl, val]) => (
          <div key={lbl}>
            <div style={{ fontSize:9, color:"#b7bdc5", letterSpacing:"0.08em" }}>{lbl}</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#94a3b8" }}>
              {val}<span style={{ fontSize:9, color:"#475569", marginLeft:2 }}>{cfg.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart
          data={DATA}
          margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id={`areaGrad_${cfg.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={cfg.color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={cfg.color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(99,102,241,0.08)"
            vertical={false}
          />

          {/* Average reference line */}
          <ReferenceLine
            y={avg}
            stroke={cfg.color}
            strokeDasharray="4 4"
            strokeOpacity={0.3}
            strokeWidth={1}
          />

          <XAxis
            dataKey="year"
            tick={{ fill: "#f7f7f7", fontSize: 12, fontFamily: "'Segoe UI Variable','Segoe UI',sans-serif" }}
            axisLine={{ stroke: "rgba(99,102,241,0.1)" }}
            tickLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fill: "#ffffff", fontSize: 12, fontFamily: "'Segoe UI Variable','Segoe UI',sans-serif" }}
            axisLine={false}
            tickLine={false}
            tickCount={4}
          />

          <Tooltip
            content={<CustomTooltip unit={cfg.unit} color={cfg.color} />}
            cursor={false}
          />

          {/* Area fill under the trend */}
          <Area
            type="monotone"
            dataKey={cfg.key}
            fill={`url(#areaGrad_${cfg.key})`}
            stroke="none"
            isAnimationActive={true}
            animationDuration={800}
          />

          {/* Lollipop bars */}
          <Bar
            dataKey={cfg.key}
            barSize={24}
            shape={(props) => {
              const idx = DATA.findIndex(d => d.year === props.year);
              return (
                <LollipopBar
                  {...props}
                  fill={cfg.color}
                  glow={cfg.glow}
                  isHovered={hoveredIdx === props.index}
                />
              );
            }}
            onMouseEnter={(_, index) => setHoveredIdx(index)}
            isAnimationActive={true}
            animationDuration={900}
            animationEasing="ease-out"
          >
            {DATA.map((_, i) => (
              <Cell
                key={i}
                fill={cfg.color}
                opacity={hoveredIdx === null || hoveredIdx === i ? 1 : 0.4}
              />
            ))}
          </Bar>

          {/* Connecting trend line */}
          <Line
            type="monotone"
            dataKey={cfg.key}
            stroke={cfg.color}
            strokeWidth={1.5}
            strokeOpacity={0.35}
            dot={false}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function WaterIndicators() {
  return (
    <div style={{
      fontFamily: "'Segoe UI Variable','Segoe UI',sans-serif",
      background: "linear-gradient(135deg,#060d1a 0%,#0a1628 50%,#060d1a 100%)",
      minHeight: "50vh",
      padding: "28px 24px 32px",
      minWidth: "100vh",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 28, textAlign: "center" }}>
        <div style={{
          fontSize: 20, fontWeight: 700, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "#475569", marginBottom: 6,
        }}>Irrigated Basin · 2016–2021</div>
        <div style={{
          fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em",
          background: "linear-gradient(90deg,#2dd4bf,#60a5fa,#c084fc)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Water Performance Indicators</div>
        <div style={{
          marginTop: 8, display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap",
        }}>
          {["ET Analysis", "Water Use Efficiency", "Basin Closure", "Availability"].map(tag => (
            <span key={tag} style={{
              fontSize: 15, color: "#9ca3ac", border: "1px solid rgba(99,102,241,0.15)",
              borderRadius: 20, padding: "2px 10px", letterSpacing: "0.04em",
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 16,
        maxWidth: 2000,
        margin: "0 auto",
      }}>
        {CHARTS.map(cfg => <ChartCard key={cfg.key} cfg={cfg} />)}
      </div>

      {/* Footer note */}
      <div style={{
        textAlign: "center", marginTop: 24,
        fontSize: 15, color: "#adbed8", letterSpacing: "0.06em",
      }}>
        Dashed line indicates period average · Hover over lollipops for details
      </div>
    </div>
  );
}