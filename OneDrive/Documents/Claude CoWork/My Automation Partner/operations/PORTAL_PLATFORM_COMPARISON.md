# Portal Platform Comparison Matrix

## Quick Reference Scorecard

### Option 1: Next.js on Same Hetzner VPS

```
╔════════════════════════════════════════════════════════════════╗
║                  CUSTOM NEXT.JS ON HETZNER                    ║
╠════════════════════════════════════════════════════════════════╣
║  Cost                    ████░░░░░░ $40/mo                    ║
║  Setup Speed             ████░░░░░░ 4-6 weeks                 ║
║  Customization           ██████████ Unlimited                 ║
║  Scalability (users)     ███░░░░░░░ 50-100                    ║
║  Maintenance Burden      ████░░░░░░ High (Docker, OS, etc)    ║
║  Performance at Scale    ██░░░░░░░░ Shared resources = slow   ║
║  White-label Capable     ██████████ Yes                       ║
╠════════════════════════════════════════════════════════════════╣
║  Verdict: VIABLE FOR MVP ONLY                                  ║
║  Bottleneck: Shared CPU/RAM with n8n workflows                ║
║  Risk: Portal crash = n8n affected                            ║
║  When to Use: <50 paying customers, budget tight              ║
╚════════════════════════════════════════════════════════════════╝
```

---

### Option 2: Vercel Frontend + Hetzner Backend (RECOMMENDED)

```
╔════════════════════════════════════════════════════════════════╗
║           VERCEL NEXT.JS + HETZNER EXPRESS API                ║
╠════════════════════════════════════════════════════════════════╣
║  Cost                    ███████░░░ $67-87/mo                 ║
║  Setup Speed             ███████░░░ 4-5 weeks                 ║
║  Customization           ██████████ Unlimited                 ║
║  Scalability (users)     ██████████ 1,000+                    ║
║  Maintenance Burden      ██░░░░░░░░ Low (managed services)    ║
║  Performance at Scale    ██████████ Global CDN + cache        ║
║  White-label Capable     ██████████ Yes                       ║
╠════════════════════════════════════════════════════════════════╣
║  Verdict: BEST FOR YOUR STAGE                                 ║
║  Advantage: Separates concerns, auto-scales, proven stack     ║
║  Sweet Spot: 100-1,000 customers                              ║
║  When to Use: Ready to scale professionally                   ║
╚════════════════════════════════════════════════════════════════╝
```

---

### Option 3: Bubble.io (Visual Builder)

```
╔════════════════════════════════════════════════════════════════╗
║                       BUBBLE.IO                                ║
╠════════════════════════════════════════════════════════════════╣
║  Cost                    ██████░░░░ $65-139/mo                ║
║  Setup Speed             ██████████ 2 weeks                   ║
║  Customization           ███░░░░░░░ Limited (components)      ║
║  Scalability (users)     ██████░░░░ 500+                      ║
║  Maintenance Burden      ██░░░░░░░░ Zero (fully managed)      ║
║  Performance at Scale    ████░░░░░░ OK (not optimized)        ║
║  White-label Capable     ██░░░░░░░░ No (Bubble branding)      ║
╠════════════════════════════════════════════════════════════════╣
║  Verdict: FASTEST TO MVP, WORST FOR SCALE                    ║
║  Trade-off: Speed vs customization + cost                    ║
║  When to Use: Proof of concept (2-4 weeks)                   ║
║  Problem: Costs rise with users, hard to migrate away         ║
╚════════════════════════════════════════════════════════════════╝
```

---

### Option 4: Retool (Internal Tools Platform)

```
╔════════════════════════════════════════════════════════════════╗
║                       RETOOL                                   ║
╠════════════════════════════════════════════════════════════════╣
║  Cost                    ░░░░░░░░░░ $530+/mo (per-user!)      ║
║  Setup Speed             ██████████ 2-3 weeks                 ║
║  Customization           ████░░░░░░ Medium (internal tools)   ║
║  Scalability (users)     ░░░░░░░░░░ Breaks budget             ║
║  Maintenance Burden      ██░░░░░░░░ Zero                      ║
║  Performance at Scale    ████░░░░░░ OK for dashboards         ║
║  White-label Capable     ░░░░░░░░░░ No                        ║
╠════════════════════════════════════════════════════════════════╣
║  Verdict: NOT SUITABLE FOR EXTERNAL CUSTOMERS                 ║
║  Reason: Per-user pricing kills ROI at 100+ users             ║
║  Use Case: Internal admin dashboard instead                   ║
║  Warning: 100 portal users = $1,000/month!                    ║
╚════════════════════════════════════════════════════════════════╝
```

