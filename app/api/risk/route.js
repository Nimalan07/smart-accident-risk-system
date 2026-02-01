import { calculateRisk } from "@/lib/riskCalculator";
import { getTrafficLevel } from "@/lib/trafficLogic";
import { loadAccidentData } from "@/lib/dataParser";

export async function POST(req) {
  const body = await req.json();
  const { weather, hour, isWeekend, lat, lng } = body;

  const accidents = loadAccidentData();

  const nearbyAccidents = accidents.filter(
    (a) =>
      a.latitude &&
      a.longitude &&
      Math.abs(a.latitude - lat) < 0.05 &&
      Math.abs(a.longitude - lng) < 0.05
  );

  const trafficLevel = getTrafficLevel(hour, isWeekend);

  const result = calculateRisk({
    weather,
    hour,
    trafficLevel,
    pastAccidents: nearbyAccidents.length
  });

  return Response.json({
    output: result,
    pastAccidents: nearbyAccidents.length
  });
}
