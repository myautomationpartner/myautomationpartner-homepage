# SECURITY RULES — Hard Constraints

**Purpose:** Protect API keys, customer data, and infrastructure. These rules are non-negotiable.

**Last Updated:** March 30, 2026
**Enforced:** Yes — All code, workflows, and documentation

---

## 🔑 API Keys & Credentials

### THE GOLDEN RULE
**NEVER log, commit, or expose API keys, passwords, or credentials in ANY form.**

### Where Credentials Go
- ✅ `credential.txt` (file, protected, in root)
- ✅ n8n credential store (internal n8n storage)
- ✅ Environment variables (server-side only)
- ❌ NOT in git history
- ❌ NOT in documentation
- ❌ NOT in code files
- ❌ NOT in JSON payloads
- ❌ NOT in logging/console output

### How to Use in n8n Workflows

#### ❌ WRONG (Hardcoded):
```javascript
// DO NOT DO THIS
const apiKey = "sk_prod_actualkey123xyz";
const response = await fetch('https://api.metricool.com/api/v2', {
  headers: { 'Authorization': apiKey }
});
```

#### ✅ RIGHT (Credential Stub):
```javascript
// This is correct - uses n8n credentials
{{ $credentials.metricoolApiKey }}

// In HTTP node Authorization header:
Authorization: Bearer {{ $credentials.metricoolApiKey }}

// In headers (key-value):
// Header Name: Authorization
// Header Value: Bearer {{ $credentials.metricoolApiKey }}
```

### Credential Naming in n8n
- **Format:** Store as credential, reference with `$credentials.serviceName`
- **Examples:**
  - ✅ `$credentials.metricoolApiKey`
  - ✅ `$credentials.resendApiKey`
  - ✅ `$credentials.filloutApiKey`
- **Never:**
  - ❌ `$credentials.actual_key_value`
  - ❌ `$secrets.apikey`
  - ❌ `process.env.SK_PROD_REAL_KEY`

### credential.txt Format
```
# Format: SERVICE_NAME=value
# This file is NEVER committed to git

METRICOOL_API_KEY=sk_prod_xxxxxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxx
FILLOUT_API_KEY=Bearer sk_prod_xxxxxxxxxxxx
CLOUDFLARE_R2_ACCESS_KEY=xxxxxxxxxxx
CLOUDFLARE_R2_SECRET_KEY=xxxxxxxxxxx
N8N_ENCRYPTION_KEY=xxxxxxxxxxx
```

### .gitignore (Protect credential.txt)
```
# Never commit credentials
credential.txt
.env
.env.local
*.key
*.pem
/secrets/
```

---

## 🔐 Database & Customer Data

### What's Protected
- ✅ Client personal information (names, emails, phone numbers)
- ✅ Client business data (metrics, performance, analytics)
- ✅ User account information
- ✅ Social media analytics (owned by clients)

### Data Access Rules
- ✅ Only access data you need for the task
- ✅ Respect role-based access control (Admin/Editor/Viewer)
- ✅ Use linked record filtering (e.g., `Linked Client = current user's client`)
- ✅ Log data access for audit trails
- ❌ Never download all customer data unnecessarily
- ❌ Never share test data with unauthorized people
- ❌ Never export customer data to external services

### Data in Backups
- ✅ Regular backups are encrypted
- ✅ Backup storage is protected (Fillout, n8n, Cloudflare)
- ✅ Restore process is documented
- ❌ Never test backups with real customer data on unprotected systems

---

## 🚨 Logging & Error Handling

### What's Safe to Log
- ✅ Workflow execution status (started, completed, failed)
- ✅ Error messages (without sensitive data)
- ✅ API response codes (200, 404, 500)
- ✅ Execution duration and performance
- ✅ General debug info (node names, step count)

### What NEVER Gets Logged
- ❌ API keys or authorization headers
- ❌ Customer data (names, emails, phone numbers)
- ❌ Request/response bodies with sensitive data
- ❌ Passwords or credentials
- ❌ Database connection strings with credentials
- ❌ Personal identification numbers (SSN, ID, passport)
- ❌ Financial information (credit cards, bank accounts)
- ❌ Health/medical data

### n8n Logging Best Practices
```javascript
// ❌ WRONG - Logs full response with potential secrets
console.log("API Response:", apiResponse);

// ✅ RIGHT - Logs only safe info
console.log("API call completed", { status: apiResponse.status, timestamp: new Date() });

// ❌ WRONG - Logs authorization header
console.log("Request headers:", { Authorization: authHeader, ...otherHeaders });

// ✅ RIGHT - Logs without sensitive headers
console.log("Request sent", { endpoint: url, method: 'GET' });
```

### Error Handling Pattern
```javascript
try {
  // API call
  const response = await fetchMetrics();
} catch (error) {
  // ❌ WRONG - Logs full error which might contain keys
  console.log("Error:", error);

  // ✅ RIGHT - Logs safe error info
  console.log("Metrics API failed", {
    errorType: error.name,
    message: error.message || "Unknown error",
    statusCode: error.statusCode,
    timestamp: new Date()
  });

  // Send error to n8n error workflow (without data)
  // Don't expose to user without sanitizing
}
```

