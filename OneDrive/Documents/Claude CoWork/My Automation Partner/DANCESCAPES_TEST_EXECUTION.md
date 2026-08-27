# Dancescapes Onboarding — Live Test Execution

**Start Date:** March 30, 2026
**Client:** Dancescapes Performing Arts
**Workflow ID:** `Ckwcm2H3x8kHDBVi`
**Status:** 🚀 TESTING IN PROGRESS

---

## 🎯 Test Objectives

- ✅ Verify all 3 bug fixes are working (Linked Client, Welcome Email, Active checkbox)
- ✅ Confirm client record created correctly in Zite
- ✅ Confirm admin user created with correct permissions
- ✅ Confirm welcome email sent to info@dancescapes.com
- ✅ Confirm portal login works
- ✅ Confirm metrics sync within 1 hour
- ✅ Confirm no errors in n8n execution logs

---

## 📋 PHASE 1: PRE-TEST VERIFICATION (30 minutes)

### Step 1.1: Verify Metricool Data Available
**Goal:** Ensure blog 6035446 has active social media data

**Action:** Check if Metricool has data for blog 6035446
- [ ] Log into Metricool: https://app.metricool.com
- [ ] Navigate to blog 6035446
- [ ] Verify Instagram page connected: [ Count = ? ]
- [ ] Verify TikTok page connected: [ Count = ? ]
- [ ] Verify Facebook page connected: [ Count = ? ]
- [ ] Note: Data doesn't need to be new, just available

**Expected:** All 3 platforms show follower counts (not 0, not "error")

---

### Step 1.2: Verify n8n Workflows are Published
**Goal:** Ensure both workflows are in production mode, not draft

**Action:** Check n8n workflow status
- [ ] Navigate to: https://n8n.myautomationpartner.com
- [ ] Find Workflow ID: `Ckwcm2H3x8kHDBVi` (Client Onboarding)
- [ ] Status should show: ✅ Published
- [ ] Find Workflow ID: `Ag4LvhN5gkxFoKgN` (Metrics)
- [ ] Status should show: ✅ Published

**Expected:** Both workflows published and ready to execute

---

### Step 1.3: Test Metricool API Connection
**Goal:** Verify API key is valid and we can fetch data

**Command to run:**
```bash
curl -X GET \
  "https://app.metricool.com/api/v2/analytics/timelines?from=2026-03-01T00:00:00Z&to=2026-03-30T23:59:59Z&metric=followers&network=instagram&userId=4660143&blogId=6035446" \
  -H "X-Mc-Auth: [API_KEY_FROM_credential.txt]"
```

**What to check:**
- [ ] Response status: 200 (success)
- [ ] Response contains follower count data: [ Value = ? ]
- [ ] No authentication errors

**Expected:** Returns current Instagram follower count for blog 6035446

---

### Step 1.4: Test Fillout/Zite API Connection
**Goal:** Verify Fillout API key is valid and we can create records

**Command to run:**
```bash
curl -X POST \
  "https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/thCZdPGZ4pk/records" \
  -H "Authorization: Bearer [API_KEY_FROM_credential.txt]" \
  -H "Content-Type: application/json" \
  -d '{
    "record": {
      "Name": "TEST_DELETE_ME",
      "Business Name": "Test Company",
      "Contact Email": "test@example.com",
      "Status": "Active",
      "Subscription Plan": "Growth",
      "Metricool User ID": "4660143",
      "Metricool Blog ID": "9999999"
    }
  }'
```

**What to check:**
- [ ] Response status: 200 or 201 (created)
- [ ] Response includes record ID
- [ ] No authentication errors

**Expected:** Test record created successfully in Zite Clients table

---

### Step 1.5: Test Resend Email API Connection
**Goal:** Verify Resend API key is valid and we can send emails

**Command to run:**
```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer [API_KEY_FROM_credential.txt]" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@myautomationpartner.com",
    "to": "kennymonico@gmail.com",
    "subject": "Test Email - Dancescapes Setup",
    "html": "<p>This is a test email to verify Resend API is working.</p>"
  }'
```

**What to check:**
- [ ] Response status: 200 (sent)
- [ ] Response includes message ID
- [ ] No authentication errors
- [ ] Check kennymonico@gmail.com inbox for test email (allow 30 seconds)

**Expected:** Email sent successfully and received

---

### Step 1.6: Clear Old Dancescapes Records from Zite
**Goal:** Remove any previous test records so this test starts clean

**Action:** Delete old Dancescapes records
- [ ] Log into Zite: https://build.fillout.com
- [ ] Navigate to Clients table (thCZdPGZ4pk)
- [ ] Find and delete any records with "Dancescapes" in name
- [ ] Count deleted: [ ? records ]
- [ ] Navigate to Users table (tfgmDJ9BFXf)
- [ ] Find and delete any records with "Dancescapes" or "info@dancescapes.com"
- [ ] Count deleted: [ ? records ]
- [ ] Also delete any "TEST_DELETE_ME" record from Step 1.4

