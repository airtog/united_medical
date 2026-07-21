# United Medical Exams vs. Lenoy Med — Content & Technical Battle Plan

**Prepared:** July 21, 2026
**Owner:** Tog Samphel / FX3 Media
**Target site:** unitedmedicalexams.com (FX3-owned demand asset)
**Primary competitor:** lenoymed.com
**Purpose:** Self-contained execution brief. Everything needed to run this work is in this file — no prior conversation required.

---

# ⛔ DESIGN LOCK — READ BEFORE TOUCHING ANYTHING

**The visual design of unitedmedicalexams.com is FINAL and NOT part of this project.**

Do **not** change: layout, page structure, color palette, typography, spacing, component design, imagery style, photo choices, the hero, the testimonial carousel design, or any visual treatment. Do **not** "improve," "modernize," or "clean up" the design. Do **not** substitute images for different images. Do **not** propose a redesign.

The site's design converts. This project is **content, code, and technical performance only.**

Every task in this document is tagged:

| Tag | Meaning | Approval needed |
|---|---|---|
| **[A] INVISIBLE** | Code/technical only. Pixel-identical result. Nobody can see a difference. | No — just do it |
| **[B] CONTENT** | Text swapped inside existing components. No layout/style change. | No — just do it |
| **[C] ADDITIVE** | Adds a new element to a page. Touches layout. | **YES — Tog approves each one first** |

**If a task isn't tagged, it isn't approved. If in doubt, it's [C] and you ask.**

---

## 0. The situation in one paragraph

United Medical Exams has the better-built, better-focused, better-marked-up website running on better infrastructure, and it is **losing the ad auction** to a bloated WordPress medspa site that has copy-paste errors in its title tags. As of July 1–21, 2026, Lenoy Med holds 22.49% impression share to UME's 18.54%, appears **above UME 76.30% of the time** when both are in the same auction, and holds absolute top-of-page 62.39% vs UME's 27.04%. The loss is not caused by budget, domain age, or site design. It is caused by two specific, fixable things: **(1) Lenoy advertises $329 against UME's $599 and puts that price in the title tag**, and **(2) UME's homepage ships ~8.9 MB of oversized image files**, which almost certainly suppresses the Landing Page Experience component of Quality Score. Both fixes are invisible to the eye.

**Pricing decision: $599 HOLDS. We are not cutting price.** We change how price is *presented in ads and title tags*, not what it is, and not where it sits on the page.

---

## 1. Verified competitive intelligence

All figures pulled live **July 21, 2026**. Re-verify before acting if it's now past ~August 2026.

### 1.1 Auction position — Google Ads Auction Insights
Search Campaign, Jul 1–21 2026, account 531-955-7543 (ocid 7494101912)

| Domain | Impr. share | Overlap rate | Position above rate | Top of page | Abs. top | Outranking share |
|---|---|---|---|---|---|---|
| **lenoymed.com** | **22.49%** | 33.05% | **76.30%** | 86.95% | **62.39%** | 13.86% |
| **You (UME)** | **18.54%** | — | — | 77.53% | 27.04% | — |
| zocdoc.com | 15.88% | 30.25% | 39.32% | 80.24% | 11.01% | 16.33% |
| greencardmedicalexam.com | 13.57% | 15.67% | 37.59% | 61.25% | 27.34% | 17.45% |
| easyime.com | 10.15% | 19.67% | 31.10% | 79.96% | 7.31% | 17.40% |
| naomedical.com | <10% | 9.38% | 80.49% | 91.83% | 58.50% | 17.14% |
| manhattanmedicalarts.com | <10% | 10.63% | 77.42% | 90.56% | 50.18% | 17.01% |
| atriummednyc.com | <10% | 4.57% | 65.00% | 75.63% | 15.20% | 17.99% |
| afcurgentcare.com | <10% | 10.69% | 42.78% | 82.70% | 23.01% | 17.69% |

**Context:** In May 2026 UME was below 10% and last in the auction. The June ramp to $50/day moved UME to second. The auction is **fragmented** — leader holds only 22.5%. Real headroom exists.

