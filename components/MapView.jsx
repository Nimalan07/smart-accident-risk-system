"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import cities from "@/data/cities.json";

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

function ChangeView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !center) return;
    map.setView(center, 12);
  }, [center, map]);

  return null;
}

export default function MapView() {
  const [city, setCity] = useState("Chennai");
  const [center, setCenter] = useState([13.0827, 80.2707]);
  const [riskData, setRiskData] = useState(null);

  async function fetchRisk(lat, lon) {
    let weather = "clear";

    try {
      const weatherRes = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon })
      });

      if (weatherRes.ok) {
        const text = await weatherRes.text();
        if (text) {
          const weatherData = JSON.parse(text);
          weather = weatherData.weather || "clear";
        }
      }
    } catch {}

    try {
      const res = await fetch("/api/risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weather,
          hour: new Date().getHours(),
          isWeekend: false,
          lat,
          lng: lon
        })
      });

      if (!res.ok) return;

      const text = await res.text();
      if (!text) return;

      const data = JSON.parse(text);
      setRiskData(data);
    } catch {}
  }

  function handleCheck() {
    const input = city.trim().toLowerCase();

    const cityKey = Object.keys(cities).find(
      (c) => c.toLowerCase() === input
    );

    if (!cityKey) {
      alert("City not found in database");
      return;
    }

    const { lat, lon } = cities[cityKey];
    setCenter([lat, lon]);
    fetchRisk(lat, lon);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleCheck();
    }
  }

  useEffect(() => {
    handleCheck();
  }, []);

  const getColor = (level) => {
    if (level === "High") return "red";
    if (level === "Medium") return "orange";
    return "green";
  };

  return (
    <>
      <div style={{ marginBottom: "12px" }}>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter city name"
          style={{ padding: "6px" }}
        />
        <button
          onClick={handleCheck}
          style={{ marginLeft: "8px", padding: "6px 10px" }}
        >
          Check Risk
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
      >
        <ChangeView center={center} />

        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {riskData && (
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
