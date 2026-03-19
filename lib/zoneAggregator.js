export function aggregateZoneRisks(zones) {
  if (!zones.length) return null;

  let total = 0;
  let maxZone = zones[0];

  for (const z of zones) {
    total += z.riskScore;

    if (z.riskScore > maxZone.riskScore) {
      maxZone = z;
    }
  }

  const avg = total / zones.length;

  let level = "Low";
  if (avg > 70) level = "High";
  else if (avg > 40) level = "Medium";

  return {
    riskScore: Math.round(avg),
    riskLevel: level,
    dominantZone: maxZone.name
  };
}