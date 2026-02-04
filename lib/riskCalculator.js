export function calculateRisk({
  weather,
  hour,
  trafficLevel,
  pastAccidents
}) {
  let riskScore = 0;

  // 1️⃣ Normalize historical accidents (no hard cap)
  const accidentScore = Math.min(
    Math.log(pastAccidents + 1) * 25,
    50
  );
  riskScore += accidentScore;

  // 2️⃣ Traffic
  if (trafficLevel === "high") riskScore += 15;
  if (trafficLevel === "medium") riskScore += 8;

  // 3️⃣ Time
  if (hour >= 22 || hour <= 5) riskScore += 10;
  if (hour >= 7 && hour <= 10) riskScore += 8;
  if (hour >= 17 && hour <= 21) riskScore += 8;

  // 4️⃣ Weather
  if (weather === "rain") riskScore += 10;
  if (weather === "fog") riskScore += 15;

  riskScore = Math.round(Math.min(riskScore, 100));

  let riskLevel = "Low";
  if (riskScore >= 70) riskLevel = "High";
  else if (riskScore >= 35) riskLevel = "Medium";

  return { riskScore, riskLevel };
}
