import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import "./FutureWaterAvailabilityChart.css";

// Historical data + projected future values
const DATA = [
  { year: "2016", available: 299.5, type: "historical" },
  { year: "2017", available: 302.4, type: "historical" },
  { year: "2018", available: 326.9, type: "historical" },
  { year: "2019", available: 343.9, type: "historical" },
  { year: "2020", available: 299.5, type: "historical" },
  { year: "2021", available: 297.6, type: "historical" },
  // Projected values (trend-based)
  { year: "2022", available: 310.2, type: "projected" },
  { year: "2023", available: 318.7, type: "projected" },
  { year: "2024", available: 305.4, type: "projected" },
  { year: "2025", available: 322.1, type: "projected" },
];

const ALL = DATA.map(d => ({ ...d, available: +d.available.toFixed(2) }));
const HIST = ALL.filter(d => d.type === "historical");
const PROJ = ALL.filter(d => d.type === "projected");

const avg = HIST.reduce((s, d) => s + d.available, 0) / HIST.length;
const min = Math.min(...ALL.map(d => d.available));
const max = Math.max(...ALL.map(d => d.available));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const isProj = DATA.find(d => d.year === label)?.type === "projected";
  return (
    <div className="fwa-tooltip">
      <div className="fwa-tooltip-year">
        {label} {isProj && <span className="fwa-tooltip-proj-badge">Projected</span>}
      </div>
      <div className="fwa-tooltip-value">
        {payload[0]?.value?.toFixed(2)}
        <span className="fwa-tooltip-unit">MCM</span>
      </div>
    </div>
  );
};

export default function FutureWaterAvailabilityChart() {
  return (
    <div className="fwa-card">
      <div className="fwa-card-accent" />
      <div className="fwa-header">
        <div>
          <div className="fwa-title">Future Water Availability</div>
          <div className="fwa-desc">Historical (2016–2021) &amp; projected (2022–2025) in MCM</div>
        </div>
        <div className="fwa-legend">
          <span className="fwa-legend-item fwa-legend-hist">
            <span className="fwa-legend-dot" style={{ background: "#60a5fa" }} /> Historical
          </span>
          <span className="fwa-legend-item fwa-legend-proj">
            <span className="fwa-legend-dot" style={{ background: "#f472b6" }} /> Projected
          </span>
        </div>
      </div>

      <div className="fwa-stats-row">
        {[["AVG (hist)", avg.toFixed(1)], ["MIN", min.toFixed(1)], ["MAX", max.toFixed(1)]].map(([lbl, val]) => (
          <div key={lbl} className="fwa-stat">
            <div className="fwa-stat-label">{lbl}</div>
            <div className="fwa-stat-value">{val}<span className="fwa-stat-unit">MCM</span></div>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={ALL} margin={{ top: 16, right: 12, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="fwaGradBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="fwaGradPink" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f472b6" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#f472b6" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" vertical={false} />

          {/* Divider between historical and projected */}
          <ReferenceLine x="2021" stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" strokeWidth={1.5} />

          {/* Avg line */}
          <ReferenceLine y={avg} stroke="#60a5fa" strokeDasharray="4 4" strokeOpacity={0.3} strokeWidth={1} />

          <XAxis dataKey="year" tick={{ fill: "#f7f7f7", fontSize: 12 }} axisLine={{ stroke: "rgba(99,102,241,0.1)" }} tickLine={false} />
          <YAxis domain={[min * 0.95, max * 1.06]} tick={{ fill: "#ffffff", fontSize: 12 }} axisLine={false} tickLine={false} tickCount={5} />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(96,165,250,0.2)", strokeWidth: 1 }} />

          {/* Render two separate areas using segmented approach via stroke + fill conditional */}
          <Area
            type="monotone"
            dataKey="available"
            stroke="#60a5fa"
            strokeWidth={2}
            fill="url(#fwaGradBlue)"
            dot={(props) => {
              const d = ALL[props.index];
              if (d?.type !== "historical") return <g key={props.key} />;
              return (
                <circle key={props.key} cx={props.cx} cy={props.cy} r={5}
                  fill="#60a5fa" stroke="#0f172a" strokeWidth={2}
                  filter="drop-shadow(0 0 4px #60a5fa)"
                />
              );
            }}
            activeDot={{ r: 8, fill: "#60a5fa", stroke: "#0f172a", strokeWidth: 2 }}
            animationDuration={1200}
          />

          {/* Projected overlay layer — dashed stroke */}
          <Area
            type="monotone"
            dataKey={(d) => d.type === "projected" ? d.available : null}
            stroke="#f472b6"
            strokeWidth={2}
            strokeDasharray="6 3"
            fill="url(#fwaGradPink)"
            dot={(props) => {
              if (props.value == null) return <g key={props.key} />;
              return (
                <circle key={props.key} cx={props.cx} cy={props.cy} r={5}
                  fill="#f472b6" stroke="#0f172a" strokeWidth={2}
                  filter="drop-shadow(0 0 4px #f472b6)"
                />
              );
            }}
            activeDot={{ r: 8, fill: "#f472b6", stroke: "#0f172a", strokeWidth: 2 }}
            animationDuration={1400}
            connectNulls={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="fwa-footer">Dashed line = period average · Vertical divider = forecast boundary</div>
    </div>
  );
}
