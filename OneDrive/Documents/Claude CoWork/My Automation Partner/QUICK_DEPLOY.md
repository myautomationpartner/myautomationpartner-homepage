# Quick Deploy: Websites + Portal (Direct Method)

**Time:** 15-20 minutes
**Method:** SSH + nginx (simpler than Coolify UI)
**Result:** Both sites live + portal fetching metrics

---

## 🚀 Direct Deployment Steps

### Step 1: Copy Files to Hetzner

```bash
# From your local machine, copy files to Hetzner
scp homepage.html root@87.99.128.65:/var/www/myautomationpartner/
scp dancescapes-portal.html root@87.99.128.65:/var/www/myautomationpartner/dancescapes/
scp dancescapes-metrics.json root@87.99.128.65:/var/www/myautomationpartner/api/metrics/
```

### Step 2: SSH into Hetzner & Create Directory Structure

```bash
ssh root@87.99.128.65

# Create web root directories
mkdir -p /var/www/myautomationpartner/html
mkdir -p /var/www/myautomationpartner/api/metrics
chmod -R 755 /var/www/myautomationpartner

# Copy files
cp /path/to/homepage.html /var/www/myautomationpartner/html/index.html
cp /path/to/dancescapes-portal.html /var/www/myautomationpartner/dancescapes/index.html
cp /path/to/dancescapes-metrics.json /var/www/myautomationpartner/api/metrics/dancescapes.json

# Verify files exist
ls -la /var/www/myautomationpartner/html/
ls -la /var/www/myautomationpartner/dancescapes/
ls -la /var/www/myautomationpartner/api/metrics/
```

### Step 3: Create nginx Config

```bash
# Create nginx config for myautomationpartner.com
cat > /etc/nginx/sites-available/myautomationpartner.conf << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name myautomationpartner.com www.myautomationpartner.com;

    root /var/www/myautomationpartner/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Allow CORS for metrics fetch
    location /api/ {
        alias /var/www/myautomationpartner/api/;
        add_header Access-Control-Allow-Origin *;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name dancescapes.myautomationpartner.com;

    root /var/www/myautomationpartner/dancescapes;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Allow CORS for metrics fetch
    location /api/ {
        alias /var/www/myautomationpartner/api/;
        add_header Access-Control-Allow-Origin *;
    }
}
EOF

# Enable the config
ln -s /etc/nginx/sites-available/myautomationpartner.conf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Step 4: Verify nginx is Running

```bash
systemctl status nginx
curl http://myautomationpartner.com
curl http://dancescapes.myautomationpartner.com
```

---

## 🔧 n8n Workflow Modification

### Option A: Using n8n File Node

1. **Open n8n:** n8n.myautomationpartner.com
2. **Open "Social Media Scrape" workflow**
3. **Add new node after HTTP requests:**
   - Type: **File**
   - Operation: **Write to file**
   - File path: `/var/www/myautomationpartner/api/metrics/dancescapes.json`

4. **Set content to:**
```json
{
  "instagram": {{ $node["HTTP Request Instagram"].json.followers }},
  "tiktok": {{ $node["HTTP Request TikTok"].json.followers_count }},
  "facebook": {{ $node["HTTP Request Facebook"].json.pageFollows }},
  "updated_at": "{{ $now.toISO() }}"
}
```

5. **Test:** Click "Execute" → Check if JSON file updates
6. **Deploy:** Click "Publish" when working

### Option B: Manual Testing (Quick Verify)

```bash
# SSH into Hetzner
ssh root@87.99.128.65

# Manually update metrics JSON (simulates n8n workflow)
cat > /var/www/myautomationpartner/api/metrics/dancescapes.json << 'EOF'
{
  "instagram": 45230,
  "tiktok": 128450,
  "facebook": 8920,
  "updated_at": "2026-03-30T14:30:00Z"
}
EOF

