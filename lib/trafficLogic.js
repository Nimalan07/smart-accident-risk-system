export function getTrafficLevel(hour, isWeekend = false) {
  if (isWeekend) {
    if (hour >= 10 && hour <= 20) {
      return "medium";
    }
    return "low";
  }

  if (hour >= 7 && hour <= 10) {
    return "high";
  }

  if (hour >= 17 && hour <= 21) {
    return "high";
  }

  if (hour >= 22 || hour <= 5) {
    return "low";
  }
  return "medium";
}
