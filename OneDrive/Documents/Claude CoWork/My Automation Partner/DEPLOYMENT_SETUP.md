# Deployment Setup: Websites + Portal

**Date Created:** March 30, 2026
**Status:** Ready for deployment
**Timeline:** 1-2 hours to full deployment

---

## 📁 Files Ready

- ✅ `homepage.html` — myautomationpartner.com (main website)
- ✅ `dancescapes-portal.html` — Dancescapes dashboard
- ✅ Sample metrics JSON (will create during setup)

---

## 🚀 Deployment Steps

### Step 1: Create Static Site in Coolify

1. **Open Coolify:** http://87.99.128.65:8000
2. **Go to:** Dancescapes-Portal project → production environment
3. **Click:** "+ New" → Select "Static Site"
4. **Configure:**
   - Name: `myautomationpartner-website`
   - Domain: `myautomationpartner.com`
   - Build: None (static files)
   - Publish: `homepage.html`
   - Port: 80

5. **Deploy homepage.html** to Coolify

---

### Step 2: Create Portal Static Site

1. **In same project, click:** "+ New" → "Static Site"
2. **Configure:**
   - Name: `dancescapes-portal`
   - Domain: `dancescapes.myautomationpartner.com` (or subdomain of choice)
   - Publish: `dancescapes-portal.html`
   - Port: 81 (or next available)

3. **Deploy dancescapes-portal.html**

---

### Step 3: Create Metrics JSON Endpoint

The portal reads metrics from: `/api/metrics/dancescapes.json`

**Option A: Using n8n Webhook (Recommended)**

1. **In n8n**, modify "Social Media Scrape" workflow:
   - After fetching Instagram/TikTok/Facebook metrics
   - Add new node: **File** (write to disk)
   - **Path:** `/opt/coolify/dancescapes-metrics.json`
   - **Content:**
     ```json
     {
       "instagram": {{ $node["HTTP Request Instagram"].json.followers }},
       "tiktok": {{ $node["HTTP Request TikTok"].json.followers_count }},
       "facebook": {{ $node["HTTP Request Facebook"].json.pageFollows }},
       "updated_at": "{{ $now.toISO() }}"
     }
     ```

2. **Schedule:** Keep existing hourly schedule

3. **Test:** Run workflow manually, verify JSON file created

---

**Option B: Manual Testing (Quick Start)**

Create this file on Hetzner VPS temporarily:

```bash
cat > /tmp/dancescapes-metrics.json << 'EOF'
{
  "instagram": 45230,
  "tiktok": 128450,
  "facebook": 8920,
  "updated_at": "2026-03-30T14:30:00Z"
}
EOF
```

Serve from Coolify data folder.

---

### Step 4: Configure File Access

Portal needs to read `/api/metrics/dancescapes.json`

**Option A: Using nginx Reverse Proxy** (Coolify handles this)
- Files served from Coolify static site
- n8n workflow writes to shared folder
- Configure nginx location block to serve JSON

**Option B: Simple approach**
- Save JSON to Coolify's public folder
- Update portal fetch URL

---

## 🔗 Portal Integration

**Portal fetches from:**
```
/api/metrics/dancescapes.json
```

**JSON Structure (required):**
```json
{
  "instagram": 45230,
  "tiktok": 128450,
  "facebook": 8920,
  "updated_at": "2026-03-30T14:30:00Z"
}
```

**Portal updates every:** 5 minutes (auto-refresh)

---

## 🛠️ n8n Workflow Modification

**Current "Social Media Scrape" flow:**
```
Schedule → Search records → Update record → HTTP Requests (3 platforms)
```

**New flow (add at end):**
```
HTTP Requests (3 platforms)
  ↓
Set node: Merge metrics into object
  ↓
File node: Write to dancescapes-metrics.json
  ↓
Done
```

**Set Node Output:**
```javascript
{
  "instagram": {{$node["HTTP Request Instagram"].json.followers}},
  "tiktok": {{$node["HTTP Request TikTok"].json.followers_count}},
  "facebook": {{$node["HTTP Request Facebook"].json.pageFollows}},
  "updated_at": {{$now.toISO()}}
}
```

---

## 📊 Testing Checklist

- [ ] Homepage loads at myautomationpartner.com
- [ ] Dancescapes portal loads at dancescapes.myautomationpartner.com
- [ ] Portal displays placeholder metrics (before n8n integration)
- [ ] n8n workflow writes metrics.json successfully
- [ ] Portal fetches live metrics and updates every 5 mins
- [ ] Mobile responsive on both sites
- [ ] SSL certificates working (Coolify auto-generates)

---

## 🔗 URLs After Deployment

| Site | URL |
|------|-----|
| Main Website | https://myautomationpartner.com |
| Dancescapes Portal | https://dancescapes.myautomationpartner.com |

---

## ⏭️ Next Phase (Express API)

Once verified, we can upgrade to:
- Real-time metrics (webhook-based)
- Multi-client portals
- User authentication
- Advanced analytics

But for now, this **JSON + polling** approach is:
- ✅ Fast to set up
- ✅ No new dependencies
- ✅ Works with existing n8n workflow
- ✅ Scales to ~100 clients before needing Express API

---

## 🚨 Troubleshooting

**Portal shows "Error":**
- Check browser console (F12) for fetch errors
- Verify JSON file exists at correct path
- Ensure CORS headers allow cross-origin fetch

**Metrics not updating:**
- Check n8n workflow execution logs
- Verify file write permissions on Hetzner
- Check n8n scheduler is running

**DNS not resolving:**
- Verify Cloudflare DNS records point to 87.99.128.65
- Wait 5-10 mins for DNS propagation
- Test with: `nslookup myautomationpartner.com`

---

**Ready to deploy? Next steps:**
1. Copy both HTML files to Hetzner
2. Create new static sites in Coolify
3. Modify n8n workflow to write metrics
4. Test end-to-end
