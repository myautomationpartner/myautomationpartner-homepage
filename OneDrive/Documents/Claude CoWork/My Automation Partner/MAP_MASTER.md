# My Automation Partner — Master Project Brief
**Last Updated:** March 30, 2026
**Domain:** myautomationpartner.com
**Role:** Claude is Senior Developer & Business Partner

---

## BUSINESS VISION

Build a scalable, high-margin **automated social media management client portal** — selling a fully managed ecosystem, not just software.

**Core Value Proposition:**
- Clients get a branded portal with real-time social media metrics, content calendar, and team management
- Unlimited clients/users for ~$40/mo total backend cost
- Fully automated: zero manual data entry once a client is onboarded
- Role-based access: Client A only ever sees Client A's data

---

## TECH STACK (What We're Running)

| Service | URL | Purpose | Monthly Cost |
|---------|-----|---------|-------------|
| **Fillout (Zite)** | build.fillout.com | Database + UI dashboard frontend | ~$19/mo |
| **n8n** | n8n.myautomationpartner.com | Self-hosted automation engine | ~$10/mo |
| **Coolify** | 87.99.128.65:8000 | Deployment & hosting manager | ~$10/mo |
| **Hetzner VPS** | 87.99.128.65 | Physical server running n8n + Coolify | (included above) |
| **Cloudflare R2** | pub-ba8be99ab92a493c8f41012c737905d5.r2.dev | File storage (logos, media assets) | ~$1/mo |
| **Metricool** | app.metricool.com | Social media metrics API | Variable |
| **Resend** | api.resend.com | Transactional email (replaces SMTP) | Free tier |
| **Airtable** | airtable.com | Backup database reference | Available |

**Total Monthly Cost: ~$40/mo**

**Credentials:** Stored in `credential.txt` in this folder. Never stored in code. Claude always prompts for manual login.

---

## DATABASE SCHEMA (Fillout/Zite)

**Base ID:** `9e604ece6abca0ed`

### Table 1: Clients (`thCZdPGZ4pk`)
| Field | Type | Notes |
|-------|------|-------|
| Name | Text | Primary key display |
| Business Name | Text | |
| Contact Email | Email | |
| Status | Select | Active / Inactive |
| Subscription Plan | Select | Starter / Growth / Agency |
| Onboarding Status | Select | Invited / Setup / Active |
| Metricool User ID | Text | Shared across brands (4660143) |
| Metricool Blog ID | Text | Unique per client |
| Logo URL | URL | Stored in Cloudflare R2 |
| Brand Colors | Text | Hex codes e.g. "#9C27B0,#FF9800" |
| Website URL | URL | For auto brand detection |

### Table 2: Users (`tfgmDJ9BFXf`)
| Field | Type | Notes |
|-------|------|-------|
| Name | Text | |
| Email | Email | Login credential |
| Role | Select | Admin / Editor / Viewer |
| Active | Checkbox | |
| Linked Client | Relation | Foreign key → Clients table |

### Table 3: Content Calendar (table ID TBD)
| Field | Type | Notes |
|-------|------|-------|
| Post Date/Time | DateTime | |
| Platform | Select | Instagram / Facebook / TikTok |
| Status | Select | Draft / Scheduled / Published |
| Media Asset URL | URL | Stored in Cloudflare R2 |
| Linked Client | Relation | Foreign key → Clients table |

### Table 4: Metrics (`tfkftiCb4U3`)
| Field | Type | Notes |
|-------|------|-------|
| Date | DateTime | |
| Followers_Instagram | Number | |
| Followers_TikTok | Number | |
| Followers_Facebook | Number | |
| Platform | Text | "Multi-Platform" |
| Linked Client | Relation | Foreign key → Clients table |

---

## LIVE CLIENTS IN SYSTEM

| Client | Metricool Blog ID | Metricool User ID | Status |
|--------|------------------|------------------|--------|
| Dancescapes Performing Arts | 6035446 | 4660143 | Active (test) |
| My Automation Partner | 6035338 | 4660143 | Active (internal) |

---

## N8N WORKFLOWS

### Workflow 1: Multi-Platform Metrics (LIVE ✅)
**ID:** `Ag4LvhN5gkxFoKgN`
**Status:** Published v2, running hourly
**What it does:** Pulls follower counts from Instagram, TikTok, and Facebook via Metricool API → merges into single record → POSTs to Fillout Metrics table

**Architecture:**
```
Schedule Trigger (hourly)
  → HTTP: Metricool Instagram followers
  → HTTP: Metricool TikTok followers
  → HTTP: Metricool Facebook followers
  → Set node: merge all 3 into one object
  → HTTP POST: Fillout Metrics table
```

**Critical API Details:**
- Endpoint: `GET https://app.metricool.com/api/v2/analytics/timelines`
- Auth header: `X-Mc-Auth` (value in credential.txt)
- Platform metric names: Instagram=`followers`, TikTok=`followers_count`, Facebook=`pageFollows`
- Date format MUST use `Z` suffix (NOT `+00:00` — Metricool breaks on `+` signs)
- n8n date expression: `{{ $now.minus({days: 30}).toUTC().toISO().substring(0, 19) + 'Z' }}`

---

### Workflow 2: Client Onboarding Automation (LIVE ✅ — minor issues)
**ID:** `Ckwcm2H3x8kHDBVi`
**Status:** Published, functional but has known bugs
**Webhook URL:** `https://n8n.myautomationpartner.com/webhook/client-onboarding`

**What it does:** Receives client signup data via webhook → creates client record in Fillout → creates linked admin user → sends welcome email (currently disconnected) → returns success

