"use client";

import { useEffect, useState } from "react";

export default function Alerts() {
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

  return (
    <main style={{ padding: "20px" }}>
      <h2>Risk Alerts</h2>

      {data.riskLevel === "High" && (
        <div style={{ color: "red" }}>
          High accident risk detected. Avoid this area if possible.
        </div>
      )}

      {data.riskLevel === "Medium" && (
        <div style={{ color: "orange" }}>
          Moderate risk detected. Drive with caution.
        </div>
      )}

      {data.riskLevel === "Low" && (
        <div style={{ color: "green" }}>
          Low risk detected. Normal driving conditions.
        </div>
      )}
    </main>
  );
}
