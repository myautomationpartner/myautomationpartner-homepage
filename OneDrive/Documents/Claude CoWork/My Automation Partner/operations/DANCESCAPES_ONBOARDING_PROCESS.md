# Dancescapes Performing Arts — Onboarding Process & Workflow Steps

**Client:** Dancescapes Performing Arts
**Metricool Blog ID:** 6035446
**Metricool User ID:** 4660143 (shared)
**Portal Email:** info@dancescapes.com
**Status:** Ready for fresh onboarding test
**Created:** March 30, 2026

---

## 🎯 Onboarding Goal

Complete end-to-end setup for Dancescapes so they can:
1. ✅ Log into their branded portal
2. ✅ See real-time follower counts (Instagram, TikTok, Facebook)
3. ✅ See their content calendar (scheduled posts)
4. ✅ Have admin/editor/viewer team members

---

## 📋 PHASE 1: Intake (Pre-Automation)

**What's needed from Dancescapes:**
- [ ] Business name: "Dancescapes Performing Arts" ✅
- [ ] Primary contact email: info@dancescapes.com ✅
- [ ] Subscription plan: Growth ✅
- [ ] Metricool Blog ID: 6035446 ✅
- [ ] Website URL: https://dancescapesperformingarts.com ✅
- [ ] Brand logo: [To collect]
- [ ] Brand colors (hex codes): [To collect]
- [ ] Additional team members (names + emails): [To collect]

**Checklist:**
- [ ] Verify Metricool account has Instagram, TikTok, Facebook connected
- [ ] Verify blog ID 6035446 is active and pulling data
- [ ] Confirm contact has email access

---

## ⚙️ PHASE 2: Automated Onboarding (n8n Workflow)

**Workflow ID:** `Ckwcm2H3x8kHDBVi` (Client Onboarding Automation)
**Webhook:** `POST https://n8n.myautomationpartner.com/webhook/client-onboarding`

### Step 1: Trigger Webhook with Client Data

**What triggers the workflow:**
```bash
curl -X POST https://n8n.myautomationpartner.com/webhook/client-onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Dancescapes Performing Arts",
    "email": "info@dancescapes.com",
    "plan": "Growth",
    "metricoolUserId": "4660143",
    "metricoolBlogId": "6035446"
  }'
```

### Step 2: Format Client Data (Set Node)

**Input:** Raw webhook payload
**Process:** Normalize and validate fields
**Output:** Standardized object

```javascript
{
  "businessName": "Dancescapes Performing Arts",
  "email": "info@dancescapes.com",
  "plan": "Growth",
  "metricoolUserId": "4660143",
  "metricoolBlogId": "6035446"
}
```

### Step 3: Create Client Record in Zite

**Node:** `Create Client in Zite` (HTTP POST)
**Endpoint:** `https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/thCZdPGZ4pk/records`
**Auth:** Bearer {filloutApiKey}

**Payload sent to Zite:**
```json
{
  "record": {
    "Name": "Dancescapes Performing Arts",
    "Business Name": "Dancescapes Performing Arts",
    "Contact Email": "info@dancescapes.com",
    "Status": "Active",
    "Subscription Plan": "Growth",
    "Onboarding Status": "Setup",
    "Metricool User ID": "4660143",
    "Metricool Blog ID": "6035446"
  }
}
```

**Response from Zite:**
- `id`: Unique client record ID (e.g., `rec_xxx_yyy`)
- Status: 200 (created)

**What gets stored in Zite Clients table:**
- Name: "Dancescapes Performing Arts"
- Contact Email: "info@dancescapes.com"
- Status: "Active"
- Subscription Plan: "Growth"
- Metricool Blog ID: "6035446"
- **CRITICAL:** Store the returned `client.id` for linking the admin user

---

### Step 4: Create Admin User in Zite

**Node:** `Create Admin User` (HTTP POST)
**Endpoint:** `https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/tfgmDJ9BFXf/records`
**Auth:** Bearer {filloutApiKey}

**Payload sent to Zite:**
```json
{
  "record": {
    "Name": "Dancescapes Performing Arts - Primary Admin",
    "Email": "info@dancescapes.com",
    "Role": "Admin",
    "Active": true,
    "Linked Client": ["rec_xxx_yyy"]
  }
}
```

**CRITICAL FIXES (Applied March 30, 2026):**
1. ✅ **Linked Client** uses explicit node reference: `$('Create Client in Zite').item.json.id` (NOT `$json.id`)
2. ✅ **Active** field set to `true` (was missing)
3. ✅ Email field uses: `$('Format Client Data').item.json.email`

