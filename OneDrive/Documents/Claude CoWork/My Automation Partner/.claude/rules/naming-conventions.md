# NAMING CONVENTIONS — Hard Constraints

**Purpose:** Consistency across all naming in code, workflows, and documentation. Follow these rules for all new work.

**Last Updated:** March 30, 2026
**Enforced:** Yes — All PRs and deployments must follow

---

## 📋 n8n Workflow Naming

### Workflow Names
- **Format:** `{sequence}-{purpose}` or `{verb}-{noun}`
- **Examples:**
  - ✅ `01-client-onboarding` (sequence for order)
  - ✅ `02-metrics-collection` (sequence for order)
  - ✅ `execute-metricool-api` (sub-workflow pattern)
  - ✅ `global-error-catch` (error handling pattern)
- **Anti-patterns:**
  - ❌ `workflow1`, `workflow2` (no meaning)
  - ❌ `ClientOnboarding` (inconsistent case)
  - ❌ `test_workflow_v3_draft` (too many versions)

### Node Names (in workflows)
- **Format:** Ask as a question or state as a condition
- **Examples:**
  - ✅ `Is user active?` (decision node)
  - ✅ `Get latest metrics` (data retrieval)
  - ✅ `Format data for Zite` (transformation)
  - ✅ `Send welcome email` (action)
  - ✅ `Create client in Zite` (action)
- **Anti-patterns:**
  - ❌ `IF` or `IF1`, `IF2` (no context)
  - ❌ `Step1`, `Step2` (no meaning)
  - ❌ `Node42` (no descriptive value)

### Variable Names (in Set nodes)
- **Format:** `camelCase` for variables, `UPPER_SNAKE_CASE` for constants
- **Examples:**
  - ✅ `clientName`, `businessEmail`, `metricoolUserId`
  - ✅ `METRICOOL_API_KEY`, `RESEND_FROM_EMAIL`
  - ✅ `isActive`, `hasMetrics`, `needsNotification`
- **Anti-patterns:**
  - ❌ `ClientName`, `client_name` (inconsistent case)
  - ❌ `x`, `temp`, `data` (too vague)
  - ❌ `variable1`, `var2` (no meaning)

---

## 📁 Folder & File Naming

### Folder Names
- **Format:** `lowercase-with-hyphens`
- **Examples:**
  - ✅ `/workflows/sub-workflows/`
  - ✅ `/integrations/metricool/`
  - ✅ `/operations/onboarding-docs/`
- **Anti-patterns:**
  - ❌ `/workflows/Sub-Workflows` (inconsistent case)
  - ❌ `/integrations/Metricool_API` (mixed separators)

### Documentation Files
- **Format:** `UPPERCASE_SNAKE_CASE.md` for main docs, `lowercase-kebab-case.md` for detailed docs
- **Examples:**
  - ✅ `MAP_MASTER.md` (main documentation)
  - ✅ `API_SCHEMA.md` (reference)
  - ✅ `api-integration-guide.md` (detailed guide)
  - ✅ `WORKFLOW_INVENTORY.md` (index)
- **Anti-patterns:**
  - ❌ `map_master.md` (all lowercase for main docs)
  - ❌ `API_Schema.md` (inconsistent case)

### JSON/Data Files
- **Format:** `lowercase-kebab-case.json`
- **Examples:**
  - ✅ `dns-records.json`
  - ✅ `database-schema.json`
  - ✅ `test-payloads.json`
- **Anti-patterns:**
  - ❌ `DnsRecords.json`
  - ❌ `dns_records.json` (use hyphens, not underscores)

### Script Files
- **Format:** `lowercase-kebab-case.js` or `lowercase-kebab-case.sh`
- **Examples:**
  - ✅ `n8n-workflow-tool.js`
  - ✅ `setup-vps.sh`
  - ✅ `debug-api-calls.js`

---

## 🏷️ Database Field Naming (Zite/Fillout)

### Client Table
- ✅ `Name` (business name)
- ✅ `Contact Email`
- ✅ `Status` (dropdown: Active/Paused/Inactive)
- ✅ `Subscription Plan` (dropdown: Starter/Growth/Agency)
- ✅ `Metricool User ID` (linked ID)
- ✅ `Metricool Blog ID` (linked ID)
- ✅ `Created Date` (auto timestamp)

### Users Table
- ✅ `Name` (first + last or display name)
- ✅ `Email`
- ✅ `Role` (dropdown: Admin/Editor/Viewer)
- ✅ `Active` (checkbox)
- ✅ `Linked Client` (linked record)
- ✅ `Created Date` (auto timestamp)

### Metrics Table
- ✅ `Date` (ISO format with Z suffix: 2026-03-30T00:00:00Z)
- ✅ `Platform` (dropdown: Instagram/TikTok/Facebook/YouTube)
- ✅ `Metric Type` (dropdown: followers/engagement/reach)
- ✅ `Value` (number)
- ✅ `Linked Client` (linked record)

### Content Calendar Table
- ✅ `Title` (post title)
- ✅ `Scheduled Date` (ISO format with Z: 2026-03-30T10:00:00Z)
- ✅ `Platform` (dropdown: multi-select)
- ✅ `Status` (dropdown: Scheduled/Published/Drafted)
- ✅ `Content` (long text)
- ✅ `Linked Client` (linked record)

