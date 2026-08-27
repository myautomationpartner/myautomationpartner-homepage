# My Automation Partner - Project Structure

**Last Updated:** March 30, 2026
**Status:** Production Ready
**Vision:** Scalable, high-margin automated social media management client portal

---

## 📁 Folder Organization

### `/docs` — Documentation & Reference
**Purpose:** All technical documentation, API references, and business guides.

**Contents:**
- `API_REFERENCE.md` — Fillout, Metricool, Resend, Cloudflare APIs
- `SETUP_GUIDE.md` — Getting started, service logins, initial config
- `ARCHITECTURE.md` — System design, data flow, integration points
- `WORKFLOWS.md` — Detailed workflow documentation
- `CLIENT_GUIDE.md` — How clients use the portal
- `TROUBLESHOOTING.md` — Common issues and solutions

### `/operations` — Business Operations & Client Management
**Purpose:** Daily operations, client records, team documentation, processes.

**Contents:**
- `CLIENTS.md` — Active clients list, contact info, Metricool IDs
- `ONBOARDING_CHECKLIST.md` — Step-by-step new client setup
- `TEAM_ROLES.md` — Team member roles, responsibilities, access levels
- `SLA.md` — Service level agreements, uptime targets, support hours
- `PRICING.md` — Subscription plans, feature tiers, renewal terms
- `INCIDENT_LOG.md` — Uptime issues, outages, resolution notes

### `/workflows` — n8n Workflow Definitions & Management
**Purpose:** Automation workflow code, templates, and deployment records.

**Contents:**
- `LIVE_WORKFLOWS.md` — Production workflows currently deployed
  - Workflow ID: Ag4LvhN5gkxFoKgN (Multi-Platform Metrics)
  - Workflow ID: Ckwcm2H3x8kHDBVi (Client Onboarding)
- `workflow-backups/` — JSON backups of all workflows
- `WORKFLOW_TESTING.md` — Testing procedures, test data, validation

### `/assets` — Logos, Media, Branding
**Purpose:** Visual assets for the platform and client branding.

**Contents:**
- `logo.svg` / `logo.png` — My Automation Partner branding
- `client-logos/` — Client logos (stored in Cloudflare R2, backed up here)
- `email-templates/` — HTML email templates (welcome, digest, etc.)
- `brand-guidelines.md` — Color palette, typography, design standards

### `/development` — Code Snippets, Tools, Testing
**Purpose:** Reusable code, utility scripts, test data, dev tools.

**Contents:**
- `n8n_workflow_tool.js` — Pinia store injection template for programmatic workflow editing
- `test_payloads/` — Sample webhook payloads for testing
- `query_templates/` — Common n8n expressions and queries
- `debug_scripts/` — Troubleshooting scripts

---

## 📋 Core Files (Root Level)

| File | Purpose | Keep Updated |
|------|---------|--------------|
| `MAP_MASTER.md` | Single source of truth — all infrastructure, tech stack, APIs, accomplishments, pending work | ✅ Weekly |
| `credential.txt` | Credentials for all services (never commit to code) | ✅ As needed |
| `PROJECT_STRUCTURE.md` | This file — folder organization and purpose | ✅ Monthly |

---

## 🔄 Workflow: How to Update the Project

### When Adding a New Feature or Fixing a Bug:
1. Update `MAP_MASTER.md` with changes to workflows, APIs, or database schema
2. Create/update relevant files in `/docs`, `/operations`, or `/development`
3. Test in n8n using Pinia injection script (`development/n8n_workflow_tool.js`)
4. Document the change in `/workflows/LIVE_WORKFLOWS.md`

### When Onboarding a New Client:
1. Follow checklist: `operations/ONBOARDING_CHECKLIST.md`
2. Add client record: `operations/CLIENTS.md`
3. Trigger n8n workflow: `Webhook: POST https://n8n.myautomationpartner.com/webhook/client-onboarding`
4. Verify in Zite database: `build.fillout.com/database/9e604ece6abca0ed`

### When Deploying a New Workflow:
1. Write workflow using n8n UI or Pinia injection
2. Export to `/workflows/workflow-backups/{workflow-name}.json`
3. Test with payloads in `/development/test_payloads/`
4. Document in `/workflows/LIVE_WORKFLOWS.md`
5. Publish and monitor execution logs

---

## 🔐 Security & Best Practices

| Practice | Details |
|----------|---------|
| **Credentials** | Never commit `credential.txt` to git. Only store in secure vault. |
| **API Keys** | n8n, Fillout, Metricool, Resend, Cloudflare keys stored in `credential.txt` |
| **Database** | Fillout/Zite handles backups; all client data encrypted in transit |
| **Access Control** | Role-based (Admin/Editor/Viewer) with Linked Client ID isolation |
| **Monitoring** | Check n8n execution logs daily; monitor uptime metrics |

---

## 📊 Key Metrics & Targets

- **Backend Cost:** < $40/month (target: $30-35/month)
- **Clients:** Unlimited (architecture scales horizontally)
- **Users per Client:** Unlimited (single backend cost)
- **Workflow Run Cost:** Zero (self-hosted n8n on fixed $10/mo VPS)
- **Dashboard Load Time:** < 2 seconds
- **Uptime Target:** 99.5% (0.5% = ~3.6 hours/month downtime)

---

## 🚀 Next Priority Tasks

1. **Content Calendar Workflow** — Pull scheduled posts from Metricool and sync to Fillout
2. **Zite Frontend Customization** — Build dashboard, calendar, analytics pages
3. **Client Portal Launch** — Test with Dancescapes, then onboard first real client
4. **White-Label Setup** — Custom domain per client, branded portal
5. **Email Digests** — Weekly performance summaries to client email

---

## 📞 Quick Links

| Service | URL | Login |
|---------|-----|-------|
| **Zite (Portal & DB)** | https://build.fillout.com | billing@myautomationpartner.com |
| **n8n (Workflows)** | https://n8n.myautomationpartner.com | kennymonico@gmail.com |
| **Metricool (Metrics API)** | https://app.metricool.com | billing@myautomationpartner.com |
| **Cloudflare R2 (File Storage)** | https://dash.cloudflare.com | billing@myautomationpartner.com |
| **Coolify (Deployment)** | http://87.99.128.65:8000 | kennymonico@gmail.com |

---

## 📝 Document Ownership

| Document | Owner | Review Frequency |
|----------|-------|------------------|
| `MAP_MASTER.md` | Senior Dev (Claude) | Weekly during active development |
| `docs/` | Technical Lead | Monthly |
| `operations/` | Operations Manager | As needed |
| `workflows/` | Automation Engineer | After each deployment |
| `development/` | Development Team | Ongoing |

---

**This structure keeps the project organized, scalable, and ready for team collaboration. Each folder serves a specific business function while maintaining clear separation of concerns.**
