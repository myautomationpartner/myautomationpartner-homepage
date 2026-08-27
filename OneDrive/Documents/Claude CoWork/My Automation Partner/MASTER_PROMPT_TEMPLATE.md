# MASTER PROMPT TEMPLATE

**Purpose:** A standardized prompt format that makes work professional, efficient, and executable. Copy and modify for your specific task.

---

## 📋 Template for AI Assistant (Claude)

```markdown
# Task: [Brief 1-line description]

## CONTEXT
Load these files to understand current state:
- @CLAUDE.md (router - start here)
- @MAP_MASTER.md (single source of truth)
- @infra/deployment-notes.md (current infrastructure status)

## RULES TO FOLLOW (Load first)
- @.claude/rules/naming-conventions.md
- @.claude/rules/security-rules.md
- @.claude/rules/[specific-rule-if-needed]

## LOAD RELEVANT SKILLS (As needed)
Choose from:
- @.claude/skills/n8n-admin/SKILL.md (for workflow work)
- @.claude/skills/api-integration/SKILL.md (for API work)
- @.claude/skills/database-admin/SKILL.md (for database work)
- @.claude/skills/cloudflare-admin/SKILL.md (for infrastructure)
- @.claude/skills/zite-admin/SKILL.md (for portal/client work)

## SPECIFIC TASK DETAILS

### Goal
[Clear description of what you want to accomplish]

### Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### References
- @[relevant/path.md]
- @integrations/[api]/API_SCHEMA.md (if API work)
- @/workflows/[workflow-name].json (if editing workflows)

### Constraints
- [Any specific constraints for this task]
- [Budget/time constraints]
- [What NOT to do]

## EXECUTION STEPS (AI will write plan in PLAN.md before executing)
1. Write execution plan in @PLAN.md
2. Get approval if high-risk
3. Follow rules from @.claude/rules/
4. Execute step-by-step
5. Update @MAP_MASTER.md with changes
6. Document in @docs/DEPLOYMENT_LOG.md

## APPROVAL GATE
Before executing: Please confirm you understand the plan and rules.

## OUTPUT REQUIREMENTS
- [ ] Working code/workflow/documentation
- [ ] Updated @MAP_MASTER.md
- [ ] Updated @docs/DEPLOYMENT_LOG.md (if infra change)
- [ ] Updated relevant ops docs
- [ ] Summary of what was done and why

## SUPPORT
Questions? Check @CLAUDE.md for quick answers.
```

---

## 🎯 Real-World Examples

### Example 1: "Add a New Workflow"

```markdown
# Task: Create Metricool Metrics Sync Workflow

## CONTEXT
- @CLAUDE.md
- @MAP_MASTER.md
- @/workflows/LIVE_WORKFLOWS.md (to see existing workflows)

## RULES TO FOLLOW
- @.claude/rules/naming-conventions.md
- @.claude/rules/security-rules.md

## LOAD SKILLS
- @.claude/skills/n8n-admin/SKILL.md
- @.claude/skills/api-integration/SKILL.md

## SPECIFIC TASK DETAILS

### Goal
Create a new n8n workflow that pulls metrics from Metricool every hour and stores in Zite.

### Success Criteria
- [ ] Workflow named following conventions: `03-metricool-sync`
- [ ] Uses Metricool API correctly (see API_SCHEMA.md)
- [ ] Transforms data to match Zite Metrics table schema
- [ ] Handles errors gracefully with retry logic
- [ ] All nodes follow naming conventions (questions/actions)
- [ ] Uses credential stubs (not hardcoded keys)
- [ ] Tested with sample payloads
- [ ] Documented in LIVE_WORKFLOWS.md

### References
- @integrations/metricool/API_SCHEMA.md
- @integrations/fillout/database-schema.json
- @/workflows/WORKFLOW_TESTING.md
- @development/test_payloads/metricool-sample.json

### Constraints
- Must run hourly (not real-time)
- Handle rate limits (100 req/min)
- Keep execution time < 30 seconds

## EXECUTION STEPS
1. Write plan in @PLAN.md
2. Create workflow in n8n
3. Test with sample data
4. Verify follows naming conventions
5. Verify uses credential stubs (not hardcoded keys)
6. Export JSON to @/workflows/workflow-backups/
7. Document in @/workflows/LIVE_WORKFLOWS.md
8. Update @MAP_MASTER.md
9. Get approval before deploying to production
```

