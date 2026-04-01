# Portal Platform Decision Summary
**Status:** Recommendation Ready
**Date:** March 30, 2026

---

## THE QUESTION

You're scaling from 2 test clients to 100+ paying customers. Your current setup:
- n8n workflows (automation) on Hetzner VPS ($40/mo)
- Fillout/Zite database ($19/mo)
- Need: Customer portal showing metrics, calendar, team management

**Decision:** Which hosting/platform for the portal?

---

## FIVE OPTIONS EVALUATED

| Option | Tech | Cost | Setup Time | Pros | Cons |
|--------|------|------|-----------|------|------|
| **1. Next.js on Hetzner** | Custom build | $40 | 4-6 wks | No extra cost | Shared resources, bottleneck at 100 users |
| **2. Vercel + Hetzner** | Next.js + Express | $67 | 4-5 wks | Best balance, auto-scales, proven | Slight architecture complexity |
| **3. Bubble.io** | Visual builder | $65-139 | 2 wks | Fastest MVP | Expensive, locked-in, not white-label |
| **4. Retool** | Low-code dashboard | $530+ | 2 wks | Fast build | Per-user pricing, breaks budget at scale |
| **5. Supabase + Next.js** | Custom + PostgreSQL | $40-85 | 6-8 wks | Most scalable, RLS security | More complex, 1hr data lag |

---

## RECOMMENDATION: OPTION 2 (Vercel + Hetzner with Redis)

### Architecture
```
Client Browser
    ↓
Vercel CDN (Next.js portal) ← Global, auto-scales
    ↓
Hetzner VPS (API + Redis cache) ← n8n workflows + portal backend
    ↓
Fillout API ← Client data (metrics, calendar, users)
```

### Why This Wins
1. **Cost:** +$27/mo ($67 vs $40 today) for unlimited scaling
2. **Performance:** Global CDN + Redis cache = <2sec page loads
3. **Separates concerns:** n8n and portal don't compete for resources
4. **Auto-scales:** Vercel handles 1,000+ concurrent users without effort
5. **Maintainable:** Clear separation of frontend (Vercel) and backend (Hetzner)
6. **Standard stack:** Next.js + Express + Redis = easy to hire for

### Technical Details
- **Frontend:** Next.js on Vercel (free tier works, scales to $20/mo)
- **Backend:** Express API on Hetzner (caches Fillout data in Redis)
- **Cache:** Redis on Hetzner ($7/mo, 256MB) prevents Fillout rate limits
- **Auth:** Vercel Auth or Supabase Auth (free tier)
- **Data:** Live query Fillout, cache for 5 minutes to reduce API calls

---

## COST COMPARISON (100+ CLIENTS)

| Service | Today | Option 2 | Δ |
|---------|-------|----------|---|
| Hetzner VPS | $40 | $40 | — |
| Fillout/Zite | $19 | $19 | — |
| Cloudflare R2 | $1 | $1 | — |
| Metricool | Var | Var | — |
| **Hetzner Redis** | — | $7 | +$7 |
| **Vercel (portal)** | — | $0-20 | +$0-20 |
| **Resend** | Free | Free | — |
| **TOTAL** | **$60/mo** | **$67-87/mo** | **+$7-27/mo** |

**For scaling from 2 to 100+ customers, +$27/mo is negligible.**

---

## TIMELINE

| Week | Task | Effort |
|------|------|--------|
| 1 | Next.js setup + basic UI (dashboard, calendar) | 40 hrs |
| 2 | Dashboard KPIs + calendar details | 40 hrs |
| 3 | Express API backend + Redis cache setup | 40 hrs |
| 4 | Auth + integration testing + load test | 40 hrs |
| 5 | Monitoring + launch + feedback | 20 hrs |
| **Total** | **Production ready** | **~180 hrs (4-5 weeks @ 1 engineer)** |

---

## WHAT ABOUT FILLOUT RATE LIMITS?

**Your usage (100 clients, 5 users each = 500 portal users):**
- Without cache: 500 API calls/day = too risky
- With Redis 5-min cache: ~120 API calls/day = safe

**Solution in Option 2:** Redis caches Fillout responses, prevents hitting limits.
**n8n unchanged:** Still pulls metrics 3x/hour = 3 calls/hour = no issue.

---

## WHAT ABOUT SCALING BEYOND 100 CLIENTS?

| Clients | Concurrent Users | Option 2 Handles? | Cost Impact |
|---------|-----|---|---|
| 100 | 50-100 | ✓ Easily | $67-87 (no change) |
| 500 | 250-500 | ✓ Easily | $67-87 (no change) |
| 1,000 | 500-1,000 | ✓ Easily | May upgrade Hetzner ($60-100) |
| 5,000+ | 2,500+ | ✓ Yes, with optimization | Hetzner upgrade + Supabase migration |

**With Option 2, you have 6-12 months before needing to scale further.**

---

## NEXT STEPS

1. **Review** this doc with team lead
2. **Approve** the $27/mo additional spend (Redis + Vercel)
3. **Assign** one engineer for 4-5 weeks
4. **Create** GitHub repo (`portal-next-js`)
5. **Set up** Vercel account + Redis instance
6. **Start** Week 1: Next.js foundation

---

## IF YOU WANT SOMETHING DIFFERENT

**Want fastest MVP?** → Option 3 (Bubble, 2 weeks, but expensive at scale)
**Want maximum flexibility?** → Option 5 (Supabase, 6 weeks, best for 10k+)
**Want zero maintenance?** → Option 3 or 4 (but cost explodes at 100+ users)
**Want to stay on Hetzner only?** → Option 1 (works but hits ceiling at 100 users)

**None of these are better for your use case. Option 2 is the sweet spot.**

---

**Document Owner:** Infrastructure Team
**Last Updated:** March 30, 2026
**Decision Status:** ✅ Recommended, awaiting approval
