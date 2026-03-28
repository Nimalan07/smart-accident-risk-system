import { XMLParser } from "fast-xml-parser";

export async function POST(req) {
  try {
    const { city } = await req.json();
    if (!city) return Response.json({ count: 0 });

    const query = `road accident ${city} today`;
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
      query
    )}&hl=en-IN&gl=IN&ceid=IN:en`;

    const res = await fetch(url);
    if (!res.ok) return Response.json({ count: 0 });

    const xml = await res.text();

    const parser = new XMLParser();
    const data = parser.parse(xml);

    const items = data?.rss?.channel?.item || [];
    const articles = Array.isArray(items) ? items : [items];

    // Count articles from last 24 hours
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;

    const recentCount = articles.filter((a) => {
      const pub = new Date(a.pubDate).getTime();
      return now - pub < ONE_DAY;
    }).length;

    return Response.json({ count: recentCount });
  } catch {
    return Response.json({ count: 0 });
  }
}
