/**
 * n8n Workflow Editor — Pinia Store Injection Tool
 * ================================================
 * Run this via Claude's javascript_tool (Claude in Chrome) on any open n8n workflow page.
 * This bypasses the broken n8n MCP SDK and the UI expression editor's auto-bracket bug.
 *
 * URL: https://n8n.myautomationpartner.com/workflow/<WORKFLOW_ID>
 *
 * HOW TO USE
 * ----------
 * 1. Navigate to the target workflow page in the browser
 * 2. Call javascript_tool with action: "javascript_exec" and paste the desired section below
 * 3. If you get 401, navigate to /settings/api to re-auth, then return and retry
 *
 * KNOWN WORKFLOW IDs
 * ------------------
 * myautomationpartner metrics  →  Ag4LvhN5gkxFoKgN
 *
 * METRICOOL API REFERENCE
 * -----------------------
 * Endpoint: GET https://app.metricool.com/api/v2/analytics/timelines
 * Auth header: X-Mc-Auth: <value from credentials.txt>
 *
 * Accounts:
 *   userId = 4660143  (same for all accounts)
 *   Dancescapes         blogId = 6035446
 *   My Automation Partner blogId = 6035338
 *
 * Metric names (EXACT — wrong name = 400 error):
 *   Instagram  network=instagram  metric=followers
 *   TikTok     network=tiktok     metric=followers_count
 *   Facebook   network=facebook   metric=pageFollows
 *
 * Date format: MUST use Z suffix, e.g. 2026-03-28T15:00:00Z
 *   DO NOT use +00:00 — Metricool decodes + as a space → 400 error
 *
 * n8n dynamic date expressions (expression-mode, prefix URL with "="):
 *   from: {{ $now.minus({days: 30}).toUTC().toISO().substring(0, 19) + 'Z' }}
 *   to:   {{ $now.toUTC().toISO().substring(0, 19) + 'Z' }}
 *
 * FILLOUT API REFERENCE
 * ---------------------
 * Base: 9e604ece6abca0ed
 * Metrics table: tfkftiCb4U3
 * Auth: Bearer <value from credentials.txt>
 * POST to: https://tables.fillout.com/api/v1/bases/<base>/tables/<table>/records
 */

// ============================================================
// SECTION 1 — CORE PINIA INJECTION TEMPLATE
// (Replace WORKFLOW_ID, nodes[], and connections{} as needed)
// ============================================================

(async () => {
  // ── Access Pinia store ──────────────────────────────────────
  const app = document.querySelector('#app').__vue_app__;
  const pinia = app.config.globalProperties.$pinia;
  const store = pinia._s.get('workflows');

  // ── Define nodes ───────────────────────────────────────────
  // Each node needs: id, name, type, typeVersion, position, parameters
  //
  // Common types:
  //   n8n-nodes-base.scheduleTrigger   (typeVersion 1.3)
  //   n8n-nodes-base.httpRequest        (typeVersion 4.4)
  //   n8n-nodes-base.set               (typeVersion 3.4)
  //   n8n-nodes-base.if                (typeVersion 2.2)
  //
  // IMPORTANT: Expression-mode parameter values must be prefixed with "="
  //   e.g.  url: "=https://api.example.com?from={{ $now.toUTC().toISO() }}"
  //   e.g.  jsonBody: "={{ JSON.stringify({key: $json.value}) }}"

  const nodes = [
    {
      id: "node-id-here",          // keep stable across edits to preserve execution history
      name: "Node Name",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.4,
      position: [0, 0],            // [x, y] on canvas — space nodes 300-400px apart
      parameters: {
        url: "=https://example.com?from={{ $now.minus({days:30}).toUTC().toISO().substring(0,19) + 'Z' }}",
        sendHeaders: true,
        headerParameters: {
          parameters: [{ name: "X-Mc-Auth", value: "AUTH_VALUE_HERE" }]
        }
      }
    }
    // ... add more nodes
  ];

  // ── Define connections ──────────────────────────────────────
  // Format: { "Source Node Name": { main: [[{ node: "Target Node Name", type: "main", index: 0 }]] } }
  // Fan-out (one source → multiple targets): put all targets in the same inner array
  // Fan-in (multiple sources → one target): each source gets its own entry pointing to same target

  const connections = {
    "Source Node": {
      main: [[
        { node: "Target A", type: "main", index: 0 },
        { node: "Target B", type: "main", index: 0 }   // fan-out
      ]]
    },
    "Target A": { main: [[{ node: "Final Node", type: "main", index: 0 }]] },
    "Target B": { main: [[{ node: "Final Node", type: "main", index: 0 }]] }
  };

  // ── Save to n8n server ─────────────────────────────────────
  store.setNodes(nodes);
  store.setConnections(connections);
  const result = await store.updateWorkflow('WORKFLOW_ID_HERE', {
    nodes: store.getNodes(),
    connections: store.allConnections,
    name: 'workflow-name-here'
  });
  return `Saved: ${result?.name}, nodes: ${result?.nodes?.length}`;
})()