---

## 🔗 API Naming (n8n HTTP Nodes)

### API Key Variables
- **Format:** `{SERVICE}_API_KEY`
- **Examples:**
  - ✅ `METRICOOL_API_KEY`
  - ✅ `RESEND_API_KEY`
  - ✅ `FILLOUT_API_KEY`
  - ✅ `CLOUDFLARE_API_KEY`
- **In n8n:** Always use credential stubs, never hardcoded keys
  - ✅ Use: `{{ $credentials.metricoolApiKey }}`
  - ❌ Never: `{{ 'sk_prod_actual_key' }}`

### API Endpoint Variables
- **Format:** `{SERVICE}_API_URL`
- **Examples:**
  - ✅ `METRICOOL_API_URL: https://app.metricool.com/api/v2`
  - ✅ `FILLOUT_API_URL: https://tables.fillout.com/api/v1`
  - ✅ `RESEND_API_URL: https://api.resend.com`
- **In n8n:** Can be hardcoded (not secrets)
  - ✅ Use: `https://tables.fillout.com/api/v1/bases/{baseId}/tables/{tableId}/records`

### API Methods
- **Format:** HTTP method + target
- **Examples:**
  - ✅ `GET Metricool Metrics`
  - ✅ `POST Create Client in Zite`
  - ✅ `PATCH Update User Role`

---

## 📊 Webhook Naming

### Webhook Names in n8n
- **Format:** `/webhook/{service}/{action}`
- **Examples:**
  - ✅ `/webhook/client-onboarding` (main client signup)
  - ✅ `/webhook/metrics-sync` (metrics update)
  - ✅ `/webhook/form-submission` (generic form handler)
  - ✅ `/webhook/email-bounce` (event handler)
- **Anti-patterns:**
  - ❌ `/webhook/1`, `/webhook/test` (no meaning)
  - ❌ `/webhook/ClientOnboarding` (use lowercase)

---

## 🎨 Git Branch Naming (if using version control)

### Branch Format
- **Format:** `{type}/{issue-number}-{description}`
- **Types:** `feature`, `fix`, `refactor`, `docs`, `hotfix`
- **Examples:**
  - ✅ `feature/MAP-001-add-content-calendar`
  - ✅ `fix/MAP-042-metrics-sync-bug`
  - ✅ `docs/MAP-005-api-documentation`
  - ✅ `hotfix/production-error`

---

## 💬 Documentation Naming

### README Files
- ✅ `README.md` (in folder root, explains folder purpose)
- ✅ `SKILL.md` (in .claude/skills folders)
- ✅ `API_SCHEMA.md` (in integrations/)
- ✅ `DEPLOYMENT_GUIDE.md`
- ✅ `WORKFLOW_INVENTORY.md`

### Capitalization Rule
- **Main docs:** `UPPERCASE_SNAKE_CASE.md`
- **Section headers:** `Title Case`
- **Code examples:** `camelCase` (JavaScript), `UPPER_SNAKE_CASE` (constants)

---

## 🔒 Credential & Secret Naming

### Credential Names in n8n
- **Format:** `{Service}Credentials` or `{Service}ApiKey`
- **Examples:**
  - ✅ `MetricoolCredentials`
  - ✅ `ResendApiKey`
  - ✅ `FilloutApiKey`
  - ✅ `CloudflareR2Access`

### Environment Variables
- **Format:** `UPPERCASE_SNAKE_CASE`
- **Prefix:** Service name
- **Examples:**
  - ✅ `METRICOOL_API_KEY`
  - ✅ `ZITE_BASE_ID`
  - ✅ `N8N_ENCRYPTION_KEY`
  - ✅ `CLOUDFLARE_R2_BUCKET`

### In credential.txt
- **Format:** `SERVICE_KEY=value`
- **Example:**
  ```
  METRICOOL_API_KEY=sk_prod_xxx
  RESEND_API_KEY=re_xxx
  FILLOUT_API_KEY=Bearer sk_prod_xxx
  ```

---

## ✅ Checklist Before Deploying

- [ ] All workflow names follow `{sequence}-{purpose}` pattern
- [ ] All node names ask a question or state an action
- [ ] All variables are `camelCase` (variables) or `UPPER_SNAKE_CASE` (constants)
- [ ] All file names follow: `UPPERCASE.md` (main docs), `lowercase-kebab-case.md` (guides)
- [ ] All API keys use credential stubs, not hardcoded
- [ ] All database fields match approved schema (@integrations/fillout/database-schema.json)
- [ ] All webhook names follow `/webhook/{service}/{action}` pattern
- [ ] No variables named `x`, `temp`, `data`, `variable1`, etc.
- [ ] Git branch (if applicable) follows `{type}/{issue}-{description}`

---

## 🚨 Consequences of Non-Compliance

- **Code Review:** PRs that don't follow conventions will be rejected
- **Automatic Enforcement:** Future CI/CD will lint for these rules
- **Team Clarity:** Inconsistent naming makes code harder to understand and maintain

---

**Questions?** See @CLAUDE.md for how to reach the team.
