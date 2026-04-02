# New Client Portal — Build Guide
**Last Updated:** 2026-04-02
**Reference Implementation:** `websites/02-dancescapes/`
**Maintained By:** Claude + Kenny

---

## Overview

This guide walks through creating a branded social media portal for a new client from scratch. The portal is a static Cloudflare Pages site backed by a Cloudflare D1 inbox database and two n8n workflows. All client data lives in the Fillout/Zite database and is used to configure each portal.

**Time to deploy a new portal: ~30–45 minutes**

---

## Step 0 — Prerequisites: Client Must Exist in Zite

Before building anything, confirm the client record exists in Fillout (Zite). It should have been created by the **n8n Client Onboarding Workflow** (`Ckwcm2H3x8kHDBVi`).

### Required Fields in Clients Table (`thCZdPGZ4pk`)

Fetch the client record from Fillout:
```
GET https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/thCZdPGZ4pk/records
Authorization: Bearer {{FILLOUT_API_KEY}}
```

Confirm these fields are populated before proceeding:

| Field | Example | Used For |
|---|---|---|
| `Name` | `Dancescapes Performing Arts` | Portal title, footer, greetings |
| `Business Name` | `Dancescapes Performing Arts LLC` | Footer legal name |
| `Contact Email` | `info@dancescapes.com` | Reference only |
| `Metricool User ID` | `4660143` | n8n API calls (shared across all clients) |
| `Metricool Blog ID` | `6035446` | **Primary identifier** — every API call uses this |
| `Logo URL` | `https://pub-ba8be99ab92a493c8f41012c737905d5.r2.dev/dancescapes%20logo.jpg` | Header logo img src |
| `Brand Colors` | `#c9a84c,#d4619c` | CSS `--primary` and `--accent` variables |
| `Website URL` | `https://www.dancescapesperformingarts.com` | Sidebar quick link |
| `Status` | `Active` | Confirm before building |

> **If Logo URL is missing:** Upload the client's logo to Cloudflare R2 bucket `pub-ba8be99ab92a493c8f41012c737905d5` and paste the public URL into the Clients record before proceeding. See `storage/r2-bucket-policy.json` for upload instructions.

> **If Brand Colors is missing:** Go to the client's website, pick the dominant color for `--primary` and a complementary/accent color for `--accent`. Enter as `#hex1,#hex2` in Zite.

---

## Step 1 — Gather Client Config Values

From the Zite client record, collect:

```
CLIENT_NAME        = "Studio Name"              # e.g. "Dancescapes"
CLIENT_FULL_NAME   = "Studio Name LLC"          # e.g. "Dancescapes Performing Arts LLC"
CLIENT_LOCATION    = "City, State"              # e.g. "Endicott, NY"
CLIENT_WEBSITE     = "https://..."              # e.g. "https://www.dancescapesperformingarts.com"
CLIENT_EMAIL       = "info@..."                 # e.g. "info@dancescapes.com"
METRICOOL_BLOG_ID  = "6035446"                  # from Zite Metricool Blog ID field
METRICOOL_USER_ID  = "4660143"                  # shared — same for all clients
LOGO_URL           = "https://pub-...r2.dev/..." # from Zite Logo URL field
COLOR_PRIMARY      = "#c9a84c"                  # first hex in Brand Colors
COLOR_ACCENT       = "#d4619c"                  # second hex in Brand Colors
EMOJI_FALLBACK     = "💃"                       # fallback if logo fails to load
PORTAL_SLUG        = "clientname"               # lowercase, no spaces (used in URLs/filenames)
```

> **Deriving `COLOR_PRIMARY` CSS variants** — The portal uses these derived values. Calculate them from `COLOR_PRIMARY`:
> - `--primary`       = `COLOR_PRIMARY` (e.g. `#c9a84c`)
> - `--primary-light` = slightly lighter (~15%) e.g. `#e8c76a`
> - `--primary-dim`   = `rgba(R,G,B,0.12)` e.g. `rgba(201,168,76,0.12)`
> - `--primary-border`= `rgba(R,G,B,0.22)` e.g. `rgba(201,168,76,0.22)`
> - `--accent`        = `COLOR_ACCENT` (e.g. `#d4619c`)
>
> You can ask Claude: *"Give me the rgba breakdown and lighter variant of #c9a84c"*

