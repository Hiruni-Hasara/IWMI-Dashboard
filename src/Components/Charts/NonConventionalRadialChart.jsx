import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import "./NonConventionalRadialChart.css";

const RAW = [
  { year: 2016, non_rec: 44.8, net_inflow: 1171.9 },
  { year: 2017, non_rec: 44.3, net_inflow: 1193.1 },
  { year: 2018, non_rec: 52.2, net_inflow: 1336.3 },
  { year: 2019, non_rec: 41.6, net_inflow: 1445.1 },
  { year: 2020, non_rec: 50.4, net_inflow: 1090.2 },
  { year: 2021, non_rec: 45.6, net_inflow: 1155.6 },
];

// Dependence as %
const DATA = RAW.map(d => ({
  name: String(d.year),
  value: +(d.non_rec / d.net_inflow * 100).toFixed(2),
  fill: "", // set below
}));

// Assign colors per ring (outermost = most recent)
const RING_COLORS = ["#f97316", "#fb923c", "#fdba74", "#fcd34d", "#fbbf24", "#f59e0b"];
DATA.forEach((d, i) => { d.fill = RING_COLORS[i]; });

const avg = DATA.reduce((s, d) => s + d.value, 0) / DATA.length;
const min = Math.min(...DATA.map(d => d.value));
const max = Math.max(...DATA.map(d => d.value));

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0]?.payload || {};
  return (
    <div className="ncr-tooltip">
      <div className="ncr-tooltip-year">Year {name}</div>
      <div className="ncr-tooltip-value">
        {typeof value === "number" ? value.toFixed(2) : value}
        <span className="ncr-tooltip-unit">%</span>
      </div>
      <div className="ncr-tooltip-label">Dependence on non-conventional</div>
    </div>
  );
};

const CustomLegend = () => (
  <div className="ncr-legend">
    {DATA.map(d => (
      <div key={d.name} className="ncr-legend-item">
        <span className="ncr-legend-dot" style={{ background: d.fill }} />
        <span className="ncr-legend-year">{d.name}</span>
        <span className="ncr-legend-val" style={{ color: d.fill }}>{d.value}%</span>
      </div>
    ))}
  </div>
);

export default function NonConventionalRadialChart() {
  return (
    <div className="ncr-card">
      <div className="ncr-card-accent" />
      <div className="ncr-card-header">
        <div className="ncr-card-title">Non-Conventional Sources</div>
        <div className="ncr-card-desc">Dependence on non-conventional sources (%) from 2016 to 2021</div>
      </div>

      <div className="ncr-stats-row">
        {[["AVG", avg.toFixed(2)], ["MIN", min.toFixed(2)], ["MAX", max.toFixed(2)]].map(([lbl, val]) => (
          <div key={lbl} className="ncr-stat">
            <div className="ncr-stat-label">{lbl}</div>
            <div className="ncr-stat-value">{val}<span className="ncr-stat-unit">%</span></div>
          </div>
        ))}
      </div>

      <div className="ncr-chart-layout">
        <div className="ncr-radial-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="15%"
              outerRadius="90%"
              data={DATA}
              startAngle={180}
              endAngle={-180}
              barSize={14}
              barCategoryGap="8%"
            >
              <PolarAngleAxis type="number" domain={[0, max * 1.15]} tick={false} />
              <RadialBar
                dataKey="value"
                cornerRadius={6}
                background={{ fill: "rgba(255,255,255,0.03)", radius: 6 }}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="ncr-center-label">
            <div className="ncr-center-value">{avg.toFixed(2)}</div>
            <div className="ncr-center-sub">avg %</div>
          </div>
        </div>

        <CustomLegend />
      </div>
    </div>
  );
}
