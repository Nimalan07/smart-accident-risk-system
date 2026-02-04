export async function POST(req) {
  try {
    const { weather, trafficCongestion, accidentCount } =
      await req.json();

    // ✅ Base risk (always present)
    let riskScore = 15;

    // Weather impact
    if (weather === "rain") riskScore += 15;
    if (weather === "fog") riskScore += 20;

    // Traffic impact
    if (trafficCongestion > 60) riskScore += 40;
    else if (trafficCongestion > 30) riskScore += 25;
    else if (trafficCongestion > 10) riskScore += 10;
    else riskScore += 5; // even light traffic adds some risk

    // Accident news impact
    if (accidentCount >= 10) riskScore += 30;
    else if (accidentCount >= 5) riskScore += 20;
    else if (accidentCount >= 2) riskScore += 10;

    riskScore = Math.min(Math.round(riskScore), 100);

    let riskLevel = "Low";
    if (riskScore >= 70) riskLevel = "High";
    else if (riskScore >= 35) riskLevel = "Medium";

    return Response.json({
      riskScore,
      riskLevel,
      trafficCongestion,
      accidentCount
    });
  } catch {
    return Response.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