**Critical:** Lost impression share has **flipped**. Jul 1–21: lost-IS-to-**rank 48.34%** vs lost-IS-to-**budget 32.58%**. Rank is now the bigger constraint. *Budget alone cannot fix this.*

### 1.2 Domain age — RDAP, Jul 21 2026

| Domain | Registered | Age | Impr. share | Position above UME |
|---|---|---|---|---|
| easyime.com | 2010-12-20 | 15.6 yrs | 10.15% | 31.10% |
| greencardmedicalexam.com | 2011-11-03 | 14.7 yrs | 13.57% | 37.59% |
| manhattanmedicalarts.com | 2018-04-13 | 8.3 yrs | <10% | 77.42% |
| naomedical.com | 2019-08-12 | 7.0 yrs | <10% | 80.49% |
| **lenoymed.com** | **2022-02-24** | **4.4 yrs** | **22.49%** | **76.30%** |
| **unitedmedicalexams.com** | **2025-07-29** | **1.0 yr** | 18.54% | — |

**Domain age does not explain the gap.** The two oldest domains (15.6, 14.7 yrs) are the ones UME beats. Lenoy is second-youngest and wins. Age is not an Ad Rank factor.

### 🚨 1.3 URGENT — DOMAIN EXPIRY

**unitedmedicalexams.com expires 2026-07-29** (registered 2025-07-29, 1-year term; Verisign RDAP, Jul 21 2026).

**8 days from this document's date.** If it lapses, site + Calendly + all ads go dark at once. UME already lost ~a month of web bookings in March 2026 to a Google Ads verification pause — same class of preventable outage.

**Do today, before anything else:** renew, **3–5 year term**, **auto-renew ON**, **registrar lock ON**, verify registrant email is monitored, confirm domain stays in FX3's name (Structure B — non-negotiable).

---

## 2. Head-to-head teardown

### 2.1 Offer & pricing

Lenoy's exact copy (`/i-693-immigration-medical-exam/`):
> Service Includes — Report Ready in 5-9 Days · Laboratory Test: Quantiferon TB Gold, RPR, Gonorrhea Urine Test · Physical Exam by Civil Surgeon · Sealed I-693 Report · *Vaccination If Needed* (At an Extra Cost) · **Price $329.99**

| | United Medical Exams | Lenoy Med |
|---|---|---|
| Advertised price | $599 | **$329.99** (title says $329; Elizabeth page says $299) |
| Labs included | Yes | **Yes** — TB Gold, RPR, GC urine |
| Vaccines | "administered on-site" — inclusion **unclear** | Explicitly **extra cost** |
| Report turnaround | 5–7 days | 5–9 days |
| Same-day appointments | Yes, advertised | Not advertised |
| Physical locations | 1 (Clifton) | 3 real + Hackensack page |
| Spanish page | **No** | **Yes** |
| Booking | Calendly real-time embed | 4-field lead form + callback |
| Price in title tag | **No** | **Yes** |

### 2.2 ⚠️ The false claim that must be removed

Current homepage + FAQ copy:
> "Most clinics that charge less don't include labs. Patients end up paying $1,000+ at Quest Diagnostics for bloodwork alone."

**This is factually wrong against Lenoy.** Their $329.99 **includes** the standard I-693 lab panel. A prospect who reads this, then visits Lenoy and sees labs included, has been handed a reason to distrust UME. Worse than having no argument. **P0 removal.**

### 2.3 Technical comparison

| Metric | UME | Lenoy |
|---|---|---|
| HTML size | **30 KB** ✅ | 208–503 KB |
| Gzipped transfer | **6.4 KB** ✅ | 28.5 KB |
| TTFB | **0.102s** ✅ | 0.808s (8× slower) |
| Server | Cloudflare, HTTP/2 ✅ | Apache, no CDN |
| JS files | **5** ✅ | **36** |
| Total image payload | **~8.9 MB** ❌ | moderate |
| Lazy loading | 34 of 38 ✅ | 0 of 89 |
| Alt text | **13 of 38** ❌ | 81 of 89 ✅ |
| Explicit width/height | **0 of 38** ❌ | 87 of 89 ✅ |
| Cache-control | `max-age=0, must-revalidate` ❌ | — |
| Platform | Static (Cloudflare Pages) ✅ | WordPress + cardioly theme |