**Expected:** No old Dancescapes or test records remain in Zite

---

### Step 1.7: Verify n8n Webhook URL
**Goal:** Confirm the webhook endpoint is active and listening

**Action:** Check webhook in n8n
- [ ] Navigate to Workflow ID: `Ckwcm2H3x8kHDBVi`
- [ ] Find the Webhook Trigger node
- [ ] Copy webhook URL: `https://n8n.myautomationpartner.com/webhook/client-onboarding`
- [ ] Confirm URL is visible and shows "Active"

**Expected:** Webhook URL is active and ready to receive POST requests

---

## 🚀 PHASE 2: EXECUTE ONBOARDING (5-10 minutes)

### Step 2.1: Trigger Webhook with Dancescapes Data
**Goal:** Kick off the automated onboarding workflow

**Command to run:**
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

**Expected Response:**
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

**What to check:**
- [ ] Response status: 200 (success)
- [ ] Response contains: success: true
- [ ] Response contains: clientId (store this: ____________)
- [ ] Response contains: userId (store this: ____________)
- [ ] **TIMESTAMP:** When triggered: ____________

---

### Step 2.2: Monitor n8n Execution Log (Real-Time)
**Goal:** Watch workflow execute and catch any errors

**Action:** Monitor workflow execution
- [ ] Navigate to Workflow ID: `Ckwcm2H3x8kHDBVi`
- [ ] Click "Executions" tab
- [ ] Should see new execution entry at timestamp from Step 2.1
- [ ] Watch as each node executes:
  - [ ] Format Client Data — completed ✅
  - [ ] Create Client in Zite — completed ✅
  - [ ] Create Admin User in Zite — completed ✅
  - [ ] Send Welcome Email — completed ✅
  - [ ] Return Success Response — completed ✅

**Check for errors:**
- [ ] No red "X" marks on any nodes
- [ ] No error messages in logs
- [ ] All nodes show green checkmarks ✅

**Expected:** All 5 nodes complete without errors

---

### Step 2.3: Check Webhook Response Timing
**Goal:** Verify the workflow executed quickly

**Time from trigger to response:**
- Started: ____________ (from Step 2.1)
- Completed: ____________ (from n8n logs)
- **Duration:** ____________ (should be < 30 seconds)

**Expected:** Workflow completes in 5-30 seconds

---

## ✅ PHASE 3: VERIFY RESULTS (10 minutes)

### Step 3.1: Verify Client Record Created in Zite
**Goal:** Confirm Dancescapes was added to Clients table with correct data

**Action:** Check Zite Clients table
- [ ] Log into Zite: https://build.fillout.com
- [ ] Navigate to Clients table (thCZdPGZ4pk)
- [ ] Find record with Name: "Dancescapes Performing Arts"
- [ ] Verify fields:
  - [ ] Name: "Dancescapes Performing Arts" ✅
  - [ ] Business Name: "Dancescapes Performing Arts" ✅
  - [ ] Contact Email: "info@dancescapes.com" ✅
  - [ ] Status: "Active" ✅
  - [ ] Subscription Plan: "Growth" ✅
  - [ ] Onboarding Status: "Setup" ✅
  - [ ] Metricool User ID: "4660143" ✅
  - [ ] Metricool Blog ID: "6035446" ✅

**Record ID:** ____________ (copy this, should match clientId from Step 2.1)

**Expected:** All fields correct, record created successfully

---

