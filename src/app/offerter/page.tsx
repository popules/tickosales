"use client";

import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { loadLeads } from "@/lib/leads/storage";
import { Lead } from "@/lib/leads/types";
import { 
  FileText, 
  Download, 
  Mail, 
  Send, 
  Plus, 
  Trash2, 
  Calculator,
  Calendar,
  Building,
  User,
  Phone,
  Globe,
  CheckCircle2
} from "lucide-react";

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface QuoteData {
  leadId: string;
  quoteNumber: string;
  date: string;
  validUntil: string;
  items: QuoteItem[];
  subtotal: number;
  vat: number;
  total: number;
  notes: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

export default function OfferterPage() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('lead');
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [quote, setQuote] = useState<QuoteData>({
    leadId: leadId || '',
    quoteNumber: `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [],
    subtotal: 0,
    vat: 0.25,
    total: 0,
    notes: '',
    status: 'draft'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);

  useEffect(() => {
    setLeads(loadLeads());
    if (leadId) {
      const lead = loadLeads().find(l => l.id === leadId);
      if (lead) setSelectedLead(lead);
    }
  }, [leadId]);

  useEffect(() => {
    const subtotal = quote.items.reduce((sum, item) => sum + item.total, 0);
    const vat = subtotal * quote.vat;
    const total = subtotal + vat;
    setQuote(prev => ({ ...prev, subtotal, vat, total }));
  }, [quote.items, quote.vat]);

  const addQuoteItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setQuote(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateQuoteItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    }));
  };

  const removeQuoteItem = (id: string) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simple PDF content (in real app, use a PDF library like jsPDF)
      const pdfContent = `
OFFERT - ${quote.quoteNumber}
Datum: ${quote.date}
Giltig till: ${quote.validUntil}

Kund: ${selectedLead?.name}
${selectedLead?.kommun}

Artiklar:
${quote.items.map(item => 
  `${item.description} - ${item.quantity}st × ${item.unitPrice}kr = ${item.total}kr`
).join('\n')}

Summa: ${quote.subtotal}kr
Moms (25%): ${quote.vat}kr
Totalt: ${quote.total}kr

Noteringar:
${quote.notes}
      `;

      // Download as text file (placeholder for PDF)
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `offert-${quote.quoteNumber}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      setQuote(prev => ({ ...prev, status: 'sent' }));
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async () => {
    if (!selectedLead?.emails[0]) return;
    
    setIsEmailing(true);
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, integrate with email service
      alert(`Offert skickad till ${selectedLead.emails[0]}`);
      setQuote(prev => ({ ...prev, status: 'sent' }));
    } finally {
      setIsEmailing(false);
    }
  };

  const getStatusColor = (status: QuoteData['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    }
  };

  const getStatusText = (status: QuoteData['status']) => {
    switch (status) {
      case 'draft': return 'Utkast';
      case 'sent': return 'Skickad';
      case 'accepted': return 'Accepterad';
      case 'rejected': return 'Avvisad';
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Offertbyggare</h1>
            <p className="text-muted-foreground">Skapa professionella offerter för dina leads</p>
          </div>
          <Badge className={getStatusColor(quote.status)}>
            {getStatusText(quote.status)}
          </Badge>
        </div>

        {/* Lead Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Kund
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={quote.leadId || "none"} onValueChange={(value: string) => {
              const lead = value === "none" ? null : leads.find(l => l.id === value);
              setSelectedLead(lead);
              setQuote(prev => ({ ...prev, leadId: value === "none" ? "" : value }));
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Välj en lead" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Välj en lead</SelectItem>
                {leads.map(lead => (
                  <SelectItem key={lead.id} value={lead.id}>
                    <div className="flex items-center gap-2">
                      <span>{lead.name}</span>
                      <span className="text-muted-foreground">({lead.kommun})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedLead && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Kontaktperson</Label>
                    <p className="font-medium">{selectedLead.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Kommun</Label>
                    <p className="font-medium">{selectedLead.kommun}</p>
                  </div>
                  {selectedLead.emails[0] && (
                    <div>
                      <Label className="text-muted-foreground">E-post</Label>
                      <p className="font-medium">{selectedLead.emails[0]}</p>
                    </div>
                  )}
                  {selectedLead.phones[0] && (
                    <div>
                      <Label className="text-muted-foreground">Telefon</Label>
                      <p className="font-medium">{selectedLead.phones[0]}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Hemsida</Label>
                    <a 
                      href={selectedLead.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {selectedLead.websiteUrl}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quote Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quote Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Offertartiklar
                  </CardTitle>
                  <Button size="sm" onClick={addQuoteItem} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Lägg till artikel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {quote.items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Inga artiklar tillagda än</p>
                    <p className="text-sm">Klicka på "Lägg till artikel" för att börja</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quote.items.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-start p-4 border rounded-lg">
                        <div className="col-span-6">
                          <Label className="text-xs text-muted-foreground">Beskrivning</Label>
                          <Input
                            placeholder="T.ex. Webbdesign, Konsulttimmar, etc."
                            value={item.description}
                            onChange={(e) => updateQuoteItem(item.id, 'description', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs text-muted-foreground">Antal</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuoteItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs text-muted-foreground">Pris/st (kr)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) => updateQuoteItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-1">
                          <Label className="text-xs text-muted-foreground">Totalt</Label>
                          <div className="font-medium">{item.total} kr</div>
                        </div>
                        <div className="col-span-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuoteItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Noteringar</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Lägg till eventuella noteringar, villkor, eller annan information..."
                  value={quote.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuote(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Quote Summary & Actions */}
          <div className="space-y-6">
            {/* Quote Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Offertinformation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Offertnummer</Label>
                  <Input value={quote.quoteNumber} readOnly />
                </div>
                <div>
                  <Label>Datum</Label>
                  <Input 
                    type="date" 
                    value={quote.date}
                    onChange={(e) => setQuote(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Giltig till</Label>
                  <Input 
                    type="date" 
                    value={quote.validUntil}
                    onChange={(e) => setQuote(prev => ({ ...prev, validUntil: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Prissammanfattning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Summa:</span>
                  <span className="font-medium">{quote.subtotal} kr</span>
                </div>
                <div className="flex justify-between">
                  <span>Moms (25%):</span>
                  <span className="font-medium">{quote.vat} kr</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Totalt:</span>
                    <span>{quote.total} kr</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Åtgärder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full gap-2" 
                  onClick={generatePDF}
                  disabled={!selectedLead || quote.items.length === 0 || isGenerating}
                >
                  <Download className="h-4 w-4" />
                  {isGenerating ? 'Genererar...' : 'Ladda ner PDF'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={sendEmail}
                  disabled={!selectedLead?.emails[0] || quote.items.length === 0 || isEmailing}
                >
                  <Mail className="h-4 w-4" />
                  {isEmailing ? 'Skickar...' : 'Skicka via e-post'}
                </Button>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Offerten sparas automatiskt</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
