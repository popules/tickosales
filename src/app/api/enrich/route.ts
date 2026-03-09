import { NextResponse } from "next/server";

function normalizeUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean)));
}

function extractEmails(html: string) {
  const emails = html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
  return uniqueStrings(emails).slice(0, 10);
}

function extractPhones(html: string) {
  const normalized = html.replace(/\s+/g, " ");
  const matches = normalized.match(/(\+46|0)\s?\d{1,3}[\s-]?\d{2,3}[\s-]?\d{2}[\s-]?\d{2}/g) ?? [];
  return uniqueStrings(matches).slice(0, 10);
}

async function fetchText(url: string) {
  const res = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: {
      "user-agent": "tickosales/0.1 (+https://ticko.se)",
      accept: "text/html,application/xhtml+xml",
    },
  });

  const contentType = res.headers.get("content-type") ?? "";
  if (!res.ok) {
    throw new Error(`Fetch failed (${res.status})`);
  }
  if (!contentType.includes("text/html")) {
    throw new Error("Not HTML");
  }

  return await res.text();
}

export async function POST(req: Request) {
  const body = (await req.json()) as { websiteUrl?: string };
  const websiteUrl = normalizeUrl(body.websiteUrl ?? "");

  if (!websiteUrl) {
    return NextResponse.json(
      { ok: false, error: "Missing websiteUrl" },
      { status: 400 },
    );
  }

  const urlsToTry = [
    websiteUrl,
    new URL("/kontakt", websiteUrl).toString(),
    new URL("/kontakta-oss", websiteUrl).toString(),
    new URL("/contact", websiteUrl).toString(),
    new URL("/om-oss", websiteUrl).toString(),
  ];

  let combined = "";
  let fetched = 0;

  for (const u of urlsToTry) {
    try {
      const html = await fetchText(u);
      combined += "\n" + html;
      fetched++;
      if (fetched >= 2) break;
    } catch {
      continue;
    }
  }

  if (!combined) {
    return NextResponse.json({ ok: true, enrichmentStatus: "failed", emails: [], phones: [] });
  }

  const emails = extractEmails(combined);
  const phones = extractPhones(combined);

  return NextResponse.json({
    ok: true,
    enrichmentStatus: "enriched",
    emails,
    phones,
  });
}
