export function getCityRadius(city) {
  const name = city.toLowerCase();

  if (["delhi", "mumbai"].includes(name)) {
    return { zoneOffset: 0.08, circleRadius: 10000 };
  }

  if (["chennai", "bengaluru", "kolkata", "hyderabad"].includes(name)) {
    return { zoneOffset: 0.06, circleRadius: 8000 };
  }

  return { zoneOffset: 0.03, circleRadius: 5000 };
}