### Example 2: "Fix an API Integration Bug"

```markdown
# Task: Fix Metricool API Rate Limit Issue

## CONTEXT
- @CLAUDE.md
- @MAP_MASTER.md (what's broken?)
- @/workflows/02-metrics-collection.json (the workflow)
- @docs/DEPLOYMENT_LOG.md (when did this start?)

## RULES TO FOLLOW
- @.claude/rules/security-rules.md
- @.claude/rules/naming-conventions.md

## LOAD SKILLS
- @.claude/skills/api-integration/SKILL.md
- @.claude/skills/n8n-admin/SKILL.md

## SPECIFIC TASK DETAILS

### Goal
Metrics workflow is hitting rate limits from Metricool (100 req/min). Add backoff logic and queuing.

### Success Criteria
- [ ] Understand root cause
- [ ] Implement retry with exponential backoff
- [ ] Add queue to batch requests
- [ ] Verify rate limits respected
- [ ] Test with sample data
- [ ] Document fix in DEPLOYMENT_LOG.md
- [ ] No errors in 24-hour test

### References
- @integrations/metricool/API_SCHEMA.md (rate limits)
- @/workflows/02-metrics-collection.json
- @operations/INCIDENT_LOG.md (when reported)

### Constraints
- Don't slow down other workflows
- Keep retry logic simple
- Respect Metricool's 100 req/min limit

## EXECUTION STEPS
1. Write plan in @PLAN.md
2. Analyze current workflow to find issue
3. Implement backoff logic (wait then retry)
4. Test with high-volume data
5. Verify rate limits
6. Update workflow JSON
7. Deploy and monitor
8. Document fix in @docs/DEPLOYMENT_LOG.md
9. Update @MAP_MASTER.md
```

### Example 3: "Onboard a New Client"

```markdown
# Task: Onboard New Client - ACME Corp

## CONTEXT
- @CLAUDE.md
- @operations/ONBOARDING_CHECKLIST.md
- @operations/CLIENTS.md (add them here)
- @operations/SLA.md (make sure we can support them)

## RULES TO FOLLOW
- @.claude/rules/security-rules.md (protect their data)

## LOAD SKILLS
- @.claude/skills/zite-admin/SKILL.md
- @.claude/skills/api-integration/SKILL.md (if needed)

## SPECIFIC TASK DETAILS

### Goal
Complete onboarding for ACME Corp including all required setup steps.

### Success Criteria
- [ ] Client record created in Zite
- [ ] Admin user created with login access
- [ ] Welcome email sent
- [ ] Metricool connected and syncing
- [ ] First metrics visible in dashboard
- [ ] Client can log in and see data
- [ ] Recorded in @operations/CLIENTS.md
- [ ] SLA acknowledged

### Provided Info
- Client: ACME Corp
- Contact: john@acme.com
- Plan: Growth
- Metricool User ID: 4660143
- Metricool Blog ID: 6035446

### References
- @operations/ONBOARDING_CHECKLIST.md
- @/workflows/main/01-client-onboarding.json
- @operations/CLIENTS.md

## EXECUTION STEPS
1. Follow @operations/ONBOARDING_CHECKLIST.md step-by-step
2. Collect required info from client
3. Trigger client-onboarding webhook
4. Verify records created in Zite
5. Confirm welcome email sent
6. Test client login
7. Wait 24 hours for initial metrics
8. Record in @operations/CLIENTS.md
9. Send welcome call scheduled
```

### Example 4: "Deploy to Production"

