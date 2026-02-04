"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((m) => m.Circle),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

export default function MapView() {
  const [city, setCity] = useState("Chennai");
  const [center, setCenter] = useState([13.0827, 80.2707]);
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchRisk(lat, lon, cityName) {
    setLoading(true);

    let weather = "clear";
    let trafficCongestion = 0;

    // 1️⃣ REAL-TIME TRAFFIC
    try {
      const trafficRes = await fetch("/api/traffic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon })
      });

      if (trafficRes.ok) {
        const t = await trafficRes.json();
        trafficCongestion = t.congestion ?? 0;
      }
    } catch {}

    // 2️⃣ REAL-TIME WEATHER
    try {
      const weatherRes = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon })
      });

      if (weatherRes.ok) {
        const w = await weatherRes.json();
        weather = w.weather || "clear";
      }
    } catch {}

    // 3️⃣ RISK ENGINE
    try {
      const riskRes = await fetch("/api/risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weather,
          trafficCongestion
        })
      });

      if (!riskRes.ok) {
        setLoading(false);
        return;
      }

      const result = await riskRes.json();
      setRiskData({ output: result });
    } catch {}

    setLoading(false);
  }

  async function handleCheck() {
    const input = city.trim();
    if (!input) return;

    const geoRes = await fetch("/api/geocode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: input })
    });

    if (!geoRes.ok) {
      const err = await geoRes.json();
      alert(err.error || "Invalid city");
      return;
    }

    const geo = await geoRes.json();
    setCenter([geo.lat, geo.lon]);

    fetchRisk(geo.lat, geo.lon, input);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleCheck();
  }

  useEffect(() => {
    handleCheck();
  }, []);

  const getColor = (lvl) => {
    if (lvl === "High") return "red";
    if (lvl === "Medium") return "orange";
    return "green";
  };

  return (
    <>
      <div style={{ marginBottom: "12px" }}>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter Indian city"
          style={{ padding: "6px", width: "220px" }}
        />
        <button
          onClick={handleCheck}
          style={{ marginLeft: "8px", padding: "6px 12px" }}
        >
          Check Risk
        </button>
      </div>

      {loading && <p>Fetching real-time data…</p>}

      <MapContainer
        key={center.join(",")}
        center={center}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {riskData?.output && (
          <Circle
            center={center}
            radius={1500}
            pathOptions={{
              color: getColor(riskData.output.riskLevel),
              fillOpacity: 0.4
            }}
          >
            <Popup>
              City: {city}
              <br />
              Risk Level: {riskData.output.riskLevel}
              <br />
              Risk Score: {riskData.output.riskScore}
            </Popup>
          </Circle>
        )}
      </MapContainer>
    </>
  );
}