// ============================================================
// SECTION 2 — LIVE PRODUCTION WORKFLOW
// myautomationpartner — Multi-Platform Metrics
// Workflow ID: Ag4LvhN5gkxFoKgN
// ============================================================

// ============================================================
// SECTION 2B — CONTENT CALENDAR WORKFLOW (TEMPLATE)
// Fetches scheduled posts from Metricool (2 brands daily at 7 AM)
// Merges + POSTs to Fillout Content Calendar table
//
// Metricool Posts API:
//   GET https://app.metricool.com/api/v2/scheduler/posts
//   Query params: start, end, timezone, extendedRange, userId, blogId
// ============================================================

(async () => {
  const app = document.querySelector('#app').__vue_app__;
  const pinia = app.config.globalProperties.$pinia;
  const store = pinia._s.get('workflows');

  const auth = 'XQUTDQOFKUGCLCEIVFFQYIUUFVUAVIHDHCUBVRRRNWGANTZEMEYUWTERUOKAEWRG';
  const filloutAuth = 'Bearer sk_prod_IktkDf43suTULP3Lrfl2VTOOQR9kAak7XSUhcv0irLBjmIAL3T7DIAT4jRZNNSqu8f2EgkUy2DcprzkigHh1Cdt1LslBj47GHJ9_46379';

  const baseParams = "from={{ $now.minus({days: 30}).toUTC().toISO().substring(0, 19) + 'Z' }}&to={{ $now.toUTC().toISO().substring(0, 19) + 'Z' }}&timezone=America/New_York&subject=account&userId=4660143&blogId=6035446";

  const nodes = [
    {
      id: "4f02aa7f-b452-499a-8227-9deb4d41904b",
      name: "Schedule Trigger",
      type: "n8n-nodes-base.scheduleTrigger",
      typeVersion: 1.3,
      position: [-1168, 112],
      parameters: { rule: { interval: [{ field: "hours" }] } }
    },
    {
      id: "8ac0649a-1630-4bae-ba2e-77f511ab6ec2",
      name: "HTTP Request - Instagram",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.4,
      position: [-880, -200],
      parameters: {
        url: `=https://app.metricool.com/api/v2/analytics/timelines?${baseParams}&metric=followers&network=instagram`,
        sendHeaders: true,
        headerParameters: { parameters: [{ name: "X-Mc-Auth", value: auth }] }
      }
    },
    {
      id: "tiktok-node-001",
      name: "HTTP Request - TikTok",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.4,
      position: [-880, 0],
      parameters: {
        url: `=https://app.metricool.com/api/v2/analytics/timelines?${baseParams}&metric=followers_count&network=tiktok`,
        sendHeaders: true,
        headerParameters: { parameters: [{ name: "X-Mc-Auth", value: auth }] }
      }
    },
    {
      id: "facebook-node-001",
      name: "HTTP Request - Facebook",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.4,
      position: [-880, 200],
      parameters: {
        url: `=https://app.metricool.com/api/v2/analytics/timelines?${baseParams}&metric=pageFollows&network=facebook`,
        sendHeaders: true,
        headerParameters: { parameters: [{ name: "X-Mc-Auth", value: auth }] }
      }
    },
    {
      id: "set-metrics-001",
      name: "Set - Format Metrics",
      type: "n8n-nodes-base.set",
      typeVersion: 3.4,
      position: [-500, 0],
      parameters: {
        mode: "raw",
        jsonBody: "={{ { \"instagram\": $('HTTP Request - Instagram').item.json.data, \"tiktok\": $('HTTP Request - TikTok').item.json.data, \"facebook\": $('HTTP Request - Facebook').item.json.data } }}"
      }
    },
    {
      id: "fillout-post-001",
      name: "HTTP Request - Fillout POST",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.4,
      position: [-180, 0],
      parameters: {
        method: "POST",
        url: "https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/tfkftiCb4U3/records",
        sendHeaders: true,
        headerParameters: { parameters: [{ name: "Authorization", value: filloutAuth }] },
        sendBody: true,
        specifyBody: "json",
        jsonBody: "={{ JSON.stringify({ \"record\": { \"Date\": new Date().toISOString(), \"Platform\": \"Multi-Platform\", \"Followers_Instagram\": $json.instagram?.[0]?.values?.[0]?.value, \"Followers_TikTok\": $json.tiktok?.[0]?.values?.[0]?.value, \"Followers_Facebook\": $json.facebook?.[0]?.values?.[0]?.value } }) }}"
      }
    }
  ];

  const connections = {
    "Schedule Trigger": { main: [[
      { node: "HTTP Request - Instagram", type: "main", index: 0 },
      { node: "HTTP Request - TikTok",    type: "main", index: 0 },
      { node: "HTTP Request - Facebook",  type: "main", index: 0 }
    ]]},
    "HTTP Request - Instagram": { main: [[{ node: "Set - Format Metrics", type: "main", index: 0 }]] },
    "HTTP Request - TikTok":    { main: [[{ node: "Set - Format Metrics", type: "main", index: 0 }]] },
    "HTTP Request - Facebook":  { main: [[{ node: "Set - Format Metrics", type: "main", index: 0 }]] },
    "Set - Format Metrics":     { main: [[{ node: "HTTP Request - Fillout POST", type: "main", index: 0 }]] }
  };

  store.setNodes(nodes);
  store.setConnections(connections);
  const result = await store.updateWorkflow('Ag4LvhN5gkxFoKgN', {
    nodes: store.getNodes(),
    connections: store.allConnections,
    name: 'myautomationpartner'
  });
  return `Saved: ${result?.name}, nodes: ${result?.nodes?.length}`;
})()


