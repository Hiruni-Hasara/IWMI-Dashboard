import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Jan", value: 40 },
  { name: "Feb", value: 50 },
  { name: "Mar", value: 60 },
  { name: "Apr", value: 80 },
  { name: "May", value: 65 },
];

export default function Chart() {
  return (
    <LineChart width={500} height={300} data={data}>
      <Line type="monotone" dataKey="value" stroke="cyan" strokeWidth={3} />
      <CartesianGrid stroke="#444" />
      <XAxis dataKey="name" stroke="#ccc" />
      <YAxis stroke="#ccc" />
      <Tooltip />
    </LineChart>
  );
}
