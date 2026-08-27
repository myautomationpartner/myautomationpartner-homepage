# Dancescapes Onboarding — Workflow Summary & Visual Flow

**Client:** Dancescapes Performing Arts  
**Status:** Ready for testing  
**Test Date:** March 30, 2026

---

## 📊 Complete Onboarding Pipeline

### THE 6-STEP AUTOMATED SEQUENCE

```
PHASE 1: INTAKE (Manual)
├── Collect Dancescapes details
├── Email: info@dancescapes.com ✅
├── Blog ID: 6035446 ✅
└── Verify Metricool data available

PHASE 2: AUTOMATED ONBOARDING (n8n Workflow Ckwcm2H3x8kHDBVi)
│
├─ STEP 1: Webhook Trigger
│  └─ POST /webhook/client-onboarding
│     ├─ businessName: "Dancescapes Performing Arts"
│     ├─ email: "info@dancescapes.com"
│     ├─ plan: "Growth"
│     └─ metricoolBlogId: "6035446"
│
├─ STEP 2: Format Client Data
│  └─ Set node normalizes/validates payload
│     └─ Output: Standardized object
│
├─ STEP 3: Create Client Record (Zite)
│  └─ HTTP POST to Zite Clients table
│     ├─ Input: Formatted data
│     ├─ Output: client.id (unique record ID)
│     └─ Stores: Name, Email, Plan, Blog ID
│
├─ STEP 4: Create Admin User (Zite)
│  └─ HTTP POST to Zite Users table
│     ├─ Input: Client ID from Step 3
│     ├─ CRITICAL FIX: Use $('Create Client in Zite').item.json.id
│     ├─ Output: user.id (unique user ID)
│     └─ Stores: Email, Role=Admin, Active=✅, Linked Client
│
├─ STEP 5: Send Welcome Email (Resend)
│  └─ HTTP POST to api.resend.com/emails
│     ├─ To: info@dancescapes.com
│     ├─ Subject: "Welcome to My Automation Partner! 🎉"
│     └─ Body: Portal access instructions
│
└─ STEP 6: Return Success Response
   └─ HTTP 200 response
      ├─ success: true
      ├─ clientId: "rec_xxx"
      └─ userId: "rec_user_xxx"

PHASE 3: AUTOMATED METRICS (n8n Workflow Ag4LvhN5gkxFoKgN)
├─ Runs: Every hour automatically
├─ Fetches: Instagram, TikTok, Facebook followers via Metricool
├─ For blog ID: 6035446
└─ Stores in Zite Metrics table with Linked Client = Dancescapes

PHASE 4: CONTENT CALENDAR (Workflow TBD)
├─ Runs: Daily at 6 AM UTC
├─ Fetches: Scheduled posts from Metricool scheduler
└─ Stores in Zite Content Calendar table

PHASE 5: TEAM MEMBERS (Manual)
├─ Invite Editor (email: [TBD])
├─ Invite Viewer (email: [TBD])
└─ Each user has Linked Client = Dancescapes

PHASE 6: BUSINESS SUCCESS
└─ Dancescapes logs in → Sees metrics → Manages content
```

---

## 🔄 Data Flow (What Moves Where)

```
Dancescapes Data
      ↓
[Webhook POST]
      ↓
n8n Format Node
      ↓
        ├──→ Zite Clients Table
        │         ↓
        │    [Client Record ID]
        │         ↓
        ├──→ Zite Users Table ← [Linked to Client ID]
        │
        ├──→ Resend API
        │         ↓
        │    [Welcome Email]
        │
        └──→ n8n Response
             [success: true]

            ↓↓↓ (Automatic Hourly) ↓↓↓

        Metricool API
             ↓
        [Instagram/TikTok/Facebook]
             ↓
        n8n Merge Node
             ↓
        Zite Metrics Table ← [Linked to Dancescapes]
             ↓
        Portal Dashboard
             ↓
        Real-time follower counts visible to Dancescapes
```

---

## 📋 Zite Database State After Onboarding

### Clients Table (thCZdPGZ4pk)
```
┌─────────────────────────────────────────────────────────────┐
│ Name: Dancescapes Performing Arts                            │
│ Business Name: Dancescapes Performing Arts                   │
│ Contact Email: info@dancescapes.com                          │
│ Status: Active                                               │
│ Subscription Plan: Growth                                    │
│ Onboarding Status: Setup                                     │
│ Metricool User ID: 4660143                                   │
│ Metricool Blog ID: 6035446                                   │
│ Created: March 30, 2026                                      │
│ Record ID: rec_xxx_yyy (stored for linking)                  │
└─────────────────────────────────────────────────────────────┘
```

### Users Table (tfgmDJ9BFXf)
```
┌─────────────────────────────────────────────────────────────┐
│ Name: Dancescapes Performing Arts - Primary Admin            │
│ Email: info@dancescapes.com                                  │
│ Role: Admin                                                  │
│ Active: ✅ (true)                                             │
│ Linked Client: Dancescapes Performing Arts ← CRITICAL FIX    │
│ Created: March 30, 2026                                      │
│ Record ID: rec_user_xxx                                      │
└─────────────────────────────────────────────────────────────┘
```

