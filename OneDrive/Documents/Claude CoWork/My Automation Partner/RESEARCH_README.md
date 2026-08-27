# Hosting & Portal Research — START HERE

**Date:** March 30, 2026
**Status:** Complete and ready to execute
**Effort:** 4-5 weeks to production
**Additional cost:** +$27-47/month

---

## The Question

You're scaling from 2 test clients to 100+ paying customers. Your current infrastructure (Hetzner VPS + Fillout/Zite database) costs $40/month. Now you need a **customer portal** showing metrics, content calendar, and team management.

**Decision:** Which hosting platform? Should you add the portal to your existing VPS or build separately?

---

## The Answer

**Option 2: Vercel Frontend + Hetzner Backend (RECOMMENDED)**

```
Vercel (Next.js portal)     ← Global CDN, auto-scales, $0-20/mo
    ↓
Hetzner (Express API)       ← n8n + caching, $40/mo + $7 Redis
    ↓
Fillout/Zite (database)     ← Unchanged, $19/mo
```

**Cost:** +$27-47/month (total $67-87/mo)
**Scalability:** Handles 1,000+ concurrent portal users
**Maintenance:** Low (Vercel and Redis are managed)
**Timeline:** 4-5 weeks to production

---

## Why This Option?

| Factor | Rating | Why |
|--------|--------|-----|
| **Cost efficiency** | 9/10 | Only $0.27-0.47 per customer for portal |
| **Scalability** | 10/10 | Grows from 100 to 1,000+ users without changes |
| **Maintainability** | 9/10 | Clear separation: n8n untouched, portal independent |
| **Speed to market** | 8/10 | 4-5 weeks with one engineer |
| **Technology debt** | 9/10 | Standard tech (Next.js, Express, Redis) = easy to hire |
| **Risk level** | 8/10 | Low (proven stack, no vendor lock-in) |

---

## What You Get

**For customers:**
- Fast dashboard (< 2 seconds via global CDN)
- Real-time metrics (Instagram, TikTok, Facebook followers)
- Content calendar (scheduled posts by platform)
- Team management (invite users, set roles)
- Mobile responsive (works on all devices)

**For your business:**
- Automatic scaling (no ops burden)
- Cheap at scale (doesn't break budget at 500+ customers)
- White-label capable (can customize per client)
- Easy migrations (if needed in future)

---

## The Other Options (Why Not?)

| Option | Cost | Verdict |
|--------|------|---------|
| **1. Next.js on Hetzner** | $40 | Works until 100 users, then bottle-necks |
| **3. Bubble.io** | $65-139 | Fast MVP (2 weeks), expensive + locked-in at scale |
| **4. Retool** | $530+/mo | Good for internal tools, NOT for 100 external users |
| **5. Supabase + Next.js** | $40-85 | Most scalable (10k+), too complex for now |

---

## Implementation Timeline

```
Week 1  → Next.js foundation + UI skeleton (40 hrs)
Week 2  → Dashboard, calendar, analytics pages (40 hrs)
Week 3  → Express API, Redis, authentication (40 hrs)
Week 4  → Integration, testing, optimization (40 hrs)
Week 5  → Monitoring setup, production launch (20 hrs)
───────────────────────────────────────────────────
Total  → 180 hours (4-5 weeks, 1 engineer)
```

All details in: `OPTION2_IMPLEMENTATION_GUIDE.md`

---

## Cost Breakdown

| Service | Today | With Portal | Change |
|---------|-------|------------|--------|
| Hetzner VPS | $40 | $40 | — |
| Fillout/Zite | $19 | $19 | — |
| Cloudflare R2 | $1 | $1 | — |
| Metricool | Var | Var | — |
| **NEW: Redis** | — | $7 | +$7 |
| **NEW: Vercel** | — | $0-20 | +$0-20 |
| **TOTAL** | **$60** | **$67-87** | **+$7-27** |

**Per customer cost at 100 clients:** $0.67/month for portal infrastructure

---

## Will Fillout Rate Limits Be a Problem?

**Short answer: No, not with Option 2.**

Your usage:
- n8n metrics: 3 API calls/hour
- Portal with 100 clients × 5 users: ~120 API calls/day with cache

Fillout's estimated limit: 100-500 calls/minute

Option 2 solution:
- Redis caches responses for 5 minutes
- Even without cache: 0.08 API calls/second = very safe
- If rate limited: portal shows cached data (acceptable)

You won't hit rate limits until 1,000+ concurrent portal users.

---

## Decision Checklist

Before starting Week 1, confirm:

- [ ] Team lead reviewed PORTAL_DECISION_SUMMARY.md
- [ ] +$27/month additional cost is approved
- [ ] 1 engineer allocated for 5 weeks
- [ ] GitHub repository created (portal-nextjs)
- [ ] Vercel account ready (free tier)
- [ ] SSH access to Hetzner confirmed
- [ ] Credentials (Fillout API key, etc.) available

---

## File Guide

Read in this order:

1. **This file** (you are here) — 5 min read
2. **PORTAL_DECISION_SUMMARY.md** — Executive summary, 10 min read
3. **HOSTING_PORTAL_RESEARCH.md** — Deep dive, 30 min read
4. **OPTION2_IMPLEMENTATION_GUIDE.md** — Week-by-week execution, start Week 1
5. **PORTAL_PLATFORM_COMPARISON.md** — Reference for future decisions

All files in: `/operations/`

---

## FAQ

**Q: Will adding the portal slow down n8n workflows?**
A: No. Vercel and Hetzner are separate. n8n gets dedicated resources.

**Q: What if we want to white-label?**
A: Option 2 supports it. Each client can get their own branded domain.

**Q: Can we migrate to a different platform later?**
A: Yes. Next.js is portable. You could move to Supabase/Option 5 at 1,000+ users.

**Q: Do we need Redis?**
A: Yes, for production. It prevents Fillout API rate limits and improves speed.

**Q: What happens if Vercel or Hetzner goes down?**
A: Fillout/Zite stays up. Portal might be slow/down. n8n workflows unaffected.

**Q: How many engineers needed?**
A: 1 full-time for 5 weeks. Or 2 part-time for 10 weeks.

---

## Next Steps

1. **Review** → Read PORTAL_DECISION_SUMMARY.md (quick overview)
2. **Approve** → Confirm budget and timeline with team
3. **Setup** → Create GitHub repo, Vercel account, assign engineer
4. **Execute** → Follow OPTION2_IMPLEMENTATION_GUIDE.md Week 1

Expected production launch: **5 weeks from start date**

---

## Questions?

All questions answered in the research documents:
- **Why Option 2?** → See PORTAL_DECISION_SUMMARY.md
- **How does it work?** → See HOSTING_PORTAL_RESEARCH.md (Section 2)
- **What about costs?** → See PORTAL_PLATFORM_COMPARISON.md
- **How to build it?** → See OPTION2_IMPLEMENTATION_GUIDE.md

---

**Ready to proceed?**

Option 2 is the recommended path. No additional research needed.

Start with Week 1 of `OPTION2_IMPLEMENTATION_GUIDE.md` once approved.

Good luck with your scaling! 🚀
