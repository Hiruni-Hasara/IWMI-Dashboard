import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import * as XLSX from "xlsx";

export default function DonutChart() {
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0); // ⭐ Needed to calculate percentages

  useEffect(() => {
    fetch("/data.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        const formatted = json.map((row) => ({
          name: row.name || row.Name,
          value: Number(row.value || row.Value),
        }));

        const sum = formatted.reduce((a, b) => a + b.value, 0);

        setChartData(formatted);
        setTotal(sum);
      })
      .catch((err) => console.error("Excel load error:", err));
  }, []);

  const COLORS = ["#6560ccff", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  // ⭐ LABEL FORMATTER
  const renderLabel = (entry) => {
    const percent = ((entry.value / total) * 100).toFixed(1);
    return `${entry.name}: ${percent}%`;
  };

  // ⭐ TOOLTIP FORMATTER
  const tooltipFormatter = (value, name, props) => {
    const percent = ((value / total) * 100).toFixed(1);
    return [`${value} (${percent}%)`, name];
  };

  return (
    <div style={{ padding: "10px", width: "100%", height: "100%", overflow: "visible" }}>
      <h2 style={{ color: "#387fe9ff", marginBottom: "10px", textAlign: "center" }}>
        Land Usage
      </h2>

      {chartData.length > 0 ? (
        <div style={{ width: "100%", height: "320px", overflow: "visible" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                label={renderLabel}   // ⭐ Custom label with percentage
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip formatter={tooltipFormatter} /> {/* ⭐ Custom tooltip */}
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p style={{ color: "#ccc" }}>Loading data from Excel…</p>
      )}
    </div>
  );
}
