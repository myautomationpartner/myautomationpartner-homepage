# Main Client Portal

**Purpose:** Branded portal for all My Automation Partner clients

**Entry Point:** `index.html`

## Overview
This is the main portal that clients log into to view:
- Real-time social media metrics
- Content calendar
- Team management
- Performance analytics

## Structure
```
01-portal/
├── index.html (homepage)
├── login.html (login page)
└── assets/
    ├── logo.svg (main logo)
    └── map-logo.png (alternative logo)
```

## Connected Systems
- **Zite/Fillout:** Database backend for client records
- **n8n:** Metrics collection & automation workflows
- **Metricool:** Real-time Instagram, TikTok, Facebook metrics

## Deployment
- Hosted on: Cloudflare Pages or similar
- DNS: myautomationpartner.com
- Assets: Cloudflare R2

## Client Access
- All active clients get login credentials
- Role-based access: Admin/Editor/Viewer
- Linked to their specific Metricool accounts

---

**Last Updated:** March 31, 2026
