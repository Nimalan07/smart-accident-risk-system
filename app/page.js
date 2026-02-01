import MapView from "@/components/MapView";

export default function Home() {
  return (
    <main style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Smart Accident & Risk Prediction System
      </h1>

      <MapView />
    </main>
  );
}
