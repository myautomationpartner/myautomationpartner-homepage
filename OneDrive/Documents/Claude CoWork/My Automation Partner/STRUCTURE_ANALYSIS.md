# File Structure Analysis & Recommendations

**Comparing Current Structure vs. Professional Template**

---

## 📊 Current Structure Assessment

### ✅ What's Working Well
1. **Clear Folder Organization** — Separates concerns (docs, operations, workflows, etc.)
2. **Comprehensive README Files** — Each folder explains its purpose
3. **Single Source of Truth** — MAP_MASTER.md centralizes key info
4. **Team-Friendly** — GETTING_STARTED.md and role-based guides
5. **Clean Root Level** — Only 5 essential files

### ⚠️ What's Missing or Could Improve
1. **No Router Pattern** — CLAUDE.md would prevent context overload and clearly route to relevant docs
2. **No Scratchpad** — PLAN.md would give Claude a place to write step-by-step execution plans
3. **No Hidden Rules Folder** — Rules are scattered; no centralized constraint system
4. **No Skill/Knowledge Modules** — Claude loads same docs every time instead of on-demand
5. **Workflow Organization** — Not separated by "blast radius" (impact level)
6. **No Infrastructure as Code** — Deployment logic not clearly captured
7. **No Integration Templates** — API schemas not standardized

---

## 🎯 Template Structure Analysis

### ✅ Strengths of Professional Template
1. **Router Pattern (CLAUDE.md)** — Single entry point, prevents context bloat
2. **Scratchpad (PLAN.md)** — Claude's workspace for step-by-step planning
3. **Hidden .claude/ Folder** — Rules and skills organized for on-demand loading
4. **Hard Constraints** — Naming conventions, security rules in one place
5. **Blast Radius Thinking** — Workflows organized by impact/scope
6. **Infrastructure as Code** — Docker, setup scripts, DNS exported
7. **Integration Schemas** — Standardized templates for each external tool
8. **Knowledge Modules** — Skills loaded only when relevant (saves context)

### ⚠️ Potential Issues for Your Project
1. Assumes Docker deployment (you use Hetzner VPS + Coolify)
2. Less business-focused (no operations folder)
3. Assumes AI-first workflow design
4. May be over-engineered for a solo/small team

---

## 🔄 Recommended Hybrid Structure

**Best of both: Professional rigor + Business clarity**

```
My Automation Partner/
│
├── 📋 ROUTING & PLANNING (Entry Points)
│   ├── CLAUDE.md              # ← THE ROUTER (Claude starts here)
│   ├── PLAN.md                # ← THE SCRATCHPAD (Execution checklist)
│   └── MAP_MASTER.md          # ← Single source of truth
│
├── 🔐 .claude/ (Hidden rules & skills)
│   ├── rules/
│   │   ├── naming-conventions.md
│   │   ├── security-rules.md
│   │   ├── coding-standards.md
│   │   └── deployment-rules.md
│   └── skills/
│       ├── n8n-admin/SKILL.md
│       ├── cloudflare-admin/SKILL.md
│       ├── database-admin/SKILL.md
│       ├── api-integration/SKILL.md
│       └── zite-admin/SKILL.md
│
├── 📚 docs/ (Documentation)
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   ├── DATA_FLOW.md
│   └── DEPLOYMENT_LOG.md
│
├── 🏢 operations/ (Business)
│   ├── README.md
│   ├── CLIENTS.md
│   ├── ONBOARDING_CHECKLIST.md
│   ├── SLA.md
│   ├── PRICING.md
│   └── INCIDENT_LOG.md
│
├── 🔧 infra/ (Infrastructure)
│   ├── docker-compose.yml
│   ├── setup-vps.sh
│   ├── cloudflare/
│   │   ├── dns-records.json
│   │   ├── r2-config.md
│   │   └── waf-rules.json
│   └── deployment-notes.md
│
├── 💾 storage/ (Data & Assets)
│   ├── r2-bucket-policy.json
│   ├── backup-strategy.md
│   └── assets/
│       ├── logos/
│       └── email-templates/
│
├── 🔗 integrations/ (External Tools)
│   ├── metricool/
│   │   ├── API_SCHEMA.md
│   │   └── test_payloads.json
│   ├── resend/
│   │   ├── API_SCHEMA.md
│   │   └── email-templates/
│   ├── fillout/
│   │   ├── API_SCHEMA.md
│   │   └── database-schema.json
│   └── n8n/
│       ├── API_SCHEMA.md
│       └── node-reference.md
│
├── 🚀 workflows/ (n8n Logic - by blast radius)
│   ├── main/
│   │   ├── 01-client-onboarding.json
│   │   └── 02-metrics-collection.json
│   ├── sub-workflows/
│   │   ├── execute-metricool-api.json
│   │   └── format-metrics-for-zite.json
│   ├── error-handling/
│   │   └── global-error-catch.json
│   ├── scripts/
│   │   └── data-transforms.js
│   ├── WORKFLOW_INVENTORY.md
│   └── WORKFLOW_TESTING.md
│
├── 🛠️ development/ (Dev Tools)
│   ├── n8n_workflow_tool.js
│   ├── test_payloads/
│   ├── debug_scripts/
│   └── DEVELOPMENT_GUIDE.md
│
├── 📋 CONFIG FILES
│   ├── credential.txt
│   ├── .gitignore
│   └── README_SECURITY.md
│
└── 📖 GUIDES
    ├── GETTING_STARTED.md
    ├── CLEANUP_SUMMARY.md
    └── PROJECT_STRUCTURE.md
```

