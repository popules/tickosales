"use client";

import { Lead, LeadCreateInput, LeadContactStatus } from "./types";

const STORAGE_KEY = "tickosales.leads.v1";

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const SAMPLE_LEADS: LeadCreateInput[] = [
  { name: "ByggPro AB", websiteUrl: "byggpro.se", kommun: "Stockholm", type: "bygg" },
  { name: "VVS-Specialisten", websiteUrl: "vvsspecialisten.se", kommun: "Göteborg", type: "vvs" },
  { name: "DesignStudio Nordic", websiteUrl: "designstudio.se", kommun: "Malmö", type: "design" },
  { name: "Tak & Fasad i Sverige", websiteUrl: "takfasad.se", kommun: "Uppsala", type: "tak" },
  { name: "El-Consult AB", websiteUrl: "elconsult.se", kommun: "Linköping", type: "el" },
];

export function loadLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // First time - add sample leads
    const samples = SAMPLE_LEADS.map((input): Lead => ({
      id: uid(),
      name: input.name,
      websiteUrl: normalizeUrl(input.websiteUrl),
      kommun: input.kommun,
      type: input.type,
      contactStatus: "new",
      enrichmentStatus: "pending",
      emails: [],
      phones: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }));
    saveLeads(samples);
    return samples;
  }
  try {
    const parsed = JSON.parse(raw) as Lead[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveLeads(leads: Lead[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

export function upsertLeads(inputs: LeadCreateInput[]): Lead[] {
  const existing = loadLeads();
  const existingByKey = new Map<string, Lead>();

  for (const lead of existing) {
    existingByKey.set(keyForLead(lead.name, lead.websiteUrl, lead.kommun), lead);
  }

  const next: Lead[] = [...existing];

  for (const input of inputs) {
    const key = keyForLead(input.name, input.websiteUrl, input.kommun);
    const found = existingByKey.get(key);

    if (found) {
      const updated: Lead = {
        ...found,
        name: input.name,
        websiteUrl: normalizeUrl(input.websiteUrl),
        kommun: input.kommun,
        type: input.type,
        updatedAt: nowIso(),
      };
      const idx = next.findIndex((l) => l.id === found.id);
      if (idx >= 0) next[idx] = updated;
      continue;
    }

    const created: Lead = {
      id: uid(),
      name: input.name,
      websiteUrl: normalizeUrl(input.websiteUrl),
      kommun: input.kommun,
      type: input.type,
      contactStatus: "new",
      enrichmentStatus: "pending",
      emails: [],
      phones: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    next.unshift(created);
  }

  saveLeads(next);
  return next;
}

export function updateLeadStatus(id: string, contactStatus: LeadContactStatus): Lead[] {
  const leads = loadLeads();
  const next = leads.map((l) =>
    l.id === id ? { ...l, contactStatus, updatedAt: nowIso() } : l,
  );
  saveLeads(next);
  return next;
}

export function applyEnrichmentResult(
  id: string,
  result: {
    emails: string[];
    phones: string[];
    enrichmentStatus: Lead["enrichmentStatus"];
    aiSummary?: string;
    fitScore?: number;
  },
): Lead[] {
  const leads = loadLeads();
  const next = leads.map((l) => {
    if (l.id !== id) return l;
    return {
      ...l,
      emails: result.emails,
      phones: result.phones,
      enrichmentStatus: result.enrichmentStatus,
      aiSummary: result.aiSummary,
      fitScore: result.fitScore,
      lastEnrichedAt: nowIso(),
      updatedAt: nowIso(),
    };
  });
  saveLeads(next);
  return next;
}

function keyForLead(name: string, websiteUrl: string, kommun: string) {
  return `${name}`.trim().toLowerCase() +
    "|" +
    normalizeUrl(websiteUrl).trim().toLowerCase() +
    "|" +
    `${kommun}`.trim().toLowerCase();
}

function normalizeUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}
