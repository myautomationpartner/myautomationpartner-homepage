# DATA_FLOW.md: Core Automation Pipelines

This document describes the exact data sequence for all primary n8n automation pipelines. All workflow updates must respect these phases and data transformations.

---

## 🔄 PIPELINE 1: Client Onboarding & Portal Setup

**Workflow ID:** `Ckwcm2H3x8kHDBVi`
**Status:** ✅ LIVE (Fixed March 30, 2026)
**Trigger:** Webhook POST `/webhook/client-onboarding` from intake form

### Phase 1: Intake & Validation
1. **Trigger (Webhook):** New client signup data received with: businessName, email, plan, metricoolUserId, metricoolBlogId
2. **Format Data (Set node):** Normalize and validate all fields. Output schema: `{ businessName, email, plan, metricoolUserId, metricoolBlogId }`

### Phase 2: Client Record Creation (Zite)
3. **Create Client in Zite:** HTTP POST to `https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/thCZdPGZ4pk/records`
   - Input: Formatted client data
   - Output: `client.id` (unique Fillout record ID for later reference)
   - Payload shape: `{ record: { Name, Business Name, Contact Email, Status: "Active", Subscription Plan, Metricool User ID, Metricool Blog ID } }`

### Phase 3: Admin User Creation (Zite)
4. **Create Admin User in Zite:** HTTP POST to `https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/tfgmDJ9BFXf/records`
   - Input: Client record ID from Phase 2, client email
   - Output: `user.id` (new admin user ID)
   - **CRITICAL:** Linked Client must reference `$('Create Client in Zite').item.json.id` (explicit node reference, not relative ID)
   - Payload shape: `{ record: { Name: "{businessName} - Primary Admin", Email, Role: "Admin", Active: true, Linked Client: [client.id] } }`

### Phase 4: Welcome Email (Resend)
5. **Send Welcome Email:** HTTP POST to `https://api.resend.com/emails`
   - Input: Client email, business name, temporary portal URL
   - Uses Resend API (NOT SMTP — Hetzner blocks port 25/465/587)
   - Payload: `{ from: "onboarding@myautomationpartner.com", to: email, subject: "Welcome...", html: template }`

### Phase 5: Success Response
6. **Return Success Response:** HTTP response to calling system with client ID, user ID, status = "success"

---

## 📊 PIPELINE 2: Hourly Metrics Collection

**Workflow ID:** `Ag4LvhN5gkxFoKgN`
**Status:** ✅ LIVE
**Trigger:** Schedule — Every hour at :00

### Phase 1: Fetch Social Metrics (Metricool)
1. **Get Instagram Followers:** HTTP GET to `https://app.metricool.com/api/v2/analytics/timelines?metric=followers&network=instagram&userId={userId}&blogId={blogId}`
   - Auth: Header `X-Mc-Auth: {api_key}` (from credential.txt)
   - Date format MUST use Z suffix: `2026-03-30T00:00:00Z` (NOT `+00:00`)
   - Output: Single value (current follower count)

2. **Get TikTok Followers:** HTTP GET to `https://app.metricool.com/api/v2/analytics/timelines?metric=followers_count&network=tiktok&userId={userId}&blogId={blogId}`
   - **Note:** TikTok uses `followers_count` field (not `followers`)
   - Output: Single value

3. **Get Facebook Page Followers:** HTTP GET to `https://app.metricool.com/api/v2/analytics/timelines?metric=pageFollows&network=facebook&userId={userId}&blogId={blogId}`
   - **Note:** Facebook uses `pageFollows` field (not `followers`)
   - Output: Single value

### Phase 2: Data Merge & Transform
4. **Merge All Metrics (Set node):** Combine the three API responses into single object:
   ```json
   {
     "date": "2026-03-30T00:00:00Z",
     "instagramFollowers": 1242,
     "tiktokFollowers": 5890,
     "facebookFollowers": 312,
     "platform": "Multi-Platform",
     "linkedClientId": "{client.id}"
   }
   ```

### Phase 3: Store in Zite Metrics Table
5. **POST to Zite Metrics Table:** HTTP POST to `https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/tfkftiCb4U3/records`
   - Input: Merged metrics object
   - Payload shape: `{ record: { Date, Platform, Followers_Instagram, Followers_TikTok, Followers_Facebook, Linked Client: [clientId] } }`

### Phase 4: Completion
6. **Log Success:** Record timestamp and record count in n8n execution log

**Rate Limiting:** Metricool allows 100 requests/minute. Current setup respects this (3 requests × ~500 clients/hour = within limits). If scaling beyond 500 clients, implement backoff logic.

