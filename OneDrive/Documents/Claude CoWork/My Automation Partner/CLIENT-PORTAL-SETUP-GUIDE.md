# Client Portal Login — Complete Setup Guide

**Status:** Frontend deployed ✅ | Backend setup in progress
**Last Updated:** March 30, 2026

---

## PART A: n8n Webhook Workflow Setup

### Step 1: Access Your n8n Instance

1. Open https://n8n.myautomationpartner.com in your browser
2. Log in with your admin credentials
3. Click **"Workflows"** in the left sidebar

### Step 2: Import the Workflow

**Option A: Using the JSON file**

1. Click **"+ New"** button at the top
2. Select **"Import from URL"** or **"Import from file"**
3. Navigate to the `portal-login-auth.json` file in your workspace folder
4. Click **"Open"** or **"Import"**
5. n8n will create a new workflow called `portal-login-auth`

**Option B: Manual creation (if import fails)**

1. Create a new workflow named `portal-login-auth`
2. Add these nodes in order:
   - Webhook trigger (POST /webhook/portal-login)
   - Set node (extract email & password)
   - If node (check credentials present)
   - HTTP Request (query Fillout Users table)
   - If node (check user found)
   - Set node (extract user fields)
   - If node (check account active)
   - Code node (verify password hash)
   - If node (check password match)
   - HTTP Request (get client portal URL)
   - Set node (extract Portal URL)
   - Webhook response (success with redirect)
   - [Error branches: respond with error messages]

### Step 3: Configure Fillout API Credentials

The workflow needs your Fillout/Zite API credentials. You'll need:

- **Fillout API Key** (from your Zite account settings)
- **Base ID** (the Zite base ID, typically starts with `base_`)
- **Users Table ID** (the ID of your Users table)
- **Clients Table ID** (the ID of your Clients table)

**To find these values:**

1. Log into https://tables.fillout.com
2. Open your base (the main workspace)
3. Look at the URL bar — it shows: `https://tables.fillout.com/...`
   - Extract: `baseId` and table IDs from the URL or settings
4. Go to **Settings** → **API Keys** to get your Fillout API Key

**Configure credentials in n8n:**

1. In the `portal-login-auth` workflow, look for the HTTP Request nodes:
   - "GET user record from Zite"
   - "GET client portal URL"

2. For each HTTP Request node:
   - Click on the node
   - In the right panel under **Authentication**, select or create:
     - **Credential Type:** "HTTP Header Auth"
     - **Name:** "FilloutApiKey"
     - **Header Name:** "Authorization"
     - **Header Value:** `Bearer YOUR_FILLOUT_API_KEY`

3. Save the credential

**Update the API URLs:**

In each HTTP Request node, update the URL to use YOUR base ID and table IDs:

- Node "GET user record from Zite":
  ```
  https://tables.fillout.com/api/v1/bases/{YOUR_BASE_ID}/tables/{YOUR_USERS_TABLE_ID}/records
  ```

- Node "GET client portal URL":
  ```
  https://tables.fillout.com/api/v1/bases/{YOUR_BASE_ID}/tables/{YOUR_CLIENTS_TABLE_ID}/records/{linkedClientId}
  ```

Replace `{YOUR_BASE_ID}`, `{YOUR_USERS_TABLE_ID}`, `{YOUR_CLIENTS_TABLE_ID}` with actual values.

### Step 4: Enable and Test the Webhook

1. **Activate the workflow:**
   - Click the **"Active"** toggle at the top right to turn ON
   - You should see a green checkmark ✓

2. **Copy the webhook URL:**
   - The workflow will show a webhook URL (e.g., `https://n8n.myautomationpartner.com/webhook/portal-login`)
   - This is what the login page will POST to

3. **Test with a valid user (optional):**
   - Use a tool like Postman or curl to test:
     ```bash
     curl -X POST https://n8n.myautomationpartner.com/webhook/portal-login \
       -H "Content-Type: application/json" \
       -d '{"email":"test@example.com","password":"testpass"}'
     ```
   - Expected response (if user found and password correct):
     ```json
     {"success": true, "redirectUrl": "https://..."}
     ```

4. **Verify CORS headers:**
   - The webhook response includes CORS headers allowing requests from https://myautomationpartner.com
   - You can verify this in browser DevTools (Network tab when testing login)

---

## PART B: Zite Database Field Setup

### Step 1: Access Your Zite Base

1. Open https://tables.fillout.com
2. Click on your base (the main workspace)
3. You should see your tables listed

### Step 2: Add Field to Users Table

**What to add:** `Password Hash` field (to store hashed passwords)

1. Click on the **Users** table
2. Click the **"+"** button at the right end of the column headers (after the last column)
3. Select **"Text"** field type
4. **Field Name:** `Password Hash`
5. **Field Type:** Single-line text
6. **Description:** "SHA-256 hash of user password (never store plaintext)"
7. **Required:** No (leave unchecked)
8. Click **Save** or **Add**

**Populate password hashes for existing users:**

For each existing user, you need to generate a SHA-256 hash of their password:

*On macOS/Linux:*
```bash
echo -n "theirpassword" | sha256sum
```

*On Windows (PowerShell):*
```powershell
$password = "theirpassword"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($password)
$hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
$hashString = -join ($hash | ForEach-Object { $_.ToString("x2") })
Write-Host $hashString
```

Or use an online tool: https://www.sha256online.com/ (paste password, get hash)

Then:
1. Open the Users table in Zite
2. For each user, click the `Password Hash` cell
3. Paste the generated SHA-256 hash
4. Save

