# UME — Core Context File

**United Medical Exams (UME) · FX3 Media engagement · canonical reference**
Last drafted: Aug 18, 2026 · Owner: Tog Samphel (FX3 Media)
> Last verified against live systems: **Aug 18, 2026** — full EHR + GA4 + Google Ads + Quo reconciliation of the Aug 1–17 window. §5, §6, §7 and §10 updated from that pull.

> Purpose: single source of truth for the UME engagement — entities, ownership, assets, people, tools, measurement method, the real performance baseline, and the standing rulings on contested numbers. Seed this into any new working session so we don't re-derive context. Where this file states real numbers, the source is cited inline. **This file contains no passwords or secrets** — those live in the password manager.
>
> **Authority:** this file is the authoritative source of truth. Where the FX3 skill (`fx3-client-acquisition-system`, incl. its `references/`) or prior working memory conflicts with anything here, **this file wins** and the others defer to it (Tog's ruling, Aug 18 2026). Section 11 records the governing rulings on the items that were in conflict.

---

## 1. What UME is, in one paragraph

United Medical Exams is a consumer-facing brand for USCIS **I-693 immigration medical exams** ("green card medical"), priced at **$599 cash-pay**. Fulfillment is a real USCIS-designated **civil surgeon** practice at **842 Clifton Ave, Clifton, NJ 07013**, operated under **Cardiacare Center PC / Weiss Medical Group**, credentialed practitioner **Dr. Emmanuel M. Weiss**. FX3 Media (Tog, solo) owns and runs the entire demand layer that feeds the practice — brand site, Google Ads, tracking, booking, analytics — and is paid on booked exams. The practice is a **fulfillment node, not an asset owner**. This is the engagement's flagship and the proof-of-concept for the wider FX3 productized acquisition system.

---

## 2. Entity & ownership map (Structure B — the moat)

| Layer | Who owns / operates it | Notes |
|---|---|---|
| Clinical fulfillment | Cardiacare Center PC / Weiss Medical Group; Dr. E. Weiss (civil surgeon) | Performs the exam, signs the I-693 |
| Brand / demand layer | **FX3 Media (Tog)** | Domain, ad account, tracking line, booking layer, GA4 — all in FX3's name |

**Structure B principle (non-negotiable):** FX3 owns the demand-side assets; the doctor is the fulfillment side. The domain, Google Ads account, tracking number, and booking layer **never transfer to any partner doctor**. That ownership is the platform moat — it creates recurring revenue, switching costs, and exit/platform value (a $7–10M-class asset vs. a $2–3M agency multiple). Asset ownership is conceded only as a deliberate negotiation trade, never by default.

---

## 3. The offer & unit economics

- **Product:** USCIS I-693 immigration medical exam, **$599 cash-pay**.
- **Market shape:** NJ five-county catchment, ~**770 searches/mo** at maturity — a **harvest market**, not a growth market. Mature, seasonal, roughly flat YoY. Grow only by taking share. Practical ceiling ≈ **40 attributed bookings/mo** (~2–2.5× current run rate). *(Source: Keyword Planner geo-filtered to catchment counties; see §7–8.)*
- **FX3 pricing model:** $500/mo management retainer per client **+ $299 per booking**; FX3 pays the ad spend. Breakeven ≈ **14 bookings/mo**; maturity (~40 bookings/mo) projects ≈ **$8,260/mo net** per surgeon.
- **Seasonality of spend:** scale into the Jan–Apr peak (~$130–180/day), pull back in the summer trough (~$50–70/day). Budget simulator in the trough shows near-zero conversion gain from added spend — the market is demand-limited seasonally.

---

## 4. People

- **Dr. Emmanuel M. Weiss ("Mike")** — civil surgeon / credentialed practitioner, and the same person referred to as "Mike" for operations and business decisions on the practice side. One contact, both roles: clinical *and* ops/business. Clinical anchor for the CardiaCheck pivot (existing cardiology equipment).
- **Sandy** — EHR data entry; **applies appointment tags manually** (this is the hand-key step behind lag artifacts — see §6).
- **Tog Samphel** — FX3 Media, owns the demand layer and this engagement.

---

## 5. Owned demand-layer assets & access

*(Reference only. Secrets in password manager — not here.)*

| Asset | Identifier |
|---|---|
| Domain | unitedmedicalexams.com (Cloudflare Pages; GitHub `airtog` / repo `united_medical`; deploys via **Antigravity**) |
| Google Ads | Cardiacare Center PC — account **531-955-7543**, ocid **7494101912** |
| GA4 | property **p499841671**, measurement ID **G-M6D4QHH38F**, stream **11855247781** |
| Booking | Calendly → owned **`/thank-you`** redirect (conversion tracking anchor; see §6) |
| Call tracking | **Quo** (the former OpenPhone) — app at **`my.quo.com`**, log in via `quo.com`. Line **(855) 755-1312**; inbox `PNB6BaFA1V`; after-hours AI = Sona. *Note: `quo.co` and `app.quo.com` do not resolve.* |
| EHR | **AdvancedMD**, office code **135257** (source of truth). Username on file; **password in password manager, not stored here.** Export = `AppointmentBookingDetail…csv` |

**Tool-navigation quirks worth keeping (hard-won):**
- **Google Ads:** navigate via account selector — dashed-number URLs 400. Date picker needs a *real* mouse click (Angular Material ignores programmatic clicks). Use synchronous IIFEs, not `setTimeout` (async returns empty). Execute write sequences in one `browser_batch` to reduce mid-sequence disconnects; on any dropout, **confirm account unchanged** (failure mode produces no partial writes).
- **GA4:** admin deep-links redirect to Home — navigate via gear → left nav. Events report loads cleanly via `get_page_text`.
- **Calendly:** URL-parameter navigation is most reliable; screenshots render blank (use `read_page` filter=all + `find`); close a detail pane before opening the next.
- **Quo:** close the Sona promo popup first or scroll/search fails silently. **The Calls tab's conversation-state filter defaults to `Open` and silently hides `Done` conversations — set it to `Any` before counting anything.** The list is a virtualized Virtuoso grid: only rendered rows exist in the DOM, so scrape by repeatedly scrolling the `.w9n9b60` container and accumulating `[role="row"]` innerText into a Map. "Call forwarded" rows carry no duration; only Sona-answered rows do.
- **AdvancedMD export fields:** `Textbox80`=appt type, `StartDate2`=service date, `Textbox39`=create date, `PatientName1`, `PreferredPhone1`, `ZipCode1`. Web tag = `IMMIGRATION - WEB SI(TE)`; traditional = `IMMIGRATION APPT`. When filtering by create date, set service date wide open (AND logic clips both windows).
- **GA4 single-event daily series:** deselect all rows, select just the event, click **Plot rows**, then *hover a point* — the y-axis only rescales once the tooltip is up. Reading the line off pixels without a tooltip is unreliable.
- **Google Ads date picker** renders at two different sizes depending on viewport — re-screenshot and re-locate the day cells each time rather than reusing coordinates.
- **RDAP** via `rdap.verisign.com` for domain checks (whois unreliable here).
- **Search Console:** load `https://search.google.com/search-console` directly; use URL params for filters.

---

## 6. Measurement method (the honest reconciliation)

**EHR is the source of truth.** Platform metrics (Ads conversion column, GA4 Realtime, Quo call counts) inform but never override the EHR.

**Attribution — permanent three-bucket framework.** Booking *mechanism* ≠ discovery *channel*. Report bookings as: **Booked online (Calendly)** / **Called tracked line (Quo-matched)** / **Other**. The old "traditional vs. web" split is *not* a channel signal — the traditional EHR tag is a catch-all default for anything not routed through Calendly or the tracked line.

**Phone-match attribution.** Normalize last-10 digits and join Quo caller numbers ↔ EHR `PreferredPhone1` to surface ad-sourced bookings mis-tagged "traditional." Always frame the result as a **floor** (only catches callers of the tracked number).

> **CORRECTED Aug 18 2026 — web self-bookers DO appear in the Quo log.** The earlier claim that they never do (and that phone-match therefore carries zero double-counting risk) is **false**: in Aug 1–17, 2 of the 5 web-tagged bookings had also called the tracked line (one called twice before booking, one called two days before booking online). **Compute the corrected floor as `(web-tagged events) + (Quo-matched events that are NOT already web-tagged)`. Never add a raw phone-match count to a raw web count.**

**Present attribution and ROAS in dual form, always labeled as floors:** tagged (floor) and corrected (floor + phone-matched).

**Hard-won reading rules:**
- Count **distinct phone numbers (booking events)**, not raw rows, before calling any "traditional" trend. Family/group bookings inflate the bucket (e.g., one number = 6 rows = 1 booking event).
- **Phone area code ≠ location** in the NYC/NJ metro — people keep historical area codes. County signal comes from Google Ads Matched Locations + EHR `ZipCode1`, never Quo area codes.
- Quo **"Missed call" / "Forwarded" / 0-duration = normal business-hours auto-forward to the office**, not lead leakage. Sona only answers after-hours.
- **EHR create date for web-tag rows is the office DATA-ENTRY date, not the patient's booking time.** Measured Aug 1–17 2026: real GA4 `calendly_confirmed` fired 8/5, 8/6, 8/8 (Sat), 8/11, 8/13, 8/16 (Sun); the matching EHR web creates landed 8/7, 8/10, 8/12 ×2, 8/17 — **zero overlap**, every EHR date trailing GA4 by 1–3 days, and both weekend bookings surfacing the following Monday. Never read an EHR create-date gap (especially a weekend zero) as a demand gap. Use GA4 for *when demand arrives*, EHR for *whether it became a real appointment*, and expect the EHR web count to sit ~1 behind GA4 at any moment.
- **Google Ads "Conversions" is not a booking count — always open Goals → Summary for the goal split** before quoting it. Aug 1–17 read 9.00 conversions, which happened to equal the GA4 `calendly_confirmed` count of 9; they are unrelated numbers. The real split was Book appointments 4 / Phone call leads 5 / Contacts 0.
- **Net out Tog's own test traffic before computing anything.** Hitting `/thank-you` directly to test the redirect fires `calendly_confirmed` in GA4 while creating no Calendly appointment, no EHR row and no Ads conversion. Three such tests on Aug 11 2026 are exactly what made the raw GA4 counts read 9 events / 7 users. A GA4-vs-EHR gap is therefore **not** automatically hand-key lag — ask which spikes are tests first.
- **Don't discard odd-looking EHR rows on the name alone — phone-match them first.** Chart 11380 "HOLDER, PLACE" (no zip, no email) looked like a junk placeholder but its number matched a real Quo call on the same day the row was created. It is a real booking entered under a placeholder name. *(Open item: confirm with the front desk whether this is routine practice — it is a fixable data-quality leak.)*
- **T+24h rule:** never diagnose broken tracking from Realtime alone. GA4→Ads import lag is 24–72h. Wait 24h for delayed dispatch before escalating.
- Boundary-check every export first (`Textbox35` header + min/max `StartDate2`). Use `csv.reader`/`DictReader`, **never `pd.read_csv`** (pandas silently drops rows with embedded newlines).
- **Single-variable discipline:** one experiment per window, verify on EHR, then proceed. Never stack changes.

**Known artifacts (don't misread these as demand):**
- **Mar 2026 web = 2:** Google Ads verification pause (~Mar 9–Apr 5), not demand.
- **Jun 2026 "web drop":** hand-key lag artifact (Sandy's manual tagging); GA4 `calendly_confirmed` held flat May→Jun.
- **GBP→Quo swap, Jun 25 2026:** inflated call counts from that date (generic discovery + repeat/spam; one number redialed 10×/day in July). Pre/post-swap call volumes are **not** directly comparable; clean baseline expected ~mid-Aug 2026 before Quo volume is a reliable KPI again.
- **Pre-2025 `IMMIGRATION - WEB SITE` tag** tracked returning-patient cross-sell (Zocdoc/internal), **not** Tog's bookings. Post-2025 web tag = 100% new patients via Calendly. Never compare pre/post web share as the same channel.

---

## 7. The real performance baseline

### 2026 monthly (through July) — EHR source of truth
*Source: `AppointmentBookingDetail-17.csv` (EHR, create-dates 1/1–7/31/2026), triangulated with Google Ads. This is the established baseline; future sessions don't need to re-derive 2026 monthly totals.*

| Month | Ad Spend | Impr. | CTR | Avg CPC | Web bkgs | Trad bkgs | Total |
|---|---|---|---|---|---|---|---|
| Jan | $837 | 3,421 | 7.45% | $3.28 | 9 | 6 | 15 |
| Feb | $891 | 3,541 | 8.22% | $3.06 | 8 | 13 | 21 |
| Mar | $904 | 3,070 | 10.20% | $2.89 | 2\* | 19 | 21 |
| Apr | $381 | 1,407 | 7.68% | $3.53 | 6 | 14 | 20 |
| May | $912 | 3,987 | 7.17% | $3.19 | 14 | 11 | 25 |
| Jun | $1,272 | 3,360 | 8.96% | $4.22 | 5† | 14 | 19 |
| Jul | $1,505 | 4,757 | 7.21% | $4.39 | 11 | 6 | 17 |

\*Mar web=2 = verification-pause artifact. †Jun web=5 = hand-key lag artifact (GA4 calendly_confirmed flat May→Jun). **H1+Jul total = 138 bookings.**

**August MTD — measured Aug 1–17 2026, four-system reconciliation (EHR + GA4 + Google Ads + Quo), pulled Aug 18 2026.** This supersedes the earlier ~31-row / 83% estimate.

| Measure | Value | Basis |
|---|---|---|
| EHR bookings | **16 rows / 14 booking events** | create-date 8/1–8/17, service window opened to 9/18 |
| Projected month | **~29 rows** | 17 complete days × 31; prior best 25 (May), Jul 17 |
| Online bookings | **6** (5 keyed in EHR, 1 still pending entry) | GA4 `calendly_confirmed`, net of 3 Tog tests on 8/11 |
| Tracked-line bookings | **6** | Quo ↔ EHR phone-match, excluding the 2 web bookers who also called |
| Other | 3 | Beaton, Wilson, Carcamo Ponce — no Calendly, no tracked-line call |
| Ad spend | **$877** · 164 clicks · ~2.1K impr · **avg CPC $5.35** | Google Ads, Aug 1–17 |
| Ads conversions | **9** = Book appointments 4 + Phone call leads 5 + Contacts 0 | Goals → Summary |

**Attribution (dual floors, both labeled):** tagged floor **5/14 = 36%**; corrected floor **11/14 = 79%**. *(The previously recorded 83% was an estimate and ran slightly hot; 79% is the measured figure.)*

**Cost per booking, by basis:** blended per EHR booking event **$62.64** · per demand-layer-attributed booking **$79.73** · per Ads conversion **$97.44** · per web-only booking **$146.17**. See §10 for which basis governs the tripwire.

**Watch:** avg CPC $5.35 is up sharply from Jul $4.39 and Jan $3.28 while impression share moved 17%→22% — buying share and paying for it. CPC is the variable most likely to push the attributed figure toward the tripwire. Quo logged 55 calls / 45 distinct callers with **8 repeat dialers** (one 3×), so call volume is still not a clean KPI (see the GBP→Quo swap artifact in §6).

### Multi-year context — immigration appt volume
*Source: full-practice annual EHR exports `AppointmentBookingDetailALL{2023,2024,2025}.csv`, immigration appointment types only. Counts are directional (annual full-practice exports; pre-2025 web tag = returning-patient cross-sell, not comparable to Calendly bookings).*

| Year | Immigration appts | of which web-tag | traditional |
|---|---|---|---|
| 2023 | 67 | 49 | 18 |
| 2024 | 40 | 16 | 24 |
| 2025 | 67 | 17 | 50 |
| 2026 (Jan–Jul) | **138** | — | — |

The engagement's lift shows up clearly: **2024 ≈ 40 immigration appts (~3.3/mo)** matches the pre-engagement "~3 exams/month" baseline almost exactly; **2026 is already at 138 through July** — more than 2× all of 2025 in half the year. This is the EHR-verified spine of the "3 → 15+/month" proof point.

---

## 8. Market & demand principles

- The NJ five-county catchment is **mature, seasonal, ~flat YoY** — a harvest window. These terms **peak late-winter/early-spring and fade into summer every year**; always check the 4-year Keyword Planner history before calling a 3-month drop a structural decline.
- **Rank, not budget, is currently the binding constraint.** Lost-IS-to-rank (51.62%) exceeds lost-IS-to-budget (29.05%) as of July → fix Quality Score before stepping budget.
- **Auction Insights (Aug):** UME at **22.65% impression share, now ahead of Lenoy (20.60%)** for the first time. Lenoy still holds the absolute top-position advantage (57.3% vs. UME 27.2%).
- Expansion markets validated by Keyword Planner (each needs a local civil surgeon as a Structure B node): NYC tri-borough (Brooklyn ~700/mo, Queens ~660/mo, Bronx ~270/mo); Dallas–Fort Worth (~770/mo); DC metro (~680/mo); Chicago/Cook (~640/mo). Texas cluster (DFW + Houston) is a single-licensing-regime play. Edison/Iselin NJ deprioritized (~160/mo — community/referral routing, not Google search).

---

## 9. Current state (Aug 2026)

**Conversion tracking — confirmed working.** The fragile `calendly_confirmed` postMessage listener (broke on privacy browsers, ad-blocked devices, Calendly iframe-escape) was replaced by an owned **`/thank-you` redirect** architecture. tracking.js upgraded v8→v9→v9b (Cloudflare immutable cache forced cache-busting); "Pass event details" ON. Proven live by Roy Rojas's organic booking firing `calendly_confirmed`. **The rebuild is load-bearing, not redundant:** over Aug 1–17 the legacy postMessage chain logged only 3 `invitee_meeting_scheduled` against 6 real confirmations (~43% capture). Do not restore reliance on `invitee_*` events for counting.

**Google Ads conversion signal — rebuilt.** Two new Primary conversion actions: **"Website Calls (Quo line, 60s+)"** at $150 and **"Calls from ads"** at $150, both with 60-second minimum-duration gates. Google call-forwarding number deployed sitewide via Antigravity; call asset cleared review. Live end-to-end test confirmed: forwarding number renders on ad click, routes to office, and **original caller ID survives the double-hop into the Quo log** (preserving the Quo↔EHR phone-match method). First morning showed five forwarded calls, all <60s, correctly filtering to zero conversions. **Confirmed producing as of Aug 18 2026:** the Aug 1–17 window recorded **5 Phone call leads** (60s+ gate) alongside 4 Book appointments, and Quo↔EHR phone-matching independently tied **6** traditional-tagged bookings to the tracked line. The phone channel is real and measurable.

**Site.** Homepage hero rebuilt — video removed, static WebP slideshow, payload cut ~16× (~9MB → ~567KB), audited/verified. Funnel rebalanced on a **capability-asymmetry** strategy: online booking owns speed/certainty; phone owns questions, family/group bookings, and attorney-deadline coordination. Standardized CTA language: **"Book Online for Next-Day Appointments"** (the word "for" is required — parallel constructions are too weak), **"Takes 60 seconds"** muted microcopy under Schedule, **"Questions? Talk to our team"** under Call. Schedule primary/first, Call secondary/second in all five homepage locations.

**Brand/entity.** Recommended DBA **"United Immigration Medical Exams"** as an alternate name under Cardiacare Center PC via NJ Form C-150G ($50, five-year term). A plain LLC is not appropriate under NJ corporate-practice-of-medicine rules. USPTO trademark advisable but the descriptive phrase likely lands on the Supplemental Register with a disclaimer requirement; a non-affiliation disclaimer is recommended on-site given the "United"+"Immigration" combination.

---

## 10. On the horizon (queued, single-variable discipline)

- **Google Ads batch (pending Chrome MCP stability — last attempt timed out with no writes landing; account confirmed unchanged):** pause `Book Your Exam` sitelink; edit `Book Appointment` sitelink in place; remove three low-CTR process-education sitelinks; update headline/description 4 same-day callout. Account then freezes to month-end.
- **Parked until after the batch:** Hudson negative bid/exclusion + ~$185/mo reallocation to Bergen/Passaic; Bergen bid-up; budget step toward $65+/day, contingent on cost/booking staying **below the $140 tripwire**.

> **Tripwire definition — LOCKED Aug 18 2026.** The $140 tripwire is measured as **ad spend ÷ demand-layer-attributed booking events** (web-tagged events + Quo-matched events not already web-tagged), on the EHR, for the spend window in question. Why this basis and not another: the same Aug 1–17 window reads $62.64 blended, **$79.73 attributed**, $97.44 per Ads conversion and $146.17 web-only — it either clears the tripwire comfortably or breaches it depending purely on definition, which is the exact failure mode Ruling 1 froze ROAS over. Attributed is the right basis because it is the number FX3 actually controls, and it is consistent with the $68–72 previously recorded in §7. **Aug 1–17 reads $79.73 — clear. The budget step is supported.** *(Tog: change this basis if you disagree, but change it here and once, before it ships anywhere.)*

> **Sequencing note (single-variable discipline):** rising CPC ($4.39 → $5.35) is the pressure on that number, so land the Quality Score fixes **before** the budget step, not alongside it. Also: Bergen was previously flagged "best performer," but produced only 1 of 16 August rows against Essex 6 and Passaic 3 — verify Bergen against Ads matched-locations before funding the bid-up.
- **Quality Score fixes (Lenoy battle-plan):** verify the hero rebuild (~567KB) satisfies the image-payload constraint, execute QS fixes, ride ~2 weeks, re-pull cost/booking, then revisit budget.
- **Quo cleanup:** spam-block the repeat dialers — Aug 1–17 shows 8 numbers calling 2+ times, one 3×, none of which match an EHR booking. Establish a clean post-swap baseline before treating Quo call volume as a KPI.
- **CardiaCheck / HeartCheck (second vertical, parked pending UME stabilization):** preventive cardiology cash-pay stack (cardiac assessment panel, GLP-1/metabolic membership, insurance-billed cardiology as the largest revenue line), on Dr. Weiss's existing equipment. Domain **cardiacheck.com** secured.
- **FX3 expansion & sales enablement:** DC-metro cold-call list built (112 independent practices post-chain-filter); study guide + call script for Tog to practice personally (30–50 dials before outsourcing); AmpUp.ai KB built. Single-call goal: book a 15-minute follow-up showing real local search-demand data.

---

## 11. Governing rulings on contested numbers

Three items conflicted across the FX3 skill and prior memory. This file governs; the rulings below are the standing position. Two are resolved from real data; one (ROAS) is deliberately frozen because resolving it honestly requires a live recompute, not a pick.

**Ruling 1 — ROAS is FROZEN. Do not quote any ROAS figure client-facing until recomputed live.**
The sources genuinely disagree, and memory disagrees with itself: skill says ~4.2× web-attributed / ~10× blended; the memory summary says ~9–10× web-attributed / ~5× blended; other memory notes imply ~9–10× *blended* at low spend declining to ~5–6× at maturity. These aren't reconcilable by inspection because they use different spend windows, different booking sets (web-only vs. blended), and different revenue bases. **Standing rule:** no ROAS number goes on any page, deck, or proposal until it is recomputed live with explicit definitions locked — (a) spend window, (b) which bookings count (web-attributed floor vs. blended, both labeled), (c) revenue = bookings × $599. Once computed, record the locked figure here and this ruling retires. Until then, treat 4.2× / 5× / 9–10× / 10× all as unusable.

**Ruling 2 — Demand framing: the market is a mature, seasonal, ~flat-YoY harvest market. RESOLVED.**
Governing narrative: the five-county catchment (~770/mo) is mature and seasonal, roughly flat year-over-year; you grow by taking share, and the ceiling (~40 attributed bookings/mo) is real and near. The skill's "~73% YoY structural decline" is **superseded** — it's a narrow-window, volume-weighted read off tiny bucketed bases (an earlier "-14% YoY, falling hard" estimate was already shown to be wrong the same way; the honest aggregate 4-year trend line reads flat). EHR immigration volume actually *rose* 2024→2026 as FX3 took share. Keep the USCIS memo **PM-602-0199** on the radar as a *separate* regulatory risk to re-verify (it is a policy-risk item, not a demand-trend claim) — but it does not change the demand framing.

**Ruling 3 — Proof point: "~3 → ~15+ exams/month, EHR-verified" is the standing conservative claim. RESOLVED.**
Grounding: 2024 ran ~40 immigration appts (~3.3/mo) — the pre-engagement baseline; 2026 is at 138 through July (~20/mo), best month **25 (May)**, and **August pacing ~29** (measured Aug 1–17, see §7 — an earlier ~31 estimate ran hot). So "~3 → ~15+/month" is defensible and conservative for sustained lift; "~15–20+/month" is fair for a recent-months framing. The skill's "3 → 24" is defensible only as a **labeled peak/rolled-window** figure, not the sustained number — don't present it bare. Lock one framing per asset before it ships. *(Source: annual EHR exports `AppointmentBookingDetailALL2024/2025.csv`; 2026 baseline from the `-17` export; Aug pace from the Aug 18 2026 four-system reconciliation in §7.)*

**Downstream cleanup this ruling implies (not yet done):** the FX3 skill body and `references/case-study.md` still carry the old ROAS numbers, the "73% structural decline" framing, and the "3 → 24" pitch. Those should be updated to point here — the ROAS lines neutralized to "recompute live (see UME core context §11)," the decline framing corrected, and the pitch number aligned. Flagging rather than silently rewriting the sales brief; do on Tog's go.

---

## 12. Working style (apply to all UME/FX3 work)

Direct, data-driven, accountability-first. **Conclusion before explanation.** One sharp recommendation with next steps, not option menus. **Prose over bullets** in strategy/analysis. Cited data over asserted claims — correct errors immediately with the citation. EHR as source of truth over platform metrics. Honest framing in everything client-facing, including the dual/floored attribution. No proactive HTML/visual deliverables unless asked. Verify a prospect actually offers the relevant service before any outreach.
