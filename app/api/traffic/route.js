export async function POST(req) {
  try {
    const { lat, lon } = await req.json();

    const apiKey = process.env.TOMTOM_API_KEY;

    const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lon}&key=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) {
      return Response.json({ congestion: 0 });
    }

    const data = await res.json();
    const flow = data.flowSegmentData;

    const currentSpeed = flow.currentSpeed;
    const freeFlowSpeed = flow.freeFlowSpeed;

    const congestion =
      freeFlowSpeed > 0
        ? Math.round(
            ((freeFlowSpeed - currentSpeed) / freeFlowSpeed) * 100
          )
        : 0;

    return Response.json({
      congestion,        // %
      currentSpeed,
      freeFlowSpeed
    });
  } catch {
    return Response.json({ congestion: 0 });
  }
}
