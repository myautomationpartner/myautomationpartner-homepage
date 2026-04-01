# My Automation Partner — Client Portal

**Purpose:** Marketing landing page & client portal for My Automation Partner

**Entry Point:** `index.html` (public landing page) | `login.html` (client login)

## Overview

### Public Landing Page (`index.html`)
A fully responsive marketing site showcasing:
- **Hero Section** — Value proposition with CTA and key metrics
- **Integration Showcase** — Scrolling ticker of connected platforms
- **How It Works** — Cards highlighting core features (analytics, calendar, automation, reporting)
- **Five Pillars** — Premium service offerings (Unified Portal, Social Automation, Growth Analytics, Unified Inbox, Smart Calendar)
- **Benefits** — Why clients choose MAP (zero tech skills, expert support, custom workflows) with impact stats
- **Features** — 6 detailed capability cards (all-in-one hub, hourly syncs, secure portals, automated digests, fast onboarding, scalability)
- **Pricing** — 3 transparent plans (Starter $29, Growth $79, Agency $199)
- **CTA & Footer** — Conversion points with company info & links

### Client Login (`login.html`)
Secure login portal for authenticated clients to access:
- Real-time social media metrics
- Content calendar
- Team management
- Performance analytics

## Structure
```
01-portal/
├── index.html              # Main landing page (production)
├── login.html              # Client login page
├── README.md               # This file
├── .gitignore              # Git ignore rules
└── assets/
    ├── MyAutomationPartner-Logo.png  # Main logo (PNG)
    └── logo.svg                       # Vector logo backup
```

## Tech Stack
- **HTML5** — Semantic structure
- **CSS3** — Modern styling with CSS variables, gradients, animations
- **Vanilla JavaScript** — Lightweight, no framework dependencies
- **Responsive Design** — Mobile-first, works on all screen sizes

### Design System
- **Color Scheme:** Dark theme (#0a0a0a background) with gold accents (#FFD700)
- **Typography:** Inter font family with semantic hierarchy
- **Components:** Cards, buttons, badges, stats blocks, grids
- **Animations:** Smooth scrollbar, hover effects, pulse animations

## Connected Systems
- **Zite/Fillout:** Backend database for authenticated client records (login.html)
- **n8n:** Metrics collection & automation workflows
- **Metricool:** Real-time Instagram, TikTok, Facebook metrics API
- **Resend:** Email delivery for client digests

## Deployment
- **Hosting:** Cloudflare Pages
- **Domain:** myautomationpartner.com
- **DNS:** Cloudflare
- **Assets:** Served locally + Cloudflare R2 for additional resources

## Client Access
- Public landing page: No authentication required
- Authenticated portal (login.html): Requires credentials
- Role-based access: Admin/Editor/Viewer roles in Zite
- Data isolation: Each client linked to their Metricool account

## Recent Updates (Apr 1, 2026)
- ✅ Added "Five Pillars of Modern Automation" bento-grid section
- ✅ Added "Automate Your Daily Tasks" benefits section with stat blocks
- ✅ Replaced SVG logos with PNG asset from `/assets/MyAutomationPartner-Logo.png`
- ✅ Enhanced responsive design for mobile/tablet
- ✅ All sections fully styled and animated

## Development Notes
- Pure HTML/CSS — no build step required
- Self-contained — all styles in `<style>` tag
- Accessible — proper semantic HTML and ARIA labels
- Performance optimized — minimal external requests
- SEO friendly — proper meta tags and structured content

---

**Last Updated:** April 1, 2026
**Status:** Production Ready
**Maintained By:** My Automation Partner Team
