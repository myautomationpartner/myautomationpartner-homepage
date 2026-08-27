# Assets Folder — `/assets`

**Purpose:** Logos, media files, branding assets, and email templates for the platform and clients.

## 🎨 What Goes Here

- My Automation Partner branding (logos, colors, fonts)
- Client logos (local backup, originals in Cloudflare R2)
- Email templates (HTML)
- Brand guidelines and design standards
- UI component assets

## 📂 Folder Structure

```
assets/
├── README.md (this file)
├── branding/
│   ├── logos/
│   │   ├── my-automation-partner-logo.svg
│   │   ├── my-automation-partner-logo.png
│   │   └── my-automation-partner-favicon.ico
│   └── brand-guidelines.md
├── email-templates/
│   ├── welcome-email.html
│   ├── weekly-digest.html
│   ├── status-update.html
│   └── feedback-survey.html
├── client-logos/
│   ├── dancescapes-logo.png (backup from R2)
│   └── README.md (list of client logos)
└── ui-components/
    ├── dashboard-icon-set.svg
    ├── charts-templates.html
    └── README.md
```

## 📋 Key Documents (To Create)

### Branding & Design
- `branding/brand-guidelines.md` — Colors, typography, logo usage, spacing
- `branding/color-palette.md` — Hex codes for brand colors
- `ASSET_INVENTORY.md` — List of all assets, locations, file formats

### Email Templates
- `email-templates/TEMPLATE_GUIDE.md` — How to use and customize email templates
- `email-templates/` — All HTML email templates for automated sends

### Client Logos
- `client-logos/README.md` — Index of client logos, Cloudflare R2 URLs

## 📧 Email Template Usage

All email templates use dynamic fields that are populated by n8n:

```html
<!-- Example: Welcome Email -->
<p>Welcome {{ clientName }}!</p>
<p>Your account for {{ businessName }} is now active.</p>
<a href="{{ portalUrl }}">Access Your Portal →</a>
```

### Available Dynamic Fields:
- `{{ clientName }}` — Client contact person name
- `{{ businessName }}` — Client business name
- `{{ email }}` — Client email address
- `{{ portalUrl }}` — Link to client portal
- `{{ supportEmail }}` — Support email address
- `{{ currentDate }}` — Today's date

## 🖼️ Brand Guidelines

### Color Palette
```
Primary: #667eea (Indigo)
Secondary: #764ba2 (Purple)
Accent: #FF9800 (Orange)
Success: #4CAF50 (Green)
Error: #F44336 (Red)
Neutral: #9e9e9e (Gray)
Background: #f5f5f5 (Light Gray)
```

### Typography
```
Headings: Poppins (Google Fonts)
Body: Inter (Google Fonts)
Monospace: JetBrains Mono (Code/technical)
```

## ☁️ Cloudflare R2 Integration

### Uploading to Cloudflare R2:
```bash
# Endpoint: https://c181883cf900033f21cb85678b18caf3.r2.cloudflarestorage.com
# Public URL: https://pub-ba8be99ab92a493c8f41012c737905d5.r2.dev

# File structure in R2:
/logos/{client-name}/logo.png
/email-assets/header-image.png
/client-portal/{client-id}/branding.json
```

### Adding a New Asset to R2:
1. Save asset to `/assets` folder locally
2. Upload to Cloudflare R2 via dashboard or API
3. Copy public URL from R2
4. Update in Zite client record (Logo URL field)
5. Backup link in `client-logos/README.md`

## 📋 Asset Inventory Template

```markdown
# Asset Inventory

| Asset | Type | Location (Local) | Location (R2) | Purpose | Backup? |
|---|---|---|---|---|---|
| my-automation-partner-logo.svg | Logo | assets/branding/logos/ | /logos/ | Platform branding | ✅ |
| welcome-email.html | Template | assets/email-templates/ | N/A | Onboarding email | ✅ |
| dancescapes-logo.png | Client Logo | assets/client-logos/ | /logos/dancescapes/ | Client portal | ✅ |
```

## 🔄 Maintenance

- Keep local copies of client logos for backup
- Review brand guidelines annually or when rebranding
- Update email templates when changing platform branding
- Monitor R2 storage usage (target: < 500MB)
- Archive old assets after 12 months of disuse

## 💡 Best Practices

- **Logo Files:** Keep SVG for scalability, PNG for web fallback
- **Email Templates:** Test in multiple email clients before deploying
- **File Names:** Use descriptive, lowercase names with dashes (e.g., `welcome-email.html`)
- **Backups:** Always keep local copy of client logos
- **Optimization:** Compress images for web; aim for < 100KB per asset

---

**Note:** Original client logos are stored in Cloudflare R2 at `pub-ba8be99ab92a493c8f41012c737905d5.r2.dev`. This folder maintains backups and local copies for reference.
