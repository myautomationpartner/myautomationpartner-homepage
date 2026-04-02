# GitHub + Cloudflare Pages Setup Guide

Complete step-by-step guide for deploying My Automation Partner sites to Cloudflare Pages.

---

## PART 1: Create GitHub Repositories

### Option A: Via Web (Easiest)

1. Go to **https://github.com/new** (should be signed in as `myautomationpartner`)

2. **First Repository - Homepage**
   - Repository name: `myautomationpartner-homepage`
   - Visibility: **Public**
   - ✅ Skip README, .gitignore, license
   - Click **Create repository**

3. **Second Repository - Dancescapes**
   - Go to **https://github.com/new** again
   - Repository name: `dancescapes-portal`
   - Visibility: **Public**
   - ✅ Skip README, .gitignore, license
   - Click **Create repository**

---

## PART 2: Push Files to GitHub

Open **PowerShell** or **Command Prompt** and run these commands in order:

### Homepage Repository

```powershell
# Create temp folder for homepage
mkdir "$env:TEMP\myautomationpartner-homepage"
cd "$env:TEMP\myautomationpartner-homepage"

# Copy the HTML file and rename to index.html
copy "C:\Users\kenny\OneDrive\Documents\Claude CoWork\My Automation Partner\homepage.html" "index.html"

# Initialize and commit
git init
git config user.email "billing@myautomationpartner.com"
git config user.name "My Automation Partner"
git add index.html
git commit -m "Initial homepage deployment"
git remote add origin https://github.com/myautomationpartner/myautomationpartner-homepage.git
git branch -M main

# Push to GitHub
git push -u origin main
```

### Dancescapes Repository

```powershell
# Create temp folder for dancescapes
mkdir "$env:TEMP\dancescapes-portal"
cd "$env:TEMP\dancescapes-portal"

# Copy the HTML file and rename to index.html
copy "C:\Users\kenny\OneDrive\Documents\Claude CoWork\My Automation Partner\dancescapes-portal.html" "index.html"

# Initialize and commit
git init
git config user.email "billing@myautomationpartner.com"
git config user.name "My Automation Partner"
git add index.html
git commit -m "Initial dancescapes portal deployment"
git remote add origin https://github.com/myautomationpartner/dancescapes-portal.git
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## PART 3: Connect to Cloudflare Pages

1. Go to **https://dash.cloudflare.com**
   - Sign in with your Cloudflare account

2. In the left sidebar, click **Workers & Pages**

3. Click **Create** → **Pages** → **Connect to Git**

4. Authorize GitHub and select the organization: **myautomationpartner**

5. **Deploy Homepage**
   - Select repository: `myautomationpartner-homepage`
   - Branch: `main`
   - Project name: `myautomationpartner-homepage`
   - Framework preset: **None**
   - Build output directory: *(leave blank)*
   - Root directory: `/`
   - Click **Save and Deploy**
   - Wait for deployment (1-2 minutes)
   - You'll get a URL like: `https://myautomationpartner-homepage.pages.dev`

6. **Deploy Dancescapes**
   - Go back to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
   - Select repository: `dancescapes-portal`
   - Branch: `main`
   - Project name: `dancescapes-portal`
   - Framework preset: **None**
   - Build output directory: *(leave blank)*
   - Root directory: `/`
   - Click **Save and Deploy**
   - Wait for deployment
   - You'll get a URL like: `https://dancescapes-portal.pages.dev`

---

## PART 4: Custom Domains (Optional but Recommended)

If you own custom domains (e.g., `myautomationpartner.com`, `dancescapesperformingarts.com`):

### For Homepage
1. In Cloudflare Pages, go to `myautomationpartner-homepage`
2. Click **Settings** → **Domains**
3. Click **Add custom domain**
4. Enter: `myautomationpartner.com` (or your domain)
5. Cloudflare will auto-configure DNS since your domain is already on Cloudflare

### For Dancescapes
1. In Cloudflare Pages, go to `dancescapes-portal`
2. Click **Settings** → **Domains**
3. Click **Add custom domain**
4. Enter your domain (e.g., `dancescapesperformingarts.com`)
5. Cloudflare auto-configures the DNS

---

## PART 5: Verify Deployment

✅ Test the sites:
- Homepage: Visit `https://myautomationpartner-homepage.pages.dev` (or your custom domain)
- Dancescapes: Visit `https://dancescapes-portal.pages.dev` (or your custom domain)

✅ Both sites should load immediately without errors.

---

## Future Updates

When you update the HTML files:

1. Edit `homepage.html` or `dancescapes-portal.html` in your workspace
2. Commit and push to GitHub:
   ```powershell
   cd "$env:TEMP\myautomationpartner-homepage"
   git pull
   copy "C:\Users\kenny\OneDrive\Documents\Claude CoWork\My Automation Partner\homepage.html" "index.html"
   git add index.html
   git commit -m "Update homepage"
   git push
   ```
3. Cloudflare automatically detects the push and redeploys within seconds.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Git authentication failed | Run `gh auth login` to re-authenticate GitHub CLI |
| Deployment fails | Check Cloudflare Pages build logs: go to the project → **Deployments** tab |
| Custom domain not working | Wait 5 minutes for DNS propagation, then hard-refresh (Ctrl+Shift+R) |
| Changes not appearing | Clear browser cache or open in incognito window |

---

**Created:** March 30, 2026
**Project:** My Automation Partner - Static Site Deployment
