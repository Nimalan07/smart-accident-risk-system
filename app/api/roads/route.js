export async function POST(req) {
  try {
    const { bbox } = await req.json();

    if (!bbox) {
      return Response.json({ roads: [] });
    }

    const [south, north, west, east] = bbox;

    const query = `
      [out:json][timeout:25];
      (
        way["highway"~"motorway|trunk|primary|secondary"](${south},${west},${north},${east});
      );
      out geom;
    `;

    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: query
    });

    const text = await res.text();

    // 🛑 Handle XML error safely
    if (text.startsWith("<")) {
      return Response.json({ roads: [] });
    }

    const data = JSON.parse(text);

    return Response.json({
      roads: data.elements || []
    });

  } catch (err) {
    return Response.json({ roads: [] });
  }
}