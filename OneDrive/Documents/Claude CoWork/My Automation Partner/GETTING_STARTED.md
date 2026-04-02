# Getting Started with My Automation Partner

**Welcome!** This guide will help you navigate the project structure and find what you need.

---

## 🎯 I'm Looking For...

### Infrastructure & Technical Details
→ **`MAP_MASTER.md`**
- Tech stack overview
- Database schema
- Current n8n workflows
- Service credentials reference
- API details
- What's been accomplished
- What still needs to be done

### Project Organization & Folder Guide
→ **`PROJECT_STRUCTURE.md`**
- Why each folder exists
- What goes in each folder
- File maintenance schedule
- Quick links to services

### What Just Got Fixed?
→ **`CLEANUP_SUMMARY.md`**
- 3 workflow bugs fixed
- 26 files cleaned up
- New folder structure created
- Next action items

---

## 📁 Where to Go Based on Your Role

### 👨‍💼 **Operations / Business Manager**
**Start here:** `/operations/README.md`

Then look for:
- `CLIENTS.md` — List of active clients
- `ONBOARDING_CHECKLIST.md` — How to onboard new clients
- `PRICING.md` — Subscription plans and pricing
- `INCIDENT_LOG.md` — Issue tracking and resolution

**Common Tasks:**
- Adding a new client: Follow `ONBOARDING_CHECKLIST.md`
- Looking up client info: Check `CLIENTS.md`
- Reporting an issue: Add to `INCIDENT_LOG.md`

---

### 💻 **Developer / Engineer**
**Start here:** `/development/README.md`

Then look for:
- `n8n_workflow_tool.js` — Pinia injection script (edit workflows)
- `test_payloads/` — Sample data for testing
- `query_templates/` — Common n8n expressions
- `debug_scripts/` — Troubleshooting tools

**Common Tasks:**
- Creating new workflow: Use `n8n_workflow_tool.js` + `test_payloads/`
- Debugging an issue: Check `debug_scripts/` and `../MAP_MASTER.md`
- Testing API: Use curl commands from `/development/`

---

### 📚 **Technical Lead / Architect**
**Start here:** `/docs/README.md`

Then look for:
- `API_REFERENCE.md` — All external APIs
- `ARCHITECTURE.md` — System design
- `DATABASE_SCHEMA.md` — Data structure
- `../MAP_MASTER.md` — Single source of truth

**Common Tasks:**
- Understanding system: Read `/docs/ARCHITECTURE.md`
- API integration: Check `/docs/API_REFERENCE.md`
- Database queries: See `/docs/DATABASE_SCHEMA.md`

---

### 🎨 **Designer / Branding**
**Start here:** `/assets/README.md`

Then look for:
- `/assets/branding/brand-guidelines.md` — Brand standards
- `/assets/email-templates/` — Email designs
- `/assets/branding/logos/` — Logo files
- Cloudflare R2 backup locations

**Common Tasks:**
- Finding brand colors: See `brand-guidelines.md`
- Using email template: See `email-templates/`
- Uploading client logo: Follow instructions in `README.md`

---

### 🔧 **DevOps / Infrastructure**
**Start here:** `/workflows/README.md`

Then look for:
- `LIVE_WORKFLOWS.md` — All production workflows
- `workflow-backups/` — JSON exports for disaster recovery
- `WORKFLOW_TESTING.md` — Testing procedures
- `/development/debug_scripts/` — Troubleshooting tools

**Common Tasks:**
- Checking workflow status: See `LIVE_WORKFLOWS.md`
- Backing up workflow: Export to `workflow-backups/`
- Testing workflow: Use `WORKFLOW_TESTING.md` + `test_payloads/`

---

## 🚀 Quick Start Tasks

### First Time Setup
1. Read `MAP_MASTER.md` — Understand the infrastructure (5 min)
2. Check `/operations/CLIENTS.md` — See current clients (2 min)
3. Review `/workflows/LIVE_WORKFLOWS.md` — Know what's automated (3 min)
4. Bookmark quick links in `PROJECT_STRUCTURE.md` (1 min)

### Adding Your First Client
1. Get their Metricool User ID and Blog ID
2. Follow `/operations/ONBOARDING_CHECKLIST.md`
3. Trigger webhook: `POST /webhook/client-onboarding`
4. Verify in Zite database
5. Document in `/operations/CLIENTS.md`

