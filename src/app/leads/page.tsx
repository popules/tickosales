"use client";

import AppShell from "@/components/AppShell";
import { parseLeadsCsv } from "@/lib/leads/csv";
import {
  applyEnrichmentResult,
  loadLeads,
  updateLeadStatus,
  upsertLeads,
} from "@/lib/leads/storage";
import { Lead, LeadContactStatus, LeadType } from "@/lib/leads/types";
import { useMemo, useState } from "react";

function typeLabel(type: LeadType) {
  if (type === "brf") return "BRF";
  return "Fastighetsförvaltare";
}

function statusLabel(status: LeadContactStatus) {
  if (status === "new") return "Ny";
  if (status === "saved") return "Sparad";
  if (status === "contacted") return "Kontaktad";
  return "Inte relevant";
}

function pillClass(status: LeadContactStatus) {
  if (status === "new") return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
  if (status === "saved") return "bg-zinc-900/10 text-zinc-800 dark:bg-white/10 dark:text-zinc-200";
  if (status === "contacted") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300";
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(() => loadLeads());
  const [search, setSearch] = useState("");
  const [kommun, setKommun] = useState<string>("");
  const [type, setType] = useState<LeadType | "">("");
  const [status, setStatus] = useState<LeadContactStatus | "">("");
  const [busyIds, setBusyIds] = useState<Set<string>>(() => new Set());
  const [importError, setImportError] = useState<string>("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads
      .filter((l) => (kommun ? l.kommun === kommun : true))
      .filter((l) => (type ? l.type === type : true))
      .filter((l) => (status ? l.contactStatus === status : true))
      .filter((l) =>
        q
          ? l.name.toLowerCase().includes(q) ||
            l.websiteUrl.toLowerCase().includes(q) ||
            l.kommun.toLowerCase().includes(q)
          : true,
      );
  }, [kommun, leads, search, status, type]);

  const kommunOptions = useMemo(() => {
    const set = new Set(leads.map((l) => l.kommun).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [leads]);

  async function onCsvFile(file: File | null) {
    setImportError("");
    if (!file) return;
    const text = await file.text();
    const parsed = parseLeadsCsv(text);
    if (parsed.length === 0) {
      setImportError(
        "Kunde inte läsa CSV. Kräver kolumner: namn, hemsida/url, kommun, typ (brf eller fastighetsförvaltare).",
      );
      return;
    }

    const next = upsertLeads(parsed);
    setLeads(next);
  }

  function setStatusForLead(id: string, nextStatus: LeadContactStatus) {
    setLeads(updateLeadStatus(id, nextStatus));
  }

  async function enrichLead(lead: Lead) {
    setBusyIds((prev) => new Set(prev).add(lead.id));
    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ websiteUrl: lead.websiteUrl }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        enrichmentStatus: Lead["enrichmentStatus"];
        emails: string[];
        phones: string[];
      };

      if (!data.ok) throw new Error("Enrichment failed");
      setLeads(
        applyEnrichmentResult(lead.id, {
          enrichmentStatus: data.enrichmentStatus,
          emails: data.emails,
          phones: data.phones,
        }),
      );
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(lead.id);
        return next;
      });
    }
  }

  return (
    <AppShell activePath="/leads">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Importera en lista med BRF/fastighetsförvaltare och berika med kontaktuppgifter från webbplatsen.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
              Importera CSV
              <input
                type="file"
                accept=".csv,text/csv"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e) => void onCsvFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>

        {importError ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {importError}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök namn, kommun, URL…"
            className="h-10 w-full rounded-xl border border-black/10 bg-white/60 px-3 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-black/20 dark:border-white/10 dark:bg-white/5"
          />
          <select
            value={kommun}
            onChange={(e) => setKommun(e.target.value)}
            className="h-10 w-full rounded-xl border border-black/10 bg-white/60 px-3 text-sm outline-none focus:border-black/20 dark:border-white/10 dark:bg-white/5"
          >
            <option value="">Alla kommuner</option>
            {kommunOptions.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => setType((e.target.value as LeadType | "") ?? "")}
            className="h-10 w-full rounded-xl border border-black/10 bg-white/60 px-3 text-sm outline-none focus:border-black/20 dark:border-white/10 dark:bg-white/5"
          >
            <option value="">Alla typer</option>
            <option value="brf">BRF</option>
            <option value="fastighetsforvaltare">Fastighetsförvaltare</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus((e.target.value as LeadContactStatus | "") ?? "")}
            className="h-10 w-full rounded-xl border border-black/10 bg-white/60 px-3 text-sm outline-none focus:border-black/20 dark:border-white/10 dark:bg-white/5"
          >
            <option value="">Alla statusar</option>
            <option value="new">Ny</option>
            <option value="saved">Sparad</option>
            <option value="contacted">Kontaktad</option>
            <option value="dismissed">Inte relevant</option>
          </select>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-black/5 bg-white/50 p-8 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              Inga leads än. Importera en CSV med kolumner: <span className="font-medium">namn</span>,{" "}
              <span className="font-medium">hemsida/url</span>, <span className="font-medium">kommun</span>.
            </div>
          ) : (
            filtered.map((lead) => {
              const busy = busyIds.has(lead.id);
              return (
                <div
                  key={lead.id}
                  className="group rounded-3xl border border-black/5 bg-white/60 p-5 shadow-sm backdrop-blur transition-colors hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-base font-semibold tracking-tight">{lead.name}</div>
                        <span
                          className={
                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium " +
                            pillClass(lead.contactStatus)
                          }
                        >
                          {statusLabel(lead.contactStatus)}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-zinc-900/10 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                          {typeLabel(lead.type)} · {lead.kommun}
                        </span>
                      </div>

                      <a
                        href={lead.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block max-w-[72ch] break-all text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      >
                        {lead.websiteUrl}
                      </a>

                      <div className="flex flex-wrap gap-2 text-sm">
                        {lead.emails.length ? (
                          <div className="rounded-2xl border border-black/5 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              E-post
                            </div>
                            <div className="mt-0.5 text-sm font-medium">
                              {lead.emails[0]}
                            </div>
                          </div>
                        ) : null}
                        {lead.phones.length ? (
                          <div className="rounded-2xl border border-black/5 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              Telefon
                            </div>
                            <div className="mt-0.5 text-sm font-medium">
                              {lead.phones[0]}
                            </div>
                          </div>
                        ) : null}
                        {!lead.emails.length && !lead.phones.length ? (
                          <div className="text-sm text-zinc-500 dark:text-zinc-400">
                            Inga kontaktuppgifter ännu. Kör berikning.
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void enrichLead(lead)}
                        className={
                          "inline-flex h-9 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors " +
                          (busy
                            ? "bg-zinc-900/20 text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
                            : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200")
                        }
                      >
                        {busy ? "Berikar…" : "Berika"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setStatusForLead(lead.id, "saved")}
                        className="inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-white/40 px-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                      >
                        Spara
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusForLead(lead.id, "contacted")}
                        className="inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-white/40 px-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                      >
                        Kontaktad
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusForLead(lead.id, "dismissed")}
                        className="inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-white/40 px-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                      >
                        Inte relevant
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
