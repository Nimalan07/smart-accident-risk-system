import MapView from "@/components/MapView";

export default function Home() {
  return (
    <main>
      <h1>Smart Accident & Risk Prediction System</h1>
      <p style={{ textAlign: "center", marginBottom: "20px", color: "#94a3b8" }}>
        Check accident risk for any city based on real data and conditions
      </p>

      <MapView />
    </main>
  );
}