---

## Step 2 — Create the Portal Folder

```bash
# In the project root:
cp -r websites/02-dancescapes websites/03-{PORTAL_SLUG}
cd websites/03-{PORTAL_SLUG}
```

Rename the GitHub repo for the new client (or create a new one):
```bash
git init
git remote add origin https://github.com/myautomationpartner/{PORTAL_SLUG}-portal.git
```

---

## Step 3 — Find & Replace All Client-Specific Values

Open `public/index.html` and replace every occurrence of the Dancescapes values with the new client values. The full list of substitutions:

### HTML / Content Substitutions

| Find | Replace With | Where |
|---|---|---|
| `Dancescapes — Social Media Command Center` | `{CLIENT_NAME} — Social Media Command Center` | `<title>` tag |
| `https://pub-ba8be99ab92a493c8f41012c737905d5.r2.dev/dancescapes%20logo.jpg` | `{LOGO_URL}` | `<img src=` in header |
| `alt="Dancescapes"` | `alt="{CLIENT_NAME}"` | logo `<img>` |
| `💃` | `{EMOJI_FALLBACK}` | `.brand-logo-fallback` div |
| `Dancescapes` (brand name in header) | `{CLIENT_NAME}` | `.brand-name` div |
| `Welcome back, <span class="brand-accent">Dancescapes!</span>` | `Welcome back, <span class="brand-accent">{CLIENT_NAME}!</span>` | hero greeting |
| `Dancescapes Performing Arts LLC` | `{CLIENT_FULL_NAME}` | site footer |
| `Endicott, NY` | `{CLIENT_LOCATION}` | site footer |
| `Dancescapes Unified Inbox` | `{CLIENT_NAME} Unified Inbox` | panel title + header button (3 spots) |

### JavaScript Substitutions

| Find | Replace With | Where |
|---|---|---|
| `const INBOX_BLOG_ID = '6035446'` | `const INBOX_BLOG_ID = '{METRICOOL_BLOG_ID}'` | JS constants block |
| `webhook/metrics/dancescapes` | `webhook/metrics/{PORTAL_SLUG}` | `syncFromApi()` fetch URL |
| `blogId=6035446` (in n8n nodes) | `blogId={METRICOOL_BLOG_ID}` | n8n workflows (see Step 6) |
| `userId=4660143` | `userId={METRICOOL_USER_ID}` | n8n workflows |

### CSS Color Substitutions (`:root` block, lines ~12–18)

| Find | Replace With |
|---|---|
| `--gold: #c9a84c` | `--gold: {COLOR_PRIMARY}` |
| `--gold-light: #e8c76a` | `--gold-light: {COLOR_PRIMARY_LIGHT}` |
| `--gold-dim: rgba(201,168,76,0.12)` | `--gold-dim: rgba({R},{G},{B},0.12)` |
| `--gold-border: rgba(201,168,76,0.22)` | `--gold-border: rgba({R},{G},{B},0.22)` |
| `--rose: #d4619c` | `--rose: {COLOR_ACCENT}` |
| `--border-gold: rgba(201,168,76,0.18)` | `--border-gold: rgba({R},{G},{B},0.18)` |

### Default Quick Links — Update Studio Section

In the `DEFAULT_LINKS` array (search for `DEFAULT_LINKS = [`), update the Studio-section links to match the new client:

```javascript
{ id: 'website', icon: '🌐', label: '{CLIENT_NAME} Website', desc: 'Your live website', url: '{CLIENT_WEBSITE}', section: 'Studio', builtin: true },
{ id: 'email',   icon: '✉️', label: 'Email Inbox', desc: '{CLIENT_EMAIL}', url: 'https://outlook.office.com/mail/', section: 'Studio', builtin: true },
```

### Calendar Content Ideas & Hashtags

The `CALENDAR_DATA`, `CONTENT_IDEAS`, and `HASHTAGS` objects contain Dancescapes-specific copy. For a new client:
- Replace `HASHTAGS.studio` with the client's own branded hashtags
- Replace `HASHTAGS.local` with the client's city/region hashtags
- Update `CALENDAR_DATA` day suggestions to match the client's industry
- Update `CONTENT_IDEAS` categories to match the client's services

