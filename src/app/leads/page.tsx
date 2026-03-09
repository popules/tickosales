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
import { useMemo, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Upload, Mail, Phone, Globe, CheckCircle2, Clock, User, X, FileText, HelpCircle } from "lucide-react";

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

function statusColor(status: LeadContactStatus) {
  if (status === "new") return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
  if (status === "saved") return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
  if (status === "contacted") return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
  return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
}

function typeColor(type: LeadType) {
  if (type === "brf") return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300";
  return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300";
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(() => loadLeads());
  const [search, setSearch] = useState("");
  const [kommun, setKommun] = useState<string>("");
  const [type, setType] = useState<LeadType | "">("");
  const [status, setStatus] = useState<LeadContactStatus | "">("");
  const [busyIds, setBusyIds] = useState<Set<string>>(() => new Set());
  const [importError, setImportError] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (selectedLead?.id === id) {
      setSelectedLead({ ...selectedLead, contactStatus: nextStatus });
    }
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
      const updated = applyEnrichmentResult(lead.id, {
        enrichmentStatus: data.enrichmentStatus,
        emails: data.emails,
        phones: data.phones,
      });
      setLeads(updated);
      if (selectedLead?.id === lead.id) {
        setSelectedLead({ ...selectedLead, enrichmentStatus: data.enrichmentStatus, emails: data.emails, phones: data.phones });
      }
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(lead.id);
        return next;
      });
    }
  }

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left Panel - Lead List */}
        <div className="w-1/2 border-r border-border bg-background/50">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-b border-border bg-background/60 p-4 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold">Leads</h1>
                  <p className="text-sm text-muted-foreground">
                    {mounted ? `${filtered.length} av ${leads.length} leads` : "Laddar..."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Så här importerar du leads</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 text-sm">
                        <p className="text-muted-foreground">
                          Ladda upp en CSV-fil med dina potentiella kunder. Varje rad blir ett lead.
                        </p>
                        
                        <div className="bg-slate-100 rounded-lg p-4">
                          <p className="font-medium mb-2">Obligatoriska kolumner:</p>
                          <code className="text-xs bg-white p-2 rounded block">
                            namn,hemsida,kommun,typ
                          </code>
                        </div>
                        
                        <div>
                          <p className="font-medium mb-2">Exempel på fil:</p>
                          <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded overflow-x-auto">
{`ByggPro AB,byggpro.se,Stockholm,bygg
VVS-Specialisten,vvsspecialisten.se,Göteborg,vvs
DesignStudio,designstudio.se,Malmö,design`}
                          </pre>
                        </div>
                        
                        <div>
                          <p className="font-medium mb-2">Giltiga typer:</p>
                          <p className="text-xs text-muted-foreground">
                            bygg, vvs, el, tak, ventilation, mark, transport, consulting, marketing, it, design, brf, fastighetsforvaltare, other
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={(e) => void onCsvFile(e.target.files?.[0] ?? null)}
                    />
                    <Button size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Importera CSV
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Sök leads..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={kommun || "all"} onValueChange={(value) => setKommun(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alla kommuner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla kommuner</SelectItem>
                    {kommunOptions.map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={type || "all"} onValueChange={(value: LeadType | "all") => setType(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alla typer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla typer</SelectItem>
                    <SelectItem value="brf">BRF</SelectItem>
                    <SelectItem value="fastighetsforvaltare">Fastighetsförvaltare</SelectItem>
                    <SelectItem value="bygg">Bygg</SelectItem>
                    <SelectItem value="ventilation">Ventilation</SelectItem>
                    <SelectItem value="tak">Tak</SelectItem>
                    <SelectItem value="vvs">VVS</SelectItem>
                    <SelectItem value="el">El</SelectItem>
                    <SelectItem value="mark">Mark/Anläggning</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="consulting">Konsult</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="it">IT/Teknik</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="other">Annat</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={status || "all"} onValueChange={(value: LeadContactStatus | "all") => setStatus(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alla statusar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla statusar</SelectItem>
                    <SelectItem value="new">Ny</SelectItem>
                    <SelectItem value="saved">Sparad</SelectItem>
                    <SelectItem value="contacted">Kontaktad</SelectItem>
                    <SelectItem value="dismissed">Inte relevant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {importError && (
                <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                  {importError}
                </div>
              )}
            </div>

            {/* Lead List */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Inga leads hittades</h3>
                  <p className="text-muted-foreground mb-4">
                    Importera en CSV-fil för att komma igång
                  </p>
                  
                  {/* CSV Template */}
                  <div className="bg-slate-100 rounded-lg p-4 mb-4 text-left w-full max-w-md">
                    <p className="text-sm font-medium text-slate-700 mb-2">CSV-format (kolumner):</p>
                    <code className="text-xs text-slate-600 block mb-3">
                      namn,hemsida,kommun,typ
                    </code>
                    <p className="text-xs text-slate-500 mb-2">Exempel:</p>
                    <code className="text-xs text-slate-600 block bg-white p-2 rounded">
                      ByggPro AB,byggpro.se,Stockholm,bygg<br/>
                      VVS-Specialisten,vvsspecialisten.se,Göteborg,vvs<br/>
                      DesignStudio,designstudio.se,Malmö,design
                    </code>
                    <p className="text-xs text-slate-400 mt-2">
                      Tillåtna typer: bygg, vvs, el, tak, ventilation, mark, transport, consulting, marketing, it, design, brf, fastighetsforvaltare, other
                    </p>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={(e) => void onCsvFile(e.target.files?.[0] ?? null)}
                    />
                    <Button>Importera CSV</Button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filtered.map((lead) => {
                    const busy = busyIds.has(lead.id);
                    const isSelected = selectedLead?.id === lead.id;
                    return (
                      <div
                        key={lead.id}
                        className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                          isSelected ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedLead(lead)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium truncate">{lead.name}</h3>
                              <Badge className={statusColor(lead.contactStatus)}>
                                {statusLabel(lead.contactStatus)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className={typeColor(lead.type)}>
                                {typeLabel(lead.type)}
                              </Badge>
                              <span>{lead.kommun}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              {lead.emails.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {lead.emails.length}
                                </span>
                              )}
                              {lead.phones.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {lead.phones.length}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                {lead.enrichmentStatus === "enriched" ? "Berikad" : "Ej berikad"}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={(e) => {
                              e.stopPropagation();
                              enrichLead(lead);
                            }}
                            className="shrink-0"
                          >
                            {busy ? (
                              <Clock className="h-4 w-4 animate-spin" />
                            ) : (
                              <Search className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Lead Details */}
        <div className="w-1/2 bg-background">
          {selectedLead ? (
            <div className="h-full flex flex-col">
              {/* Lead Details Header */}
              <div className="border-b border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedLead.name}</h2>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColor(selectedLead.contactStatus)}>
                        {statusLabel(selectedLead.contactStatus)}
                      </Badge>
                      <Badge variant="outline" className={typeColor(selectedLead.type)}>
                        {typeLabel(selectedLead.type)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{selectedLead.kommun}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLead(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <a
                    href={selectedLead.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground underline"
                  >
                    {selectedLead.websiteUrl}
                  </a>
                </div>
              </div>

              {/* Contact Information */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Contact Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Kontaktuppgifter
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedLead.emails.length > 0 ? (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">E-post</label>
                          <div className="mt-1 space-y-1">
                            {selectedLead.emails.map((email, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{email}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">Inga e-postadresser hittades</div>
                      )}

                      {selectedLead.phones.length > 0 ? (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Telefon</label>
                          <div className="mt-1 space-y-1">
                            {selectedLead.phones.map((phone, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{phone}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">Inga telefonnummer hittades</div>
                      )}

                      {selectedLead.emails.length === 0 && selectedLead.phones.length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground mb-4">
                            Inga kontaktuppgifter ännu. Kör berikning för att hitta e-post och telefon.
                          </p>
                          <Button
                            onClick={() => enrichLead(selectedLead)}
                            disabled={busyIds.has(selectedLead.id)}
                            className="gap-2"
                          >
                            {busyIds.has(selectedLead.id) ? (
                              <Clock className="h-4 w-4 animate-spin" />
                            ) : (
                              <Search className="h-4 w-4" />
                            )}
                            {busyIds.has(selectedLead.id) ? "Berikar..." : "Berika lead"}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Åtgärder</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setStatusForLead(selectedLead.id, "saved")}
                          className="gap-2"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Spara
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setStatusForLead(selectedLead.id, "contacted")}
                          className="gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          Kontaktad
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setStatusForLead(selectedLead.id, "dismissed")}
                          className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                          Inte relevant
                        </Button>
                        <Button
                          onClick={() => window.open(`/offerter?lead=${selectedLead.id}`, '_blank')}
                          className="gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          Skapa offert
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Välj en lead</h3>
              <p className="text-muted-foreground">
                Välj en lead från listan för att se detaljer och hantera kontaktuppgifter
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