**Response from Zite:**
- `id`: Unique user record ID (e.g., `rec_user_xxx`)
- Status: 200 (created)

**What gets stored in Zite Users table:**
- Name: "Dancescapes Performing Arts - Primary Admin"
- Email: "info@dancescapes.com"
- Role: "Admin"
- Active: ✅ (true)
- Linked Client: → Dancescapes client record (so they only see their data)

---

### Step 5: Send Welcome Email (Resend API)

**Node:** `Send Welcome Email` (HTTP POST)
**Endpoint:** `https://api.resend.com/emails`
**Auth:** Bearer {resendApiKey}

**Payload sent to Resend:**
```json
{
  "from": "onboarding@myautomationpartner.com",
  "to": "info@dancescapes.com",
  "subject": "Welcome to My Automation Partner! 🎉",
  "html": "<h2>Welcome to My Automation Partner!</h2><p>Hi there,</p><p>Your account for <strong>Dancescapes Performing Arts</strong> has been set up and is ready to go.</p><p>You can now log in to your client portal at: <a href='https://build.fillout.com/form/...'>[Portal Link]</a></p><p>Login email: info@dancescapes.com</p><p>If you have any questions, feel free to reply to this email.</p><p>Best,<br>My Automation Partner Team</p>"
}
```

**Response from Resend:**
- `id`: Email message ID
- Status: 200 (sent)

**What Dancescapes receives:**
- Welcome email with portal access link
- Instructions on how to log in
- Confirmation that metrics sync started

---

### Step 6: Return Success Response

**Node:** `Return Success Response` (HTTP Response)
**Response sent back:**
```json
{
  "success": true,
  "message": "Client onboarded successfully",
  "clientId": "rec_xxx_yyy",
  "userId": "rec_user_xxx",
  "email": "info@dancescapes.com",
  "businessName": "Dancescapes Performing Arts"
}
```

**What this means:**
- ✅ Client record created in Zite
- ✅ Admin user created in Zite
- ✅ Welcome email sent to Dancescapes
- ✅ All connections wired correctly

---

## 📊 PHASE 3: Metrics Sync Starts (Automatic)

**Workflow ID:** `Ag4LvhN5gkxFoKgN` (Multi-Platform Metrics)
**Trigger:** Runs every hour automatically

### Hourly Process:
1. **Get Instagram Followers:** `followers` metric for blog 6035446
2. **Get TikTok Followers:** `followers_count` metric for blog 6035446
3. **Get Facebook Followers:** `pageFollows` metric for blog 6035446
4. **Merge Data:** Combine all 3 into single record with date/platform
5. **Store in Zite:** POST to Metrics table with `Linked Client: [Dancescapes ID]`

**Result in Zite Metrics Table:**
```
Date: 2026-03-30T14:00:00Z
Platform: Multi-Platform
Followers_Instagram: [current count]
Followers_TikTok: [current count]
Followers_Facebook: [current count]
Linked Client: Dancescapes Performing Arts
```

**What Dancescapes sees in portal:**
- Real-time follower counts updated every hour
- Historical trend data
- Multi-platform comparison view

---

## 📅 PHASE 4: Content Calendar (Coming Soon)

**Workflow ID:** [TBD - to be created]
**Trigger:** Daily at 6 AM UTC

**What it will do:**
1. Query Metricool scheduler API for scheduled posts (next 30 days)
2. Transform Metricool format → Zite format
3. Upsert to Zite Content Calendar table
4. Filter by `Linked Client: Dancescapes`

**Result in Zite Content Calendar Table:**
```
Title: [Post caption]
Scheduled Date: 2026-04-15T10:00:00Z
Platform: Instagram (or TikTok/Facebook/Multi)
Status: Scheduled
Content: [Full post text]
Linked Client: Dancescapes Performing Arts
```

---

## 👥 PHASE 5: Team Members Setup (Manual)

**What to do after onboarding:**

1. **Invite Editor (e.g., Social Media Manager)**
   - Email: [to be collected from Dancescapes]
   - Name: [to be collected]
   - Role: Editor (can edit content calendar, see metrics)
   - Instructions: Log in → Change password → Start managing

2. **Invite Viewer (e.g., Manager)**
   - Email: [to be collected from Dancescapes]
   - Name: [to be collected]
   - Role: Viewer (read-only access)
   - Instructions: Log in → Review metrics only

