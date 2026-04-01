# Workflows Folder — `/workflows`

**Purpose:** n8n workflow definitions, deployment records, and workflow management documentation.

## 🔄 What Goes Here

- Production workflow JSON backups
- Workflow deployment records
- Testing and validation procedures
- Workflow performance logs
- Workflow version history

## 📋 Key Documents (To Create)

### Workflow Inventory
- `LIVE_WORKFLOWS.md` — All currently deployed workflows with details
- `WORKFLOW_TEMPLATES.md` — Reusable workflow templates for new features
- `WORKFLOW_TESTING.md` — Testing procedures, test data, validation steps
- `WORKFLOW_VERSION_HISTORY.md` — Version control and deployment history

### Backup & Recovery
- `workflow-backups/` folder — JSON exports of all production workflows
- `BACKUP_PROCEDURE.md` — How to export and backup workflows
- `RECOVERY_PROCEDURE.md` — How to restore from backups

## 📝 Example LIVE_WORKFLOWS.md

```markdown
# Live n8n Workflows

## 1. Multi-Platform Metrics Workflow ✅ PRODUCTION

**Workflow ID:** `Ag4LvhN5gkxFoKgN`
**Status:** Published v2 (Active)
**Purpose:** Pull social media follower counts from Instagram, TikTok, Facebook every hour and store in Zite

**Trigger:** Schedule (Hourly)
**Output:** Stores to Zite Metrics table (tfkftiCb4U3)
**Clients:** Dancescapes, My Automation Partner

**Node Flow:**
```
Schedule Trigger (hourly)
  → HTTP: Metricool Instagram followers
  → HTTP: Metricool TikTok followers
  → HTTP: Metricool Facebook followers
  → Set: Merge all 3 metrics
  → HTTP POST: Zite Metrics table
```

**API Endpoints Used:**
- Metricool: `GET https://app.metricool.com/api/v2/analytics/timelines`
- Zite: `POST https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/tfkftiCb4U3/records`

**Last Modified:** March 28, 2026
**Last Tested:** March 30, 2026 ✅

---

## 2. Client Onboarding Automation ✅ PRODUCTION

**Workflow ID:** `Ckwcm2H3x8kHDBVi`
**Status:** Published (Active)
**Purpose:** Automated client signup and account creation

**Trigger:** Webhook POST to `/webhook/client-onboarding`
**Outputs:** Creates client record + admin user + sends welcome email

**Node Flow:**
```
Webhook POST /webhook/client-onboarding
  → Format Client Data (Set node)
  → HTTP POST: Create Client in Zite
  → HTTP POST: Create Admin User in Zite
  → Send Welcome Email (Resend API)
  → Return Success Response
```

**Recent Updates (March 30, 2026):**
- ✅ Fixed: Reconnected Send Welcome Email node to workflow
- ✅ Fixed: Updated Linked Client to use explicit node reference
- ✅ Already: Active checkbox set to true on new users
- ✅ Changed: Using Resend API instead of SMTP (Hetzner blocks SMTP)

**Last Modified:** March 30, 2026
**Last Tested:** March 30, 2026 ✅
```

## 🧪 Testing Procedures

### Before Deploying Any Workflow:
1. Create test payload (see `test_payloads/` folder)
2. Test in manual mode (not published)
3. Verify output in Zite database
4. Test error handling with invalid inputs
5. Check performance and execution time
6. Document test results

### Test Execution:
```bash
# Example webhook test
curl -X POST https://n8n.myautomationpartner.com/webhook/client-onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Test Corp",
    "email": "test@example.com",
    "plan": "Growth",
    "metricoolUserId": "4660143"
  }'
```

## 🛠️ Workflow Editing

### Using Pinia Store Injection (Programmatic):
See `../development/n8n_workflow_tool.js` for the canonical method to edit workflows via JavaScript injection. This bypasses n8n UI limitations and MCP validation errors.

### Using n8n UI:
1. Log in to https://n8n.myautomationpartner.com
2. Navigate to Workflows → {workflow name}
3. Click Editor to modify nodes
4. Test in manual mode before publishing

## 📦 Backup & Version Control

### Weekly Backup:
```bash
# Export all workflows to JSON
# Store in workflow-backups/ with timestamp
workflow-backups/
├── Ag4LvhN5gkxFoKgN_v2_metrics_2026-03-30.json
├── Ckwcm2H3x8kHDBVi_v1_onboarding_2026-03-30.json
└── {workflow-id}_{version}_{name}_{date}.json
```

## 💡 File Structure

```
workflows/
├── README.md (this file)
├── LIVE_WORKFLOWS.md
├── WORKFLOW_TEMPLATES.md
├── WORKFLOW_TESTING.md
├── WORKFLOW_VERSION_HISTORY.md
├── BACKUP_PROCEDURE.md
├── RECOVERY_PROCEDURE.md
├── workflow-backups/
│   ├── Ag4LvhN5gkxFoKgN_v2_metrics_2026-03-30.json
│   └── Ckwcm2H3x8kHDBVi_v1_onboarding_2026-03-30.json
└── test_payloads/
    ├── client-onboarding-test.json
    ├── metricool-response-sample.json
    └── zite-record-response-sample.json
```

---

**Important:** See `../MAP_MASTER.md` for single source of truth on workflow details, APIs, and current status.
