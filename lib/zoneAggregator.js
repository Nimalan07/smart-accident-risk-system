export function aggregateZoneRisks(zoneResults) {
  const scores = zoneResults.map(z => z.riskScore);

  const maxRisk = Math.max(...scores);
  const minRisk = Math.min(...scores);
  const avgRisk =
    Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  return {
    cityRiskScore: maxRisk,
    avgRiskScore: avgRisk,
    minRiskScore: minRisk
  };
}