### Deploying a New Workflow
1. Build in n8n UI or use `/development/n8n_workflow_tool.js`
2. Test with `/development/test_payloads/`
3. Export JSON to `/workflows/workflow-backups/`
4. Document in `/workflows/LIVE_WORKFLOWS.md`
5. Update `MAP_MASTER.md` with changes

---

## 🔐 Important Files (DO NOT LOSE)

| File | Purpose | Location | Backup? |
|------|---------|----------|---------|
| `credential.txt` | Service credentials (protected) | Root | ✅ Secure vault |
| `MAP_MASTER.md` | Single source of truth | Root | ✅ Weekly |
| `/workflows/workflow-backups/` | Workflow JSON exports | workflows/ | ✅ Drive |
| n8n database | All workflow definitions | n8n instance | ✅ n8n backups |
| Zite database | All client data | Fillout servers | ✅ Fillout backups |

---

## 📞 Quick Links to Services

### Development/Testing
- **n8n Workflows:** https://n8n.myautomationpartner.com/signin
- **Zite Database:** https://build.fillout.com
- **Metricool API:** https://app.metricool.com

### Infrastructure
- **Coolify (Deployment):** http://87.99.128.65:8000/login
- **Cloudflare R2 (Files):** https://dash.cloudflare.com
- **Airtable (Backup):** https://airtable.com

### Credentials
- See `credential.txt` for all usernames/passwords
- **WARNING:** Keep `credential.txt` secure, never commit to git

---

## 🎓 Learning Path

### If You're New to the Project:
1. **Week 1:** Read `MAP_MASTER.md`, explore folder structure
2. **Week 2:** Read relevant `/docs/` files for your role
3. **Week 3:** Practice with test payloads in `/development/`
4. **Week 4:** Make your first change (small feature or bug fix)

### If You're Managing the Project:
1. **Day 1:** Read `PROJECT_STRUCTURE.md`, `CLEANUP_SUMMARY.md`
2. **Day 2:** Review all `/operations/` documentation
3. **Day 3:** Check `/workflows/LIVE_WORKFLOWS.md`
4. **Day 4:** Plan next quarter's features

### If You're Developing:
1. **Day 1:** Read `/development/README.md`, clone `n8n_workflow_tool.js`
2. **Day 2:** Review `/docs/ARCHITECTURE.md`, `/docs/API_REFERENCE.md`
3. **Day 3:** Explore test payloads, practice with Pinia injection
4. **Day 4:** Make your first workflow change

---

## ❓ FAQ

**Q: Where's the password for [service]?**
A: See `credential.txt` (protected file)

**Q: How do I edit a workflow?**
A: Use `/development/n8n_workflow_tool.js` (Pinia injection method)

**Q: Where's the client database?**
A: Zite at https://build.fillout.com (Clients table: thCZdPGZ4pk)

**Q: How do I add a new client?**
A: Follow `/operations/ONBOARDING_CHECKLIST.md`

**Q: What's the system architecture?**
A: See `/docs/ARCHITECTURE.md` (or `MAP_MASTER.md` for quick overview)

**Q: How do I test a webhook?**
A: Use curl command in `/development/test_payloads/`

**Q: Where are backups stored?**
A: See "Important Files" table above

---

## ✨ Pro Tips

💡 **Keep MAP_MASTER.md updated** — It's your single source of truth
💡 **Use test payloads** — Never test on production data
💡 **Document changes** — Update relevant files after each feature
💡 **Back up workflows** — Export JSON to `/workflows/workflow-backups/`
💡 **Review checklists** — Follow `/operations/` checklists before major changes
💡 **Check the README** — Each folder has a README explaining its purpose

---

## 🎯 Next Steps

1. **Pick your role** from "Where to Go" section above
2. **Read the relevant README** for your folder
3. **Bookmark the quick links** you'll use frequently
4. **Ask questions** if something isn't clear
5. **Start contributing** to the project!

---

**Welcome to My Automation Partner! 🚀**

The project is organized, documented, and ready for collaboration. Use this guide to find what you need, and refer back to it anytime you need direction.

Happy building!