### Step 3: Add Field to Clients Table

**What to add:** `Portal URL` field (the external dashboard URL for each client)

1. Click on the **Clients** table
2. Click the **"+"** button at the right end of the column headers
3. Select **"URL"** field type
4. **Field Name:** `Portal URL`
5. **Field Type:** URL
6. **Description:** "External portal URL where this client logs in (Zite direct link, custom subdomain, etc.)"
7. **Required:** No
8. Click **Save** or **Add**

**Populate Portal URLs for existing clients:**

For each client in the Clients table:

1. Decide where their portal is:
   - **Option 1:** Direct Zite link (e.g., `https://tables.fillout.com/forms/client_record_id`)
   - **Option 2:** Custom subdomain (e.g., `https://acme.myautomationpartner.com`)
   - **Option 3:** External system URL (e.g., their own dashboard)

2. Open the Clients table in Zite
3. For each client, click the `Portal URL` cell
4. Paste the appropriate URL
5. Save

**Example Portal URLs:**
```
https://tables.fillout.com/forms/rec_abc123xyz  (direct Zite link)
https://client-dashboard.myautomationpartner.com  (custom subdomain)
https://app.customsystem.com/client/acme  (external system)
```

---

## PART C: Verify Field Setup

1. Reload your Zite base in browser (Ctrl+R or Cmd+R)
2. Open the **Users** table:
   - Should see `Password Hash` column
   - At least one user should have a password hash populated
3. Open the **Clients** table:
   - Should see `Portal URL` column
   - At least one client should have a Portal URL populated

---

## PART D: End-to-End Testing

Once both Parts A and B are complete, test the full login flow:

### Test 1: Valid Login with Redirect

1. Open https://myautomationpartner.com/login
2. Enter a valid user's email address (from your Users table)
3. Enter the password that you hashed (not the hash, the original password)
4. Click **"Sign in to Portal"**

**Expected outcome:**
- Page shows "Login successful! Redirecting to your dashboard..."
- After ~1 second, browser redirects to the Portal URL configured in their Clients record

### Test 2: Invalid Credentials

1. Open https://myautomationpartner.com/login
2. Enter an email that doesn't exist OR wrong password
3. Click **"Sign in to Portal"**

**Expected outcome:**
- Red error message: "Invalid email or password. Please try again."
- Email and password fields show red borders

### Test 3: Inactive Account

1. Open your Users table in Zite
2. Create a test user with:
   - Email: `inactive@test.com`
   - Password Hash: (same SHA-256 hash as Test 1)
   - Active: **Unchecked** (toggle OFF)
3. Go to https://myautomationpartner.com/login
4. Enter `inactive@test.com` and the matching password
5. Click **"Sign in to Portal"**

**Expected outcome:**
- Error message: "Your account is currently inactive. Contact support@myautomationpartner.com"

### Test 4: Rate Limiting

1. Open https://myautomationpartner.com/login
2. Try 5 wrong passwords in a row (enter random password 5 times)
3. Try a 6th attempt

**Expected outcome:**
- After 5 failures, get message: "Too many failed attempts. Please wait 30 seconds."
- Timer counts down from 30
- After 30 seconds, can try again

### Test 5: Password Visibility Toggle

1. Open https://myautomationpartner.com/login
2. Click in the Password field and type something
3. Click the eye icon (show/hide button)
4. Password text should become visible
5. Click eye icon again
6. Password should be hidden with dots

**Expected outcome:**
- Eye icon toggles between open eye 👁️ and crossed-out eye 👁️‍🗨️
- Password field type toggles between `password` and `text`

---

## Troubleshooting

### n8n Workflow Issues

**Problem:** "Workflow failed" or webhook returns 500 error

**Solution:**
1. Check n8n execution logs (click the workflow, view execution history)
2. Verify Fillout API credentials are correct
3. Verify base ID and table IDs in HTTP Request nodes are correct
4. Check that Users table has the `Password Hash` column

**Problem:** "401 Unauthorized" error

**Solution:**
1. Verify Fillout API Key is correct
2. Check Authorization header format: `Bearer YOUR_API_KEY`
3. Regenerate API key in Fillout if needed

### Zite Field Issues

**Problem:** Can't find `Password Hash` or `Portal URL` column

**Solution:**
1. Reload the page (Ctrl+R / Cmd+R)
2. Verify you added the field to the correct table (Users vs Clients)
3. Check field was actually saved (click the field to see properties)

**Problem:** Login page shows "Unexpected server response" error

**Solution:**
1. Check browser console (F12 → Console tab)
2. Look for CORS errors or network errors
3. Verify webhook URL in login.html matches your n8n webhook URL

---

## Quick Reference

| Component | URL/Location |
|-----------|-------------|
| Login Page | https://myautomationpartner.com/login |
| n8n Workflow | https://n8n.myautomationpartner.com → Workflows → portal-login-auth |
| Zite Users Table | https://tables.fillout.com → Your base → Users |
| Zite Clients Table | https://tables.fillout.com → Your base → Clients |
| Webhook Endpoint | https://n8n.myautomationpartner.com/webhook/portal-login (POST) |

---

## Next Steps After Setup

1. ✅ Deploy frontend (login.html to Cloudflare Pages)
2. ⏳ **Configure n8n workflow** (this guide)
3. ⏳ **Add Zite fields** (this guide)
4. ⏳ Test end-to-end login flow
5. Optional: Upload logo.svg to Cloudflare R2 for email templates
6. Optional: Create "Forgot Password" email flow in n8n

---

**Questions?** Check the error messages in n8n execution logs or browser console (F12).