---

### Option 5: Supabase + Next.js (Most Ambitious)

```
╔════════════════════════════════════════════════════════════════╗
║          SUPABASE POSTGRES + CUSTOM NEXT.JS                   ║
╠════════════════════════════════════════════════════════════════╣
║  Cost                    ████░░░░░░ $40-85/mo                 ║
║  Setup Speed             ██░░░░░░░░ 6-8 weeks                 ║
║  Customization           ██████████ Unlimited                 ║
║  Scalability (users)     ██████████ 10,000+                   ║
║  Maintenance Burden      ███░░░░░░░ Medium (PostgreSQL ops)   ║
║  Performance at Scale    ██████████ Local queries, RLS        ║
║  White-label Capable     ██████████ Yes                       ║
╠════════════════════════════════════════════════════════════════╣
║  Verdict: FUTURE-PROOF, TOO COMPLEX FOR NOW                  ║
║  Advantage: Most scalable, built-in RLS security             ║
║  Drawback: 1-hour data lag, requires sync logic              ║
║  Sweet Spot: 1,000+ customers (when scaling beyond Option 2)  ║
║  Migration Path: Start with Option 2, upgrade to 5 later      ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Head-to-Head Comparison

### Cost at Different Scales

```
                    At 100 Customers    At 500 Customers    At 1,000 Customers
Option 1: Hetzner   $40/mo              $40/mo              ⚠️  Upgrade needed
Option 2: Vercel    $67-87/mo           $67-87/mo           $67-87/mo
Option 3: Bubble    $65-139/mo          $95-139/mo          ✗ Too expensive
Option 4: Retool    ✗ $530/mo+          ✗ $1,000/mo+        ✗ $10,000+/mo
Option 5: Supabase  $40-85/mo           $40-85/mo           $40-85/mo
```

**Winner for cost:** Option 5, but complexity not justified yet. Option 2 is best balance.

---

### Setup Time & Complexity

```
Fastest → Slowest

Bubble          (2 weeks, zero coding)
Retool          (2-3 weeks, visual builder)
Vercel+Hetzner  (4-5 weeks, standard stack)
Next.js Hetzner (4-6 weeks, all-in-one)
Supabase        (6-8 weeks, PostgreSQL + sync)
```

---

### Customization & Branding

```
Most → Least

Custom Builds   (Hetzner, Vercel+Hetzner, Supabase) = Full control
Supabase        ✓ White-label, custom domain
Vercel+Hetzner  ✓ White-label, custom domain
Hetzner-only    ✓ White-label, custom domain
─────────────────────────────────────────────
Retool          ✗ "Powered by Retool" badge
Bubble          ✗ "Built with Bubble" branding
```

---

### Scalability: When Do You Hit Limits?

```
Option 1: Next.js on Hetzner
├─ 50-100 concurrent users: ✓ Comfortable
├─ 100-200 concurrent: ⚠️ Slowing down
├─ 200+ concurrent: ✗ Out of memory, crashes

Option 2: Vercel + Hetzner
├─ 500-1,000 concurrent users: ✓ Comfortable
├─ 1,000-5,000 concurrent: ✓ Fine (Vercel auto-scales)
├─ 5,000+ concurrent: ⚠️ Hetzner needs upgrade, consider Supabase

Option 3: Bubble
├─ 500+ concurrent users: ✓ Comfortable
├─ 1,000+ concurrent: ✓ Fine (Bubble handles)
├─ Limits: Cost ceiling ($139/mo), customization ceiling

Option 4: Retool
├─ 500+ users: ✓ Fine (per-user pricing hits ceiling)
├─ 100 users: ✗ $1,000/mo (cost kills project)
├─ Unusable for scale