```markdown
# Task: Deploy Metrics Workflow to Production

## CONTEXT
- @CLAUDE.md
- @MAP_MASTER.md
- @infra/DEPLOYMENT_GUIDE.md (production process)
- @docs/DEPLOYMENT_LOG.md (recent deployments)

## RULES TO FOLLOW
- @.claude/rules/security-rules.md
- @.claude/rules/naming-conventions.md
- @.claude/rules/deployment-rules.md (if one exists)

## LOAD SKILLS
- @.claude/skills/cloudflare-admin/SKILL.md
- @.claude/skills/n8n-admin/SKILL.md

## SPECIFIC TASK DETAILS

### Goal
Deploy the new metrics workflow to production with zero downtime.

### Success Criteria
- [ ] Workflow tested thoroughly in staging
- [ ] Zero data loss
- [ ] Rollback plan documented
- [ ] Monitoring enabled (30 min post-deploy)
- [ ] Team notified
- [ ] @docs/DEPLOYMENT_LOG.md updated
- [ ] @MAP_MASTER.md updated
- [ ] No alerts in first 24 hours

### Constraints
- Deploy during business hours (10-14 UTC)
- Have rollback plan ready
- Notify team 1 hour before
- Monitor closely for 30 minutes

### References
- @infra/DEPLOYMENT_GUIDE.md
- @/workflows/workflow-backups/03-metrics-sync-v2.json
- @docs/DEPLOYMENT_LOG.md

## EXECUTION STEPS
1. Write deployment plan in @PLAN.md
2. Get approval from team lead
3. Create backup of current workflow
4. Test rollback procedure
5. Deploy to n8n
6. Monitor execution logs
7. Verify data flowing correctly
8. Check for errors (first 30 min critical)
9. Update @docs/DEPLOYMENT_LOG.md
10. Update @MAP_MASTER.md
11. Team notification
```

---

## 📝 How to Use This Template

### Quick Version (Simple Tasks)
```
# Task: [Title]
- @CLAUDE.md (router)
- @[specific-docs-needed]
- @.claude/rules/[relevant-rules]
- Goal: [1 sentence]
- Success: [3-5 bullet points]
```

### Full Version (Complex Tasks)
Use all sections above - especially for:
- New features
- Infrastructure changes
- High-risk tasks
- Critical bug fixes

### Approval Gates
Always include these before high-risk tasks:
- Explicit approval requirement
- Team member to approve (name)
- Risk assessment
- Rollback plan

---

## 🎯 Best Practices

### Before Asking Claude
1. Read @CLAUDE.md (you'll understand better)
2. Gather required context (@MAP_MASTER.md, etc.)
3. Write specific success criteria
4. Identify constraints and risks
5. Mention what rules to follow

### When Claude Responds
1. Claude will write plan in @PLAN.md
2. Review plan before approval
3. Approve or request changes
4. Claude executes step-by-step
5. Claude documents everything

### After Task Completion
1. Claude updates @MAP_MASTER.md
2. Claude updates @docs/DEPLOYMENT_LOG.md
3. You verify success criteria met
4. You archive completed @PLAN.md (rename with date)
5. Both sign off as complete

---

## 💡 Pro Tips

- **Stack @ references:** More specific = faster execution
- **Load skills progressively:** Load only what you need (saves context)
- **Write PLAN.md first:** Shows thinking, enables course correction
- **Document as you go:** @PLAN.md execution log captures everything
- **Update MAP_MASTER.md:** Single source of truth stays current
- **Archive PLAN.md monthly:** Keeps history of what was done

---

## ✅ Validation Checklist

Before submitting task to Claude:
- [ ] Clear goal statement (1-2 sentences)
- [ ] Specific success criteria (3+ items)
- [ ] Relevant @ references included
- [ ] Rules specified (@.claude/rules/*)
- [ ] Skills identified (@.claude/skills/*)
- [ ] Constraints clearly stated
- [ ] Approval requirements if needed

---

**Ready to use?** Copy the relevant example above, fill in your specific details, and submit to Claude!

---

**Last Updated:** March 30, 2026
**Maintained By:** Claude + Team
**Review Frequency:** As new patterns emerge
