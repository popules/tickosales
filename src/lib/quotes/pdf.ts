import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

interface Lead {
  id: string;
  name: string;
  websiteUrl: string;
  kommun: string;
  type: string;
  contactStatus: string;
  enrichmentStatus: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
}

export function generateQuotePDF(quote: QuoteData, lead: Lead | null): jsPDF {
  const doc = new jsPDF();
  
  // Add font for better Swedish character support
  doc.setFont("helvetica");
  
  // Header with logo area
  doc.setFillColor(8, 145, 178); // cyan-600
  doc.rect(0, 0, 210, 40, "F");
  
  // Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("ticko", 15, 25);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Offert", 15, 32);
  
  // Quote info box (top right)
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(120, 50, 75, 50, 3, 3, "F");
  
  doc.setTextColor(71, 85, 105); // slate-600
  doc.setFontSize(9);
  doc.text("Offertnummer:", 125, 62);
  doc.text("Datum:", 125, 72);
  doc.text("Giltig till:", 125, 82);
  doc.text("Status:", 125, 92);
  
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont("helvetica", "bold");
  doc.text(quote.quoteNumber, 170, 62);
  doc.setFont("helvetica", "normal");
  doc.text(quote.date, 170, 72);
  doc.text(quote.validUntil, 170, 82);
  
  // Status badge
  const statusColors: Record<string, [number, number, number]> = {
    draft: [148, 163, 184],     // slate-400
    sent: [6, 182, 212],        // cyan-500
    accepted: [34, 197, 94],    // green-500
    rejected: [239, 68, 68],    // red-500
  };
  const statusLabels: Record<string, string> = {
    draft: "Utkast",
    sent: "Skickad",
    accepted: "Accepterad",
    rejected: "Avslagen",
  };
  const color = statusColors[quote.status] || [148, 163, 184];
  doc.setFillColor(color[0], color[1], color[2]);
  doc.roundedRect(170, 85, 20, 8, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text(statusLabels[quote.status] || quote.status, 173, 90.5);
  
  // Customer section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Kund", 15, 55);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  if (lead) {
    doc.text(lead.name, 15, 65);
    if (lead.address) doc.text(lead.address, 15, 72);
    doc.text(lead.kommun, 15, lead.address ? 79 : 72);
    if (lead.email) {
      doc.setTextColor(8, 145, 178);
      doc.text(lead.email, 15, lead.address ? 86 : 79);
    }
  } else {
    doc.text("Ingen kund vald", 15, 65);
  }
  
  // Items table
  if (quote.items.length > 0) {
    autoTable(doc, {
      startY: 110,
      head: [["Beskrivning", "Antal", "Pris/st", "Totalt"]],
      body: quote.items.map(item => [
        item.description,
        item.quantity.toString(),
        `${item.unitPrice.toLocaleString('sv-SE')} kr`,
        `${item.total.toLocaleString('sv-SE')} kr`,
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [8, 145, 178],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' },
      },
    });
  }
  
  // Totals section
  const autoTableDoc = doc as any;
  const totalsY = autoTableDoc.lastAutoTable?.finalY || 140;
  
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(120, totalsY + 10, 75, 45, 3, 3, "F");
  
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text("Summa:", 125, totalsY + 22);
  doc.text(`Moms (${(quote.vat * 100).toFixed(0)}%):`, 125, totalsY + 32);
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.text("Totalt:", 125, totalsY + 45);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(10);
  doc.text(`${quote.subtotal.toLocaleString('sv-SE')} kr`, 185, totalsY + 22, { align: 'right' });
  doc.text(`${(quote.subtotal * quote.vat).toLocaleString('sv-SE')} kr`, 185, totalsY + 32, { align: 'right' });
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(8, 145, 178);
  doc.setFontSize(14);
  doc.text(`${quote.total.toLocaleString('sv-SE')} kr`, 185, totalsY + 45, { align: 'right' });
  
  // Notes section
  if (quote.notes) {
    const notesY = totalsY + 60;
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text("Noteringar", 15, notesY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const splitNotes = doc.splitTextToSize(quote.notes, 180);
    doc.text(splitNotes, 15, notesY + 8);
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(248, 250, 252);
  doc.rect(0, pageHeight - 25, 210, 25, "F");
  
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.setFont("helvetica", "normal");
  doc.text("ticko.se | Offert genererad automatiskt", 105, pageHeight - 12, { align: 'center' });
  doc.text("Betalningsvillkor: 30 dagar netto | För frågor, kontakta oss på hej@ticko.se", 105, pageHeight - 6, { align: 'center' });
  
  return doc;
}

export function downloadQuotePDF(quote: QuoteData, lead: Lead | null): void {
  const doc = generateQuotePDF(quote, lead);
  doc.save(`offert_${quote.quoteNumber}_${lead?.name || 'kund'}.pdf`);
}
