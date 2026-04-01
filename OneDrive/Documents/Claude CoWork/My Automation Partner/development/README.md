# Development Folder — `/development`

**Purpose:** Code snippets, tools, utilities, test data, and developer resources.

## 💻 What Goes Here

- Reusable code snippets and utilities
- n8n workflow editing tools (Pinia store injection)
- Test payloads and sample data
- Common n8n expressions and queries
- Debugging and troubleshooting scripts
- Development documentation and examples

## 📂 Folder Structure

```
development/
├── README.md (this file)
├── n8n_workflow_tool.js
├── test_payloads/
│   ├── client-onboarding-test.json
│   ├── metricool-response-sample.json
│   ├── fillout-create-record-response.json
│   └── resend-email-response.json
├── query_templates/
│   ├── n8n-expressions.md
│   └── common-queries.md
├── debug_scripts/
│   ├── inspect-workflow-nodes.js
│   ├── test-api-connections.js
│   └── validate-data-format.js
└── DEVELOPMENT_GUIDE.md
```

## 🔧 Key Tools & Files

### n8n Workflow Tool (Canonical Method)
**File:** `n8n_workflow_tool.js`

This is the canonical method for programmatic n8n workflow editing. It injects JavaScript directly into n8n's Pinia store, bypassing MCP validation limitations.

**Usage:**
1. Open n8n in browser (https://n8n.myautomationpartner.com)
2. Navigate to the workflow you want to edit
3. Open browser console (F12 → Console tab)
4. Paste and modify the code from `n8n_workflow_tool.js`
5. Press Enter to execute

**Why Pinia Injection?**
- Avoids n8n MCP SDK validation errors
- Direct access to internal workflow store
- Reliable for adding/modifying nodes and connections
- Tested and proven on this instance

**Example:**
```javascript
(async () => {
  const app = document.querySelector('#app').__vue_app__;
  const pinia = app.config.globalProperties.$pinia;
  const store = pinia._s.get('workflows');

  // Modify workflow nodes here
  const nodes = store.getNodes();

  // ... make changes ...

  store.setNodes(nodes);
  const result = await store.updateWorkflow('WORKFLOW_ID', {
    nodes: store.getNodes(),
    connections: store.allConnections,
    name: 'workflow-name'
  });

  return `Workflow saved: ${result?.name}`;
})();
```

## 🧪 Test Payloads

### Client Onboarding Webhook Test
**File:** `test_payloads/client-onboarding-test.json`

```json
{
  "businessName": "Test Company Inc",
  "email": "test@testcompany.com",
  "plan": "Growth",
  "contactPerson": "Jane Doe",
  "phone": "+1-555-0000",
  "metricoolUserId": "4660143",
  "metricoolBlogId": "6035446"
}
```

**Test Command:**
```bash
curl -X POST https://n8n.myautomationpartner.com/webhook/client-onboarding \
  -H "Content-Type: application/json" \
  -d @test_payloads/client-onboarding-test.json
```

### Metricool API Response Sample
**File:** `test_payloads/metricool-response-sample.json`

```json
{
  "data": [
    {
      "dateTime": "2026-03-30T00:00:00Z",
      "value": 1242,
      "network": "instagram"
    }
  ]
}
```

## 📚 Common n8n Expressions

**File:** `query_templates/n8n-expressions.md`

### Date Expressions:
```javascript
// Current date/time in UTC
{{ $now.toUTC().toISO() }}

// 30 days ago
{{ $now.minus({days: 30}).toUTC().toISO() }}

// Metricool format (with Z suffix)
{{ $now.toUTC().toISO().substring(0, 19) + 'Z' }}

// ISO string
{{ new Date().toISOString() }}
```

### Data Transformations:
```javascript
// Access previous node output
{{ $('Node Name').item.json.fieldName }}

// Conditional value
{{ $json.value ?? 'default' }}

// Array access
{{ $json.results[0].name }}

// Object creation
{{ JSON.stringify({ field: $json.value, date: $now.toUTC().toISO() }) }}
```

### String Operations:
```javascript
// Concatenation
{{ $json.firstName + ' ' + $json.lastName }}

// Template literal
{{ `Hello ${$json.name}!` }}

// Uppercase/lowercase
{{ $json.name.toUpperCase() }}
```

## 🐛 Debugging & Troubleshooting

### Workflow Not Triggering?
1. Check webhook URL is correct
2. Verify request method (POST/GET) matches
3. Inspect n8n execution logs
4. Test with curl from `/development/test_payloads/`

### Data Not Flowing Correctly?
1. Use Set node to inspect and log data
2. Check expressions don't have syntax errors
3. Verify node connections in workflow diagram
4. Review HTTP response codes (200 = success)

### API Connection Issues?
1. Verify credentials in `credential.txt`
2. Check API endpoint URLs (case-sensitive)
3. Test API manually: `curl -H "Authorization: Bearer {key}" {url}`
4. Verify SSL certificates (n8n has `provideSslCertificates: false`)

## 🚀 Quick Development Workflow

### Adding a New Workflow Node:
1. Edit in n8n UI or use Pinia injection
2. Test in manual mode
3. Export to JSON → `../workflows/workflow-backups/`
4. Document in `../workflows/LIVE_WORKFLOWS.md`
5. Update `../MAP_MASTER.md` with any changes

### Testing an API Integration:
1. Create test payload in `test_payloads/`
2. Use HTTP Request node with test payload
3. Inspect response
4. Adjust parsing/transformation as needed
5. Document in this folder

## 📝 Development Guide

**File:** `DEVELOPMENT_GUIDE.md` (To Create)

Should include:
- Local development setup (if applicable)
- How to test workflows locally
- Code review checklist
- Testing procedures and acceptance criteria
- Documentation standards
- Git workflow (if using version control)

## 🔗 API Testing Tools

### Manual API Testing:
```bash
# Test Metricool API
curl -X GET "https://app.metricool.com/api/v2/analytics/timelines?from=2026-03-01T00:00:00Z&to=2026-03-30T23:59:59Z&metric=followers&network=instagram&userId=4660143&blogId=6035446" \
  -H "X-Mc-Auth: YOUR_METRICOOL_API_KEY"

# Test Fillout Create Record
curl -X POST "https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/tfgmDJ9BFXf/records" \
  -H "Authorization: Bearer YOUR_FILLOUT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"record": {"Name": "Test User", "Email": "test@example.com"}}'

# Test Resend Email
curl -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer YOUR_RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from": "onboarding@myautomationpartner.com", "to": "test@example.com", "subject": "Test", "html": "<p>Test</p>"}'
```

## 📋 Checklist for New Features

- [ ] Feature designed and approved
- [ ] Test payload created in `test_payloads/`
- [ ] Workflow/code written and tested
- [ ] Error handling implemented
- [ ] API responses validated
- [ ] Documentation updated in `../docs/`
- [ ] Added to `../workflows/LIVE_WORKFLOWS.md`
- [ ] Updated `../MAP_MASTER.md`
- [ ] Tested with real client data
- [ ] Performance verified (< 5s execution time)
- [ ] Deployed to production
- [ ] Monitored for issues (24 hours)

---

**Note:** This folder is for developer tools and snippets. Production workflows live in `/workflows`. Documentation lives in `/docs`.