### 2.4 🔥 The image payload problem — highest-ROI fix in this document

Testimonial avatars, measured live Jul 21 2026:

| File | Bytes |
|---|---|
| person-15.png | 847,592 |
| person-16.png | 803,379 |
| person-11.png | 785,167 |
| person-13.png | 768,843 |
| person-14.png | 755,161 |
| person-12.png | 717,985 |
| Screenshot-9.png | 717,385 |
| Screenshot-7.png | 650,289 |
| Screenshot-2.png | 614,383 |
| Screenshot-3.png | 575,904 |
| Screenshot-6.png | 551,541 |
| Screenshot-10.png | 532,748 |
| Screenshot-8.png | 496,872 |
| Screenshot-5.png | 490,398 |
| **TOTAL (14 files)** | **9,307,647 B ≈ 8.9 MB** |

Each renders as a **small circular avatar**. Lazy-loaded, but the carousel sits immediately below the hero — any scroll triggers the download. On mobile cellular (dominant for this traffic) this is a Landing Page Experience failure, and Landing Page Experience feeds Quality Score, which feeds Ad Rank.

**Most probable mechanical cause of the 48.34% lost-IS-to-rank.**

Also: **0 of 38 images carry explicit `width`/`height`** → guaranteed Cumulative Layout Shift. Format mix: 34 PNG / 3 WebP / 1 JPG.

> **⛔ DESIGN NOTE:** The fix is **compression only — same photos, same crops, same look.** Do NOT swap these for different images, monogram/initial avatars, illustrations, or real patient photos. A 780 KB PNG and a 12 KB WebP of the identical photo look identical at 200px. That is the entire change.

### 2.5 Content depth

| Page | Words |
|---|---|
| Lenoy `/hackensack-nj/immigration-physical-i-693/` | **4,337** |
| Lenoy `/i-693-immigration-medical-exam/` | **3,898** |
| Lenoy homepage | 2,131 |
| **UME homepage** | **848** |
| **UME `/locations/hackensack-nj.html`** | **497** |
| **UME `/appointments.html`** | **107** |

Internal links per page: **Lenoy 45 · UME 4.**

### 2.6 The booking page is the weakest owned asset

`/appointments.html` — 107 words:
- **No schema markup** (homepage has excellent schema; this page has none)
- **No `tel:` link — zero clickable phone CTA**
- **No fallback path.** If Calendly fails, blocks, or the user doesn't want a calendar, it's a dead end.

Funnel reality: **~86% of sessions never open the scheduler; of those who do, ~72% never pick a day.** June 2026 baseline: 453 users → 61 opened scheduler (13.5%) → 9 confirmed (2.0% overall).

Lenoy's equivalent: 3 forms + 4 tel: links, and their form is **4 fields with no date/time selection** — far lower friction. They capture the lead and call back.

### 2.7 Schema — UME wins, and the review question is a NON-ISSUE

**UME:** `MedicalBusiness` (priceRange $599, telephone, address, `medicalSpecialty: Immigration Medicine`, areaServed NJ/NY/CT, OpeningHoursSpecification), `Physician` (Dr. Emmanuel M. Weiss), `FAQPage` (5 Q&A), `AggregateRating` 5.0 / 50.

**Lenoy:** generic `LocalBusiness` ×3, `Organization`, `WebPage`, `BreadcrumbList`, `WebSite`+`SearchAction`, `FAQPage`, `Product`.

UME uses correct medical vocabulary; Lenoy uses generic business markup. **Lenoy has `BreadcrumbList` and `WebSite`/`SearchAction`; UME lacks both** — that's the only real gap.

#### ✅ RESOLVED: the AggregateRating / testimonial question

**Verdict: not a ranking problem, not a penalty risk. No action required beyond honest bookkeeping.**