> **Tip:** Ask Claude: *"Rewrite CALENDAR_DATA and CONTENT_IDEAS for a [business type] called [name] in [city]. Match the existing JS format."*

---

## Step 4 — Create the Cloudflare D1 Inbox Database

```bash
cd websites/03-{PORTAL_SLUG}

# Create D1 database
npx wrangler d1 create {PORTAL_SLUG}-inbox
# → Copy the database_id from output
```

Update `wrangler.jsonc`:
```jsonc
{
  "name": "{PORTAL_SLUG}-portal",
  "compatibility_date": "2025-09-27",
  "pages_build_output_dir": "./public",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "{PORTAL_SLUG}-inbox",
      "database_id": "PASTE_ID_FROM_ABOVE"
    }
  ]
}
```

Apply the schema:
```bash
npx wrangler d1 execute {PORTAL_SLUG}-inbox --file=./schema.sql --remote
```

The `schema.sql` file is already in the folder from the Dancescapes template — no changes needed.

---

## Step 5 — Create the Cloudflare Pages Project & Deploy

```bash
# First deploy creates the project
npx wrangler pages deploy public --project-name {PORTAL_SLUG}-portal --branch main --commit-dirty=true
```

Then connect to GitHub for auto-deploy on push:
1. Go to Cloudflare Dashboard → Pages → `{PORTAL_SLUG}-portal`
2. Settings → Git Integration → Connect to `github.com/myautomationpartner/{PORTAL_SLUG}-portal`
3. Build settings: leave blank (static site, no build command)
4. Save

**Production URL:** `https://{PORTAL_SLUG}-portal.pages.dev`

> **Custom domain (optional):** Cloudflare Dashboard → Pages → Custom Domains → Add `portal.{clientdomain}.com`. Add a CNAME record in DNS pointing to `{PORTAL_SLUG}-portal.pages.dev`.

---

## Step 6 — Create n8n Workflows

### Workflow A: `{NN}-metrics-api` (Metrics Webhook)

The metrics API workflow serves live follower data to the portal. Clone from workflow `zleaSkTADuVITFNF` (`03-metrics-api`) and update:

| Node | Change |
|---|---|
| Webhook path | Change from `/webhook/metrics/dancescapes` → `/webhook/metrics/{PORTAL_SLUG}` |
| Fillout GET (record count) | No change (same table `tfkftiCb4U3`) |
| Fillout GET (latest record) | Filter by `Linked Client = {CLIENT_ZITE_RECORD_ID}` if multi-tenant |
| Response node | No change |

**Webhook URL after deploy:** `https://n8n.myautomationpartner.com/webhook/metrics/{PORTAL_SLUG}`

### Workflow B: `{NN}-inbox-sync` (Inbox Sync)

Clone from workflow `qK0RZKWwfgJ2uBSl` (`04-inbox-sync`) and update:

| Node | Change |
|---|---|
| `Fetch Facebook messages` | Change `blogId` query param → `{METRICOOL_BLOG_ID}` |
| `Fetch Instagram messages` | Change `blogId` query param → `{METRICOOL_BLOG_ID}` |
| `Fetch Google reviews` | Change `blogId` query param → `{METRICOOL_BLOG_ID}` |
| `Format all messages for D1` | Change `const blogId = '6035446'` → `'{METRICOOL_BLOG_ID}'` |
| `Upsert messages to D1` | Change URL → `https://{PORTAL_SLUG}-portal.pages.dev/api/inbox` |

### Workflow C: `{NN}-inbox-reply` (Reply Webhook)

Clone from workflow `JUDslexiU17mcjfL` (`05-inbox-reply`) and update:

| Node | Change |
|---|---|
| Webhook path | Change from `/webhook/inbox-reply` → `/webhook/inbox-reply-{PORTAL_SLUG}` |
| `Reply to Google review` | Change `blogId` query param → `{METRICOOL_BLOG_ID}` |
| `Reply to message` | Change `blogId` query param → `{METRICOOL_BLOG_ID}` |

**Then update the portal JS:**
```javascript
// In public/index.html, update:
const INBOX_REPLY_URL = 'https://n8n.myautomationpartner.com/webhook/inbox-reply-{PORTAL_SLUG}';
```

### Activate all three workflows in n8n after creation.

---

## Step 7 — Update `MAP_MASTER.md`

