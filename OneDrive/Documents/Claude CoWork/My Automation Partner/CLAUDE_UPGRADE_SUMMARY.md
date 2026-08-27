# CLAUDE.md & DATA_FLOW.md Upgrade — What Changed

**Date:** March 30, 2026
**Status:** ✅ Deployed and ready to use
**Impact:** Faster, clearer execution for all tasks

---

## 🎯 What Was Better in the Example Files

### 1. **CLAUDE.md: Directives Instead of Navigation**

**Old approach (what we had):**
```markdown
- **Create a new workflow** → @/workflows/WORKFLOW_GUIDE.md
- **Debug an n8n error** → Load skill: @.claude/skills/n8n-admin/SKILL.md
```
This reads like a directory. Claude has to guess what to do next.

**New approach (example pattern):**
```markdown
If we are building an n8n workflow, review @docs/DATA_FLOW.md first 
to understand the exact sequence, then reference 
@.claude/rules/naming-conventions.md for node naming
```
This reads like instructions. Claude knows exactly what to do and in what order.

### 2. **Data Flow as a Separate Document**

**Old approach:** Everything in MAP_MASTER.md (300+ lines mixing tech stack, workflow details, accomplishments, pending work)

**New approach:** Separate DATA_FLOW.md showing only the pipeline sequence
- Phase 1: Intake & Validation
- Phase 2: Client Record Creation
- Phase 3: Admin User Creation
- Phase 4: Welcome Email
- Phase 5: Success Response

When building/debugging workflows, Claude only reads DATA_FLOW.md (focused).

### 3. **Conditional Routing**

**Old:** "Here are 10 possible things you might need"
**New:** "IF you're doing X, THEN load Y. IF you're doing Z, THEN load Q."

This prevents context bloat. Claude loads what's needed, skips the rest.

---

## ✅ What You Get Now

### CLAUDE.md Redesign
- ✅ **Shorter** (~80 lines vs. 180) — Saves context for actual work
- ✅ **Directive** — Uses imperative language ("Before X, load Y")
- ✅ **Conditional routing** — IF building workflow THEN load DATA_FLOW.md
- ✅ **Core directives** — "Plan First," "No Secrets," "Follow Rules," "Document After"
- ✅ **Quick task reference** — 4 common scenarios with exact steps

### DATA_FLOW.md (NEW)
- ✅ **Pipeline-focused** — Shows exact 5-6 phase sequence for each workflow
- ✅ **Data transformations** — What data changes at each step
- ✅ **API details** — Specific endpoints, field mappings, rate limits
- ✅ **Technical rules** — Date formatting, credential stubs, retry logic
- ✅ **Dependency map** — Which workflows read/write to which tables

---

## 📊 How It Improves Your Work

| Scenario | Old Approach | New Approach | Benefit |
|----------|-------------|-------------|---------|
| **"I need to fix the metrics workflow"** | Read CLAUDE.md → Find link → Read 10 other docs → Maybe get context wrong | Read CLAUDE.md → "Load DATA_FLOW.md Phase 2" → Understand exact Metricool API calls | **10 min faster, less context confusion** |
| **"I'm building a new workflow"** | Read CLAUDE.md → Search for examples → Guess structure | Read CLAUDE.md → Load DATA_FLOW.md → See exact phase structure to follow | **Clear template to follow** |
| **"What does the current pipeline look like?"** | Search MAP_MASTER.md → Mix of business + tech details | Open DATA_FLOW.md → See 5-phase sequence immediately | **Single source for architecture** |
| **"I need to know rate limits for Metricool"** | Dig through multiple files looking for API limits | Open DATA_FLOW.md → "Rate Limiting: 100 requests/minute" | **Facts right there** |

---

## 🔄 What Stayed the Same (Still Works)

These files were already good and weren't changed:

✅ **MAP_MASTER.md** — Still your single source of truth (loaded on-demand, not upfront)
✅ **PLAN.md** — Execution scratchpad (already solid)
✅ **.claude/rules/** — Naming conventions & security (unchanged, very good)
✅ **MASTER_PROMPT_TEMPLATE.md** — Prompt format guide (still excellent)
✅ **/operations/, /workflows/, /development/** — All folder README files (still valuable reference)

---

## 🚀 How to Use the New System

### For Your Next Task to Claude:

**Old flow:**
1. Open CLAUDE.md (long read)
2. Find relevant section
3. Open 2-3 supporting docs
4. Hope Claude understands context
5. Claude guesses what to do

**New flow:**
1. Open CLAUDE.md (quick read, ~3 min)
2. Follow the conditional routing ("IF building workflow THEN...")
3. Load the specific files mentioned
4. Claude has clear directives
5. Claude executes with confidence

### Example: "Fix the client onboarding webhook"

**What to tell Claude:**
```
# Task: Fix client onboarding webhook error

Read @CLAUDE.md, then:
- Load @docs/DATA_FLOW.md (understand the 5-phase sequence)
- Load @.claude/rules/naming-conventions.md
- Load @.claude/rules/security-rules.md
- Check @/workflows/01-client-onboarding.json

Goal: [Your specific issue]
Success: [How you'll know it's fixed]
```

Claude will:
1. Read CLAUDE.md → See directive "IF fixing workflows LOAD DATA_FLOW.md"
2. Understand exact phase sequence from DATA_FLOW.md
3. Follow naming/security rules
4. Write plan in @PLAN.md
5. Ask for approval
6. Execute with confidence

---

## 📈 Context Savings

**Old CLAUDE.md:** 180 lines
**New CLAUDE.md:** 80 lines
**Savings:** ~100 lines of navigation that Claude doesn't need

**Result:** More context available for actual work, faster task execution

---

## ✅ Validation

You're good to go when:
- [ ] You've read the new CLAUDE.md (~3 minutes)
- [ ] You understand the "IF X THEN load Y" conditional routing
- [ ] You've seen DATA_FLOW.md (shows the pipeline phases)
- [ ] You try one task using the new system
- [ ] You notice it's faster/clearer

---

## 🎯 Next Steps

1. **Try it immediately** — Give Claude a task using the new CLAUDE.md routing
2. **Observe the difference** — Notice how much faster Claude understands context
3. **Keep the pattern** — Use conditional routing for any new documentation you add
4. **Archive the old** — Old CLAUDE.md still exists, but you won't need it anymore

---

## 💡 Why This Pattern Works

The example files you showed were built on this principle:

> **"CLAUDE.md should be instructions for Claude, not documentation for humans."**

- Humans read `/docs`, `/operations`, `/integrations` for reference
- Claude reads CLAUDE.md for **directives** (what to load, when)
- DATA_FLOW.md shows the **architecture** (how data moves)

This separation means:
- Claude gets focused, actionable instructions
- Humans get comprehensive reference material
- Both use the system without confusion

---

**Status:** ✅ Ready to use immediately
**Last Updated:** March 30, 2026
**Recommendation:** Start using CLAUDE.md + DATA_FLOW.md for your next task