**How it works in Zite:**
- Each user has `Linked Client: Dancescapes`
- Role determines what they can edit
- Access control enforced by Zite

---

## ✅ Testing Checklist

### Pre-Onboarding (Do This First)
- [ ] Verify Metricool blog 6035446 is active
- [ ] Verify Instagram/TikTok/Facebook are connected in Metricool
- [ ] Test Metricool API directly with curl (is data available?)
- [ ] Verify Resend API key is valid (test with curl)
- [ ] Verify Fillout API key is valid (test creating dummy record)
- [ ] Clear any old "Dancescapes" records from Zite Clients table

### During Onboarding
- [ ] Trigger webhook (curl command above)
- [ ] Check n8n workflow execution log — any errors?
- [ ] Verify client record created in Zite Clients table
- [ ] Verify admin user created in Zite Users table
- [ ] **CRITICAL:** Check that Linked Client is resolved (NOT showing "Untitled record")
- [ ] Verify welcome email received at info@dancescapes.com

### Post-Onboarding
- [ ] Log into portal with email: info@dancescapes.com
- [ ] See dashboard with follower counts
- [ ] Wait 1 hour for next metrics sync
- [ ] Verify new metrics appear in portal
- [ ] Check Zite Metrics table has new records with Linked Client = Dancescapes
- [ ] Add sample Editor user (test role-based access)

### Full System Test
- [ ] Dashboard loads with correct data filtered by Dancescapes
- [ ] Metrics update hourly (check at next hour mark)
- [ ] Email was received
- [ ] Admin can see all data
- [ ] Editor can edit, can't delete
- [ ] Viewer can only read

---

## 🚨 Known Issues (Fixed March 30, 2026)

**Issue #1: Linked Client showing "Untitled record"**
- ✅ **FIXED:** Now uses explicit node reference `$('Create Client in Zite').item.json.id`
- **Test:** Check Zite Users table — Linked Client should show "Dancescapes Performing Arts" not "Untitled record"

**Issue #2: Welcome email not sending**
- ✅ **FIXED:** Reconnected Send Welcome Email node to workflow flow
- **Test:** Check info@dancescapes.com inbox for welcome email

**Issue #3: Active checkbox not set**
- ✅ **FIXED:** Added `"Active": true` to Create Admin User payload
- **Test:** Check Zite Users table — Active field should be ✅

---

## 📞 Troubleshooting

**If webhook doesn't trigger:**
- Check n8n is running: `https://n8n.myautomationpartner.com`
- Check workflow is published (not draft mode)
- Check webhook URL is correct (copy from n8n webhook node)
- Try curl command again with exact JSON

**If client record not created in Zite:**
- Check Fillout API key is valid
- Check Fillout base ID: `9e604ece6abca0ed`
- Check Fillout table ID: `thCZdPGZ4pk`
- Check JSON payload format (all required fields present)

**If metrics not syncing:**
- Check Metricool API key is valid
- Check blog ID 6035446 exists in Metricool
- Check Instagram/TikTok/Facebook pages are connected
- Check metrics workflow is published and scheduled

**If email not received:**
- Check Resend API key is valid
- Check from address: onboarding@myautomationpartner.com
- Check DNS is set up for myautomationpartner.com (may need propagation)
- Check spam/promotions folder

---

## 📊 Success Criteria

Onboarding is complete when:
- ✅ Client record exists in Zite (Status: Active)
- ✅ Admin user exists in Zite (Active: true, Linked Client resolved)
- ✅ Welcome email received at info@dancescapes.com
- ✅ Portal login works with email address
- ✅ Metrics appear in portal (updated hourly)
- ✅ No "Untitled record" showing for Linked Client
- ✅ Role-based access works (Admin sees all, Viewer sees read-only)

---

## 🎯 Next Steps After Onboarding

1. **Brand Setup** → Collect logo + brand colors → Upload to Cloudflare R2
2. **Team Onboarding** → Send login instructions to Editor + Viewer
3. **Content Calendar** → Wait for content calendar workflow → Show Dancescapes how to use it
4. **Training Call** → Walk through portal features + how to add team members
5. **Monthly Reporting** → Set up weekly digest emails with performance summaries

---

**Ready to test!**
When you're ready, we'll:
1. Verify Metricool data is fresh
2. Clear old Dancescapes records from Zite
3. Trigger the onboarding webhook
4. Monitor each phase
5. Verify all 6 steps completed successfully
6. Confirm portal access works

Let me know when to begin! 🚀
