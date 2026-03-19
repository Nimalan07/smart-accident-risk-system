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

  // ✅ FIXED: now accepts bbox properly
  async function fetchRoads(bbox) {
    if (!bbox) return;

    setLoading(true);

    try {
      const res = await fetch("/api/roads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bbox }) // ✅ correct
      });

      const data = await res.json();

      const roadsWithTraffic = (data.roads || []).map((r) => ({
        ...r,
        traffic: Math.floor(Math.random() * 100)
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

    setCenter([geo.lat, geo.lon]);

    // ✅ FIXED: passing bbox correctly
    await fetchRoads(geo.bbox);
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
          Check Traffic
        </button>
      </div>

      {loading && <p>Loading road traffic…</p>}

      {center && (
        <MapContainer
          key={`${center[0]}-${center[1]}`}
          center={center}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {roads.length === 0 && !loading && (
            <p style={{ position: "absolute", top: 10, left: 10 }}>
              No roads found
            </p>
          )}

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