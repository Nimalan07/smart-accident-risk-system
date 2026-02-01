"use client";

import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

export default function MapView() {
  const [riskData, setRiskData] = useState(null);

  useEffect(() => {
    async function fetchRisk() {
      const res = await fetch("/api/risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  weather: "rain",
  hour: new Date().getHours(),
  isWeekend: false,
  lat: 13.0827,
  lng: 80.2707
})

      });

      const data = await res.json();
      setRiskData(data);
    }

    fetchRisk();
  }, []);

  const getColor = (level) => {
    if (level === "High") return "red";
    if (level === "Medium") return "orange";
    return "green";
  };

  return (
    <MapContainer
      center={[13.0827, 80.2707]}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {riskData && (
        <Circle
          center={[13.0827, 80.2707]}
          radius={1500}
          pathOptions={{
            color: getColor(riskData.output.riskLevel),
            fillOpacity: 0.4
          }}
        >
          <Popup>
            Risk Level: {riskData.output.riskLevel}
            <br />
            Risk Score: {riskData.output.riskScore}
          </Popup>
        </Circle>
      )}
    </MapContainer>
  );
}
