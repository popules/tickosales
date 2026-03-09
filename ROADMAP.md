# Ticko Sales - Comprehensive Product Roadmap

## Current State (March 2026)

**What's Done:**
- ✅ Clean brand identity (ascending bars logo, warm palette)
- ✅ Core lead management with CSV import
- ✅ Quote builder with real PDF generation
- ✅ Follow-up task system ("Idag" page)
- ✅ 5 sample leads auto-loaded
- ✅ Universal business types (not just BRFs)
- ✅ Help dialog with CSV format

**Current Limitations:**
- LocalStorage only (data lost on clear cookies)
- No user accounts
- PDF quotes lack company branding
- No email sending
- No analytics/reports

---

## Competitor Analysis: GrowTrack

**What they do well:**
- **Google Maps integration** - Auto-scrape leads from Maps searches
- **Landing page** - Clear value prop: "Leadgenerering från Google Maps"
- **Pricing** - 595 SEK/month (positioned as premium)
- **SEO** - Strong meta: "Automatiserad leadgenerering"
- **JSON-LD structured data** - Helps with Google rankings
- **Free trial** - 7 days

**What Ticko can do better:**
- Better UI/UX (GrowTrack looks generic)
- PDF quotes with YOUR branding (not just text)
- Simpler onboarding (no need for Google Cloud setup)
- More affordable pricing
- Built-in follow-up system (they don't have this)

---

## Roadmap by Phase

### Phase 1: Foundation Fix (This Week)

**Priority: CRITICAL**

1. **Company Profile System**
   - Settings page for your business info
   - Fields: Company name, address, email, phone, website, logo
   - Bankgiro/Plusgiro for invoices
   - Org number (VAT number)
   - Custom terms & conditions
   - **Impact:** PDF quotes look professional with YOUR branding

2. **Quote System Rebrand**
   - Rename "Offerter" → "Offerter & Fakturor" (Quotes & Invoices)
   - Add quote status: Draft → Sent → Accepted → Invoiced
   - Add payment terms selector (10/30/60 days)
   - Add delivery terms (FOB, EXW, etc.)
   - Add quote notes/legalese
   - **Impact:** Actually usable for real Swedish business

3. **Email Integration**
   - Send quotes via email (SendGrid/Resend)
   - Email templates with your branding
   - Track opens/clicks
   - **Impact:** Close the loop - send quotes directly

---

### Phase 2: Data Persistence (Week 2)

**Priority: HIGH**

1. **Database Migration**
   - PostgreSQL setup
   - Move from localStorage to real DB
   - Data backup/restore
   - **Impact:** No more lost data

2. **User Authentication**
   - Email/password login
   - Password reset
   - User profiles
   - **Impact:** Multi-user support, security

3. **Team Management**
   - Invite team members
   - Role-based access (admin, sales, viewer)
   - Activity log
   - **Impact:** Agency/team usage

---

### Phase 3: Lead Generation (Week 3-4)

**Priority: HIGH**

1. **Google Places API Integration**
   - Search: "byggfirmor stockholm"
   - Filter by rating, distance, open hours
   - Import with one click
   - Map view of leads
   - **Impact:** Never run out of leads

2. **Website Enrichment (Real)**
   - Scrape contact info from websites
   - Find emails via patterns + verification
   - LinkedIn integration
   - **Impact:** Rich lead data

3. **Lead Scoring**
   - AI-powered fit scoring
   - Based on website quality, size, location
   - Priority ranking
   - **Impact:** Focus on best leads first

---

### Phase 4: Business Intelligence (Week 5-6)

**Priority: MEDIUM**

1. **Analytics Dashboard**
   - Pipeline view (lead → quote → won)
   - Revenue forecasting
   - Conversion rates by source/type
   - Sales velocity (avg time to close)
   - **Impact:** Data-driven decisions

2. **Reporting**
   - Monthly sales reports
   - Lead source analysis
   - Export to Excel/PDF
   - **Impact:** Management reporting

3. **Activity Tracking**
   - Log all touchpoints
   - Timeline view per lead
   - **Impact:** Complete history

---

### Phase 5: Automation & Scale (Month 2+)

**Priority: MEDIUM**

1. **Email Sequences**
   - Automated follow-up emails
   - Template library
   - Schedule sends
   - **Impact:** Set-and-forget nurturing

2. **Integrations**
   - Fortnox/Visma integration (accounting)
   - Webhook support
   - Zapier/Make.com
   - **Impact:** Connect to existing tools

3. **Mobile App**
   - PWA or native app
   - Offline mode
   - Voice notes
   - Photo attachments
   - **Impact:** Field sales ready

4. **AI Features**
   - AI email writer
   - Call script generation
   - Deal risk prediction
   - **Impact:** Sales assistant

---

## Specific Fixes Needed

### Quote System ("Offerter")

**Current Problems:**
- Looks like an invoice, not a quote
- Missing company branding
- No terms & conditions
- No signature line

**Fixes:**
```
- Header: Your company logo + info
- Quote number + date + valid until
- Customer info block
- Line items (description, qty, price, total)
- Subtotal, VAT (25%), Total
- Terms & conditions section
- Signature lines (salesperson + customer)
- Footer: Payment info (bankgiro)
```

### Company Profile

**Required Fields:**
```
- Company name (ticko user)
- Org number
- Address
- Email, phone
- Website
- Logo upload
- Bankgiro/Plusgiro
- Default payment terms (30 days)
- Default VAT (25%)
- Custom footer text
```

---

## Pricing Strategy

**Competitor: GrowTrack @ 595 SEK/month**

**Ticko Options:**
1. **Free Tier** - 50 leads, basic quotes, localStorage
2. **Pro** - 299 SEK/month - Unlimited leads, DB storage, email sending
3. **Business** - 599 SEK/month - Team, API access, integrations

**Advantage:** Better UX, lower price, built-in follow-ups

---

## Next Steps (Tomorrow)

1. Build Company Profile settings page
2. Update PDF generator to use company branding
3. Add terms & conditions to quotes
4. Push to GitHub

---

## Long-term Vision

**Month 3:** Public launch, first 100 paying customers
**Month 6:** Integrations ecosystem, partner program
**Month 12:** #1 Swedish SMB sales tool

**Exit opp:** Acquired by Fortnox/Visma/Dustin

---

*Generated for Anton Åberg - Ticko Sales*
*March 9, 2026*
