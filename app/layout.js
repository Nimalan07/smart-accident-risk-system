import "./globals.css";

export const metadata = {
  title: "Smart Accident & Risk Prediction System",
  description:
    "Predict accident-prone areas using weather, time, traffic, and historical data"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
