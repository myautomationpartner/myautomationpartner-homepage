# CLAUDE.md: My Automation Partner — Automated Social Media Client Portal

## 🎯 Project Purpose
This repository manages the infrastructure, n8n workflows, and integration schemas for a fully automated social media management client portal system. Clients get real-time metrics, content calendars, and team management through Zite. All data syncs automatically via n8n.

## 🏗️ Tech Stack & Tool Roles
* **n8n (Self-Hosted on Hetzner VPS):** The central orchestrator. Runs on Ubuntu via Coolify.
* **Fillout/Zite:** Customer portal + database. n8n writes client records and metrics data. Clients log in to view dashboards.
* **Cloudflare (DNS & R2):** Domain routing and object storage (client logos, brand assets, email templates).
* **Metricool:** API data source. n8n pulls Instagram/TikTok/Facebook follower counts and engagement metrics hourly.
* **Resend:** Transactional email sender (delivering welcome credentials, weekly digests to clients).
* **Airtable:** Backup database reference (optional, currently in use for redundancy).

## 🚦 Context Routing (How to Help Me)
Do not guess configurations. Use the specific files in this repo:

* If we are modifying **VPS setup, Docker, or Coolify deployment**, load `@infra/setup-vps.sh` and `@infra/docker-compose.yml`. Reference deployment guide: `@infra/DEPLOYMENT_GUIDE.md`.
* If we are building or fixing an **n8n workflow**, review `@docs/DATA_FLOW.md` first to understand the exact sequence, then reference `@.claude/rules/naming-conventions.md` for node naming (questions: "Is user active?" not "IF1").
* If we are formatting **Zite database payloads**, reference `@integrations/fillout/database-schema.json` and `@integrations/fillout/API_SCHEMA.md`.
* If we are uploading logos, managing R2, or updating DNS, refer to `@storage/r2-bucket-policy.json` and `@infra/cloudflare/r2-config.md`.
* If we are integrating a **new API**, start with `@integrations/{api}/API_SCHEMA.md`, then check test payloads at `@development/test_payloads/`.
* If this is **your first time**, read `@GETTING_STARTED.md`, then review `@docs/DATA_FLOW.md` to understand the pipeline.

## 🛑 Core Directives
1. **The "Plan First" Rule:** Before writing any code, workflow JSON, or deployment scripts, you must write a step-by-step checklist in `@PLAN.md`. Wait for my approval before executing. High-risk tasks (production deployments, database changes, credential rotation) require explicit sign-off.

2. **No Secrets:** Never write real API keys, passwords, database URIs, or credential values in your responses. Always use n8n credential stubs (e.g., `{{$credentials.metricoolApiKey}}`) or reference the credential.txt location. If you accidentally expose a credential, immediately flag it and suggest rotation.

3. **Follow the Rules:** Before any work, load and follow:
   - `@.claude/rules/naming-conventions.md` (how to name workflows, nodes, variables, files)
   - `@.claude/rules/security-rules.md` (credential protection, what can be logged, access control)

4. **Document as You Go:** After any work completes, update:
   - `@MAP_MASTER.md` (what changed in tech stack/workflows/status)
   - `@docs/DEPLOYMENT_LOG.md` (if infrastructure changed)
   - `@/workflows/WORKFLOW_INVENTORY.md` (if workflows changed)
   - `@operations/INCIDENT_LOG.md` (if issues were resolved)

## 📍 Critical Files (Load These On Demand)
| File | When to Load | Why |
|------|-------------|-----|
| `@docs/DATA_FLOW.md` | Building/fixing workflows | Shows exact 8-phase pipeline |
| `@MAP_MASTER.md` | Understanding current state | Single source of truth (infrastructure, APIs, accomplishments, pending work) |
| `@.claude/rules/naming-conventions.md` | Before writing code/workflows | Ensures consistency across node names, variables, files |
| `@.claude/rules/security-rules.md` | Before touching production/credentials | Credential stubs, what to log, access control |
| `@integrations/{api}/API_SCHEMA.md` | Integrating with Metricool, Resend, Fillout | Endpoint details, auth, field mappings |
| `@operations/CLIENTS.md` | Managing client list | Current clients, Metricool IDs, status |
| `@/workflows/WORKFLOW_INVENTORY.md` | Checking live workflows | All published n8n workflows and their status |

## ✅ Quick Task Reference
**"I want to create a new workflow"**
1. Load `@docs/DATA_FLOW.md` (understand where it fits in the pipeline)
2. Reference `@.claude/rules/naming-conventions.md` (name it `{sequence}-{purpose}`, e.g., `03-content-calendar`)
3. Check `@integrations/{api}/API_SCHEMA.md` and test payloads
4. Write plan in `@PLAN.md`, get approval
5. Build in n8n using Pinia injection (`@development/n8n_workflow_tool.js`)
6. Update `@/workflows/WORKFLOW_INVENTORY.md`

**"I want to fix a bug in metrics collection"**
1. Load `@docs/DATA_FLOW.md` (Phase 2: Fetch Analytics)
2. Review `@/workflows/02-metrics-collection.json` (current workflow)
3. Check `@integrations/metricool/API_SCHEMA.md` (rate limits, endpoint details)
4. Write plan in `@PLAN.md`, get approval
5. Fix and test with `@development/test_payloads/metricool-sample.json`
6. Update `@docs/DEPLOYMENT_LOG.md`

**"I want to onboard a new client"**
1. Follow `@operations/ONBOARDING_CHECKLIST.md` step-by-step
2. Trigger webhook: `POST https://n8n.myautomationpartner.com/webhook/client-onboarding`
3. Verify records created in Zite
4. Record in `@operations/CLIENTS.md`

**"I want to deploy to production"**
1. Load `@.claude/rules/security-rules.md` (deployment security)
2. Reference `@infra/DEPLOYMENT_GUIDE.md` (VPS/Docker process)
3. Write plan in `@PLAN.md`, get explicit approval
4. Test thoroughly in manual mode first
5. Deploy and monitor execution logs (30 min critical window)
6. Update `@docs/DEPLOYMENT_LOG.md` with timestamp and changes

---

**Last Updated:** March 30, 2026
**Next Review:** Quarterly
**Maintained By:** Claude + Team Lead
