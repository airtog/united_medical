# BBCM Tracker — Platform Context
*Bring this file into any new Claude project for full context*

---

## What This Is
A construction project tracking platform built by Tog (FX3 Media agency). Builders upload an Excel file → clients get a live, branded dashboard URL showing budget, line items, change orders, and weekly progress.

**Live URL:** `bbcm-tracker.fx3labs.io`
**Admin login:** `admin / bbcm2025` (hashed in Supabase)
**GitHub repo:** `github.com/airtog/tracker` (private)

---

## Business Model
- **Two revenue streams:**
  1. Bundled with FX3 agency retainer (website + tracker)
  2. Standalone SaaS — $1,500 setup fee + $149/month per builder
- **White-glove onboarding** — Tog maps each builder's Excel to TRACKER DATA format (2-4 hours per builder)
- **Target market** — $1M–$5M residential contractors, remodelers, specialty builders (pools, additions, kitchens)
- **Current pilot** — Bill Briguglio, B&B Construction Management, NJ

---

## Tech Stack
- **Frontend:** React + Vite (v2 folder)
- **Database:** Supabase (project: `tkvhjusiawzggdlfckpb`)
- **Hosting:** Vercel (auto-deploys on git push to main)
- **Auth:** SHA-256 hashed password in `admin_settings` Supabase table
- **Key dev:** Antigravity (AI coding assistant)

---

## Database Schema (Key Tables)
```
builders          — one row per builder (name, company, email, city, state)
clients           — homeowners, linked to builder_id
projects          — linked to client_id, has city/state/zip, tracker URL slug
uploads           — Excel upload history per project
project_line_items — parsed line items from Excel
project_change_orders — parsed COs from Excel
project_weekly_summaries — parsed weekly spend data
tracker_views     — logs every client view (for investor metrics)
admin_settings    — username + password_hash for login
```

**Research views:**
- `v_projects_full` — all projects with builder + client info joined
- `v_category_benchmarks` — avg/min/max cost by category, city, project type
- `v_change_order_stats` — CO frequency by project type and location

---

## Excel Template — TRACKER DATA Sheet Structure
The parser reads a sheet called **TRACKER DATA** with 4 sections:

### Section 1 — PROJECT SUMMARY (key-value pairs)
| Key | Value |
|---|---|
| Client Name | |
| Address | |
| Project Type | |
| Project Manager | |
| Start Date | |
| Est. Completion | |
| Total Weeks | |
| Current Week | |
| Base Hard Costs | |
| Change Orders Total | |
| CM Fee % | |
| Total Project Budget | |
| Spent to Date | |
| Remaining Budget | |
| GC Equivalent (25% avg) | *(optional — Bill's CM model only)* |
| Estimated Savings vs GC | *(optional — Bill's CM model only)* |

### Section 2 — LINE ITEMS
| Category | Item | Budget | Status | Spent to Date |
|---|---|---|---|---|

**Valid status values:** `Complete`, `In Progress`, `Ordered`, `Scheduled`, `Pending`, `Pending Approval`

**Standard categories:**
- Management & Supervision
- Cabinets & Installation
- Countertops & Backsplash
- Demo & Prep
- Cleanup & Disposal
- Appliances
- Flooring
- Electrical
- Plumbing
- Windows
- Misc & Inspections

### Section 3 — CHANGE ORDERS
| CO # | Description | Amount | Status | Date |

### Section 4 — WEEKLY SUMMARY
| Week # | Week Ending | Amount Spent | Cumulative |

---

## How the Parser Works
- `parseWorkbook()` in `TrackerPublic.jsx` reads the uploaded Excel
- `safeNum()` helper handles zero values and empty cells
- Categories roll up — status priority: In Progress > Ordered > Scheduled > Pending > Complete
- CSS classes use kebab-case of status (e.g. `in-progress`, `complete`)
- **DO NOT replace parseWorkbook()** — it's the data layer everything depends on

---

## Deployment Pipeline
```
Antigravity makes code changes
→ Accept all changes in Antigravity
→ git add . && git commit -m "description" && git push
→ Vercel auto-deploys in ~14 seconds
→ Live at bbcm-tracker.fx3labs.io
```

**Environment variables in Vercel:**
- `VITE_SUPABASE_URL` = `https://tkvhjusiawzggdlfckpb.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = (long key — check .env file in v2 folder)

---

## Multi-Tenant Architecture (Current State)
- **One Vercel deployment** serves all builders
- **One Supabase project** holds all data
- Each builder = one row in `builders` table
- Each client tracker URL = unique slug (e.g. `/p/kitchen-project-ubk67y`)
- **NOT YET BUILT:** Superadmin tier + builder-scoped logins
- Currently: one shared `admin/bbcm2025` login (fine for pilot with Bill only)

**When onboarding builder #2:** Build superadmin tier first
- `role` column on `admin_settings` (superadmin vs builder)
- `builder_id` on `admin_settings`
- RLS policies scoped by builder_id
- Separate superadmin dashboard

---

## Onboarding a New Builder — Steps
1. Log into admin at `bbcm-tracker.fx3labs.io`
2. Create builder record in Supabase `builders` table
3. Create client record linked to builder_id
4. Create project linked to client
5. Map builder's existing Excel to TRACKER DATA format (one-time)
6. Upload Excel → system generates tracker URL
7. Builder sends URL to their client

**For each new builder subdomain:**
- Add CNAME record in GoDaddy (fx3labs.io): `[buildername]` → `cname.vercel-dns.com`
- Add domain in Vercel → Settings → Domains

---

## Key Files
| File | Purpose |
|---|---|
| `v2/src/pages/TrackerPublic.jsx` | Public tracker view + parser |
| `v2/src/pages/Login.jsx` | Admin login with Remember Me |
| `v2/src/App.jsx` | Auth flow, session management |
| `v2/src/pages/Settings.jsx` | Password change UI |
| `v2/public/BBCM_Project_Tracker_TEMPLATE.xlsx` | Blank template for builders |

---

## Investor Metrics Being Captured
- `tracker_views` table logs every client view (project_id, session_id, viewed_at)
- Can query: total builders, total projects, uploads per builder, view frequency
- Start capturing now — can't backfill

---

## Roadmap (Prioritized)
1. **Next:** Superadmin tier before onboarding builder #2
2. **Builder dashboard** — active projects, budget in flight, spent to date (data already in `v_projects_full`)
3. **Line item entry UI** — type line items directly in admin (removes Excel dependency)
4. **Google Sheets integration** — auto-sync from builder's live sheet via API
5. **Supplier/notes fields** — `supplier` + `notes` columns on line items for research data
6. **Payment/subscription** — Stripe integration for $149/month billing

---

## Current Pilot Status
- **Bill Briguglio** — B&B Construction Management, NJ
- **Active project:** Harrington Family Kitchen Renovation
- **Tracker URL:** `/p/kitchen-project-ubk67y` (or similar)
- **Admin domain:** `bbcm-tracker.fx3labs.io`
- **Bill's domain:** `tracker.bbconstructionmanagement.com` (pending — Cloudflare access issue)

---

*Last updated: Session 3 — February 2026*
