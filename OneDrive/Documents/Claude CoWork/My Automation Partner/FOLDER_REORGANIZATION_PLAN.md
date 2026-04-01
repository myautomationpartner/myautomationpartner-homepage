# PROJECT FOLDER REORGANIZATION PLAN

**Created:** March 31, 2026
**Status:** ⏳ AWAITING APPROVAL
**Risk Level:** Low (file organization only, no code changes)

---

## 🎯 OBJECTIVE

Clean up the root folder by organizing website files into separate, purpose-built directories. Move from a flat structure to a hierarchical structure that makes it easy to find and manage files for each client/website.

---

## 📊 CURRENT STATE (MESSY)

```
/My Automation Partner/
├── CLAUDE.md (project instructions)
├── MAP_MASTER.md (master brief)
├── GETTING_STARTED.md
├── PLAN.md
├── [... 15+ other .md files ...]
├── credential.txt (PROTECTED)
├── dancescapes-portal.html ⚠️ CLIENT FILE
├── dancescapes-metrics.json ⚠️ CLIENT FILE
├── homepage.html ⚠️ PORTAL FILE
├── login.html ⚠️ PORTAL FILE
├── logo.svg ⚠️ BRANDING
├── My Automation Partner Logo.png ⚠️ BRANDING
├── work-summary.js
├── github-setup.bat
├── github-setup.ps1
├── assets/ (branding only)
├── development/ (tools)
├── docs/ (documentation)
├── operations/ (operational files)
└── workflows/ (n8n workflows)
```

**Problems:**
- ❌ Website HTML/CSS files mixed with documentation
- ❌ Client-specific files (Dancescapes) in root
- ❌ Portal files (homepage/login) unclear ownership
- ❌ No clear client folder structure
- ❌ Hard to locate files for a specific client

---

## ✅ PROPOSED NEW STRUCTURE

```
/My Automation Partner/
│
├── 📋 [DOCUMENTATION & SETUP] (Root Level - Existing, Unchanged)
│   ├── CLAUDE.md
│   ├── MAP_MASTER.md
│   ├── GETTING_STARTED.md
│   ├── PLAN.md
│   ├── credential.txt (PROTECTED)
│   ├── [... other critical .md files ...]
│   ├── .claude/ (hidden, project rules)
│   ├── development/ (tools & utilities)
│   ├── docs/ (reference documentation)
│   ├── operations/ (operational checklists)
│   └── workflows/ (n8n workflows)
│
├── 📁 websites/
│   │
│   ├── 01-portal/
│   │   ├── README.md (purpose of portal)
│   │   ├── index.html (or homepage.html)
│   │   ├── login.html
│   │   ├── style.css (if separated later)
│   │   ├── script.js (if separated later)
│   │   └── assets/
│   │       ├── logo.svg
│   │       ├── My Automation Partner Logo.png
│   │       └── [other shared branding]
│   │
│   └── 02-dancescapes/
│       ├── README.md (client info: Dancescapes Performing Arts)
│       ├── portal.html (dancescapes-portal.html renamed)
│       ├── metrics.json (dancescapes-metrics.json renamed)
│       ├── assets/
│       │   ├── logo.png (if Dancescapes has custom logo)
│       │   └── [client-specific assets]
│       └── config.md (Metricool IDs, API references)
│
└── 📁 utilities/ (Optional: scripts, tools)
    ├── work-summary.js
    ├── github-setup.bat
    ├── github-setup.ps1
    └── README.md
```

---

## 📋 STEP-BY-STEP MIGRATION PLAN

### Phase 1: Create Directory Structure (No File Moves)
```bash
mkdir -p websites/01-portal/assets
mkdir -p websites/02-dancescapes/assets
mkdir -p utilities
```

### Phase 2: Move Files to Appropriate Folders

**2a. Portal Files → `websites/01-portal/`**
- [ ] `homepage.html` → `websites/01-portal/index.html`
- [ ] `login.html` → `websites/01-portal/login.html`
- [ ] `logo.svg` → `websites/01-portal/assets/logo.svg`
- [ ] `My Automation Partner Logo.png` → `websites/01-portal/assets/map-logo.png`

**2b. Dancescapes Client Files → `websites/02-dancescapes/`**
- [ ] `dancescapes-portal.html` → `websites/02-dancescapes/portal.html`
- [ ] `dancescapes-metrics.json` → `websites/02-dancescapes/metrics.json`

**2c. Utility Scripts → `utilities/`**
- [ ] `work-summary.js` → `utilities/work-summary.js`
- [ ] `github-setup.bat` → `utilities/github-setup.bat`
- [ ] `github-setup.ps1` → `utilities/github-setup.ps1`

### Phase 3: Create README Files for Context

**3a. `websites/01-portal/README.md`**
- Purpose: Main client portal (My Automation Partner branded)
- Entry point: `index.html`
- Platforms: All clients access this
- Connected to: n8n workflows, Zite database

**3b. `websites/02-dancescapes/README.md`**
- Purpose: Dancescapes Performing Arts client portal
- Client: Dancescapes Performing Arts
- Metricool Blog ID: 6035446
- Metricool User ID: 4660143
- Status: Active (test)

**3c. `utilities/README.md`**
- Purpose: Support scripts and setup tools
- Contents: Summarize each script

### Phase 4: Update File References
- [ ] Check HTML files for hardcoded asset paths
- [ ] Update logo URLs to reflect new paths
- [ ] Test portal loads correctly after migration

---

## 🔄 IMPACT ANALYSIS

### Files Affected
- 9 website/utility files will be moved
- 0 code changes
- 0 configuration changes
- 0 API changes

### Files NOT Affected
- Documentation stays in root
- Workflows directory untouched
- Development tools stay in place
- Operations/docs directories untouched
- `credential.txt` stays protected in root

### Testing Required
- [ ] Open `websites/01-portal/index.html` → should load correctly
- [ ] Open `websites/01-portal/login.html` → should load correctly
- [ ] Verify logo paths work in portal files
- [ ] Verify `websites/02-dancescapes/portal.html` renders correctly

---

## 🎯 BENEFITS

✅ **Clarity:** Each client/website has its own folder
✅ **Scalability:** Easy to add new clients (03-clientname, etc.)
✅ **Maintainability:** Website files separated from documentation
✅ **Navigation:** Find client files quickly
✅ **Naming Consistency:** Follows kebab-case convention (`websites/01-portal/`)

---

## ⚠️ RISKS & MITIGATION

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Broken asset paths | Medium | Test all HTML files after move; update paths as needed |
| Workflow references | Low | No n8n workflows reference these files directly |
| Documentation outdated | Low | Will update GETTING_STARTED.md if needed |

---

## ✅ ROLLBACK PLAN

If anything breaks:
1. Keep original files backed up
2. Run `git reset` to restore original structure (if in git)
3. Manual restore from backup folder if needed

---

## 📝 APPROVAL CHECKLIST

Before implementing, confirm:

- [ ] **You agree** with the proposed structure above
- [ ] **Ready to proceed** with folder creation and file moves
- [ ] **Want me to update** HTML file asset paths automatically
- [ ] **Any other clients/websites** I should know about? (to plan for 03-, 04-, etc.)

---

## 🚀 NEXT STEPS (After Approval)

1. ✅ You approve this plan
2. I create the folder structure
3. I move files to their new locations
4. I create README files in each folder
5. I test portal loads correctly
6. I update any internal documentation
7. **Ready for VSCode!** 🎉

---

**Questions before we proceed?**