---

## 🎯 Key Improvements Explained

### 1. **Router Pattern: CLAUDE.md**
Current: Users navigate multiple docs, context gets lost
Better: Single entry point that routes to relevant sections

**Purpose:** When Claude (or team) starts work, they open CLAUDE.md first. It's < 200 lines with @ references pointing to detailed docs.

**Example CLAUDE.md:**
```markdown
# My Automation Partner — START HERE

## I need to...

- **Add a new workflow** → See @/workflows/WORKFLOW_GUIDE.md
- **Debug n8n error** → See @.claude/skills/n8n-admin/SKILL.md
- **Deploy to production** → See @infra/DEPLOYMENT.md
- **Configure Metricool API** → See @integrations/metricool/API_SCHEMA.md
- **Add a new client** → See @operations/ONBOARDING_CHECKLIST.md

## Quick Links
- Workflow inventory: @/workflows/WORKFLOW_INVENTORY.md
- Infrastructure status: @infra/deployment-notes.md
- API references: @/integrations/ (metricool, resend, fillout, n8n)
```

### 2. **Scratchpad: PLAN.md**
Current: No standard place for step-by-step planning
Better: Claude writes execution plan before running commands

**Purpose:** Shows Claude's thinking and allows user to approve before execution

**Example PLAN.md:**
```markdown
# Execution Plan [Date]

## Task: Deploy new metrics workflow

### Step-by-step plan:
- [ ] 1. Load n8n-admin skill (@.claude/skills/n8n-admin/SKILL.md)
- [ ] 2. Create workflow JSON in /workflows/main/03-advanced-metrics.json
- [ ] 3. Test with payloads in /integrations/metricool/test_payloads.json
- [ ] 4. Verify against @.claude/rules/naming-conventions.md
- [ ] 5. Deploy to n8n instance
- [ ] 6. Update WORKFLOW_INVENTORY.md
- [ ] 7. Document in DEPLOYMENT_LOG.md

## Dependencies:
- Metricool API access
- n8n workflow edit permissions
- Zite database write access
```

### 3. **.claude/ Rules Folder**
Current: Rules scattered across docs
Better: Centralized, immutable constraints for Claude to follow

**Files to create:**
- `naming-conventions.md` — How to name nodes, variables, workflows
- `security-rules.md` — Never log keys, always use credential stubs
- `coding-standards.md` — n8n expression standards, error handling
- `deployment-rules.md` — VPS, Docker, Cloudflare deployment rules

### 4. **.claude/ Skills Folder**
Current: Claude loads all docs every time
Better: Load skills on-demand, saves context for actual work

**Skills to create:**
- `n8n-admin/SKILL.md` — Workflow creation, node reference, expressions
- `cloudflare-admin/SKILL.md` — DNS, R2, WAF configuration
- `database-admin/SKILL.md` — Zite/Fillout schema and operations
- `api-integration/SKILL.md` — Metricool, Resend, n8n APIs
- `zite-admin/SKILL.md` — Portal configuration and customization

### 5. **Infra/ Folder**
Current: Deployment logic scattered
Better: Infrastructure as Code with clear setup procedures

**What to add:**
- `docker-compose.yml` — n8n, Postgres, Coolify config
- `setup-vps.sh` — Ubuntu VPS initialization
- `cloudflare/dns-records.json` — Export of DNS setup
- `deployment-notes.md` — VPS IP, Coolify URL, access info

### 6. **Storage/ Folder**
Current: Assets folder exists but minimal structure
Better: Clear bucket policies, backup strategy, asset management

**What to add:**
- `r2-bucket-policy.json` — CORS, public access rules
- `backup-strategy.md` — How to backup Zite, n8n, R2
- Document R2 bucket structure and public URL mappings

