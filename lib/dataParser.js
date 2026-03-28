import fs from "fs";
import path from "path";
import Papa from "papaparse";

export function loadAccidentData() {
  const filePath = path.join(process.cwd(), "data", "accidents.csv");
  const file = fs.readFileSync(filePath, "utf8");

  const parsed = Papa.parse(file, {
    header: true,
    skipEmptyLines: true
  });

  return parsed.data;
}
