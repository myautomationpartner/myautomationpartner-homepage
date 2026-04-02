# EXECUTION PLAN — Multi-Brand Metricool Master-Loop Refactor

**Purpose:** Refactor the existing metrics workflow to use a Master-Loop structure, enabling dynamic multi-brand data fetching from Metricool's Evolution API with AI-powered result cleaning.

---

## 📋 Current Task

**Task Name:** Multi-Brand Metricool Master-Loop
**Created:** 2026-04-01
**Owner:** Claude + Kenny
**Status:** Awaiting Approval
**Priority:** High

---

## 🎯 Goal

Replace the current hardcoded 3-platform parallel fetch in workflow `Ag4LvhN5gkxFoKgN` with a scalable Master-Loop pattern. Adding a new client will require only adding one line to the Code Node — no new HTTP nodes needed.

**Success Criteria:**
- [ ] Code Node returns all active brands as a list
- [ ] Loop processes each brand individually (not in parallel)
- [ ] HTTP node uses dynamic `{{ $json.blogId }}` and `{{ $json.userId }}` params
- [ ] Evolution endpoint used (replaces timelines endpoint)
- [ ] AI Agent cleans/normalizes each brand's response into a consistent JSON object
- [ ] Cleaned data POSTed to Fillout Metrics table per brand
- [ ] Both existing brands (Dancescapes + My Automation Partner) return successful data
- [ ] No hardcoded API keys anywhere

---

## 📚 Context & References

**Workflow Being Modified:** `Ag4LvhN5gkxFoKgN` (`myautomationpartner`)

**Current Architecture (6 nodes):**
```
Schedule Trigger
  → [parallel] HTTP Request - Instagram
  → [parallel] HTTP Request - TikTok
  → [parallel] HTTP Request - Facebook
        ↓ (all 3 merge into)
  Set - Format Metrics
  → HTTP Request - Fillout POST
```

**Problem with current design:**
- blogId is hardcoded in each HTTP node
- Adding a new client = duplicating 3 HTTP nodes + wiring
- Doesn't scale beyond 1 client per workflow instance

**New Architecture (6-7 nodes):**
```
Schedule Trigger
  → Code Node: "Get brand list"
  → Loop Over Items
      → HTTP Request: "Fetch Metricool evolution data"
      → AI Agent: "Clean and summarize metrics"
      → HTTP Request: "POST metrics to Fillout"
  [loop repeats per brand]
```

**Active Brands (for Code Node):**
| Brand | blogId | userId |
|-------|--------|--------|
| Dancescapes Performing Arts | 6035446 | 4660143 |
| My Automation Partner | 6035338 | 4660143 |

**API Change:**
- Old endpoint: `GET /api/v2/analytics/timelines`
- New endpoint: `GET /api/v2/analytics/evolution`
- Same auth header: `X-Mc-Auth: {{ $credentials.metricoolApiKey }}`
- Date format: still requires `Z` suffix (NOT `+00:00`)

---

## 🔄 Step-by-Step Execution Plan

### Phase 1: Verify Evolution Endpoint Response Shape (before building)
- [ ] Review existing test payloads or MAP_MASTER.md for evolution API response format
- [ ] Confirm what fields are returned (follower counts, engagement, etc.)
- [ ] Confirm query params required (`blogId`, `userId`, `startDate`, `endDate`, `platform`)
- [ ] Note: Do NOT run a live API test until this plan is approved

### Phase 2: Build Updated Workflow in n8n

**Node 1 — Keep existing:** `Schedule Trigger` (no changes)

**Node 2 — New:** `Get brand list` (Code Node)
```javascript
return [
  { json: { brandName: "Dancescapes Performing Arts", blogId: "6035446", userId: "4660143" } },
  { json: { brandName: "My Automation Partner",       blogId: "6035338", userId: "4660143" } }
];
```

**Node 3 — New:** `Loop Over Items` (n8n-nodes-base.splitInBatches, batchSize: 1)

**Node 4 — New:** `Fetch Metricool evolution data` (HTTP Request)
- Method: GET
- URL: `https://app.metricool.com/api/v2/analytics/evolution`
- Auth header: `X-Mc-Auth` → `{{ $credentials.metricoolApiKey }}`
- Query params:
  - `blogId`: `{{ $json.blogId }}`
  - `userId`: `{{ $json.userId }}`
  - `startDate`: `{{ $now.minus({days: 30}).toUTC().toISO().substring(0, 19) + 'Z' }}`
  - `endDate`: `{{ $now.toUTC().toISO().substring(0, 19) + 'Z' }}`

**Node 5 — New:** `Clean and summarize metrics` (AI Agent / Code)
- Normalize raw evolution API response into consistent object:
  ```json
  {
    "brandName": "...",
    "blogId": "...",
    "date": "...",
    "followers_instagram": 0,
    "followers_tiktok": 0,
    "followers_facebook": 0,
    "engagement_rate": 0
  }
  ```
- If AI Agent: use Claude Haiku (fast + cheap) with structured output prompt
- If Code Node fallback: extract known fields manually

**Node 6 — Adapted from existing:** `POST metrics to Fillout` (HTTP Request)
- Same Fillout endpoint as current workflow
- Body uses cleaned output from Node 5
- Adds `Linked Client` from brandName → Fillout record ID mapping

**Node 7 — Loop back:** Wire Node 6 output to Loop's "Loop" input to continue

### Phase 3: Test
- [ ] Disable current workflow (do not delete)
- [ ] Run new workflow manually with test data
- [ ] Verify both brands produce a Fillout record
- [ ] Verify Fillout records have correct `Linked Client` linkage
- [ ] Re-enable on schedule only after both brands confirmed working

### Phase 4: Cleanup & Documentation
- [ ] Rename workflow from `myautomationpartner` → `02-metrics-collection` (follows naming conventions)
- [ ] Update `MAP_MASTER.md` — Architecture section
- [ ] Update `workflows/WORKFLOW_INVENTORY.md`
- [ ] Update `docs/DEPLOYMENT_LOG.md` with timestamp

---

## ⚠️ Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Evolution API has different response shape than timelines | Medium | Verify in Phase 1 before building |
| AI Agent node adds latency or cost per brand | Low | Use Claude Haiku; fallback to Code Node if too slow |
| Loop processes brands sequentially (slower than parallel) | Low | Acceptable — only 2 brands currently; rate limits make parallel risky |
| Fillout `Linked Client` field requires record ID not brandName | Medium | Check existing workflow's POST body to confirm mapping approach |

**Rollback Plan:** Current workflow `Ag4LvhN5gkxFoKgN` will remain on the server (disabled, not deleted) until new workflow is fully validated.

---

## ✅ Approval Checkpoint

**Before executing Phase 2, confirm:**
- [ ] Plan reviewed and architecture approved
- [ ] OK to disable (not delete) the current workflow during testing
- [ ] AI Agent node: use Claude Haiku OR fallback to Code Node for cleaning?
- [ ] Fillout `Linked Client` field: confirm mapping approach (brandName → record ID?)

**Approver:** Kenny __________ **Date:** 2026-04-01 **Approved:** [ ] Yes

---

**Approved For Deployment:** __________ (Signature/Date)
**Deployed To Production:** __________ (Timestamp)
**Verified Working:** __________ (Timestamp)
