# Deployment Guide — My Automation Partner Portal

**Last Updated:** April 1, 2026
**Status:** Production Ready
**Maintainer:** DevOps Team

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Deployment Methods](#deployment-methods)
3. [Cloudflare Pages Setup](#cloudflare-pages-setup)
4. [Wrangler CLI Deployment](#wrangler-cli-deployment)
5. [GitHub Integration](#github-integration)
6. [Environment Configuration](#environment-configuration)
7. [Post-Deployment Checks](#post-deployment-checks)
8. [Troubleshooting](#troubleshooting)
9. [Rollback Procedures](#rollback-procedures)

---

## Quick Start

**Fastest way to deploy (recommended for production):**

```bash
# Clone the repository
git clone https://github.com/[your-org]/my-automation-partner-portal.git
cd my-automation-partner-portal/websites/01-portal

# Deploy to Cloudflare Pages (automatic via GitHub)
# OR use Wrangler CLI:
npm install -g wrangler
wrangler pages deploy --project-name=my-automation-partner
```

---

## Deployment Methods

### Method 1: GitHub + Cloudflare Pages (RECOMMENDED)
- ✅ **Easiest setup**
- ✅ **Automatic deployments on git push**
- ✅ **No manual CLI needed**
- ✅ **Built-in preview deployments**

### Method 2: Wrangler CLI
- ✅ **Direct control**
- ✅ **Works offline**
- ✅ **Great for testing**
- ✅ **Can deploy from any branch**

### Method 3: Direct Upload
- ✅ **No git required**
- ✅ **Quick one-off deployments**
- ⚠️ **No version control**
- ⚠️ **Not recommended for production**

---

## Cloudflare Pages Setup

### Prerequisites
- Cloudflare account with Pages enabled
- Domain: `myautomationpartner.com`
- GitHub repository with code pushed

### Step 1: Create a Cloudflare Pages Project

```bash
# Option A: Via Cloudflare Dashboard
1. Log in to dashboard.cloudflare.com
2. Go to Workers & Pages → Pages
3. Click "Create application" → "Connect to Git"
4. Select your repository
5. Authorize Cloudflare to access GitHub
```

### Step 2: Configure Build Settings

**In the Cloudflare Dashboard:**

| Setting | Value |
|---------|-------|
| **Framework preset** | None (static site) |
| **Build command** | (leave empty) |
| **Build output directory** | / (root) |
| **Root directory** | / (root) |
| **Environment variables** | See section below |

### Step 3: Domain Configuration

1. Go to **Custom domains** in your Pages project
2. Add custom domain: `myautomationpartner.com`
3. Cloudflare will add DNS records automatically
4. Add alternate domain: `www.myautomationpartner.com` (if desired)

### Step 4: Enable Branch Deployments

1. Go to **Deployments** settings
2. Enable **Preview deployments** for all PRs
3. Set **Production branch** to `main`

---

## Wrangler CLI Deployment

### Installation

```bash
# Install Wrangler globally
npm install -g wrangler

# Or install locally in project
npm install --save-dev wrangler

# Verify installation
wrangler --version
```

### Authentication

```bash
# Log in to your Cloudflare account
wrangler login

# This opens a browser to authorize Cloudflare API access
# You'll need to generate an API token or use OAuth
```

### Deploy Command

```bash
# Deploy the entire project (production)
wrangler pages deploy

# Deploy with specific project name
wrangler pages deploy --project-name=my-automation-partner

# Deploy to staging environment
wrangler pages deploy --env=staging

# Deploy specific directory
wrangler pages deploy ./dist --project-name=my-automation-partner
```

### Configuration File (wrangler.jsonc)

The project includes `wrangler.jsonc` with:
- ✅ Project name: `my-automation-partner-portal`
- ✅ Assets directory: `./assets`
- ✅ Compatibility date: `2026-04-01`
- ✅ Environment configurations for production & staging
- ✅ Analytics Engine binding (optional)

**No additional configuration needed** — just run the deploy command.

---

## GitHub Integration

### Automatic Deployments

Once Cloudflare Pages is connected to your GitHub repository:

1. **Every push to `main` branch** → Production deployment
2. **Every pull request** → Preview deployment (optional)
3. **Each commit** → Generates unique preview URL

### GitHub Actions (Optional)

For advanced CI/CD, add a `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: my-automation-partner-portal
          directory: ./websites/01-portal
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### Required GitHub Secrets

Add these to your GitHub repository settings (**Settings → Secrets and variables → Actions**):

| Secret | Value |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | Generate from Cloudflare dashboard |
| `CLOUDFLARE_ACCOUNT_ID` | Found in Cloudflare dashboard |

---

## Environment Configuration

### Production Environment

```jsonc
{
  "env": {
    "production": {
      "routes": [
        {
          "pattern": "myautomationpartner.com",
          "zone_name": "myautomationpartner.com"
        }
      ],
      "vars": {
        "ENVIRONMENT": "production"
      }
    }
  }
}
```

### Staging Environment

```jsonc
{
  "env": {
    "staging": {
      "routes": [
        {
          "pattern": "staging.myautomationpartner.com",
          "zone_name": "myautomationpartner.com"
        }
      ],
      "vars": {
        "ENVIRONMENT": "staging"
      }
    }
  }
}
```

### Environment Variables

**Non-sensitive environment variables** can be added to `wrangler.jsonc`:

```jsonc
{
  "vars": {
    "ENVIRONMENT": "production",
    "API_BASE_URL": "https://api.example.com",
    "ANALYTICS_ID": "your-analytics-id"
  }
}
```

**Sensitive secrets** (API keys, passwords) should **NEVER** be in code. Instead:

1. Add to Cloudflare dashboard under **Settings → Environment variables**
2. Or use GitHub Secrets for CI/CD pipelines
3. Reference as `${{ secrets.SECRET_NAME }}` in workflows

---

## Post-Deployment Checks

### Immediate Checks (5 minutes)

- [ ] Visit `https://myautomationpartner.com` in browser
- [ ] Verify all pages load without errors
- [ ] Check console for JavaScript errors (F12 → Console)
- [ ] Verify logo displays correctly
- [ ] Test responsive design (mobile view)

### Functional Checks (15 minutes)

- [ ] Hero section loads with animations
- [ ] All navigation links work
- [ ] Pricing section displays correctly
- [ ] Forms are interactive
- [ ] Images load from assets folder
- [ ] Hover effects on buttons/cards work
- [ ] Footer links are clickable

### Performance Checks

```bash
# Check Core Web Vitals
# Option 1: Google PageSpeed Insights
https://pagespeed.web.dev/?url=https://myautomationpartner.com

# Option 2: Check Cloudflare Analytics
# Dashboard → Analytics → Web Analytics

# Option 3: Check deployment logs
wrangler pages deployments list --project-name=my-automation-partner
```

### Security Checks

- [ ] HTTPS is enabled (check URL bar)
- [ ] No console warnings about mixed content
- [ ] Form submission to correct email (check browser dev tools)
- [ ] No hardcoded secrets in HTML/CSS (grep search)

---

## Troubleshooting

### Issue: 404 Errors on Deep Links

**Problem:** Navigating to `/pricing` shows 404

**Solution:** Cloudflare Pages automatically routes all requests to `index.html` for single-page applications. This site is static HTML, so add a `_routes.json` file:

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/assets/*"]
}
```

### Issue: Assets Not Loading

**Problem:** Logo or other images show broken image icon

**Symptoms:**
- Logo appears as broken image
- 404 errors in console for `/assets/*`

**Solution:**

```bash
# 1. Verify assets folder exists
ls -la ./assets/

# 2. Check file permissions
chmod 644 ./assets/*.png ./assets/*.svg

# 3. Update wrangler.jsonc
{
  "assets": {
    "directory": "./assets",
    "binding": "ASSETS"
  }
}

# 4. Redeploy
wrangler pages deploy
```

### Issue: Deployment Hangs or Times Out

**Problem:** `wrangler pages deploy` command doesn't complete

**Solution:**

```bash
# 1. Check network connection
ping cloudflare.com

# 2. Verify Wrangler is authenticated
wrangler whoami

# 3. Check API token permissions
# (Must have Pages:Edit scope)

# 4. Try with verbose logging
wrangler pages deploy --debug

# 5. Try manual upload via Cloudflare dashboard
# (Settings → Deployments → Upload files)
```

### Issue: Wrong Environment Deployed

**Problem:** Staging changes deployed to production

**Solution:**

```bash
# 1. Verify which branch was deployed
wrangler pages deployments list --project-name=my-automation-partner

# 2. Check current branch
git branch

# 3. Always deploy from main/production branch
git checkout main
git pull origin main
wrangler pages deploy

# 4. Or specify branch in Cloudflare dashboard
# (Settings → Branch deployments → Production branch)
```

---

## Rollback Procedures

### Rollback via GitHub

```bash
# 1. Identify the good commit
git log --oneline

# 2. Revert to previous version
git revert <commit-hash>  # Creates new commit (recommended)
# OR
git reset --hard <commit-hash>  # Dangerous - rewrites history

# 3. Push to trigger redeploy
git push origin main
```

### Rollback via Cloudflare Dashboard

1. Go to **Deployments** in your Pages project
2. Find the previous working deployment
3. Click **Rollback** button
4. Confirm the rollback

### Rollback via Wrangler

```bash
# View deployment history
wrangler pages deployments list --project-name=my-automation-partner

# Redeploy a specific commit
git checkout <commit-hash>
wrangler pages deploy
```

### Rollback with Downtime (Emergency Only)

```bash
# 1. Remove current deployment
wrangler pages delete deployment <deployment-id>

# 2. Deploy from backup/archived version
# (Restore from git history)

# 3. Verify restoration before re-enabling DNS
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All code committed to git
- [ ] No hardcoded secrets in code
- [ ] All tests passing (if applicable)
- [ ] No console errors in development
- [ ] All links verified and working
- [ ] Images and assets present
- [ ] Meta tags and SEO correct
- [ ] Mobile responsive design verified
- [ ] Git commit message is descriptive
- [ ] .gitignore configured (no node_modules, .env)

---

## Support & Monitoring

### Monitoring Links

| Service | URL |
|---------|-----|
| **Cloudflare Dashboard** | https://dash.cloudflare.com |
| **Pages Analytics** | Dashboard → Analytics → Web Analytics |
| **Deployment Status** | Dashboard → Pages → Deployments |
| **Error Monitoring** | Console logs in browser (F12) |

### Getting Help

**Cloudflare Documentation:**
- Pages: https://developers.cloudflare.com/pages/
- Wrangler: https://developers.cloudflare.com/workers/wrangler/
- API Reference: https://developers.cloudflare.com/api/

**Team Contact:**
- DevOps Team: devops@myautomationpartner.com
- GitHub Issues: Report bugs in repository

---

## Version History

| Date | Change | Author |
|------|--------|--------|
| Apr 1, 2026 | Initial deployment setup | DevOps |
| Apr 1, 2026 | Added wrangler.jsonc | DevOps |
| Apr 1, 2026 | Removed CTA Band section | Claude |

---

**Last Reviewed:** April 1, 2026
**Next Review:** May 1, 2026
**Status:** ✅ ACTIVE
