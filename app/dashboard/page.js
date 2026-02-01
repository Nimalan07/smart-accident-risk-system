"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weather: "rain",
          hour: new Date().getHours(),
          isWeekend: false,
          pastAccidents: 15
        })
      });

      const json = await res.json();
      setData(json.output);
    }

    load();
  }, []);

  if (!data) return null;

  const chartData = {
    labels: ["Risk Score"],
    datasets: [
      {
        label: data.riskLevel,
        data: [data.riskScore]
      }
    ]
  };

  return (
    <main style={{ padding: "20px" }}>
      <h2>Risk Analytics Dashboard</h2>
      <Bar data={chartData} />
    </main>
  );
}
