export type LeadType = 
  | "brf" 
  | "fastighetsforvaltare"
  | "bygg"
  | "ventilation"
  | "tak"
  | "vvs"
  | "el"
  | "mark"
  | "transport"
  | "consulting"
  | "marketing"
  | "it"
  | "design"
  | "other";
export type LeadContactStatus = "new" | "saved" | "contacted" | "dismissed";
export type EnrichmentStatus = "pending" | "fetched" | "enriched" | "failed";

export type Lead = {
  id: string;
  name: string;
  websiteUrl: string;
  kommun: "Stockholm" | "Göteborg" | "Malmö" | string;
  type: LeadType;
  contactStatus: LeadContactStatus;
  enrichmentStatus: EnrichmentStatus;
  emails: string[];
  phones: string[];
  aiSummary?: string;
  fitScore?: number;
  lastEnrichedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type LeadCreateInput = {
  name: string;
  websiteUrl: string;
  kommun: string;
  type: LeadType;
};