**Architecture:**
```
Webhook POST /webhook/client-onboarding
  → Format Client Data (Set node)
  → HTTP POST: Create Client in Fillout Clients table
  → HTTP POST: Create Admin User in Fillout Users table
  → [Send Welcome Email — currently disconnected]
  → Return Success Response
```

**Fillout API (correct URLs — this was a critical fix):**
- Clients: `https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/thCZdPGZ4pk/records`
- Users: `https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/tfgmDJ9BFXf/records`
- Auth: `Bearer sk_prod_...` (in credential.txt)

**Known Issues / Current Bugs:**
1. **Linked Client shows "Untitled record"** — admin user is linked to client by ID but display name isn't resolving correctly in Fillout UI
2. **Send Welcome Email disconnected** — Resend API node is configured but not wired into the main flow (SMTP blocked by Hetzner; switched to Resend)
3. **Active checkbox not checked** on new users — Active=true should be set in Create Admin User body

**Test Payload:**
```json
{
  "businessName": "Dancescapes Performing Arts",
  "contactEmail": "info@dancescapes.com",
  "clientWebsite": "https://dancescapesperformingarts.com",
  "blogId": "6035446",
  "metricoolUserId": "4660143"
}
```

---

### Workflow 3: Brand Detection (PARTIAL ⚠️)
**ID:** `vf4axtaZlDvwsdFo`
**Status:** Framework exists, not fully integrated
**What it does (planned):** Scrapes client website → extracts logo + brand colors → uploads logo to Cloudflare R2 → updates Zite client record with branding data

---

## KEY TECHNICAL DISCOVERY: Pinia Store Injection

**The canonical method for editing n8n workflows programmatically** (bypasses broken MCP validation):

```javascript
(async () => {
  const app = document.querySelector('#app').__vue_app__;
  const pinia = app.config.globalProperties.$pinia;
  const store = pinia._s.get('workflows');

  store.setNodes(nodes);
  store.setConnections(connections);
  const result = await store.updateWorkflow('WORKFLOW_ID', {
    nodes: store.getNodes(),
    connections: store.allConnections,
    name: 'workflow-name'
  });
  return `Saved: ${result?.name}, nodes: ${result?.nodes?.length}`;
})()
```

The full reusable template is in `n8n_workflow_tool.js`.

**Important:** Node body is stored in `parameters.jsonBody` (not `parameters.body`).

---

## WHAT HAS BEEN ACCOMPLISHED

- ✅ Full tech stack selected, configured, and running
- ✅ Fillout database schema created (4 tables)
- ✅ Metricool API integrated and tested (Instagram + TikTok + Facebook)
- ✅ Metrics workflow live and running hourly
- ✅ Client onboarding workflow live (creates client + admin user records)
- ✅ Discovered and solved n8n programmatic editing via Pinia injection
- ✅ Solved Hetzner SMTP block — pivoted to Resend API for email
- ✅ Fixed Fillout API URL structure (tables.fillout.com vs api.fillout.com)
- ✅ Two test clients in system: Dancescapes + My Automation Partner

---

## WHAT STILL NEEDS TO BE DONE

### Priority 1 — Fix Existing Workflow Bugs
- [ ] Fix "Linked Client" display in Users table (investigate Fillout linked record API format)
- [ ] Reconnect Send Welcome Email node using Resend API
- [ ] Set `Active: true` on new users during onboarding
- [ ] Test end-to-end with a clean fresh client onboarding

### Priority 2 — Content Calendar Workflow
- [ ] Build n8n workflow to pull scheduled posts from Metricool scheduler API
- [ ] Format and push to Fillout Content Calendar table
- [ ] Support both Dancescapes (blogId: 6035446) + My Automation Partner (blogId: 6035338)

### Priority 3 — Zite Frontend (Client Portal UI)
- [ ] Build Dashboard page (KPI cards: followers, engagement)
- [ ] Build Content Calendar page (monthly/weekly view)
- [ ] Build Team Management page
- [ ] Build Analytics & Reports page
- [ ] Set up dynamic data filtering by Linked Client ID
- [ ] Role-based views (Admin sees all, Viewer sees own client only)
- [ ] Mobile responsive design

### Priority 4 — Brand Detection (Optional Enhancement)
- [ ] Complete brand detection workflow (scrape logo + colors from client website)
- [ ] Upload logo to Cloudflare R2
- [ ] Update Zite client record with logo URL + brand colors
- [ ] Apply branding to client portal

### Priority 5 — Business Operations
- [ ] Client onboarding intake form (in Zite or external)
- [ ] Internal admin dashboard (see all clients at a glance)
- [ ] Scheduled email digests (weekly performance summaries)
- [ ] White-label custom domain setup per client
- [ ] Pricing and subscription management workflow

---

## WORKING PROTOCOL

**When Claude needs a service login:**
1. Claude says: "I need to log into [Service]. Ready to manually enter credentials?"
2. You enter credentials manually
3. Claude navigates and proposes changes
4. Claude asks approval before executing

**Credentials stored in:** `credential.txt` (this folder) — never in code or docs.

**n8n workflow editing:** Always use Pinia store injection via `javascript_tool` — see `n8n_workflow_tool.js`

---

## RESEND EMAIL CONFIG
- API Key: in credential.txt
- From address: onboarding@myautomationpartner.com
- DNS configured for myautomationpartner.com (may need propagation)
- API endpoint: `POST https://api.resend.com/emails`

---

*This document is the single source of truth. All other documentation files are superseded by this.*