### Metrics Table (tfkftiCb4U3) - Hourly Updates
```
┌─────────────────────────────────────────────────────────────┐
│ Date: 2026-03-30T14:00:00Z                                   │
│ Platform: Multi-Platform                                     │
│ Followers_Instagram: [current count]                         │
│ Followers_TikTok: [current count]                            │
│ Followers_Facebook: [current count]                          │
│ Linked Client: Dancescapes Performing Arts ← Filtered view   │
├─ 2026-03-30T15:00:00Z: [Next hourly update]                 │
├─ 2026-03-30T16:00:00Z: [Next hourly update]                 │
└─ ... (continuous hourly updates)                            │
```

---

## 🔑 API Endpoints & Authentication

### Webhook Trigger
```
URL: POST https://n8n.myautomationpartner.com/webhook/client-onboarding
Auth: None (webhook is public endpoint)
Body: JSON with client details
```

### Zite Client Creation
```
URL: POST https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/thCZdPGZ4pk/records
Auth: Bearer {filloutApiKey}
Headers: Content-Type: application/json
```

### Zite User Creation
```
URL: POST https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/tfgmDJ9BFXf/records
Auth: Bearer {filloutApiKey}
Headers: Content-Type: application/json
```

### Resend Email
```
URL: POST https://api.resend.com/emails
Auth: Bearer {resendApiKey}
Headers: Content-Type: application/json
From: onboarding@myautomationpartner.com
```

### Metricool Metrics
```
URL: GET https://app.metricool.com/api/v2/analytics/timelines
Auth: Header X-Mc-Auth: {metricoolApiKey}
Platforms: instagram, tiktok, facebook
Blog ID: 6035446
```

---

## 🧪 Test Execution Plan

### PRE-TEST (30 min before)
```
□ Verify Metricool blog 6035446 has data
□ Verify Instagram/TikTok/Facebook connected
□ Clear old Dancescapes records from Zite
□ Test Metricool API with curl
□ Test Fillout API with curl
□ Test Resend API with curl
```

### EXECUTE ONBOARDING (5-10 min)
```
□ Run webhook curl command
□ Monitor n8n execution log real-time
  └─ Watch for errors at each step
□ Check Zite after each step completes
```

### VERIFY RESULTS (10 min)
```
□ Check Zite Clients table → Dancescapes record exists
□ Check Zite Users table → Admin user exists
  ├─ Email: info@dancescapes.com ✅
  ├─ Role: Admin ✅
  ├─ Active: ✅
  └─ Linked Client: Dancescapes (NOT "Untitled record") ← KEY CHECK
□ Check info@dancescapes.com inbox → Welcome email received
□ Try portal login with info@dancescapes.com
```

### ONGOING MONITORING (24 hours)
```
□ Wait 1 hour for first metrics sync
□ Verify new records in Zite Metrics table
□ Check portal shows updated follower counts
□ Verify metrics update at next hour (2nd sync)
□ Confirm no errors in n8n execution logs
```

---

## ⚠️ Critical Fixes Applied (March 30, 2026)

### Fix #1: Linked Client Reference
**Problem:** Showed "Untitled record" in Zite UI
**Solution:** Changed to explicit node reference
```javascript
// ❌ BEFORE (relative reference)
"Linked Client": [$json.id]

// ✅ AFTER (explicit node reference)
"Linked Client": [$('Create Client in Zite').item.json.id]
```
**Test:** Zite Users table → Linked Client column should show "Dancescapes Performing Arts" clearly

### Fix #2: Send Welcome Email Reconnected
**Problem:** Email node configured but not wired into flow
**Solution:** Reconnected node to workflow sequence
**Flow:** Create Admin User → Send Welcome Email → Success Response
**Test:** info@dancescapes.com receives welcome email

### Fix #3: Active Checkbox
**Problem:** New users created without Active flag
**Solution:** Added `"Active": true` to Create Admin User payload
**Test:** Zite Users table → Active field is ✅ for Dancescapes admin

---

## 📞 Quick Reference

| Item | Value |
|------|-------|
| Workflow ID (Onboarding) | `Ckwcm2H3x8kHDBVi` |
| Workflow ID (Metrics) | `Ag4LvhN5gkxFoKgN` |
| Webhook URL | `https://n8n.myautomationpartner.com/webhook/client-onboarding` |
| Zite Base ID | `9e604ece6abca0ed` |
| Zite Clients Table | `thCZdPGZ4pk` |
| Zite Users Table | `tfgmDJ9BFXf` |
| Zite Metrics Table | `tfkftiCb4U3` |
| Metricool Blog ID | `6035446` |
| Metricool User ID | `4660143` |
| Dancescapes Email | `info@dancescapes.com` |

---

## 🎯 Success Criteria

✅ All checks pass:
- Client record created with correct data
- Admin user created with correct role & active status
- Linked Client shows "Dancescapes Performing Arts" (not "Untitled")
- Welcome email delivered to info@dancescapes.com
- Portal login works
- Metrics syncing hourly
- No errors in n8n logs

**When all ✅, Dancescapes is live!**

---

**Status:** Ready for live testing
**Last Updated:** March 30, 2026
**Tester:** [Your name]
**Test Date:** [To be filled]