Option 5: Supabase + Next.js
├─ 1,000-10,000 concurrent: ✓ Comfortable
├─ 10,000+ concurrent: ✓ Fine, may need enterprise plan
├─ Best for long-term scale
```

---

## Migration Paths

### If you start with Option 1 (Hetzner only):
```
Month 1-3: 10-30 clients
├─ Works fine, no issues

Month 4-6: 30-60 clients
├─ Performance acceptable, n8n still fast

Month 7+: 60+ clients
├─ Portal + n8n competing for RAM/CPU
├─ Migration decision point: Move portal elsewhere
├─ Migrate to: Option 2 (Vercel) or Option 5 (Supabase)
├─ Effort: 2-3 weeks for re-architecture
└─ Cost: Downtime risk, refactoring cost
```

### If you start with Option 2 (Vercel + Hetzner):
```
Month 1-6: 50-200 clients
├─ Works flawlessly, costs $67-87/mo

Month 7-18: 200-500 clients
├─ Still working well, no changes needed

Month 19+: 500+ clients
├─ Consider upgrade to Option 5 (Supabase)
├─ But no rush, Option 2 can handle 1,000+ users
├─ Migration effort: 4-6 weeks, zero downtime possible
└─ When to migrate: When cost of Hetzner scale > cost of Supabase upgrade
```

---

## Decision Tree

```
START: "I need a customer portal"
│
├─ "I want it in 2 weeks"
│  └─ Use: Bubble (fastest MVP)
│     ⚠️  Plan migration if scaling past 500 users
│
├─ "I want the lowest cost"
│  └─ Use: Option 1 Hetzner-only ($40)
│     ⚠️  Plan migration at 100 concurrent users
│
├─ "I want to scale to 100+ customers"
│  └─ Use: Option 2 Vercel+Hetzner ($67)
│     ✓ Scales to 1,000+ without changes
│     ✓ Standard tech stack
│
├─ "I want the best long-term solution"
│  └─ Use: Option 5 Supabase+Next.js ($40-85)
│     ⚠️  More complex, but future-proof
│     ✓ Scales to 10,000+
│
└─ "I want zero maintenance"
   └─ Use: Bubble or Retool
      ✗ Bubble gets expensive
      ✗ Retool per-user pricing breaks budget
```

---

## Cost Over Time (100 Customers)

```
Option 1: Hetzner Only
Month 1-6:   $40/mo ✓
Month 7-12:  $40/mo ✓
Month 13-18: $60/mo (VPS upgrade) ⚠️
Month 19+:   $100+/mo (struggling, needs refactor) ✗

Option 2: Vercel+Hetzner
Month 1-36:  $67/mo ✓
Month 37+:   $87/mo (Hetzner upgrade for other reasons) ✓

Option 3: Bubble
Month 1:     $25/mo ✓
Month 6:     $65/mo ✓
Month 12:    $99/mo ⚠️
Month 18+:   $139/mo (or more) ✗

Option 4: Retool
At 100 users: $1,000+/mo ✗✗✗

Option 5: Supabase
Month 1-36:  $40-85/mo ✓
Month 37+:   $85-150/mo (enterprise plan if needed) ✓
```

---

## Final Scorecard

| Criteria | Winner | Score |
|----------|--------|-------|
| **Best for MVP (weeks)** | Bubble | 10/10 |
| **Best for scale (years)** | Option 2 | 9/10 |
| **Best for custom needs** | Supabase | 10/10 |
| **Best cost/perf balance** | **Option 2** | 9/10 |
| **Best for 100-500 customers** | **Option 2** | 10/10 |
| **Best for long-term** | Option 5 | 9/10 |
| **Lowest maintenance** | Bubble/Retool | 10/10 |
| **Most vendor lock-in** | Retool | 8/10 (bad) |

---

**Recommendation: Option 2 (Vercel + Hetzner)**
- Best balance of cost, performance, customization, and scalability
- Perfect for your stage (scaling from 2 to 100+ customers)
- 4-5 weeks to production, standard tech stack
- Can upgrade to Option 5 later if needed
