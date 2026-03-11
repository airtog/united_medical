# FX3 Media — Zee Pools Project: Complete Knowledge Base
*Agency reference document — bring into any AI session for full context*
*Last updated: March 3, 2026*

---

## What This Is

This document captures everything built for Zee Pools (Dr. Zee Pool Installation, NJ) — the full technical stack, architectural decisions, painful lessons learned, deployment workflow, and strategic positioning. Use this to onboard any AI assistant (Antigravity, Claude Code, CoWork, Claude, etc.) on a new client engagement so you can move fast without relitigating decisions already made.

---

## The Client

**Client:** Dr. Zee Pool Installation
**Domain:** zeepools.com
**Location:** New Jersey
**Business:** Pool installation, hardscaping, repairs, opening/closing services
**Revenue tier:** $1M–$5M contractor
**Google Ads account:** Existing account (kept — has historical Quality Score value)
**GA4 Measurement ID:** `G-0VB1RBDTFD`
**Google Ads Conversion ID:** `AW-11470804910`

---

## The Stack (Non-Negotiable for This Project)

This is a four-component modern web stack. It is **not frankensteinish** — this is industry-standard practice.

```
Sanity CMS          — Content management, project data, all portfolio metadata
GitHub              — Version control, source of truth for code
Cloudflare Pages    — Hosting, global CDN, auto-deploys from GitHub pushes
Cloudflare Stream   — Video hosting and delivery
Anthropic API       — AI content generation (project titles, descriptions, tags)
Web3Forms           — Contact form submissions and email routing
Google Analytics 4  — Traffic and behavior tracking
Google Ads          — PPC campaign management
```

### How They Connect

```
Local Mac (Tog)
  ↓ runs import script
  ↓ uploads photos → Sanity CDN
  ↓ generates content via Anthropic API
  ↓ saves metadata to Sanity CMS

GitHub (airtog/zee-pools or equivalent)
  ↓ Cloudflare Pages auto-deploys on every git push (~30 seconds)

Live site (zeepools.com)
  → fetches project data from Sanity CDN at runtime
  → serves videos from Cloudflare Stream
  → form submissions go to Web3Forms → Zee's email
  → GA4 fires on page load + key events
  → Google Ads conversion tag fires on form submission
```

**Key principle:** The import script runs locally on Tog's Mac. The live website fetches content from cloud services. You do NOT need to redeploy the site to update content — only code changes require a deployment.

---

## Tech Architecture Decisions & Why

### Static HTML/CSS/JS (Not React)
The Zee Pools site is **vanilla HTML/CSS/JS** served via Python HTTP server in development and Cloudflare Pages in production. This was a deliberate choice:

- Simpler than React for a primarily content site
- No build step complexity
- Faster time-to-launch
- Any developer can maintain it

**Do NOT migrate this to React.** If a new project starts fresh, the same decision should be made deliberately.

### Sanity as Headless CMS
Sanity was chosen because:
- API-first — the site queries it directly at runtime
- Excellent image CDN built in
- Can be updated without redeploying the site
- AI import pipeline writes to it programmatically

**Sanity Project for Zee Pools:** `n3xcp6bs` (production dataset)
**API endpoint pattern:** `https://n3xcp6bs.api.sanity.io/v2024-01-01/data/query/production?query=*[_type == "project"]`

### Cloudflare Pages (Not Vercel, Not Netlify)
- Better global CDN performance
- Free tier is excellent
- Integrates cleanly with Cloudflare DNS (which you also use for the domain)
- Auto-deploys from GitHub on push

**Live URL:** `zee-pools-website.pages.dev` (Cloudflare internal)
**Production URL:** `zeepools.com` (custom domain, added in Pages → Custom Domains)

### Global Shared Components (Critical Architecture Decision)
After shipping the initial site with nav/footer/CTA copy-pasted across every page, we refactored to **fetch-based shared components**. This is not optional — it is the only sane way to maintain a multi-page static site.

