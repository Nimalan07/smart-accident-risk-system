export async function POST(req) {
  try {
    const { bbox } = await req.json();

    if (!bbox) {
      return Response.json({ roads: [] });
    }

    const [south, north, west, east] = bbox;

    const midLat = (south + north) / 2;
    const midLon = (west + east) / 2;

    // 🔥 split into 4 parts
    const boxes = [
      [south, midLat, west, midLon],
      [south, midLat, midLon, east],
      [midLat, north, west, midLon],
      [midLat, north, midLon, east]
    ];

    let allRoads = [];

    for (const b of boxes) {
      const [s, n, w, e] = b;

      const query = `
        [out:json][timeout:20];
        (
          way["highway"~"motorway|trunk|primary|secondary|tertiary"](${s},${w},${n},${e});
        );
        out geom;
      `;

      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: query
      });

      const text = await res.text();

      if (!text.startsWith("<")) {
        const data = JSON.parse(text);
        allRoads = allRoads.concat(data.elements || []);
      }
    }

    return Response.json({ roads: allRoads });

  } catch (err) {
    return Response.json({ roads: [] });
  }
}