# Verify portal can read it
curl http://87.99.128.65/api/metrics/dancescapes.json
```

---

## 🌐 DNS Configuration

### Update Cloudflare DNS

1. Go to: https://dash.cloudflare.com
2. Select myautomationpartner.com
3. **DNS Records:**
   - Type: A
   - Name: @ (or myautomationpartner.com)
   - Content: 87.99.128.65
   - Proxy: DNS only (gray cloud)

4. **Add subdomain for portal:**
   - Type: CNAME
   - Name: dancescapes
   - Content: myautomationpartner.com
   - Proxy: DNS only

5. **Wait 5-10 minutes for DNS propagation**

---

## ✅ Verification Checklist

```bash
# 1. Test homepage loads
curl -I http://myautomationpartner.com
# Should return: HTTP/1.1 200 OK

# 2. Test portal loads
curl -I http://dancescapes.myautomationpartner.com
# Should return: HTTP/1.1 200 OK

# 3. Test metrics JSON accessible
curl http://87.99.128.65/api/metrics/dancescapes.json
# Should return JSON with instagram/tiktok/facebook values

# 4. Check file permissions
ls -la /var/www/myautomationpartner/api/metrics/
# Should be readable by nginx (755 or 644)

# 5. Check nginx logs for errors
tail -f /var/log/nginx/error.log
```

---

## 🖥️ Browser Testing

1. **Open:** http://myautomationpartner.com
   - Should see homepage with hero section
   - Check mobile responsiveness (F12)

2. **Open:** http://dancescapes.myautomationpartner.com
   - Should see portal with 3 metric cards
   - Metrics should show placeholder values
   - Check "Last updated" time

3. **Portal Auto-Refresh:**
   - Portal updates every 5 minutes
   - Watch browser console (F12) for fetch requests
   - Should see `/api/metrics/dancescapes.json` calls

---

## 🔐 SSL/HTTPS Setup

Once verified over HTTP, set up SSL:

```bash
# Install Certbot if not already installed
apt-get install certbot python3-certbot-nginx

# Create SSL certificates
certbot --nginx -d myautomationpartner.com -d www.myautomationpartner.com -d dancescapes.myautomationpartner.com

# Auto-renewal should be enabled by default
certbot renew --dry-run
```

---

## 🚨 Troubleshooting

**Portal shows "Error" in browser:**
```bash
# Check browser console (F12) → Network tab
# Look for failed fetch to /api/metrics/dancescapes.json

# If 404 error:
ls -la /var/www/myautomationpartner/api/metrics/dancescapes.json
# File should exist

# If CORS error:
# Check nginx config has: add_header Access-Control-Allow-Origin *;
```

**Metrics not updating:**
```bash
# Check n8n workflow logs
# Check file write permissions:
chmod 644 /var/www/myautomationpartner/api/metrics/dancescapes.json

# Manually update to verify portal reads it:
echo '{"instagram": 99999, "tiktok": 99999, "facebook": 99999, "updated_at": "'$(date -Iseconds)'"}' > /var/www/myautomationpartner/api/metrics/dancescapes.json
```

**DNS not resolving:**
```bash
# Test DNS propagation
nslookup myautomationpartner.com
nslookup dancescapes.myautomationpartner.com

# Should return: 87.99.128.65
# If not, wait 5-10 minutes and try again
```

---

## ⏭️ After Deployment

- ✅ Both sites live and accessible
- ✅ Portal fetches metrics every 5 mins
- ✅ n8n writes metrics hourly
- ✅ Ready for Dancescapes to use

**Next step:** Scale to other clients or add Express API for real-time updates

---

## 📝 Commands Summary (Copy & Paste Ready)

```bash
# 1. Create directories
mkdir -p /var/www/myautomationpartner/{html,dancescapes,api/metrics}

# 2. Set permissions
chmod -R 755 /var/www/myautomationpartner

# 3. Copy files (from local machine)
scp homepage.html root@87.99.128.65:/var/www/myautomationpartner/html/index.html
scp dancescapes-portal.html root@87.99.128.65:/var/www/myautomationpartner/dancescapes/index.html

# 4. Test metrics file
curl http://87.99.128.65/api/metrics/dancescapes.json

# 5. Reload nginx
systemctl reload nginx

# 6. Verify
curl -I http://87.99.128.65/
```

---

**Ready to deploy? Just need:**
1. SSH access to Hetzner (use root@87.99.128.65)
2. Cloudflare API token (for DNS if automating)
3. ~15 minutes

Let me know if you'd like me to execute these commands! 🚀
