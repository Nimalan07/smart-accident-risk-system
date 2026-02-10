"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

import { generateCityZones } from "@/lib/zoneGenerator";
import { getCitySizing } from "@/lib/citySizing";
import { aggregateZoneRisks } from "@/lib/zoneAggregator";

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
  const [center, setCenter] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchZoneRisk(lat, lon, cityName) {
    let weather = "clear";
    let trafficCongestion = 0;
    let accidentCount = 0;

    try {
      const t = await fetch("/api/traffic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon })
      });
      if (t.ok) trafficCongestion = (await t.json()).congestion ?? 0;
    } catch {}

    try {
      const w = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon })
      });
      if (w.ok) weather = (await w.json()).weather ?? "clear";
    } catch {}

    try {
      const n = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: cityName })
      });
      if (n.ok) accidentCount = (await n.json()).count ?? 0;
    } catch {}

    const r = await fetch("/api/risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weather,
        trafficCongestion,
        accidentCount
      })
    });

    return r.ok ? await r.json() : null;
  }

  async function fetchCityRisk(lat, lon, cityName, bbox) {
    setLoading(true);

    const { zoneOffset, circleRadius } = getCitySizing(bbox);
    const zones = generateCityZones(lat, lon, zoneOffset, bbox);

    const zoneResults = [];

    for (const zone of zones) {
      const result = await fetchZoneRisk(zone.lat, zone.lon, cityName);
      if (result) {
        zoneResults.push({
          ...zone,
          ...result
        });
      }
    }

    const aggregated = aggregateZoneRisks(zoneResults);

    setRiskData({
      city: cityName,
      zones: zoneResults,
      aggregated,
      circleRadius
    });

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

    const newCenter = [geo.lat, geo.lon];
    setCenter(newCenter);

    await fetchCityRisk(geo.lat, geo.lon, input, geo.bbox);
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

      {loading && <p>Calculating city-wide risk…</p>}

      {center && (
        <MapContainer
          key={`${center[0]}-${center[1]}`}
          center={center}
          zoom={11}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {riskData?.zones &&
            riskData.zones.map((zone) => (
              <Circle
                key={`${zone.name}-${zone.lat}-${zone.lon}`}
                center={[zone.lat, zone.lon]}
                radius={riskData.circleRadius}
                pathOptions={{
                  color: getColor(zone.riskLevel),
                  fillOpacity: 0.35
                }}
              >
                <Popup>
                  Zone: {zone.name}
                  <br />
                  Risk Level: {zone.riskLevel}
                  <br />
                  Risk Score: {zone.riskScore}
                </Popup>
              </Circle>
            ))}
        </MapContainer>
      )}
    </>
  );
}