Facts, verified against Google Search Central:
- Since **September 2019**, Google does not display review rich results for `LocalBusiness`/`Organization` **or their subtypes** when the reviewed entity controls the reviews. `MedicalBusiness` is a LocalBusiness subtype → **UME's stars have never displayed and never will.** The markup is inert, not harmful.
- Google states explicitly you do **not** need to remove it, Search simply won't show snippets, and **you won't get a manual action just for this.**
- Manual actions come from **fake** reviews. UME's testimonials are **real patient feedback collected from direct emails and messages.** Self-serving ≠ fabricated. UME is on the right side of that line.
- **Structured data is not a direct ranking factor**, and **Google Ads Ad Rank never reads schema at all.** This topic has zero bearing on the Lenoy auction fight.

**What to actually do:**
- **[B]** Confirm the `ratingValue` 5.0 and `reviewCount` 50 honestly reflect the feedback actually collected. If the real count differs, update the number. Don't invent a round figure.
- **[A]** Keep the source emails/messages archived as evidence of authenticity.
- **⛔ DO NOT** replace the stock testimonial photos with real patient photos. Publishing identifiable patient images alongside health testimonials is a HIPAA and consent problem. Generic imagery is the correct, standard choice for a medical site. **This was bad advice in an earlier draft and is formally retracted.**
- **Optional, Tog's call only:** a small "Photos are illustrative" note near the carousel addresses FTC/state-board testimonial guidance. This is **[C]** — approval required, and it is *not* required for SEO or Ads. Worth a quick question to your own counsel or the NJ Board of Medical Examiners rules, not to me.

### 2.8 Lenoy's exploitable weaknesses

Confirmed live, Jul 21 2026:

1. **Their Hackensack pages are titled "Belleville."** `/hackensack-nj/` → "Top Rated Urgent Care in Belleville NJ." `/hackensack-nj/immigration-physical-i-693/` → "U.S. Citizenship and Immigration Services at Belleville NJ" with a Belleville meta description.
2. **Three sets of duplicate title tags** across indexed pages.
3. **Stale "-old" pages still indexed and in sitemap:** `immigration-physical-belleville-old`, `immigration-physical-elizabeth-old`, `immigration-medical-exam-belleville-old-12-06-2026`.
4. **One page has zero H1** (`/belleville-nj/immigration-medical-exam-belleville/`).
5. **Homepage has two H1s.**
6. **Price inconsistency on their own site:** $329 (titles) / $299 (Elizabeth) / $329.99 (body). A shopper viewing two pages sees three prices.
7. **Immigration is a side business.** Weight loss, aesthetics, hydrafacial, laser hair removal, microneedling, COVID testing, MAT/opioid treatment. Homepage title: "Walk In Clinic, Medical, Aesthetic & Weight Loss Services." A nervous immigration patient lands on a medspa.
8. **Slow:** 0.808s TTFB, 36 JS files, zero lazy loading across 89 images.

**Their genuine advantages:** 3 physical locations, a Spanish landing page, a direct Google Ads conversion tag (`AW-`) + Meta Pixel (UME uses GA4 import only), low-friction lead form, 4–8× content depth.

---

## 3. Strategy

**Do not cut price to $329.** UME's economics depend on $599; the exam is a considered, once-in-a-lifetime, high-stakes purchase. Lenoy can price immigration as a loss leader because it subsidizes weight-loss and aesthetics. UME can't win that race and shouldn't enter it.

**Win on four axes:**

1. **Total cost honesty.** Lenoy is $329.99 **+ vaccines**. USCIS commonly requires MMR, Tdap, varicella, influenza, COVID-19 — a full series can add $200–600+. Reframe from "they don't include labs" (false) to **"$599 covers everything including vaccines; their $329 doesn't"** (true, and decisive). *Gated on §4 P0-4 confirming UME includes vaccines.*
2. **Speed.** Same-day appointments; 5–7 day report vs their 5–9. Filing deadlines are real.
3. **Specialization & trust.** A dedicated USCIS civil surgeon practice with 40+ years, versus immigration-as-a-side-service at a medspa. UME barely says this today.
4. **Technical superiority converted into Quality Score.** UME's infrastructure already beats theirs. Fix the assets and UME out-ranks them per dollar.

### ⚠️ Layout law (FX3 build playbook — do not violate)

