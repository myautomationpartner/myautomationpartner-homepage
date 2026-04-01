# Documentation Folder — `/docs`

**Purpose:** Comprehensive technical documentation, API references, guides, and architecture documentation.

## 📚 What Goes Here

- API reference documentation (Fillout, Metricool, Resend, Cloudflare)
- System architecture diagrams and explanations
- Database schema documentation
- Detailed workflow documentation
- Setup and configuration guides
- Troubleshooting guides
- Client-facing documentation

## 📄 Key Documents (To Create)

### Core Documentation
- `API_REFERENCE.md` — Complete reference for all external APIs
- `ARCHITECTURE.md` — System design, data flow, integration patterns
- `DATABASE_SCHEMA.md` — Fillout table structures, fields, relationships
- `WORKFLOWS.md` — Detailed documentation of each n8n workflow

### Setup & Deployment
- `SETUP_GUIDE.md` — Initial setup, service configuration, credentials
- `DEPLOYMENT_GUIDE.md` — How to deploy new workflows and features
- `ENVIRONMENT_VARIABLES.md` — All required env vars and their purposes

### Operations & Client Guides
- `CLIENT_GUIDE.md` — How clients use the portal, features, navigation
- `ADMIN_GUIDE.md` — Internal admin dashboard and tools
- `TROUBLESHOOTING.md` — Common issues, errors, solutions

## 🔄 Maintenance

- Review and update monthly
- Add new API docs when integrating new services
- Update architecture diagrams when major changes occur
- Keep setup guides in sync with actual infrastructure

## 💡 Example Structure

```
docs/
├── API_REFERENCE.md
├── ARCHITECTURE.md
├── DATABASE_SCHEMA.md
├── WORKFLOWS.md
├── SETUP_GUIDE.md
├── DEPLOYMENT_GUIDE.md
├── ENVIRONMENT_VARIABLES.md
├── CLIENT_GUIDE.md
├── ADMIN_GUIDE.md
├── TROUBLESHOOTING.md
└── diagrams/
    ├── system-architecture.png
    ├── data-flow.png
    └── workflow-diagram.png
```

---

**Note:** See `../MAP_MASTER.md` for the single source of truth on infrastructure, APIs, and current status.
