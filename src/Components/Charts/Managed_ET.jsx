import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const styles = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "30px",
    padding: "20px",
    background: "#0b0f19",
    minHeight: "50vh",
  },
  card: {
    background: "#141a28",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 4px 25px rgba(0,0,0,0.35)",
    border: "1px solid #1f2937",
  },
  title: {
    margin: "0 0 12px 0",
    fontSize: "18px",
    fontWeight: 600,
    color: "#e5e7eb",
  },
  tooltip: {
    backgroundColor: "#1f2937",
    border: "1px solid #4b5563",
    borderRadius: "8px",
    padding: "10px",
    color: "#e5e7eb",
    fontWeight: 500,
  },
};

export default function ManagedETChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExcel() {
      try {
        const response = await fetch("/Managed_ET.xlsx"); // your Excel file path
        const arrayBuffer = await response.arrayBuffer();

        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Adjust column name based on your Excel
        const formattedData = jsonData.map((row) => ({
          Years: row["Years"],
          ET: parseFloat(row["Managed ET fraction (%)"]),
        }));

        setData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Excel Load Error:", err);
        setLoading(false);
      }
    }

    loadExcel();
  }, []);

  if (loading) {
    return <div style={{ padding: 20, color: "white" }}>Loading charts...</div>;
  }

  if (!data || data.length === 0) {
    return <div style={{ padding: 20, color: "white" }}>No data found.</div>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h3 style={styles.title}>Managed ET Fraction (%)</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />

            <XAxis dataKey="Years" stroke="#9ca3af" />

            <YAxis
              stroke="#9ca3af"
              domain={[0, 10]} // adjust according to your data range
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
              contentStyle={styles.tooltip}
              labelStyle={{ color: "#93c5fd" }}
              formatter={(value) => `${value}%`}
            />

            <Line
              type="monotone"
              dataKey="ET"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: "#f59e0b", r: 4 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