**Implementation:** Four HTML component files loaded via JavaScript `fetch()` in `main.js`:
- `header.html` — navigation bar (desktop + mobile)
- `footer.html` — footer links, contact, social
- `cta.html` — call-to-action section (customizable per page via data attributes)
- `contact-modal.html` — the contact form overlay

**Per-page CTA customization** uses data attributes on the container element:
```html
<div id="cta-container"
  data-title="Custom Headline Here"
  data-subcopy="Supporting copy for this specific page"
  data-bg="/images/page-specific-bg.jpg">
</div>
```

**Why this matters:** Before this refactor, changing the phone number meant editing 10 files. After, it's one file. NEVER go back to copy-paste architecture.

---

## The AI-Powered Import Pipeline

This is the core competitive advantage of FX3 Media's contractor website system.

### What It Does
1. Reads a folder of project photos (organized by project folder, named descriptively)
2. Sends photos to Anthropic's API (Claude vision) for analysis
3. Generates: SEO-optimized project title, 2–3 paragraph description, tags, location data
4. Selects the optimal cover image (landscape orientation preferred, most visually compelling)
5. Uploads all images to Sanity CDN
6. Uploads videos to Cloudflare Stream
7. Creates complete project records in Sanity CMS

### Results for Zee Pools
- **22 projects** imported with AI-generated content
- Each project has: title, description, tags, location, cover image, full gallery
- All content is SEO-optimized and written in a professional contractor voice
- Import took a fraction of the time manual data entry would have

### Intelligent Features Built In
- **Manifest tracking** — prevents duplicate imports if you run the script twice
- **Folder naming validation** — catches malformed folder names before upload
- **HEIC → JPEG conversion** — handles iPhone photos automatically
- **Orientation detection** — prefers landscape images for cover photos
- **Error recovery** — partial failures don't corrupt existing records

### Running an Import
```bash
# From the project directory on Tog's Mac
node import-projects.js ./client-photos-folder/
```

The script reads folder structure, processes each project folder, and creates/updates Sanity records. Run locally — never try to run this in CI/CD.

---

## File Structure (Zee Pools)

```
zee-pools/
├── v1/                         # Site source code
│   ├── index.html              # Homepage
│   ├── projects.html           # Portfolio page (filterable)
│   ├── services/
│   │   ├── inground-pools.html
│   │   ├── semi-inground-pools.html
│   │   ├── above-ground-pools.html
│   │   ├── pool-sales.html
│   │   ├── hardscaping.html
│   │   ├── repairs.html
│   │   ├── opening-closing.html
│   │   └── PROMPT.md           # Antigravity prompt for service pages
│   ├── components/
│   │   ├── header.html         # Shared nav (loaded via fetch)
│   │   ├── footer.html         # Shared footer (loaded via fetch)
│   │   ├── cta.html            # Shared CTA section
│   │   └── contact-modal.html  # Shared contact form modal
│   ├── css/
│   │   ├── main.css            # Global styles, CSS variables
│   │   ├── projects.css        # Portfolio page styles
│   │   └── [page].css          # Per-page stylesheets
│   ├── js/
│   │   └── main.js             # Component loader + site JS + all event tracking
│   └── images/
├── import-scripts/             # AI import pipeline
│   ├── import-projects.js
│   └── manifest.json           # Tracks imported projects
└── .cloudflare/                # Cloudflare Pages config
```

---

## Service Pages Architecture

Seven service pages, each built to the same template pattern:

| Page | Slug | Purpose |
|---|---|---|
| Inground Pools | `/services/inground-pools.html` | Primary offering, highest AOV |
| Semi-Inground Pools | `/services/semi-inground-pools.html` | Companion page, cross-links to above |
| Above Ground Pools | `/services/above-ground-pools.html` | Entry-level option |
| Pool Sales | `/services/pool-sales.html` | Product/equipment sales |
| Hardscaping | `/services/hardscaping.html` | Patios, decking, landscaping |
| Repairs | `/services/repairs.html` | Service/maintenance |
| Opening & Closing | `/services/opening-closing.html` | Seasonal services |

