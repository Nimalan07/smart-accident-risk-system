import { loadAccidentData } from "@/lib/dataParser";

export async function GET() {
  const data = loadAccidentData();
  return Response.json({ accidents: data });
}