---

## 🔒 Deployment Security

### Before Deploying
- [ ] No credentials in code/workflows
- [ ] Error handling includes sensitive data masking
- [ ] Logging doesn't expose API keys
- [ ] All authentication uses credential stubs
- [ ] Database access respects role-based control

### Environment Segregation
- **Development:** Dummy/test API keys only
- **Staging:** Optional, test with limited data
- **Production:** Real credentials in credential.txt (protected file)

### Deploy Checklist
- [ ] Code reviewed for security issues
- [ ] No hardcoded keys or passwords
- [ ] Error messages don't expose system details
- [ ] API rate limits not exceeded
- [ ] Database backups before major changes
- [ ] Rollback plan if something breaks
- [ ] Monitor execution logs for errors (30 mins post-deploy)

---

## 🛡️ Third-Party API Security

### Metricool API
- ✅ Use API key from credential.txt
- ✅ Rate limit: 100 requests/minute (respect it)
- ✅ Only request data you need
- ✅ Handle errors gracefully
- ❌ Don't log the API key
- ❌ Don't expose user/blog IDs in logs

### Resend Email API
- ✅ Use API key from credential.txt
- ✅ Verify email addresses before sending
- ✅ Have unsubscribe link in emails
- ✅ Handle bounce/unsubscribe callbacks
- ❌ Don't test with real customer emails (use test domain)
- ❌ Don't log API keys

### Fillout/Zite API
- ✅ Use API key from credential.txt
- ✅ Validate data before creating records
- ✅ Use linked record relationships correctly
- ✅ Respect rate limits
- ❌ Don't modify system fields without authorization
- ❌ Don't delete records without backup

### Cloudflare R2
- ✅ Use access keys from credential.txt
- ✅ Keep bucket policies restrictive
- ✅ Enable CORS only for needed origins
- ✅ Regularly audit R2 usage
- ❌ Don't make entire bucket public
- ❌ Don't store sensitive data in public URLs

---

## 👤 Access Control

### Role-Based Access
- **Admin:** Full access to all clients and data
- **Editor:** Can edit assigned client data only
- **Viewer:** Read-only access to assigned client data

### Implementation in Zite
- [ ] Create "Linked Client" relationship
- [ ] Filter views: `Linked Client = current user's client`
- [ ] Restrict admin functions to Admin role
- [ ] Log who accessed what data (audit trail)

### Rule to Follow
```
WHERE Linked_Client_ID = $("current_user").linkedClientId
```

This ensures users only see their assigned client's data.

---

## 📋 Compliance Checklist

### Code Review
- [ ] No credentials in any file
- [ ] Error handling masks sensitive data
- [ ] Logging is safe (no keys, customer data)
- [ ] API calls use credential stubs
- [ ] Database queries respect access control

### Deployment
- [ ] All rules followed
- [ ] Team approved changes
- [ ] Backup taken before deployment
- [ ] Rollback plan documented
- [ ] Monitoring enabled (30 mins post-deploy)

### Documentation
- [ ] No credentials mentioned in docs
- [ ] API usage documented safely
- [ ] Access control explained
- [ ] Error handling approach documented

---

## 🚨 If You Accidentally Expose Credentials

1. **Immediately:**
   - Stop all work
   - Notify team immediately (Slack, email)
   - Identify what was exposed (key, database password, etc.)

2. **Within 5 minutes:**
   - Rotate the exposed credential (generate new key)
   - Disable old credential in all services
   - Update credential.txt with new value

3. **Within 30 minutes:**
   - Review git history for exposure
   - If in git: Use `git filter-branch` or contact team lead
   - Monitor n8n logs for suspicious activity

4. **Document:**
   - Log incident in @operations/INCIDENT_LOG.md
   - Note what happened, when, and how it was fixed
   - Review to prevent repetition

### Example Incident Entry:
```
## 2026-03-30 — Accidentally Committed API Key

**What:** Metricool API key exposed in workflow node
**When:** 15:30 UTC
**Who Found:** Claude during code review
**Impact:** No known misuse, rotated within 5 mins
**Fix:** Generated new Metricool API key, updated credential.txt
**Prevention:** Add credential.txt to .gitignore
**Status:** ✅ Resolved
```

---

## 🎓 Learning Resources

- **OWASP:** https://owasp.org (security best practices)
- **n8n Security:** n8n docs on credential management
- **API Security:** Best practices for API key management

---

## ✅ Sign-Off

**By working on this project, you agree to:**
- [ ] Never commit credentials to git
- [ ] Never hardcode API keys
- [ ] Never log sensitive data
- [ ] Never expose customer data
- [ ] Always use credential stubs in n8n
- [ ] Always respect access control rules
- [ ] Report security issues immediately

**Questions?** Ask team lead or see @CLAUDE.md

---

**Last Reviewed:** March 30, 2026
**Next Review:** June 30, 2026
**Owner:** Security Lead / DevOps