---

## 📅 PIPELINE 3: Content Calendar Sync (Future)

**Workflow ID:** `[To be created]`
**Status:** 🚧 PLANNED
**Trigger:** Daily at 6 AM UTC

### Phase 1: Fetch Scheduled Posts (Metricool)
1. **Query Content Scheduler:** HTTP GET to `https://app.metricool.com/api/v2/scheduler/posts?userId={userId}&blogId={blogId}&status=scheduled`
   - Returns: List of posts scheduled for next 30 days with platform, caption, media URLs

### Phase 2: Format for Zite
2. **Transform Post Data:** Convert Metricool post schema to Zite Content Calendar schema
   - Map fields: `scheduledTime` → `Scheduled Date`, `platform` → `Platform`, `caption` → `Content`

### Phase 3: Upsert to Zite
3. **Create/Update Records in Zite:** HTTP POST to Content Calendar table
   - Skip posts already in Zite (check by external ID)
   - Add new posts with `Status: "Scheduled"`

### Phase 4: Notify Client
4. **Send Calendar Update Email:** Resend API to client with "your content calendar has been updated"

---

## 🚨 Error Handling Workflow

**Workflow ID:** `[global-error-catch]`
**Status:** 🚧 PLANNED
**Purpose:** Catch and log failures from all above workflows

### Error Sequence
1. **Detect Failure:** n8n catches any node error
2. **Log Details:** Record workflow ID, node name, error message, timestamp
3. **Format Alert:** Create structured error message (safe — no PII, credentials)
4. **Route:**
   - If critical (client onboarding failed): Send Slack alert + email ops team
   - If non-critical (metrics delayed): Log to INCIDENT_LOG.md, retry with backoff
5. **Prevent Cascade:** Stop workflow, don't propagate upstream

---

## 🔗 Data Schema Reference

### Clients Table (thCZdPGZ4pk)
```
Name (text)
Business Name (text)
Contact Email (email)
Status (select: Active/Paused/Inactive)
Subscription Plan (select: Starter/Growth/Agency)
Metricool User ID (text) — Shared: 4660143
Metricool Blog ID (text) — Unique per client
Logo URL (url) — From Cloudflare R2
Created Date (timestamp, auto)
```

### Users Table (tfgmDJ9BFXf)
```
Name (text)
Email (email)
Role (select: Admin/Editor/Viewer)
Active (checkbox)
Linked Client (linked_record → Clients)
Created Date (timestamp, auto)
```

### Metrics Table (tfkftiCb4U3)
```
Date (datetime with Z suffix)
Platform (text) — "Multi-Platform" or specific network
Followers_Instagram (number)
Followers_TikTok (number)
Followers_Facebook (number)
Linked Client (linked_record → Clients)
```

---

## 🔑 Key Technical Rules

**Date/Time Formatting:**
- Always use ISO 8601 with **Z suffix**: `2026-03-30T14:30:00Z`
- Never use `+00:00` — Metricool API breaks on `+` character
- n8n expression: `{{ $now.minus({days: 30}).toUTC().toISO().substring(0, 19) + 'Z' }}`

**Linked Records in Zite:**
- Always reference via explicit node output: `$('Node Name').item.json.id`
- Never use relative `$json.id` (causes "Untitled record" display bug)

**API Credential Stubs:**
- Metricool: `{{ $credentials.metricoolApiKey }}`
- Resend: `{{ $credentials.resendApiKey }}`
- Fillout/Zite: `{{ $credentials.filloutApiKey }}`

**Retry Logic:**
- Metricool failures: Wait 30 seconds, retry 2 times, then alert ops
- Zite failures: Don't retry (check payload validity first), escalate immediately

---

## 📋 Workflow Dependencies

```
Client Onboarding (Ckwcm2H3x8kHDBVi)
  └─ Writes to: Clients table, Users table
  └─ Depends on: Resend API (email), Zite API (records)

Metrics Collection (Ag4LvhN5gkxFoKgN)
  └─ Reads from: Metricool API (3 endpoints per client)
  └─ Writes to: Metrics table (Zite)
  └─ Depends on: Clients table (for userId, blogId)

Error Handler (global-error-catch)
  └─ Monitors: All above workflows
  └─ Writes to: INCIDENT_LOG.md, Slack (if critical)
```

---

**Last Updated:** March 30, 2026
**Status:** Reflects current live workflows + planned pipelines
**When to Update:** After any workflow change, update this file immediately
