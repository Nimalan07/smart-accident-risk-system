export async function POST(req) {
  try {
    const { lat, lon } = await req.json();

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=precipitation,visibility`;

    const res = await fetch(url);
    if (!res.ok) {
      return Response.json({ weather: "clear" });
    }

    const data = await res.json();

    let weather = "clear";

    if (data.current?.precipitation > 0) {
      weather = "rain";
    } else if (data.current?.visibility < 2000) {
      weather = "fog";
    }

    return Response.json({ weather });
  } catch {
    return Response.json({ weather: "clear" });
  }
}
