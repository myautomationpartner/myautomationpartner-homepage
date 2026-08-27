# Operations Folder — `/operations`

**Purpose:** Business operations, client management, team documentation, and daily procedures.

## 📊 What Goes Here

- Client records and contact information
- Onboarding checklists and procedures
- Team roles and responsibilities
- Service Level Agreements (SLAs)
- Pricing and subscription information
- Incident logs and uptime tracking
- Client communication templates

## 📋 Key Documents (To Create)

### Client Management
- `CLIENTS.md` — Active clients list with contact info, plan, Metricool IDs
- `CLIENT_INTAKE_FORM.md` — Information collected during onboarding
- `CLIENT_MIGRATION_LOG.md` — History of client migrations, API changes

### Onboarding & Operations
- `ONBOARDING_CHECKLIST.md` — Step-by-step new client setup process
- `OFFBOARDING_CHECKLIST.md` — Steps to safely remove a client
- `TEAM_ROLES.md` — Roles (Admin, Editor, Viewer), responsibilities, access

### Service & Support
- `SLA.md` — Uptime targets, support hours, response times
- `PRICING.md` — Subscription tiers (Starter/Growth/Agency), features, pricing
- `SUPPORT_PROCEDURES.md` — How to handle support tickets and escalations

### Operations & Monitoring
- `INCIDENT_LOG.md` — Outages, errors, resolution notes, timeline
- `MAINTENANCE_SCHEDULE.md` — Planned maintenance windows, updates
- `MONITORING_DASHBOARD.md` — Key metrics to track, alert thresholds

## 📝 Example CLIENTS.md

```markdown
# Active Clients

| Business Name | Contact Email | Plan | Metricool User ID | Metricool Blog ID | Status | Start Date |
|---|---|---|---|---|---|---|
| Dancescapes Performing Arts | info@dancescapes.com | Growth | 4660143 | 6035446 | Active | 2026-03-15 |
| My Automation Partner | billing@myautomationpartner.com | Agency | 4660143 | 6035338 | Internal Test | 2026-02-01 |
```

## ✅ Example ONBOARDING_CHECKLIST.md

```markdown
# Client Onboarding Checklist

## Pre-Onboarding (by sales team)
- [ ] Contract signed and received
- [ ] Initial intake call completed
- [ ] Client Metricool account created
- [ ] Metricool User ID and Blog ID documented

## Automated Onboarding
- [ ] Trigger n8n webhook: `/webhook/client-onboarding`
- [ ] Verify client record created in Zite
- [ ] Verify admin user created and welcome email sent
- [ ] Confirm client can log in to portal

## Post-Onboarding (by success team)
- [ ] Welcome call with client
- [ ] Portal walkthrough (dashboard, calendar, analytics)
- [ ] Social media account connections verified
- [ ] First metrics data appearing in dashboard
- [ ] Mark client as "Active" in operations/CLIENTS.md

## Success Criteria
- ✅ Client can log in
- ✅ Social media data syncing (within 24 hours)
- ✅ Client team members invited (if applicable)
- ✅ First week metrics visible
```

## 🔄 Maintenance

- Update CLIENTS.md when new clients onboard or change plans
- Review SLA compliance monthly
- Log all incidents in INCIDENT_LOG.md immediately
- Schedule maintenance windows in MAINTENANCE_SCHEDULE.md

## 💡 File Structure

```
operations/
├── README.md (this file)
├── CLIENTS.md
├── ONBOARDING_CHECKLIST.md
├── OFFBOARDING_CHECKLIST.md
├── TEAM_ROLES.md
├── SLA.md
├── PRICING.md
├── SUPPORT_PROCEDURES.md
├── INCIDENT_LOG.md
├── MAINTENANCE_SCHEDULE.md
└── templates/
    ├── welcome-email.html
    ├── status-update-email.html
    └── onboarding-call-agenda.md
```

---

**Note:** This folder is for business operations. Technical documentation lives in `/docs`, workflow definitions in `/workflows`.
