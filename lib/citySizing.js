export function getCitySizing(bbox) {
  if (!bbox || bbox.length !== 4) {
    // fallback
    return {
      zoneOffset: 0.06,
      circleRadius: 4000
    };
  }

  const [south, north, west, east] = bbox;

  const latSpan = Math.abs(north - south);
  const lonSpan = Math.abs(east - west);

  const citySpan = Math.max(latSpan, lonSpan);

  // thresholds are empirical & realistic
  if (citySpan > 0.3) {
    // very large city (Delhi-scale)
    return {
      zoneOffset: citySpan / 3,
      circleRadius: 7000
    };
  }

  if (citySpan > 0.15) {
    // metro city
    return {
      zoneOffset: citySpan / 3,
      circleRadius: 5000
    };
  }

  // small city / town
  return {
    zoneOffset: citySpan / 3,
    circleRadius: 3500
  };
}