### Step 3.2: Verify Admin User Created in Zite (CRITICAL TEST #1)
**Goal:** Confirm admin user was created with correct Linked Client (Bug Fix #1)

**Action:** Check Zite Users table
- [ ] Navigate to Users table (tfgmDJ9BFXf)
- [ ] Find record with Email: "info@dancescapes.com"
- [ ] Verify fields:
  - [ ] Name: "Dancescapes Performing Arts - Primary Admin" ✅
  - [ ] Email: "info@dancescapes.com" ✅
  - [ ] Role: "Admin" ✅
  - [ ] **CRITICAL:** Active checkbox: ✅ TRUE (Bug Fix #3)
  - [ ] **CRITICAL:** Linked Client: "Dancescapes Performing Arts" (NOT "Untitled record") (Bug Fix #1)

**What "Linked Client" should show:**
- ✅ CORRECT: "Dancescapes Performing Arts" (full business name)
- ❌ WRONG: "Untitled record" (indicates linked ID not resolving)

**Record ID:** ____________ (should match userId from Step 2.1)

**Expected:** User created with Active=✅ and Linked Client showing correct business name

---

### Step 3.3: Verify Welcome Email Sent (CRITICAL TEST #2)
**Goal:** Confirm Resend email was sent to Dancescapes (Bug Fix #2)

**Action:** Check email inbox
- [ ] Navigate to: info@dancescapes.com (or check your test email if not actual Dancescapes)
- [ ] Look for email from: onboarding@myautomationpartner.com
- [ ] Subject should be: "Welcome to My Automation Partner! 🎉"
- [ ] **Email received:** ✅ YES / ❌ NO
- [ ] **Time received:** ____________ (should be ~same time as webhook trigger)
- [ ] **Email content includes:**
  - [ ] Welcome message
  - [ ] Business name: "Dancescapes Performing Arts"
  - [ ] Portal access link
  - [ ] Login instructions

**Expected:** Welcome email delivered within 1 minute of webhook trigger

---

### Step 3.4: Count Zite Records Created
**Goal:** Verify exactly 1 client + 1 user were created

**Action:** Count records
- [ ] Clients table: How many "Dancescapes" records? __________ (should be 1)
- [ ] Users table: How many "info@dancescapes.com" records? __________ (should be 1)
- [ ] No duplicate records created ✅

**Expected:** Exactly 1 of each, no duplicates

---

## 📊 PHASE 4: MONITOR ONGOING (24 hours)

### Step 4.1: Check First Metrics Sync (1 hour after trigger)
**Goal:** Verify hourly metrics workflow is working

**Checklist (1 hour after webhook):**
- [ ] Metrics workflow executed: Check n8n execution log for workflow `Ag4LvhN5gkxFoKgN`
- [ ] Navigate to Zite Metrics table (tfkftiCb4U3)
- [ ] Find records with "Dancescapes Performing Arts" in Linked Client
- [ ] Should see 1 new record per hour:
  - [ ] Date: 2026-03-30T15:00:00Z (or next hour)
  - [ ] Platform: "Multi-Platform"
  - [ ] Followers_Instagram: [value from Metricool]
  - [ ] Followers_TikTok: [value from Metricool]
  - [ ] Followers_Facebook: [value from Metricool]
  - [ ] Linked Client: "Dancescapes Performing Arts"

**Expected:** New metrics record appears every hour automatically

---

### Step 4.2: Check Second Metrics Sync (2 hours after trigger)
**Goal:** Verify consistent hourly updates

**Checklist (2 hours after webhook):**
- [ ] New metrics record created at next hour mark
- [ ] Data updated (values may change slightly)
- [ ] Linked Client still shows "Dancescapes Performing Arts" ✅

**Expected:** Second hourly update appears on schedule

---

### Step 4.3: Test Portal Login
**Goal:** Verify Dancescapes can log in with their credentials

**Action:** Test login
- [ ] Navigate to: https://build.fillout.com (or wherever Zite portal is)
- [ ] Try to log in with:
  - Email: info@dancescapes.com
  - Password: [Will need to be reset by Dancescapes]
- [ ] If login works:
  - [ ] Dashboard loads
  - [ ] Can see their follower counts
  - [ ] Can see their content calendar (if created)
- [ ] If login doesn't work:
  - [ ] Note error message: _______________
  - [ ] May need Zite password reset link

**Expected:** Portal accessible (may need initial password reset)

---

### Step 4.4: Check n8n Error Logs
**Goal:** Verify no errors in background execution

**Action:** Check error logs
- [ ] Navigate to Workflow ID: `Ckwcm2H3x8kHDBVi` (Onboarding)
- [ ] Click "Executions"
- [ ] Should see successful execution from webhook trigger
- [ ] Any errors? __________ (should be "None")
- [ ] Navigate to Workflow ID: `Ag4LvhN5gkxFoKgN` (Metrics)
- [ ] Check last 5 executions (hourly)
- [ ] Any errors? __________ (should be "None")

**Expected:** No errors in either workflow

---

## 🎯 SUCCESS CRITERIA (Final Checklist)

**The onboarding is SUCCESSFUL if ALL of these are true:**

### Database Records ✅
- [ ] Client record exists in Zite Clients table
- [ ] Admin user exists in Zite Users table
- [ ] No duplicate records

### Bug Fixes Verified ✅
- [ ] **Fix #1:** Linked Client shows "Dancescapes Performing Arts" (not "Untitled record")
- [ ] **Fix #2:** Welcome email received in inbox
- [ ] **Fix #3:** Active checkbox is ✅ TRUE for admin user

### Automation Working ✅
- [ ] Metrics syncing hourly (new records every hour)
- [ ] No errors in n8n execution logs
- [ ] Portal login accessible

### Data Integrity ✅
- [ ] Only Dancescapes data visible to Dancescapes user
- [ ] Metrics filtered by Linked Client correctly
- [ ] No data cross-contamination

---

## 📝 FINAL TEST RESULT

**Test Status:** [ ] PASSED / [ ] FAILED

**If PASSED:**
- All success criteria met ✅
- Dancescapes ready for portal access
- Metrics syncing automatically
- System functioning as designed

**If FAILED:**
- Document which step failed: _______________
- Error message or issue: _______________
- Recommendation: _______________

---

## 🚀 NEXT STEPS (If Passed)

1. [ ] Send Dancescapes login credentials and portal link
2. [ ] Schedule portal walkthrough call
3. [ ] Collect additional team members for editor/viewer invites
4. [ ] Set up weekly email digest
5. [ ] Begin content calendar integration

---

**Test Conducted By:** _______________
**Date Completed:** _______________
**Notes:** _______________