### 7. **Integrations/ Folder (NEW)**
Current: No standardized integration schemas
Better: Each integration has schema, test data, and standards

**What to add:**
```
integrations/
├── metricool/
│   ├── API_SCHEMA.md (endpoints, auth, field names)
│   ├── test_payloads.json (sample responses)
│   └── known-issues.md (platform-specific quirks)
├── resend/
│   ├── API_SCHEMA.md
│   └── email-templates/ (HTML templates)
├── fillout/
│   ├── API_SCHEMA.md
│   ├── database-schema.json
│   └── linked-record-rules.md
└── n8n/
    ├── API_SCHEMA.md
    └── node-reference.md
```

### 8. **Workflows/ Organized by Blast Radius**
Current: Not separated by impact level
Better: Clear folder structure showing dependencies and risks

```
workflows/
├── main/           # High-priority event-driven (client onboarding, metrics)
├── sub-workflows/  # Reusable modules (API calls, data transforms)
├── error-handling/ # Global catch-all for failures
└── scripts/        # JavaScript data transformation
```

---

## 🚀 Migration Plan

### Phase 1: Create Router & Scratchpad (1 hour)
- [ ] Create `.claude/` hidden folder
- [ ] Create `CLAUDE.md` (router with @ references)
- [ ] Create `PLAN.md` (empty scratchpad template)

### Phase 2: Create Rules (2 hours)
- [ ] Create `.claude/rules/naming-conventions.md`
- [ ] Create `.claude/rules/security-rules.md`
- [ ] Create `.claude/rules/coding-standards.md`
- [ ] Create `.claude/rules/deployment-rules.md`

### Phase 3: Create Skills (3 hours)
- [ ] Create `.claude/skills/n8n-admin/SKILL.md`
- [ ] Create `.claude/skills/cloudflare-admin/SKILL.md`
- [ ] Create `.claude/skills/database-admin/SKILL.md`
- [ ] Create `.claude/skills/api-integration/SKILL.md`
- [ ] Create `.claude/skills/zite-admin/SKILL.md`

### Phase 4: Reorganize Folders (2 hours)
- [ ] Create `infra/` with docker-compose.yml, setup scripts
- [ ] Create `integrations/` with API schemas
- [ ] Reorganize `workflows/` by blast radius
- [ ] Update `storage/` with bucket policies

### Phase 5: Documentation (2 hours)
- [ ] Update CLAUDE.md with final @ references
- [ ] Create integration schemas
- [ ] Document deployment procedures

---

## 📋 Master Prompt Template

Once structure is ready, use this prompt pattern:

```markdown
# Task: [Brief description]

## Context
@CLAUDE.md                    # Start with router
@MAP_MASTER.md                # Reference single source of truth
@infra/deployment-notes.md    # Current infrastructure status

## Rules to Follow
@.claude/rules/naming-conventions.md
@.claude/rules/security-rules.md

## Load Skills As Needed
@.claude/skills/[relevant-skill]/SKILL.md

## Execution Plan
See PLAN.md for step-by-step checklist

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

---

## 💡 Implementation Recommendations

### Immediate (This Week)
1. ✅ Create CLAUDE.md (router)
2. ✅ Create .claude/rules/ folder with 4 rule files
3. ✅ Reorganize workflows/ by blast radius

### Short Term (Next 2 Weeks)
4. ✅ Create infra/ folder with deployment scripts
5. ✅ Create integrations/ folder with API schemas
6. ✅ Create .claude/skills/ with domain-specific knowledge

### Ongoing
7. ✅ Update PLAN.md before each major task
8. ✅ Keep DEPLOYMENT_LOG.md current
9. ✅ Update rules as standards evolve

---

## 📊 Impact Summary

| Aspect | Current | Improved | Benefit |
|--------|---------|----------|---------|
| Entry Point | Multiple options | Single CLAUDE.md | Less confusion, faster orientation |
| Planning | Ad-hoc | PLAN.md scratchpad | Executable checklists, approval gates |
| Rules | Scattered | .claude/rules/ | Consistency, automation readiness |
| Knowledge | All loaded | On-demand skills | Saves context, focused work |
| Deployment | Undocumented | infra/ as code | Repeatable, trackable deployments |
| Integrations | Ad-hoc | Standardized schemas | Easier debugging, faster new APIs |
| Scalability | Limited | Clear structure | Ready for team growth |

---

## 🎯 Next Step

Ready to implement? I can create:
1. **CLAUDE.md** — Router with @ references
2. **.claude/rules/** — All constraint files
3. **Master Prompt Template** — Ready to use
4. **Migration checklist** — Step-by-step guide

Choose the level of detail you want, and I'll create them all.