A prior **price-first layout** test cost **22% time-on-site**; restoring emotional/human imagery recovered growth. Therefore:

- ✅ Price **in ad copy and title tags** — where it drives CTR → Quality Score
- ❌ Price **moved higher in page layout** — where it kills engagement

Different surfaces. Do not conflate. **No layout changes to accommodate price messaging.**

---

## 4. Execution plan

### PHASE 0 — TODAY (blocking)

**P0-1 · Renew the domain.** `[A]` See §1.3. 3–5 years, auto-renew, registrar lock. *Nothing else matters if it lapses July 29.*

**P0-2 · Kill the 8.9 MB image payload.** `[A] INVISIBLE`
- Re-encode the **same 14 testimonial photos** — same images, same crops
- Resize to actual display size (~400px max for 2× retina on a ~200px avatar)
- Convert to WebP, keep JPEG/PNG fallback
- Target **<15 KB each, <200 KB total** (~98% reduction)
- Same treatment for `dr-weiss.jpg` (117 KB) and the remaining PNGs
- **⛔ Same photos. No substitutions, no monograms, no illustrations, no crop changes.**
- **Acceptance:** homepage image payload <400 KB; visual diff shows **zero perceptible change**; Lighthouse mobile Performance ≥90

**P0-3 · Add explicit image dimensions.** `[A] INVISIBLE`
- `width` + `height` attributes on all 38 `<img>` tags, matching current rendered size
- **Acceptance:** CLS <0.1 mobile; **no visual change whatsoever** (this *prevents* layout shift, it doesn't create any)

**P0-4 · Resolve the vaccine question — business decision, blocks messaging.** `[B]`
Ask Dr. Weiss / Mike directly: **does $599 include required vaccinations? Are x-rays extra?**
- **Included** → becomes the central competitive weapon (§3.1)
- **Not included** → "All-In / No hidden fees" is a chargeback and one-star-review risk and must be corrected immediately

**P0-5 · Remove the false Quest Diagnostics claim.** `[B] CONTENT`
Strip "Most clinics that charge less don't include labs… $1,000+ at Quest Diagnostics" from homepage and FAQ. Replace per §5.1. **Text swap inside the existing FAQ component — no layout change.**

---

### PHASE 1 — WEEK 1

**P1-1 · Image alt text.** `[B] CONTENT` — 25 of 38 images have none. Write descriptive, keyword-relevant alt. Invisible to sighted users; helps SEO + accessibility.

**P1-2 · Fix caching.** `[A] INVISIBLE` — `max-age=0, must-revalidate` caches nothing. Set `max-age=31536000, immutable` on hashed static assets, short TTL on HTML.

**P1-3 · Pin the Lucide dependency.** `[A] INVISIBLE` — `https://unpkg.com/lucide@latest` is an unpinned third-party CDN dependency that can change under you at any time, and it's render-blocking. Pin to an exact version or self-host. **Same icons, same appearance.**

**P1-4 · Booking-page schema.** `[A] INVISIBLE` — add `MedicalBusiness` + `BreadcrumbList` JSON-LD to `/appointments.html`. Code only, nothing renders.

**P1-5 · Sitewide `BreadcrumbList` + `WebSite`/`SearchAction` schema.** `[A] INVISIBLE` — JSON-LD only. Lenoy has these; UME doesn't. **Do not add visible breadcrumb UI** unless separately approved as [C].

**P1-6 · Tracking hardening.** `[A] INVISIBLE`
- Add a **direct Google Ads conversion tag (`AW-`)** alongside the GA4 import, for redundancy (Lenoy has one; UME doesn't)
- Verify desktop `tel:` click firing in `tracking.js`
- Keep **exactly ONE Primary conversion** (`calendly_confirmed`); everything else Secondary

**P1-7 · Booking-page copy expansion.** `[B] CONTENT` — 107 words → 400+ **within existing page components**: what to bring, what happens, how long, what's included, turnaround. No new sections or layout; fill existing content areas.

---

### PHASE 1C — REQUIRES TOG'S APPROVAL (each item individually)

> These add elements to a page and therefore touch layout. **Nothing here ships without explicit sign-off.** Listed because the conversion math is strong, not because they're assumed.

**C-1 · `tel:` CTA on `/appointments.html`.** The booking page currently has **no clickable phone number at all**. Adding one (styled with existing button components, no new design language) gives the ~72% who abandon the calendar somewhere to go. *Lowest-risk item in this section; highest expected return.*

**C-2 · Callback fallback form below the Calendly embed.** 4 fields — First, Last, Phone, Email — "Request a Callback." Mirrors Lenoy's low-friction path. Would use existing form styling. Wire to a new GA4 `callback_request` event as a **Secondary** conversion.

**C-3 · "Why is the I-693 exam cheaper elsewhere?" content asset.** New page or FAQ expansion explaining the vaccine/lab/add-on structure so shoppers self-educate on total cost. Highest-leverage SEO + trust asset available. Honest, factual, **never names a competitor.**

**C-4 · Spanish landing page (`/es/`).** Lenoy has one; UME doesn't despite "Se habla español" already in copy. ~80 searches/month (conservative floor) in the 5-county catchment. Would reuse the existing English page design exactly, translated.

**C-5 · "Photos are illustrative" note near the testimonial carousel.** FTC/medical-board hygiene. Not needed for SEO or Ads. Tog's call.

---

### PHASE 2 — WEEKS 2–3 (message + ads; no site design impact)

**P2-1 · Rewrite the price argument.** `[B] CONTENT` — see §5.1. Text swap in existing components.

**P2-2 · Put total-cost messaging into ad copy.** `[B]` — Ads only, zero site impact. Test headlines like "$599 All-In · Vaccines Included · No Add-Ons" so UME is *having* the price argument rather than silently losing it. **One variable per measurement window.**

**P2-3 · Title tag + meta description optimization** across all 22 pages. `[B] CONTENT` — invisible on-page; this is what shows in SERPs and drives CTR.

**P2-4 · Specialization messaging.** `[B] CONTENT` — §5.2 copy, dropped into existing homepage text blocks.

---

### PHASE 3 — MONTH 2 (depth; content only)

**P3-1 · Deepen the 15 location pages** from ~497 to 1,200+ words each. `[B] CONTENT` — local landmarks, directions, transit, parking, county-specific USCIS context, local FAQs. **Text into existing page templates. No template redesign.**

**P3-2 · Homepage content depth** 848 → 1,500+ words. `[B] CONTENT` — full process explained, USCIS requirements and why, vaccination detail, document checklist, expanded FAQ. **Into existing sections. Respect the value-before-price layout law — do not move price up.**

**P3-3 · Internal linking** 4 → 20+ per page. `[B] CONTENT` — cross-link location pages to each other, to appointments, to FAQ. Uses existing inline link styling.

**P3-4 · Document-checklist content.** `[B]` or `[C]` depending on placement — Lenoy has "Essential Documents for Your USCIS Medical Exam"; UME has a one-line mention. High-intent search topic. If it fits an existing FAQ/section it's [B]; if it needs a new block it's [C].

---

### PHASE 4 — ONGOING (ads & measurement; zero site impact)

**P4-1 · Budget step to $65/day** as a clean single-variable change — **only after P0-2 has been live ≥1 week**, so the Quality Score gain isn't confounded with the budget change. **Rank first, then volume.**

**P4-2 · Tripwire:** if cost per attributed booking exceeds **~$140**, stop buying volume and return to rank/quality work.

**P4-3 · County bid adjustments** (pending, still not executed): Hudson is a confirmed spend leak ($1,112 / 0 conversions Jan–Jun) → exclude or heavy negative bid; reallocate ~$185/mo to Bergen (best at ~$16/web booking), then Passaic. **Own single-variable change — do not stack with the budget step.**

**P4-4 · Monthly EHR-actuals reporting** in Impact Report format. EHR is source of truth.

---

## 5. Copy directives

*All of these are text swaps inside existing components. No layout, no new sections.*

### 5.1 Replacement for the false price claim

**REMOVE:**
> "Most clinics that charge less don't include labs. Patients end up paying $1,000+ at Quest Diagnostics for bloodwork alone."

**REPLACE WITH — conditional on P0-4 confirming vaccines are included:**
> **Why $599?**
> Because it's the whole thing. Your exam, all required bloodwork and lab tests, your required vaccinations, and your sealed I-693 — one visit, one price.
> Lower advertised prices usually cover the exam and labs only. Required vaccinations — MMR, Tdap, varicella, influenza, COVID-19 — are then billed separately, and a full series can add several hundred dollars. Ask any provider what their price includes *after* vaccinations before you compare.
> We'd rather quote you the real number up front.

**If P0-4 confirms vaccines are NOT included:** remove "All-In / Everything included / No hidden fees" sitewide, replace with an explicit inclusion list plus a clear "additional costs may apply for X" line. **Do not ship ambiguous all-in language.**

### 5.2 Specialization pillar (into existing homepage text block)

> **This is all we do.**
> United Medical Exams is a dedicated USCIS civil surgeon practice. Not a walk-in clinic that also does immigration exams between weight-loss consults — a physician with 40+ years of practice whose designation exists specifically to complete your I-693 correctly the first time.
> A rejected or incomplete I-693 costs you months. We don't do this on the side.

### 5.3 Urgency pillar

> **Same-day appointments. Sealed I-693 in 5–7 business days.**
> Filing deadlines don't move. Book today, examined today, form in hand next week.

---

## 6. Success metrics

| Metric | Baseline (Jul 21 2026) | 30-day target | 90-day target |
|---|---|---|---|
| Search impression share | 18.54% | 24% | 32% |
| Lost IS (rank) | 48.34% | <40% | <30% |
| Lenoy position-above-rate | 76.30% | <65% | <50% |
| Abs. top of page | 27.04% | 38% | 50% |
| CTR | 6.93% | 8.0% | 9.0% |
| Homepage image payload | ~8.9 MB | <400 KB | <400 KB |
| Lighthouse mobile Perf | unmeasured | ≥90 | ≥95 |
| CLS | poor (0 dims) | <0.1 | <0.1 |
| Scheduler open rate | 13.5% | 18% | 22% |
| Overall booking conv rate | 2.0% | 3.0% | 4.0% |
| Cost per attributed booking | $93.58 (corrected) | <$90 | <$75 |
| Web bookings/month | ~14 (July pace) | 16 | 20 |

**Attribution note:** July 2026 = 9 web + 4 traditional = 13 bookings. Phone-matching the Quo tracking line against EHR `PreferredPhone1` proved **2 of 4 traditional bookings were ad-sourced but uncredited** (CLEYE TEJEDA 7/1; GORDON 7/20 — the other 2 fell in a log-coverage gap, untested not disproven; testable match rate 2 of 2). Corrected attribution **11 of 13 = 85%**, cost per attributed booking **$93.58** vs $114.37 web-only. **0 of 9 web bookers appear in the call log** — clean channel separation, no double-count risk. Always present dual attribution (tagged floor + corrected floor).

---

## 7. Guardrails

1. **⛔ DESIGN IS LOCKED.** No layout, color, typography, component, or imagery changes. [C] items require Tog's explicit per-item approval.
2. **$599 price holds.** Presentation changes in ads/titles only.
3. **One variable per measurement window.** Never stack budget with geo or copy tests. Protects the case-study data future FX3 sales depend on.
4. **EHR is source of truth.** Ads conversion column is directional only. Never trust the last 24–48h (GA4→Ads lag 24–72h).
5. **Never name Lenoy Med in public-facing copy.**
6. **Never fabricate numbers.** Every claim traces to verified data.
7. **Value before price in layout; price in ads and title tags.** Price-first layout previously cost 22% time-on-site.
8. **Exactly ONE Primary conversion action** (`calendly_confirmed`). Double-tracking corrupts Smart Bidding.
9. **FX3 retains all demand assets** — domain, ad account, tracking number, booking layer.
10. **Check for Google Ads verification pauses** before blaming the site or market for a booking drop. Two confirmed disruptions: Dec 2025–Feb 2026; ~Mar 9–Apr 5 2026.
11. **Count distinct phone numbers, not raw rows**, before calling a traditional-bookings trend. June 2026's 14 traditional bookings came from ~9 unique numbers — one family booked 6 exams from a single number on 6/10.
12. **Seasonality:** flat, mature, ~770 searches/month harvest market with a late-winter/early-spring peak. Scale into Jan–Apr; hold the summer trough. Never call a 3-month change structural without checking multi-year seasonality.

---

## 8. Technical reference

**Site:** static build, Cloudflare Pages pattern. Repo: github `airtog` / `united_medical`.

**Key files:**
- `/index.html` — homepage (30 KB, 848 words)
- `/appointments.html` — booking page (8 KB, 107 words)
- `/locations/*.html` — 15 city pages (~497 words each)
- `/css/nav.css`, `/css/main.css` — **do not restructure**
- `/js/nav.js`, `/js/main.js`, `/js/tracking.js`
- `/assets/people/*.png` ← the 8.9 MB problem (compress in place, same images)
- `/assets/dr-weiss.jpg`, `/assets/awards/*`

**`tracking.js` events:** `click_to_call`, `schedule_click`, `calendly_confirmed` (value 599), `scroll_depth` (25/50/75/90), `faq_expand`, +1. Fires via `gtag`.

**Calendly embed:** `calendly.com/unitedmedicalexams-info/30min?primary_color=3b7dd8&hide_event_type_details=1&hide_gdpr_banner=1`, inline widget, min-height 700px, auto-resize on `calendly.page_height` messages.

**Accounts:**
- Google Ads: Cardiacare Center PC, 531-955-7543, **ocid 7494101912**. Navigate via account selector — dashed-number URLs 400-error. Auction Insights: `https://ads.google.com/aw/insights/auctioninsights?ocid=7494101912`
- GA4: property **p499841671**, measurement ID **G-M6D4QHH38F**, stream 11855247781. Event retention 14 months (set Jun 25 2026).
- Quo: my.quo.com, UME line **(855) 755-1312**. Inbox `my.quo.com/inbox/PNB6BaFA1V/calls` (virtualized — scroll repeatedly, accumulate per render).
- EHR: AdvancedMD, `AppointmentBookingDetail.csv`. Fields: `Textbox80`=type, `StartDate2`=service date, `Textbox39`=create date, `PatientName1`, `PreferredPhone1`, `ZipCode1`. Types: `IMMIGRATION - WEB SI` (web) / `IMMIGRATION APPT` (traditional). **Parse with `csv.reader`/`DictReader`, never `pd.read_csv`** (silent row drops on embedded newlines). Boundary-check the `Textbox35` header + min/max dates first.

**Campaign state (Jul 21 2026):** Search Campaign $50/day, Maximize conversions, fully spending ($49/day actual). PMax paused, $0. Jul 1–21: $1,029.37 spend, 3,533 impressions, 245 clicks, 6.93% CTR, $4.20 avg CPC, 9.00 conversions, $114.37/conv, 3.67% conv rate.

**GBP note:** phone swapped to the Quo tracking line **Jun 25 2026**. July call counts (117) are inflated by newly-captured generic discovery calls plus heavy repeat-dialing/spam (up to 10 redials/day from single far-flung numbers). **Call volume is not a usable KPI until ~mid-August.** Consider spam filtering/blocking on the Quo line.

---

## 9. First actions for the new session

1. **Confirm domain renewal** (§1.3) — blocking, expires **Jul 29**
2. Pull the repo; audit `/assets/people/` and confirm the 14 oversized files
3. Run a **Lighthouse mobile audit** on the homepage for the real performance baseline
4. Get the **vaccine/x-ray inclusion answer** from Dr. Weiss or Mike (P0-4) — gates all messaging work
5. Execute **P0-2 and P0-3** (compress images in place + add dimensions), deploy, re-run Lighthouse, **visual-diff to confirm zero perceptible change**
6. Execute **P0-5** (remove false claim) once P0-4 answer is in
7. Then Phase 1 `[A]`/`[B]` items
8. Bring the **[C] list to Tog** for individual approval — do not assume

**Do not step the ad budget until the image fix has been live at least a week.** Rank first, then volume.

**And again: the design is not being changed. If a task seems to require a design change, stop and ask.**
