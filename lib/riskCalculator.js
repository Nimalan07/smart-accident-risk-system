export function calculateRisk({
  weather,
  hour,
  trafficLevel,
  pastAccidents
}) {
  let riskScore = 0;


  if (weather === "rain") {
    riskScore += 30;
  } else if (weather === "fog") {
    riskScore += 40;
  } else if (weather === "clear") {
    riskScore += 10;
  }

  if (hour >= 7 && hour <= 10) {

    riskScore += 25;
  } else if (hour >= 17 && hour <= 21) {
 
    riskScore += 30;
  } else if (hour >= 22 || hour <= 5) {

    riskScore += 20;
  }

  if (trafficLevel === "high") {
    riskScore += 30;
  } else if (trafficLevel === "medium") {
    riskScore += 20;
  } else if (trafficLevel === "low") {
    riskScore += 10;
  }

  if (pastAccidents > 20) {
    riskScore += 40;
  } else if (pastAccidents > 10) {
    riskScore += 25;
  } else if (pastAccidents > 0) {
    riskScore += 10;
  }

  let riskLevel = "Low";

  if (riskScore >= 90) {
    riskLevel = "High";
  } else if (riskScore >= 50) {
    riskLevel = "Medium";
  }

  return {
    riskScore,
    riskLevel
  };
}