**Important:** Inground and semi-inground pages cross-link to each other — they serve different market segments and create a natural content hub. Do not merge them.

**Content pattern per service page:**
- Hero with real project photo from Sanity CDN
- Feature cards (3–4 key selling points)
- Process steps (how we work)
- FAQ section (great for SEO)
- CTA section (customized per page)
- Related projects gallery (pulled from Sanity by tag)

**How to build a new service page with Antigravity:**
Use a PROMPT.md file in the services folder. Tell Antigravity: *"Read v1/services/PROMPT.md and build [page-name].html"*. Do NOT paste large formatted prompts directly into Antigravity — it causes formatting corruption.

---

## Contact Form (Web3Forms)

**Access key:** `dab222e5-2f09-4ad1-a91b-dc341d57a574`
**Form name:** Zee Pools
**Submission destination:** Zee's business email
**Reply-to:** Set to the form submitter's email (replies go back to the customer)

**How it works:**
- Form submits to Web3Forms API
- Web3Forms sends notification email to Zee
- Reply-to is set dynamically so Zee can reply directly to the customer
- No backend required

**Launch status:** Contact form tested and confirmed working end-to-end. Submissions arrive in Zee's inbox and reply-to is correctly set to the form submitter's email so Zee can reply directly to customers. No allowlist configuration was needed.

---

## Google Analytics 4