Add the new client to the **Live Clients** table:
```markdown
| {CLIENT_NAME} | {METRICOOL_BLOG_ID} | {METRICOOL_USER_ID} | Active |
```

Add D1 database to tech stack and the three new workflows to the N8N Workflows section.

---

## Step 8 — Commit & Open PR

```bash
cd websites/03-{PORTAL_SLUG}
git add .
git commit -m "feat: initial portal for {CLIENT_NAME}"
git push -u origin main
gh pr create --title "feat: {CLIENT_NAME} portal" --body "New client portal — {CLIENT_NAME} ({METRICOOL_BLOG_ID})"
```

---

## Step 9 — Test Checklist

- [ ] Portal loads at `https://{PORTAL_SLUG}-portal.pages.dev`
- [ ] Client logo shows in header (not fallback emoji)
- [ ] Brand colors match client's palette — not Dancescapes gold
- [ ] Follower counts load from live API (green dot in header)
- [ ] **Unified Inbox** tab shows `{CLIENT_NAME} Unified Inbox` as title
- [ ] Manually trigger `{NN}-inbox-sync` in n8n → messages appear in Inbox tab
- [ ] Red badge appears on header Inbox button after sync
- [ ] Send a test reply → verify n8n `{NN}-inbox-reply` fires
- [ ] Quick Links sidebar has correct website URL for client
- [ ] Footer shows correct business name and location
- [ ] All hashtags and calendar content are client-specific (not Dancescapes)
- [ ] Mobile layout looks correct (sidebar toggle, inbox stacks)

---

## Reference: File Map

```
websites/03-{PORTAL_SLUG}/
├── public/
│   └── index.html          ← Single-file portal (all HTML/CSS/JS)
├── functions/
│   └── api/
│       └── inbox.js        ← Cloudflare Pages Function (D1 read/write)
├── schema.sql              ← D1 unified_messages table definition
├── wrangler.jsonc          ← Cloudflare config (name, D1 binding)
└── portal.html             ← Mirror of public/index.html (kept in sync)
```

---

## Reference: Zite Fillout API — Fetch a Client Record

To programmatically pull all brand data for a client by name:

```bash
curl -X GET "https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/thCZdPGZ4pk/records?limit=50" \
  -H "Authorization: Bearer {{FILLOUT_API_KEY}}"
```

Response fields to extract:
```json
{
  "record": {
    "Name": "Dancescapes Performing Arts",
    "Metricool Blog ID": "6035446",
    "Metricool User ID": "4660143",
    "Logo URL": "https://pub-....r2.dev/...",
    "Brand Colors": "#c9a84c,#d4619c",
    "Website URL": "https://www.dancescapesperformingarts.com",
    "Contact Email": "info@dancescapes.com"
  }
}
```

> **Future automation idea:** Build an n8n workflow that reads these Zite fields and auto-generates the portal `index.html` via a template engine — zero manual find-and-replace needed. See `MAP_MASTER.md` Priority 3 for the roadmap item.

---

## Quick Reference — Dancescapes as Template

| Value | Dancescapes Example |
|---|---|
| Metricool Blog ID | `6035446` |
| Metricool User ID | `4660143` |
| Cloudflare Pages project | `my-automation-partner` |
| D1 database | `dancescapes-inbox` (ID: `41d9a55e-eb6b-4355-b5c4-e3bea530afec`) |
| n8n metrics webhook | `/webhook/metrics/dancescapes` |
| n8n inbox-reply webhook | `/webhook/inbox-reply` |
| n8n workflow: metrics API | `zleaSkTADuVITFNF` |
| n8n workflow: inbox sync | `qK0RZKWwfgJ2uBSl` |
| n8n workflow: inbox reply | `JUDslexiU17mcjfL` |
| Primary color | `#c9a84c` (gold) |
| Accent color | `#d4619c` (rose) |
| Logo R2 URL | `https://pub-ba8be99ab92a493c8f41012c737905d5.r2.dev/dancescapes%20logo.jpg` |
| Portal repo | `github.com/myautomationpartner/dancescapes-portal` |
| Zite Base ID | `9e604ece6abca0ed` |
| Zite Clients table | `thCZdPGZ4pk` |
| Zite Metrics table | `tfkftiCb4U3` |
