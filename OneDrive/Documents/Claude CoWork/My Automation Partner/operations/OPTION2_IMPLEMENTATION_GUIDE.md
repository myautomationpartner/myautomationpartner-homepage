# Option 2: Vercel + Hetzner Implementation Guide

**Status:** Ready to execute
**Effort:** 4-5 weeks, 1 engineer
**Cost:** +$27-47/month (Redis + Vercel)
**Risk Level:** Low (proven tech stack)

---

## ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                             │
│              myautomationpartner.com/dashboard                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL GLOBAL CDN                          │
│  (Next.js App, auto-scales, $0-20/month)                       │
│                                                                  │
│  ├─ Dashboard page (KPI cards, charts)                         │
│  ├─ Content Calendar page (month/week view)                    │
│  ├─ Team Management page (users table)                         │
│  ├─ Analytics page (engagement metrics)                        │
│  ├─ Settings page (logout, preferences)                        │
│  └─ API routes:                                                │
│      └─ /api/metrics → calls Hetzner                           │
│      └─ /api/calendar → calls Hetzner                          │
│      └─ /api/users → calls Hetzner                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                     HETZNER VPS                                 │
│              87.99.128.65 (running n8n + new API)              │
│                                                                  │
│  ├─ n8n workflows (unchanged)                                  │
│  ├─ Docker container: Express API server                       │
│  │   ├─ GET /api/portal/metrics/:clientId                      │
│  │   ├─ GET /api/portal/calendar/:clientId                     │
│  │   ├─ GET /api/portal/users/:clientId                        │
│  │   └─ Health check endpoint                                  │
│  │                                                              │
│  ├─ Redis instance (256MB)                                     │
│  │   └─ Cache key: "metrics:{clientId}" (TTL: 5min)           │
│  │   └─ Cache key: "calendar:{clientId}" (TTL: 5min)          │
│  │   └─ Cache key: "users:{clientId}" (TTL: 1hr)              │
│  │                                                              │
│  └─ Nginx reverse proxy                                        │
│      └─ /portal/* → Vercel (no longer proxied)                │
│      └─ /api/* → Express on :3000                             │
│      └─ / → n8n on :5679                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP
┌─────────────────────────────────────────────────────────────────┐
│                    FILLOUT/ZITE API                             │
│          tables.fillout.com/api/v1/bases/...                   │
│                                                                  │
│  ├─ Clients table (thCZdPGZ4pk)                                │
│  ├─ Users table (tfgmDJ9BFXf)                                  │
│  ├─ Metrics table (tfkftiCb4U3)                                │
│  └─ Content Calendar table                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## WEEK-BY-WEEK EXECUTION PLAN

### WEEK 1: Frontend Foundation

**Goal:** Next.js app running locally with basic pages

**Tasks:**
```
Day 1-2: Setup
  [ ] Create Next.js project: npx create-next-app@latest portal
  [ ] Install dependencies: npm i recharts axios clsx
  [ ] Set up git repo, push to GitHub
  [ ] Create .env.local for API_BASE_URL

Day 3-4: Layout & Navigation
  [ ] Create app layout (Header, Sidebar, main content)
  [ ] Build navigation component (Dashboard, Calendar, Team, Analytics)
  [ ] Set up dark mode (shadcn/ui + Tailwind)
  [ ] Create error boundary & loading states

Day 5: Dashboard page skeleton
  [ ] Create /dashboard route
  [ ] Add placeholder KPI cards (Followers, Engagement, Posts)
  [ ] Add 7-day and 30-day charts (Recharts)
  [ ] Add "Last updated" timestamp
```

**Deliverable:** GitHub repo with working Next.js app, runnable locally

**Commands:**
```bash
# Initial setup
npx create-next-app@latest portal --typescript --tailwind
cd portal
npm i recharts axios zustand next-auth

# Create folder structure
mkdir -p app/{dashboard,calendar,team,analytics,api}
mkdir -p app/_components
mkdir -p lib/{api,hooks}

# Run locally
npm run dev
# http://localhost:3000
```

---

### WEEK 2: Portal UI Components

**Goal:** All pages built with mock data, looks polished

**Tasks:**
```
Day 1-2: Dashboard page
  [ ] KPI cards component (followers, engagement, posts)
  [ ] 7-day trend chart (line chart, Recharts)
  [ ] 30-day trend chart (area chart)
  [ ] Last synced timestamp (format: "Updated 2 hours ago")
  [ ] Mobile responsive (Tailwind breakpoints)

Day 3: Content Calendar page
  [ ] Calendar component (month view, grid layout)
  [ ] Color-coded by platform (Instagram=blue, TikTok=black, Facebook=blue)
  [ ] Click post to see details (modal or sidebar)
  [ ] Filter by platform (multi-select)
  [ ] Empty state message

Day 4: Team Management page
  [ ] Users table (Name, Email, Role, Active checkbox)
  [ ] Invite user form (email, role dropdown)
  [ ] Delete user button (with confirmation)
  [ ] Mock auth context (current user logged in as)

Day 5: Analytics page
  [ ] Engagement metrics table (date, platform, likes, comments, shares)
  [ ] Engagement trend chart
  [ ] Platform comparison chart (pie/bar)
  [ ] Date range filter (last 7/14/30 days)
```

**Deliverable:** All pages visually complete, mock data only (no API calls yet)

**UI Library:** Use shadcn/ui for consistent components
```bash
# Install shadcn/ui components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
```

---

### WEEK 3: Backend API & Authentication

**Goal:** Express server on Hetzner, Vercel calling it, Redis caching

**Part A: Express API Server (Days 1-3)**

**Setup on Hetzner:**

1. **Create Node.js project:**
```bash
ssh root@87.99.128.65
cd /opt/services
mkdir portal-api
cd portal-api
npm init -y
npm install express axios ioredis dotenv cors

# Create structure
mkdir routes lib
touch server.js .env
```

2. **server.js** (main app):
```javascript
const express = require('express');
const redis = require('ioredis');
const axios = require('axios');
require('dotenv').config();

const app = express();
const redisClient = new redis({
  host: 'localhost',
  port: 6379,
  password: process.env.REDIS_PASSWORD || undefined
});

// Middleware
app.use(express.json());
app.use(require('cors')({
  origin: ['https://myautomationpartner.com', 'https://portal.myautomationpartner.com'],
  credentials: true
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Metrics endpoint
app.get('/api/portal/metrics/:clientId', async (req, res) => {
  const { clientId } = req.params;

  try {
    // Check Redis cache
    const cached = await redisClient.get(`metrics:${clientId}`);
    if (cached) {
      return res.json({
        metrics: JSON.parse(cached),
        source: 'cache',
        cachedAt: new Date()
      });
    }

    // Query Fillout API
    const response = await axios.get(
      'https://tables.fillout.com/api/v1/bases/9e604ece6abca0ed/tables/tfkftiCb4U3/records',
      {
        headers: {
          'Authorization': `Bearer ${process.env.FILLOUT_API_KEY}`
        },
        params: {
          filter: `Linked Client="${clientId}"`
        }
      }
    );

    // Extract metrics
    const metrics = response.data.records.map(r => ({
      date: r.record.Date,
      instagram: r.record.Followers_Instagram,
      tiktok: r.record.Followers_TikTok,
      facebook: r.record.Followers_Facebook
    }));

    // Cache for 5 minutes
    await redisClient.setex(
      `metrics:${clientId}`,
      300, // 5 min TTL
      JSON.stringify(metrics)
    );

    res.json({
      metrics,
      source: 'fillout',
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Metrics error:', {
      clientId,
      status: error.response?.status,
      message: error.message
    });
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch metrics'
    });
  }
});

// Similar endpoints for calendar, users...

app.listen(3000, () => {
  console.log('Portal API running on port 3000');
});
```

3. **.env** (credentials):
```
FILLOUT_API_KEY=Bearer sk_prod_...
REDIS_PASSWORD=your_redis_password
NODE_ENV=production
```

4. **Install Redis on Hetzner:**
```bash
apt update && apt install redis-server
redis-cli CONFIG SET requirepass "your_redis_password"
systemctl restart redis-server
redis-cli ping
# Should return PONG
```

5. **Run Express in Docker (via Coolify):**
```dockerfile
# portal-api/Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY server.js .
COPY routes ./routes
COPY lib ./lib

EXPOSE 3000
CMD ["node", "server.js"]
```

6. **Deploy via Coolify:**
   - In Coolify UI: Services → Add Service → Docker
   - Repository: GitHub (portal-api)
   - Dockerfile: ./Dockerfile
   - Environment: Load from .env
   - Port: 3000
   - Network: n8n internal network
   - URL: api.myautomationpartner.com/portal/ (or private URL)

**Part B: Vercel Authentication (Days 2-3)**

1. **Install NextAuth.js on Vercel:**
```bash
npm install next-auth
npm install @auth/prisma-adapter prisma @prisma/client
```

2. **Set up auth/[...nextauth].ts:**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Call Hetzner API to validate user + get clientId
        const response = await axios.post(
          'https://api.myautomationpartner.com/auth/login',
          {
            email: credentials?.email,
            password: credentials?.password
          }
        );

        if (response.status === 200) {
          return {
            id: response.data.userId,
            email: response.data.email,
            clientId: response.data.clientId,
            role: response.data.role
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

3. **Create login page:**
```typescript
// app/login/page.tsx
'use client';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    // Email + password form
    // On submit: signIn('credentials', { email, password, redirect: '/dashboard' })
  );
}
```

**Part C: Vercel API Routes (Days 3)**

1. **Create /api/metrics route:**
```typescript
// app/api/metrics/route.ts
import { getServerSession } from 'next-auth/next';
import axios from 'axios';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.clientId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401
    });
  }

  try {
    const response = await axios.get(
      `${process.env.HETZNER_API_URL}/api/portal/metrics/${session.clientId}`
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch metrics' }), {
      status: 500
    });
  }
}
```

---

### WEEK 4: Integration Testing & Optimization

**Goal:** Full end-to-end working, load test passes, ready for staging

**Tasks:**
```
Day 1-2: Connect frontend to backend
  [ ] Update Dashboard to fetch /api/metrics
  [ ] Update Calendar to fetch /api/calendar
  [ ] Update Team page to fetch /api/users
  [ ] Add loading skeletons while fetching
  [ ] Handle errors gracefully (show toast/alert)

Day 3: Load testing
  [ ] Set up Vercel Analytics dashboard
  [ ] Run concurrent user test (50 users, 5 min duration)
  [ ] Monitor Hetzner CPU/RAM during test
  [ ] Verify cache hit rates (Redis)
  [ ] Check Fillout API call count
  [ ] Measure latency p50/p95/p99

Day 4: Optimization
  [ ] If slow: Add query pagination (limit=10)
  [ ] If cache misses high: Extend TTL (10 min)
  [ ] If Fillout rate limit close: Add backoff logic
  [ ] Optimize images (Next.js Image component)
  [ ] Enable gzip compression (Vercel default)

Day 5: Security & monitoring
  [ ] Add error logging (Sentry or Vercel)
  [ ] Set up uptime monitoring (Uptime Robot)
  [ ] Verify HTTPS working
  [ ] Test CORS headers
  [ ] Verify auth middleware working
```

**Load Test Setup:**
```bash
# Using k6 (free alternative to LoadImpact)
npm install -g k6

# load-test.js
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 50, // 50 virtual users
  duration: '5m', // 5 minutes
};

export default function () {
  http.get('https://myautomationpartner.com/dashboard');
  sleep(2);
  http.get('https://myautomationpartner.com/api/metrics');
  sleep(1);
}

# Run test
k6 run load-test.js
```

---

### WEEK 5: Launch & Monitoring

**Goal:** Live in production, monitoring active, ready for customers

**Tasks:**
```
Day 1: Final checks
  [ ] Verify all pages load in < 2 seconds
  [ ] Test on mobile (iPhone + Android)
  [ ] Test all user flows (login → dashboard → calendar → logout)
  [ ] Verify data is live (not stale)
  [ ] Verify error handling (break n8n, see graceful fallback)

Day 2-3: Production deployment
  [ ] Deploy Vercel to production domain
  [ ] Deploy Express API to Hetzner production
  [ ] Update DNS CNAME for myautomationpartner.com/portal
  [ ] Test SSL certificate (https everywhere)
  [ ] Verify Redis persistence (if crashes, data survives)

Day 4: Monitoring setup
  [ ] Vercel Analytics dashboard (https://vercel.com/docs/analytics)
  [ ] Sentry error tracking (optional, free tier)
  [ ] Uptime Robot monitoring (free tier)
  [ ] Hetzner resource monitoring (CPU, RAM, disk)
  [ ] Fillout API rate limit monitoring

Day 5: Launch communications
  [ ] Notify first 5 test clients
  [ ] Send portal URL + login credentials
  [ ] Gather feedback (Google Form or Slack)
  [ ] Create FAQ/help doc (if questions)
  [ ] Plan weekly check-ins
```

**Monitoring Dashboard (Vercel):**
- Go to https://vercel.com → Project → Analytics
- Watch real-time metrics: requests/sec, response time, error rate

**Hetzner Monitoring (SSH):**
```bash
# Check CPU/RAM
top -b -n 1 | head -20

# Check disk
df -h

# Check Redis size
redis-cli info memory

# Check Express logs
docker logs portal-api
```

---

## DETAILED TECHNICAL SPECIFICATIONS

### Fillout API Rate Limit Handling

**Current approach (Week 3 code):**
- Cache all responses for 5 minutes
- If cache hits 95%+, increase TTL to 10 minutes
- If Fillout returns 429 (rate limited):
  - Catch error, return cached data even if stale
  - Log alert to Sentry
  - Email ops team

**Scaling consideration (beyond 500 clients):**
```
If avg 10 calls/minute to Fillout:
  - 50 concurrent users × 200ms latency = ~1 sec per page load
  - With cache: ~5ms per page load

Cache efficiency:
  - 100 clients, each checking dashboard = 100 misses on startup
  - 5 min TTL = 1 miss per client every 5 min
  - = 100 clients / 300 sec = 0.33 Fillout API calls/sec
  - Very safe (target: <100 calls/min)
```

### Data Flow Diagram

```
┌──────────┐
│ Browser  │ Logs in with email/password
└────┬─────┘
     │ POST /api/auth/signin
     ↓
┌──────────────────────────────────────┐
│ Vercel NextAuth                      │
│ Validates credentials                │
│ Returns JWT in httpOnly cookie       │
└────┬─────────────────────────────────┘
     │
     ↓
┌──────────────────────────────────────┐
│ Browser redirects to /dashboard      │
│ GET /api/metrics (sends JWT)         │
└────┬─────────────────────────────────┘
     │
     ↓
┌──────────────────────────────────────┐
│ Vercel API Route (/api/metrics)      │
│ 1. Verify JWT (getServerSession)     │
│ 2. Extract clientId from JWT         │
│ 3. Forward to Hetzner                │
└────┬─────────────────────────────────┘
     │ GET /api/portal/metrics/{clientId}
     ↓
┌──────────────────────────────────────┐
│ Hetzner Express Server               │
│ 1. Receive request                   │
│ 2. Check Redis cache ("metrics:xyz") │
│ 3a. If cache hit: return cached data │
│ 3b. If cache miss:                   │
│    - Query Fillout API               │
│    - Transform response              │
│    - Store in Redis (5 min TTL)      │
│    - Return to Vercel                │
└────┬─────────────────────────────────┘
     │ JSON response
     ↓
┌──────────────────────────────────────┐
│ Vercel Processes Response            │
│ Returns to browser                   │
└────┬─────────────────────────────────┘
     │
     ↓
┌──────────────────────────────────────┐
│ Browser Renders Dashboard            │
│ Charts show metrics over time        │
│ "Last updated: 2 hours ago"          │
└──────────────────────────────────────┘
```

---

## ENVIRONMENT VARIABLES

### On Vercel (Project Settings → Environment Variables)
```
NEXTAUTH_SECRET=<random 32-char string> # openssl rand -base64 32
NEXTAUTH_URL=https://myautomationpartner.com
HETZNER_API_URL=https://api.myautomationpartner.com
FILLOUT_API_KEY=Bearer sk_prod_...
```

### On Hetzner (.env file in portal-api)
```
FILLOUT_API_KEY=Bearer sk_prod_...
REDIS_PASSWORD=<strong_password>
NODE_ENV=production
PORT=3000
```

---

## DEPLOYMENT CHECKLIST

- [ ] GitHub repo created with portal code
- [ ] Vercel account connected to GitHub
- [ ] Express API Docker image built
- [ ] Coolify configured to deploy Express
- [ ] Redis instance running on Hetzner
- [ ] Nginx reverse proxy updated (if needed)
- [ ] SSL certificates valid (Cloudflare)
- [ ] Environment variables set on Vercel
- [ ] Environment variables set on Hetzner
- [ ] Database migration (if any) completed
- [ ] Load test passed (50 concurrent users)
- [ ] Error handling tested (graceful degradation)
- [ ] Monitoring tools active
- [ ] Uptime monitoring enabled
- [ ] On-call rotation documented
- [ ] Rollback procedure documented

---

## ROLLBACK PROCEDURE

If something breaks in production:

```bash
# Vercel (instant)
# 1. Go to Vercel Dashboard
# 2. Click "Deployments"
# 3. Find last known good deployment
# 4. Click "Rollback to this deployment"

# Hetzner (via Docker)
# 1. SSH to server: ssh root@87.99.128.65
# 2. Check recent commits: git log --oneline -10
# 3. Revert to known good: git revert <bad_commit_hash>
# 4. Redeploy in Coolify: Trigger manual deploy
# 5. Monitor: docker logs portal-api -f
```

---

## COST ESTIMATE

| Service | Cost | Notes |
|---------|------|-------|
| Hetzner VPS | $40/mo | Unchanged (n8n only) |
| Vercel | $0-20/mo | Free for <100k req/mo, $20 Pro after |
| Redis 256MB | $7/mo | Hetzner cloud (managed) |
| Fillout/Zite | $19/mo | Unchanged |
| Cloudflare R2 | $1/mo | Unchanged |
| **TOTAL** | **$67-87/mo** | Scales to 1,000+ concurrent |

**Per customer cost (100 clients):** $0.67/customer/month for portal infrastructure

---

## SUCCESS METRICS

After launch:
- [ ] Portal load time < 2 seconds (p95)
- [ ] API error rate < 0.1%
- [ ] Uptime > 99.5%
- [ ] Fillout API calls never exceed rate limit
- [ ] Redis cache hit rate > 80%
- [ ] Customer satisfaction (feedback form) > 4/5

---

**Ready to execute?** Follow the week-by-week plan above. Expected delivery: Production live in 5 weeks.
