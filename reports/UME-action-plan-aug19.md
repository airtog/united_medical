# UME — What I Fixed, What's Left, What Needs Your Approval
**August 19, 2026**

---

## Part 1 — Shipped to the repo (verified, ready to deploy)

All 32 changed files are on your disk. `node build.js --check` passes. 141 automated
checks pass against the real repo.

### 1. Canonical URLs — the big one
Cloudflare Pages serves this site extensionless and 301s the `.html` form to it.
Every canonical tag still pointed at the `.html` form, i.e. at a URL that redirects
away from itself. **21 of 23 pages.** The sitemap had the same defect (20 of 22).

Every page was telling Google "the real me is somewhere else." Result: the homepage
ranked as **two separate pages** (www 71 clicks / non-www 58 clicks), location pages
split across `.html` and extensionless twins, and `/appointments` never got indexed.

Fixed: all canonicals and `og:url` tags are now extensionless, self-referencing, and
on one host (`https://unitedmedicalexams.com`, matching your sitemap and robots.txt).

**This is now enforced in `build.js`, not hand-maintained.** It derives from the file
path on every build, so it cannot drift again — same pattern as the asset-hash tokens.

### 2. 713 internal links pointed at redirects
Every internal link used `/foo.html`, so every internal click and every crawl hop
went through a 301. Wasted crawl budget, diluted link equity, slower for users.

Fixed: all 713 rewritten to extensionless, in the pages and in `/components`.
Verified: **751 internal page links checked, zero broken.**

### 3. Soft-404 catch-all
Any nonexistent URL returned **HTTP 200 with the full homepage**:

```
/es/contact                -> 200, homepage
/articles/fake             -> 200, homepage
/this-does-not-exist-12345 -> 200, homepage
/locations/fake-town-nj    -> 200, homepage
```

An unbounded duplicate-content surface. It's where the ghost URLs in your
not-indexed list came from (`/es/privacy`, `/articles/...`) — pages that never existed.

Fixed: added a real `404.html`. Cloudflare Pages serves it with a genuine 404 status
for unmatched paths. It's `noindex`, excluded from the sitemap, and carries useful
links so a mistyped URL still converts.

### 4. `/appointments` — the page carrying 95% of paid intent
Was **392 words**, not indexed, and its two content cards were `display:none` below
640px — so mobile-first indexing saw roughly 200 words plus a third-party iframe.

Fixed:
- Content cards now render below the calendar on mobile instead of being hidden.
  The booking widget still comes first; nothing about the widget polish changed.
- Added 8 booking-logistics questions with FAQPage schema, placed **below** the
  calendar so your clean top-of-page is untouched.
- **392 → 1,006 words.** Every fact reused from what's already published on your
  site (homepage FAQ answers). No new claims invented.
- Questions deliberately cover booking logistics — they do not repeat the 23
  exam questions on the homepage.

### 5. Cache headers
`_headers` keyed its cache rules on `.html` paths. Requests are extensionless, so
those rules never matched the real URLs. Added the extensionless twins.

### 6. Conversion fire hardening (`/thank-you`) — flagging this one
This addresses ranked fix #3 from your own Aug 18 audit. The old code wrapped the
whole block, **including `localStorage.getItem`, in one try/catch**. In Safari
private browsing the getItem call threw *before* `gtag` ever ran, the catch
swallowed it, and the booking conversion was silently lost — on your weakest channel.

Now: storage is advisory and fails open (fire rather than lose it), the dedupe is
recorded *after* the fire, the gtag retry is bounded instead of infinite, and the
`invitee_uuid` is stripped from the URL after firing so a refresh can't re-fire
even with no storage at all.

⚠️ **Ship this together with Ads fix #1 below.** On its own, with the Ads action
still set to Count="Every", a private-browsing refresh could over-count.

---

## Part 2 — Needs your approval (I did not touch your live Ads account)

### A. Set `calendly_confirmed` Count to "One" — do this with the deploy
Outstanding from the Aug 18 audit. Use the action's own **Settings page radio
buttons**, not the inline table editor. Pairs with fix #6 above.

### B. Change the ad's Final URL to the canonical host — 30 seconds, no learning reset
Your single responsive search ad points at `https://www.unitedmedicalexams.com`.
That's the **non-canonical duplicate**. Point it at `https://unitedmedicalexams.com/`.
One field. No structural change, no bid change, no learning reset.

### C. Resolve the duplicate Primary "Calls from ads" actions, set Count to "One"
Also from the Aug 18 audit — 8 repeat dialers in 17 days are inflating it.

### D. `immigration exam near me` is being throttled
QS **2/10**, status **"Eligible (Limited): Rarely shown (low Quality Score)"**,
197 impressions and 0 conversions. Either rewrite the ad group around it or pause
it — right now it's dead weight dragging the account average.

### E. Ad group split — my advice is WAIT, and here's why
The obvious move is splitting 10 keywords into themed ad groups with matched
landing pages. I'm recommending you **don't do that yet**, for two reasons:

1. At 277 clicks/month, splitting into 5 ad groups leaves ~55 clicks each — too
   thin for Smart Bidding to learn. Over-segmentation would make things worse.
2. Landing page experience is scored on the page Google has crawled. The fixes
   above materially change what it crawls. Restructuring now means you can't tell
   which change moved the number.

Do the technical deploy first, give it 2–4 weeks, re-read Quality Score. If landing
page experience is still "Below average" across the board, *then* split — and split
into 2–3 groups (core exam / geo / booking intent), not 5.

---

## Part 3 — Needs Cloudflare dashboard access (I can't do this from here)

### www → non-www 301
Both hosts currently serve 200 independently. There is no host redirect, and
Cloudflare Pages' `_redirects` file is path-based — it can't do host matching.

Add a **Redirect Rule** in the Cloudflare dashboard:
`www.unitedmedicalexams.com/*` → `https://unitedmedicalexams.com/$1`, 301.

The canonical tags now do most of this work, but the redirect makes it unambiguous
and stops www URLs accruing signal at all.

---

## Part 4 — Verify after deploy

None of the above can be confirmed live until you push. In order:

1. `https://unitedmedicalexams.com/this-does-not-exist` returns **404**, not 200
2. View source on any page — canonical is extensionless and matches the URL
3. Search Console → URL Inspection on `/appointments` → **Request Indexing**
4. Search Console → Sitemaps → resubmit `sitemap.xml`
5. ~1 week: "Crawled - currently not indexed" should fall from 8; "Alternate page
   with proper canonical" and "Page with redirect" should both start dropping
6. ~2–4 weeks: re-read Quality Score, specifically landing page experience

### For the September organic read
Add an indexation check next to the zero-click comparison. If `/appointments` and
the location pages still aren't consolidated onto one URL, a flat result won't tell
you whether the July content failed or simply never got counted.

---

## What I could not verify

- **Deployed behaviour.** Everything is verified in the repo and by static analysis;
  the 404 status and redirect behaviour are Cloudflare-side and only observable
  after you push.
- **Whether Cloudflare Pages honours `404.html`** on your specific project config.
  It's standard Pages behaviour, but check item 1 above first thing after deploy.
- **`robots.txt` and `sitemap.xml` were iCloud placeholders locally** — I regenerated
  the sitemap from scratch and read robots.txt from the live site (it's fine, and it
  already points at the non-www sitemap, consistent with the host I standardised on).