// ============================================================
// CONTENT CALENDAR WORKFLOW — Pinia Injection Code
// Run this via javascript_tool on any n8n workflow page
// Creates: Daily 7 AM trigger → Fetch Dancescapes posts → Fetch My Automation Partner posts
//          → Merge both → POST to Fillout Content Calendar table
// ============================================================

(async () => {
  const app = document.querySelector('#app').__vue_app__;
  const pinia = app.config.globalProperties.$pinia;
  const store = pinia._s.get('workflows');

  const auth = 'XQUTDQOFKUGCLCEIVFFQYIUUFVUAVIHDHCUBVRRRNWGANTZEMEYUWTERUOKAEWRG';
  const filloutAuth = 'Bearer sk_prod_IktkDf43suTULP3Lrfl2VTOOQR9kAak7XSUhcv0irLBjmIAL3T7DIAT4jRZNNSqu8f2EgkUy2DcprzkigHh1Cdt1LslBj47GHJ9_46379';

  // Dynamic date range: today at 00:00 to tomorrow at 23:59 (fetches next 48 hours of posts)
  const dateRange = 'start={{ $now.toUTC().toISO().substring(0, 10) }}T00:00:00&end={{ $now.plus({days: 1}).toUTC().toISO().substring(0, 10) }}T23:59:59';

  const nodes = [
    {
      id: 'schedule-7am-daily',
      name: 'Schedule Trigger - 7 AM Daily',
      type: 'n8n-nodes-base.scheduleTrigger',
      typeVersion: 1.3,
      position: [-1168, 100],
      parameters: {
        rule: {
          interval: [{
            field: 'days',
            daysInterval: 1,
            triggerAtHour: 7,
            triggerAtMinute: 0
          }]
        }
      }
    },
    {
      id: 'http-dancescapes-posts',
      name: 'HTTP Request - Dancescapes Posts',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.4,
      position: [-880, -150],
      parameters: {
        url: `=https://app.metricool.com/api/v2/scheduler/posts?${dateRange}&timezone=America/New_York&extendedRange=true&userId=4660143&blogId=6035446`,
        sendHeaders: true,
        headerParameters: { parameters: [{ name: 'X-Mc-Auth', value: auth }] }
      }
    },
    {
      id: 'http-myauto-posts',
      name: 'HTTP Request - My Automation Partner Posts',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.4,
      position: [-880, 50],
      parameters: {
        url: `=https://app.metricool.com/api/v2/scheduler/posts?${dateRange}&timezone=America/New_York&extendedRange=true&userId=4660143&blogId=6035338`,
        sendHeaders: true,
        headerParameters: { parameters: [{ name: 'X-Mc-Auth', value: auth }] }
      }
    },
    {
      id: 'set-merge-brands',
      name: 'Set - Merge Brands',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [-500, -50],
      parameters: {
        mode: 'raw',
        jsonBody: "={{ {dancescapes: ($('HTTP Request - Dancescapes Posts').item.json.data ?? []), myAutomationPartner: ($('HTTP Request - My Automation Partner Posts').item.json.data ?? [])} }}"
      }
    },
    {
      id: 'http-fillout-post',
      name: 'HTTP Request - Fillout POST',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.4,
      position: [-200, -50],
      parameters: {
        method: 'POST',
        url: 'https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/contentCalendarTable/records',
        sendHeaders: true,
        headerParameters: { parameters: [{ name: 'Authorization', value: filloutAuth }] },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ JSON.stringify({records: Object.entries($json).flatMap(([brand, posts]) => (posts ?? []).map(p => ({record: {Date: p.scheduledDate, Platform: p.platform, Status: p.status, MediaUrl: p.image, Brand: brand, Title: p.title}})))}) }}'
      }
    }
  ];

  const connections = {
    'Schedule Trigger - 7 AM Daily': { main: [[
      { node: 'HTTP Request - Dancescapes Posts', type: 'main', index: 0 },
      { node: 'HTTP Request - My Automation Partner Posts', type: 'main', index: 0 }
    ]]},
    'HTTP Request - Dancescapes Posts': { main: [[{ node: 'Set - Merge Brands', type: 'main', index: 0 }]] },
    'HTTP Request - My Automation Partner Posts': { main: [[{ node: 'Set - Merge Brands', type: 'main', index: 0 }]] },
    'Set - Merge Brands': { main: [[{ node: 'HTTP Request - Fillout POST', type: 'main', index: 0 }]] }
  };

  store.setNodes(nodes);
  store.setConnections(connections);
  const result = await store.updateWorkflow('REPLACE_WITH_WORKFLOW_ID', {
    nodes: store.getNodes(),
    connections: store.allConnections,
    name: 'Content Calendar - Multi-Brand Posts'
  });
  return `Saved: ${result?.name}, nodes: ${result?.nodes?.length}`;
})()

