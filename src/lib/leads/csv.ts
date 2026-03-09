import { LeadCreateInput, LeadType } from "./types";

function asType(value: string): LeadType {
  const v = value.trim().toLowerCase();
  if (v === "brf") return "brf";
  if (v === "fastighetsforvaltare") return "fastighetsforvaltare";
  if (v === "fastighetsförvaltare") return "fastighetsforvaltare";
  throw new Error("Invalid lead type");
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (ch === "," && !inQuotes) {
      out.push(current);
      current = "";
      continue;
    }

    current += ch;
  }

  out.push(current);
  return out.map((s) => s.trim());
}

export function parseLeadsCsv(text: string): LeadCreateInput[] {
  const rawLines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (rawLines.length === 0) return [];

  const header = splitCsvLine(rawLines[0]).map((h) => h.toLowerCase());
  const nameIdx = header.findIndex((h) => ["name", "namn"].includes(h));
  const websiteIdx = header.findIndex((h) => ["website", "websiteurl", "url", "hemsida"].includes(h));
  const kommunIdx = header.findIndex((h) => ["kommun", "city", "stad"].includes(h));
  const typeIdx = header.findIndex((h) => ["type", "typ"].includes(h));

  if (nameIdx < 0 || websiteIdx < 0 || kommunIdx < 0 || typeIdx < 0) {
    return [];
  }

  const items: LeadCreateInput[] = [];

  for (const line of rawLines.slice(1)) {
    const cols = splitCsvLine(line);
    const name = cols[nameIdx] ?? "";
    const websiteUrl = cols[websiteIdx] ?? "";
    const kommun = cols[kommunIdx] ?? "";
    const rawType = cols[typeIdx] ?? "";

    if (!name || !websiteUrl || !kommun || !rawType) continue;

    let type: LeadType;
    try {
      type = asType(rawType);
    } catch {
      continue;
    }

    items.push({
      name,
      websiteUrl,
      kommun,
      type,
    });
  }

  return items;
}
