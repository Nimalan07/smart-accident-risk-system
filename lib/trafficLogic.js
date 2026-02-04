const metroCities = [
  "delhi",
  "mumbai",
  "chennai",
  "kolkata",
  "bengaluru",
  "hyderabad"
];

export function getTrafficLevel(hour, isWeekend, city) {
  const isMetro = metroCities.includes(city.toLowerCase());

  if (isWeekend) return "low";

  if (isMetro) {
    if (hour >= 8 && hour <= 11) return "high";
    if (hour >= 17 && hour <= 21) return "high";
    return "medium";
  } else {
    if (hour >= 9 && hour <= 10) return "medium";
    if (hour >= 18 && hour <= 20) return "medium";
    return "low";
  }
}