**Measurement ID:** `G-0VB1RBDTFD`
**Account:** Created fresh for this project (the old overseas group account was inaccessible and useless anyway — old site data doesn't carry over)
**Account owner:** Zee (invited Tog as Admin)

### Events Tracked
| Event | Type | Trigger |
|---|---|---|
| `page_view` | Standard | Auto-fires on every page load |
| `generate_lead` | Key Event (Primary) | Contact form successful submission |
| `phone_call_click` | Key Event (Secondary) | Any click on a `tel:` link |

### Key Event Setup
1. GA4 → Admin → Events → find the event → toggle the star → mark as Key Event
2. Do this for both `generate_lead` and `phone_call_click`
3. Wait 24 hours for GA4 to process — this is normal, not a bug

### Linking GA4 to Google Ads
GA4 → Admin → Google Ads Links → Link account → select Zee's Ads account

---

## Google Ads

**Decision:** Keep the existing Ads account (do NOT start fresh)
**Reason:** Quality Scores, conversion history, and campaign learning are worth real money. Starting over means Google treats you like a brand new advertiser — higher CPCs, slower performance.

**Tog's access level:** Administrator

**Google Ads Conversion ID:** `AW-11470804910` (discovered during CoWork implementation — this tag was originally set up in April 2024 and had been sitting broken since the Wix migration)

### Conversion Actions
| Conversion | Source | Priority |
|---|---|---|
| `generate_lead` | Imported from GA4 | Primary |
| `phone_call_click` | Imported from GA4 | Secondary |
| Legacy Ads conversion tag | `AW-11470804910` wired directly into main.js form handler | Supplemental |

**Setup path:** Ads → Goals → Conversions → New conversion action → Import → Google Analytics 4 → select property → import both events

### Google Ads Tag Implementation
The Google Ads config tag (`gtag('config', 'AW-11470804910')`) was added to all 11 HTML pages. The conversion event also fires from the form success handler in `main.js`. CoWork discovered this existing tag during implementation — always audit existing Ads accounts for orphaned conversion tags before setting up new ones.

### "Needs Attention" Status
After wiring in the conversion tag, the Ads conversion action may show "Needs attention" status for 24–48 hours while Google verifies the tag is firing. This clears once Google detects live conversion signals.

### Confirming Conversion Sync (24-Hour Follow-Up)
After GA4 and Ads are linked, check: Google Ads → Goals → Conversions → Summary and confirm `generate_lead` and `phone_call_click` have auto-synced from GA4. When they appear, set `generate_lead` as Primary and `phone_call_click` as Secondary if not already configured.

### After DNS Flip
Update all campaign destination URLs from the old site to `zeepools.com`. The old Wix URLs will 404.

---

## DNS and Domain (Cloudflare)

**Domain:** zeepools.com (registered through GoDaddy)
**DNS managed by:** Cloudflare (nameservers changed from GoDaddy's to Cloudflare's)

### DNS Records That Matter
```
CNAME   @       zee-pools-website.pages.dev    Proxied
CNAME   www     zee-pools-website.pages.dev    Proxied
```

**DO NOT touch:** MX records and TXT records — those handle Zee's email. Touch those and you kill his email.

### Cloudflare Pages Setup
The custom domain must be added in **two places** — this is a common source of confusion:

1. **Cloudflare DNS** — CNAME record pointing to Pages deployment
2. **Cloudflare Pages → Project → Custom Domains** — `zeepools.com` added and activated

If you only do #1, the domain points to Cloudflare but Pages doesn't know it's supposed to serve the site. Both steps are required.

### AI Crawler Setting
When setting up the domain in Cloudflare: **"Block only on hostnames with ads"** — this is the right setting for a contractor site running Google Ads.

### Domain Lock (GoDaddy)
Turn off Domain Lock to change nameservers. Turn it back ON after Cloudflare confirms nameservers are active. Do not forget to re-enable it.

---

## Deployment Workflow

```
1. Make code changes locally
2. Test in browser (localhost or Pages preview URL)
3. When satisfied: git add . && git commit -m "description" && git push
4. Cloudflare auto-deploys in ~30 seconds
5. Verify on zee-pools-website.pages.dev (or zeepools.com after DNS flip)
```

**Antigravity mode:** Use **Agent-Assisted** mode, NOT Agent-Driven. The difference:
- Agent-Assisted: Antigravity makes changes, waits for Tog to approve before pushing
- Agent-Driven: Antigravity pushes every single change automatically (do not use this)

**Correct Antigravity instruction:** *"Make the changes but wait for me to review in the browser before pushing to GitHub."*

---

## Mobile Navigation — Critical Bug Fix (Document This Forever)

The Zee Pools mobile nav had two separate bugs that both needed fixing:

### Bug 1: Homepage — Overlay Blocking Clicks
**Symptom:** Tapping anywhere on the homepage closed the menu or triggered nothing
**Root cause:** `.mobile-overlay` CSS was scoped inside a media query, causing `display: block` at wider viewports — the invisible overlay intercepted all clicks
**Fix:** Ensure `.mobile-overlay` defaults to `display: none` outside of `nav-open` state at ALL viewport sizes

### Bug 2: Inner Pages — Nav Links Invisible
**Symptom:** On `projects.html` and other inner pages, mobile menu opened but links were invisible (dark text on dark background)
**Root cause:** `projects.css` was applying `backdrop-filter` without the necessary `nav-open` override, AND the nav link color was not being overridden to white for the dark mobile drawer
**Fix:** In `projects.css`, wrap desktop-specific nav styling in `@media (min-width: 768px)` and add explicit white text override for mobile:

```css
@media (max-width: 767px) {
  nav .nav-links a {
    color: #ffffff !important;
  }
}
```

### Debugging Protocol That Works
1. Hard refresh (Ctrl+Shift+R) before testing — never trust cached CSS
2. Use Chrome DevTools to inject CSS directly into the live page first
3. Only after confirming the fix works in-browser, then modify the actual file
4. Check BOTH homepage AND inner pages after any nav change — they have separate CSS files

---

## How to Debug With CoWork / Claude in Chrome

CoWork with browser access is the fastest way to debug responsive design, live site issues, and verifying analytics tags are firing.

**Effective pattern for CSS/layout issues:**
```
1. Resize window to mobile: resize_window(390, 844)
2. Take screenshot to see current state
3. Use javascript_tool to inspect computed styles:
   getComputedStyle(document.querySelector('.nav')).color
4. Inject CSS fix directly: document.createElement('style') → document.head.appendChild()
5. Screenshot again to confirm fix
6. Then and only then update the actual file
```

**For Sanity data extraction:**
```javascript
// Direct API query to get all project metadata
fetch('https://n3xcp6bs.api.sanity.io/v2024-01-01/data/query/production?query=*[_type == "project"]')
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d.result)))
```

**For image URLs from Sanity:**
Use `read_network_requests` tool, filter for "sanity" — the CDN URLs appear in network traffic and can be used directly in HTML.

**For verifying analytics tags:**
CoWork can fire `gtag` events programmatically via `javascript_tool` to confirm they land in GA4 Realtime without submitting real forms or generating fake leads. This is the preferred verification method — it's non-destructive and instant.

```javascript
// Test fire a GA4 event
gtag('event', 'generate_lead', { method: 'contact_form' });
// Then check GA4 Realtime → Events to confirm it appears
```

---

## Analytics & Ads Implementation — What CoWork Did (March 2026)

This section documents the full GA4 + Google Ads tracking setup completed via CoWork. Reference for future clients.

### The Situation Going In
- Site live at zeepools.com but zero working analytics or conversion tracking
- Old overseas dev group owned the previous GA4 property and wouldn't transfer it
- Existing Google Ads account had an orphaned conversion tag (`AW-11470804910`) from April 2024 that had been broken since the Wix migration

### What Was Implemented
1. Fresh GA4 property created — `G-0VB1RBDTFD` — Zee as owner, Tog as admin
2. GA4 tag installed across all 11 HTML pages via `<script>` in `<head>`
3. `generate_lead` event wired to contact form success handler in `main.js`
4. `phone_call_click` event wired to all `tel:` link click handlers
5. Both marked as Key Events in GA4 Admin
6. GA4 linked to Google Ads account
7. CoWork audited the existing Ads account and discovered orphaned tag `AW-11470804910`
8. Google Ads config tag added to all 11 pages
9. Ads conversion event added to form success handler alongside `generate_lead`
10. Both events confirmed firing in GA4 Realtime

### CoWork Verification Method
CoWork fired events programmatically via JavaScript `gtag` calls directly in the browser — it did NOT submit the real contact form. This means no fake test emails were sent to Zee. Real end-to-end form test (fill out and submit on zeepools.com) should be done manually to confirm Web3Forms routing before marking fully complete.

### Key Takeaway for Future Clients
**Always audit the existing Google Ads account for orphaned conversion tags before setting up anything new.** A tag that's been sitting broken for a year can be recovered and wired back in — don't create duplicates. CoWork found this one by inspecting the existing Ads account's Goals → Conversions section.

---

## Service Pages — How Prompts Were Written for Antigravity

The key insight: **do not paste large formatted prompts into Antigravity**. Formatting gets corrupted and the output degrades.

**Correct approach:**
1. Create a `PROMPT.md` file in the relevant directory
2. Include all copy, photo URLs, specifications in the markdown file
3. Tell Antigravity: *"Read v1/services/PROMPT.md and build repairs.html"*

The PROMPT.md for Zee Pools service pages included:
- Exact Sanity CDN photo URLs (extracted via network request monitoring)
- Complete copywritten headlines, body text, FAQs
- Design system specs (CSS variable names, typography classes)
- Component patterns from existing pages to match
- Cross-linking instructions between related pages

---

## What We Learned — Lessons That Apply to Every Client

### 1. The Stack Is Right — Stop Second-Guessing It
Sanity + GitHub + Cloudflare Pages + Cloudflare Stream is not frankensteinish. It is the correct modern stack for agency-built contractor websites. Every piece has a clear job. Use it for every new client.

### 2. Always Refactor to Global Shared Components First
Before building inner pages, extract nav/footer/CTA into shared components. Doing it later is painful and error-prone. Do it at the start of every project.

### 3. The AI Import Pipeline Is the Business
The ability to take a folder of contractor photos and produce a professional 22-project portfolio in hours is the core value proposition of FX3 Media. Protect this pipeline, improve it, never let a client see how it works.

### 4. Position as "We Handle Everything"
Clients do not need to know about Sanity, Cloudflare, Anthropic, or any of the AI automation. The message is: *"We handle everything — you just keep doing your work."* This positioning commands higher fees and creates less friction than a technical explanation.

### 5. PROMPT.md Files, Not Clipboard Pastes
When directing Antigravity to build complex pages, write everything into a markdown file in the project and reference it. Pasting large formatted text into AI tools degrades quality.

### 6. Antigravity Agent-Assisted Mode Only
Agent-Driven mode will push every change automatically. For client projects with real live sites, this is too risky. Always use Agent-Assisted and manually approve pushes after browser verification.

### 7. CSS Isolation Between Pages Is a Trap
Page-specific CSS files that don't account for shared components (especially nav) will cause subtle bugs. The mobile nav on inner pages broke because `projects.css` overrode styles without compensating for the mobile drawer state. Always test nav behavior on EVERY page after CSS changes, not just the homepage.

### 8. DNS Has Two Steps With Cloudflare Pages
Setting up a custom domain with Cloudflare Pages requires adding the domain in BOTH the DNS settings AND the Pages project's Custom Domains tab. Missing either step means the site won't serve on the custom domain.

### 9. Keep the Google Ads Account — Never Start Fresh
An existing Ads account with history is worth real money. Quality Scores and conversion history lower CPCs and accelerate the learning algorithm. Only create a fresh GA4 Analytics property (old site data is irrelevant anyway), but keep the Ads account.

### 10. Hard Refresh Before Trusting What You See
During debugging, always do a hard refresh (Ctrl+Shift+R) before concluding something is broken or fixed. Stale cached CSS has caused more wasted time than any actual bug.

### 11. Audit Existing Ads Accounts for Orphaned Tags
Before setting up new conversion tracking, always inspect the existing Google Ads account for conversion tags that may already exist but are broken. A previous developer may have set up valid tags years ago — recovering them preserves any historical signal. CoWork found a broken tag from April 2024 that just needed to be wired into the new site's pages and form handler.

### 12. CoWork Fires Tags Programmatically — Do a Manual Form Test Too
CoWork verifies analytics events by firing `gtag` calls directly in the browser, which confirms GA4 is receiving the signal. However, this does NOT test the full form submission pipeline (Web3Forms → email routing). Always do one real manual form submission on the live domain to confirm the full end-to-end flow before handoff.

---

## Contacts and Access Summary

| Service | Account | Access |
|---|---|---|
| zeepools.com domain | GoDaddy (Zee) | Tog manages DNS via Cloudflare |
| Cloudflare | Tog's account | zee-pools-website project |
| Sanity CMS | Tog's account | Project ID: n3xcp6bs |
| GitHub | airtog organization | zee-pools repository |
| Google Analytics | Zee's Google account | Tog as Admin, ID: G-0VB1RBDTFD |
| Google Ads | Zee's account | Tog as Admin, Conversion ID: AW-11470804910 |
| Web3Forms | Tog's account | Key: dab222e5-2f09-4ad1-a91b-dc341d57a574 |

---

## Checklist: Launching a New Client Site (Based on Zee Pools)

Use this for every new FX3 Media contractor client:

**Setup (Week 1)**
- [ ] Clone Zee Pools codebase as starting template
- [ ] Create new Sanity project (get new project ID)
- [ ] Create new GitHub repository
- [ ] Connect GitHub repo to Cloudflare Pages
- [ ] Set up Web3Forms form (new key per client)
- [ ] Run AI import pipeline on client's project photos
- [ ] Verify portfolio loads correctly on Pages preview URL

**Architecture (Before Inner Pages)**
- [ ] Extract header/footer/CTA/modal into shared components
- [ ] Test component loading on at least 3 pages
- [ ] Confirm mobile nav works on homepage AND an inner page
- [ ] Set up per-page CTA data attributes

**Content (Week 2)**
- [ ] Build all service pages using PROMPT.md → Antigravity workflow
- [ ] Set up Web3Forms with client's email
- [ ] Test form submission end-to-end (real submission, not just programmatic)
- [ ] Review and approve all AI-generated project content

**Analytics & Ads (After Design Complete)**
- [ ] Audit existing Google Ads account for orphaned conversion tags first
- [ ] Create fresh GA4 property (client as owner, Tog as admin)
- [ ] Install GA4 tag across all pages
- [ ] Set up `generate_lead` event on form success
- [ ] Set up `phone_call_click` event on all tel: links
- [ ] Mark both as Key Events in GA4
- [ ] Link GA4 to Google Ads account
- [ ] Wire existing or new Google Ads conversion tag into all pages + form handler
- [ ] Use CoWork to programmatically verify both events fire in GA4 Realtime
- [ ] Import both as conversion actions in Ads
- [ ] Set primary/secondary conversion priorities

**Launch**
- [ ] Point domain to Cloudflare (change nameservers)
- [ ] Add custom domain in Cloudflare Pages (both DNS AND Pages project)
- [ ] Disable Domain Lock → change nameservers → re-enable Domain Lock
- [ ] Update all Google Ads destination URLs to new domain
- [ ] Test live form submission on production domain
- [ ] Verify GA4 realtime shows page_view firing
- [ ] Verify phone click events firing in realtime
- [ ] Wait 24 hours → confirm Key Events processing → import to Ads
- [ ] Check Ads → Goals → Conversions → Summary to confirm GA4 conversions synced

**Handoff**
- [ ] Send client the live URL
- [ ] Document all credentials in agency password manager
- [ ] Update agency knowledge base with client-specific notes

---

## Roadmap for Zee Pools (Remaining Work)

As of March 3, 2026, the following are complete:
- ✅ 22 projects imported with AI-generated content
- ✅ Filterable portfolio page live
- ✅ Global shared components (nav, footer, CTA, modal)
- ✅ Mobile navigation fixed (homepage + inner pages)
- ✅ Web3Forms contact form integrated and tested end-to-end
- ✅ All service pages built
- ✅ Domain live at zeepools.com via Cloudflare
- ✅ GA4 installed and firing (ID: G-0VB1RBDTFD)
- ✅ Conversion events set up (generate_lead, phone_call_click)
- ✅ Both marked as Key Events in GA4
- ✅ GA4 linked to Google Ads
- ✅ Google Ads destination URLs updated to zeepools.com
- ✅ Google Ads conversion tag (AW-11470804910) wired into all 11 pages + form handler
- ✅ All tags confirmed firing in GA4 Realtime via CoWork

**Next 24–48 hours:**
- Check Google Ads → Goals → Conversions → Summary to confirm `generate_lead` and `phone_call_click` synced from GA4
- Set `generate_lead` as Primary, `phone_call_click` as Secondary
- Cancel Wix subscription (no longer needed)

**Ongoing:**
- Monitor GA4 for conversion data (first data has 24–72 hour delay)
- Review Ads performance after conversion data accumulates (1–2 weeks)
- Consider adding more projects as Zee completes new installs

---

*This document is FX3 Media proprietary agency knowledge. Do not share externally.*
*Bring this file into any AI session (Antigravity, Claude, CoWork, Claude Code) to provide full project context.*
