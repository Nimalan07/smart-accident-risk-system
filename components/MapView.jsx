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
const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
);

export default function MapView() {
  const [city, setCity] = useState("Chennai");
  const [center, setCenter] = useState(null);
  const [roads, setRoads] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🎯 SMART TRAFFIC LOGIC
  function calculateTraffic(road, centerLat, centerLon) {
    let base = 20;

    const type = road.tags?.highway || "";

    // 🚗 road importance
    if (type === "motorway") base += 60;
    else if (type === "trunk") base += 50;
    else if (type === "primary") base += 40;
    else if (type === "secondary") base += 30;

    // 📍 distance from city center
    if (road.geometry && road.geometry.length > 0) {
      const p = road.geometry[0];

      const dLat = p.lat - centerLat;
      const dLon = p.lon - centerLon;
      const distance = Math.sqrt(dLat * dLat + dLon * dLon);

      if (distance < 0.05) base += 30;   // city core
      else if (distance < 0.1) base += 15;
    }

    // 🎲 small randomness
    base += Math.random() * 10;

    return Math.min(100, Math.floor(base));
  }

  async function fetchRoads(bbox, centerLat, centerLon) {
    setLoading(true);

    try {
      const res = await fetch("/api/roads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bbox })
      });

      const data = await res.json();

      const roadsWithTraffic = data.roads.map((r) => ({
        ...r,
        traffic: calculateTraffic(r, centerLat, centerLon)
      }));

      setRoads(roadsWithTraffic);
    } catch {
      setRoads([]);
    }

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
      alert("Invalid city");
      return;
    }

    const geo = await geoRes.json();

    const lat = geo.lat;
    const lon = geo.lon;

    setCenter([lat, lon]);

    await fetchRoads(geo.bbox, lat, lon);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleCheck();
  }

  useEffect(() => {
    handleCheck();
  }, []);

  const getRoadColor = (traffic) => {
    if (traffic > 70) return "red";
    if (traffic > 40) return "orange";
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
          Show Smart Traffic
        </button>
      </div>

      {loading && <p>Analyzing traffic patterns…</p>}

      {center && (
        <MapContainer
          key={`${center[0]}-${center[1]}`}
          center={center}
          zoom={12}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {roads.map((road, i) => {
            if (!road.geometry) return null;

            const coords = road.geometry.map((p) => [p.lat, p.lon]);

            return (
              <Polyline
                key={i}
                positions={coords}
                pathOptions={{
                  color: getRoadColor(road.traffic),
                  weight: 4
                }}
              />
            );
          })}
        </MapContainer>
      )}
    </>
  );
}