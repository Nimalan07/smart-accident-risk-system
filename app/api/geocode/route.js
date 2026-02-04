export async function POST(req) {
  try {
    const { city } = await req.json();

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      city
    )}&countrycodes=in&limit=1`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "smart-accident-risk-system"
      }
    });

    const data = await res.json();

    if (!data || data.length === 0) {
      return Response.json(
        { error: "City not found in India" },
        { status: 404 }
      );
    }

    const place = data[0];

    if (!place.display_name.toLowerCase().includes("india")) {
      return Response.json(
        { error: "Location outside India" },
        { status: 400 }
      );
    }

    return Response.json({
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
      name: place.display_name
    });
  } catch {
    return Response.json({ error: "Geocoding failed" }, { status: 500 });
  }
}