// ============================================================
// SECTION 3 — QUICK REFERENCE: NODE PARAMETER SHAPES
// ============================================================

// Schedule Trigger (hourly)
const scheduleTrigger = {
  type: "n8n-nodes-base.scheduleTrigger",
  typeVersion: 1.3,
  parameters: { rule: { interval: [{ field: "hours" }] } }
};

// HTTP GET with auth header
const httpGet = {
  type: "n8n-nodes-base.httpRequest",
  typeVersion: 4.4,
  parameters: {
    url: "=https://api.example.com/endpoint?param={{ $json.value }}",
    sendHeaders: true,
    headerParameters: { parameters: [{ name: "Authorization", value: "Bearer TOKEN" }] }
  }
};

// HTTP POST with JSON body
const httpPost = {
  type: "n8n-nodes-base.httpRequest",
  typeVersion: 4.4,
  parameters: {
    method: "POST",
    url: "https://api.example.com/records",
    sendHeaders: true,
    headerParameters: { parameters: [{ name: "Authorization", value: "Bearer TOKEN" }] },
    sendBody: true,
    specifyBody: "json",
    jsonBody: "={{ JSON.stringify({ record: { field: $json.value } }) }}"
  }
};

// Set node (raw JSON merge)
const setNode = {
  type: "n8n-nodes-base.set",
  typeVersion: 3.4,
  parameters: {
    mode: "raw",
    jsonBody: "={{ { key: $('Node Name').item.json.data } }}"
  }
};

// IF node
const ifNode = {
  type: "n8n-nodes-base.if",
  typeVersion: 2.2,
  parameters: {
    conditions: {
      options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
      conditions: [{
        leftValue: "={{ $json.value }}",
        rightValue: "",
        operator: { type: "string", operation: "exists" }
      }]
    }
  }
};
