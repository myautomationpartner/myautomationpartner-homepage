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
- **Structured Signup CTA** — homepage CTAs now route to `/signup/` instead of `mailto:` conversion
- **CTA & Footer** — Conversion points with company info, signup flow, and portal links

### Public Signup (`/signup/`)
A dedicated onboarding signup route for new MAP customers:
- Structured intake form aligned to the live onboarding DB contract
- Required fields: business name, contact name, email, website URL, selected plan, consent
- Optional fields: phone, primary goal, preferred contact method, requested social platforms, notes
- Client-side validation plus loading, success, and error states
- Submits to a same-origin MAP endpoint at `/api/onboarding/signup`
- Automatically falls back to the live Supabase Edge intake endpoint if the Pages backend route is unavailable in production

### Product Demo (`/demo.html`)
A public product walkthrough using current live-portal screenshot assets:
- Screenshot-led hero showing the refreshed Inbox and mobile Publisher surfaces
- Four-step workflow: capture a request, create a post, plan a campaign, and keep files close
- Tabbed screenshot showcase for Inbox, Create Post, Campaign Partner, and Files
- Mobile proof section for Publisher, Inbox, and Settings

### Client Login (`login.html`)
Secure login portal for authenticated clients to access:
- Real-time social media metrics
- Content calendar
- Owner-focused customer and content workflows
- Performance analytics

## Structure
```
01-portal/
├── index.html              # Main landing page (production)
├── signup/
│   └── index.html          # Structured MAP signup experience
├── functions/
│   └── api/onboarding/
│       └── signup.js       # Same-origin intake handler
├── login.html              # Client login page
├── SIGNUP_INTAKE.md        # Canonical homepage payload + backend contract
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
- **Color Scheme:** Dark portal-inspired theme with cyan, lime, and blue accents
- **Typography:** Inter font family with semantic hierarchy
- **Components:** Cards, buttons, badges, rotating portal previews, stats blocks, grids
- **Animations:** Smooth scrollbar, hover effects, portal reel fades, subtle motion effects

## Connected Systems
- **Supabase:** Canonical onboarding intake contract and authenticated portal data
- **Cloudflare Pages Functions:** Intended same-origin homepage intake endpoint (`/api/onboarding/signup`)
- **Supabase Edge Function:** Current live signup fallback endpoint (`/functions/v1/homepage-signup-intake`)
- **n8n:** Metrics collection & automation workflows
- **Metricool:** Real-time Instagram, TikTok, Facebook metrics API
- **Resend:** Email delivery for client digests

## Deployment
- **Hosting:** Cloudflare Pages
- **Domain:** myautomationpartner.com
- **DNS:** Cloudflare
- **Assets:** Served locally + Cloudflare R2 for additional resources
- **Runtime config:** Cloudflare Pages environment variables for the signup intake route

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

## Recent Updates (Apr 23, 2026)
- ✅ Replaced homepage `mailto:` pricing conversions with `/signup/`
- ✅ Added dedicated `/signup/` onboarding flow aligned to `db-agent/ONBOARDING_CONTRACT.md`
- ✅ Added same-origin intake handler at `/api/onboarding/signup`
- ✅ Documented payload, env vars, and downstream webhook assumptions in `SIGNUP_INTAKE.md`
- ✅ Restored live production signup through Supabase Edge fallback while the broken Pages backend route is tracked as future cleanup
- ✅ Added origin/referrer allowlisting on the public intake endpoints

## Recent Updates (Apr 30, 2026)
- ✅ Refreshed the homepage hero with the new portal preview reel
- ✅ Added Chatwoot-style phone and post-request phone visuals for owner-first workflows
- ✅ Shifted homepage language toward solo owner and lean operation use cases
- ✅ Tuned hero spacing and reel timing for a faster two-second fade cycle

## Recent Updates (May 28, 2026)
- ✅ Rebuilt `/demo.html` around current May 27-28 portal screenshots from the launch asset set
- ✅ Added a screenshot-led demo flow for Inbox, Create Post, Campaign Partner, Files, and mobile portal usage
- ✅ Kept the demo static and separate from logged-in portal runtime code

## Development Notes
- Pure HTML/CSS — no build step required
- Self-contained — all styles in `<style>` tag
- Accessible — proper semantic HTML and ARIA labels
- Performance optimized — minimal external requests
- SEO friendly — proper meta tags and structured content

---

**Last Updated:** April 30, 2026
**Status:** Production-ready marketing site with structured signup intake path and refreshed portal hero
**Maintained By:** My Automation Partner
