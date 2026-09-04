/* ---------------------------------------------------------------------------
   UME Performance — Master Dashboard : DATA FILE
   ---------------------------------------------------------------------------
   This is the ONLY file that changes on a data update. index.html is built
   once and never edited for numbers.

   Counting rules
   --------------
   • Every person / every EHR row = one exam. Families are individual exams.
   • Cancellations are EXCLUDED from trad/web/days/weeks counts; the number
     removed is recorded in `cancels`.
   • countBasis says which date the year is counted on:
       "service-month" — yearly EHR exports are service-date bounded (2023–25)
       "create-month"  — appointment creation date (2026 onward)
     Never mix bases in one chart without showing the caption.
   • webTagComparable: before Sep 2025 the EHR "WEB SITE" appointment type was
     an internal staff label, NOT online self-booking. See `tagBreak` below.
   • Ads fields are null where the number is not on record. They render as "—".
     NEVER invent one.
   • weeklyFunnel[] is the Ad Spend → Calls → Bookings chart's source. It is
     SPARSE: only weeks with at least one known field (trad/web/calls/spend)
     appear as rows. A week absent from the array entirely is a true gap — the
     chart fills the continuous Monday-to-Monday range itself and renders any
     week missing from this array as "no data" (hatched band), never as zero.
     A week THAT IS in the array with trad:0, web:0 is a real, verified zero —
     keep it. spend is null throughout pending the weekly Ads backfill (see
     backlog); paused-campaign zones must be DERIVED from spend===0 runs once
     that backfill lands, never hand-entered from memory — recollected pause
     dates have already conflicted with observed data once.
   • engagementStart marks when the FX3 engagement began, for the small start
     marker on the year/month controls. Not a data metric — never charted.
   • calls{} carries the phone layer, which is half the demand system:
       quoInbound   human inbound calls on the tracked Quo line, full month
                    (spam/robo excluded where identifiable)
       adCalls      calls via the ad's call button (Google forwarding), any duration
       siteCalls    calls via the website number-swap (paid sessions), any duration
       callConv     ≥60s call conversions counted by Google — a SUBSET of `conv`
       sonaAnswered after-hours calls handled by Sona
       phoneMatch   { matched, of, note } — the monthly Quo↔EHR attribution FLOOR
     `calls: null` on a 2026 month means call tracking did not exist yet, and
     renders "—" throughout. Never write a zero to stand in for "unknown".

   Self-enforced sanity rule (index.html checks this on every render):
     for each month, sum(days) === sum(weeks) === trad + web
   A mismatch renders a red "⚠ data mismatch" banner instead of a quiet chart.
--------------------------------------------------------------------------- */

window.UME_DATA = {
  price: 599,
  baselineMonthly: 3.4,            // 2024–25 avg bookings/mo, dashed line on charts

  engagementStart: { year: "2025", month: "11", label: "FX3 engagement began" },

  // Sparse weekly series for the Ad Spend → Calls → Bookings chart. See the
  // header note above for the gap-vs-zero rule this array depends on. calls
  // values are raw Quo call-log counts, from a full export (pulled
  // 2026-09-02, complete weeks through 2026-08-24). No rows exist before
  // 2025-12-16 despite the export's filename claiming coverage from
  // 2025-12-01 — see backlog.
  //
  // spend aggregated from a daily Google Ads export (pulled
  // 2026-09-02, covers 2025-10-01–2026-09-02, complete weeks through
  // 2026-08-24). The week of 2025-09-29 is excluded from the fill even
  // though it is inside the export's own date math — the export itself
  // starts 2025-10-01, so that week only has 5 of its 7 days represented
  // and a total here would understate it. Two consecutive weeks land at
  // exactly spend:0 (2026-04-06, 2026-04-13) — a real, verified pause, not
  // a gap. The month note on 2026-03 says "verification pause ~Mar 9–Apr
  // 5"; the actual zero-spend window per this export is Apr 3–23 (a 5-day
  // dip Jan 17–21 doesn't align to a week boundary and isn't reflected as
  // a full zero week). That discrepancy is unresolved — see backlog.
  weeklyFunnel: [
    { week: "2025-09-01", trad: 1, web: 1, calls: null, spend: null },
    { week: "2025-09-22", trad: 0, web: 2, calls: null, spend: null },
    { week: "2025-09-29", trad: 0, web: 2, calls: null, spend: null },
    { week: "2025-10-06", trad: 1, web: 1, calls: null, spend: 261.92 },
    { week: "2025-10-13", trad: 1, web: 0, calls: null, spend: 276.41 },
    { week: "2025-10-20", trad: 1, web: 0, calls: null, spend: 202.98 },
    { week: "2025-10-27", trad: 1, web: 0, calls: null, spend: 295.36 },
    { week: "2025-11-03", trad: 2, web: 0, calls: null, spend: 222.59 },
    { week: "2025-11-10", trad: 1, web: 0, calls: null, spend: 238.36 },
    { week: "2025-11-17", trad: 1, web: 1, calls: null, spend: 211.41 },
    { week: "2025-11-24", trad: 4, web: 0, calls: null, spend: 207.27 },
    { week: "2025-12-01", trad: 0, web: 5, calls: null, spend: 215.36 },
    { week: "2025-12-08", trad: 2, web: 3, calls: null, spend: 206.18 },
    { week: "2025-12-15", trad: 2, web: 0, calls: 19, spend: 110.36 },
    { week: "2025-12-22", trad: 0, web: 1, calls: 19, spend: 303.62 },
    { week: "2025-12-29", trad: 1, web: 1, calls: 15, spend: 205.25 },
    { week: "2026-01-05", trad: 4, web: 0, calls: 15, spend: 201.62 },
    { week: "2026-01-12", trad: 2, web: 4, calls: 13, spend: 157.96 },
    { week: "2026-01-19", trad: 0, web: 4, calls: 5, spend: 33.12 },
    { week: "2026-01-26", trad: 0, web: 0, calls: 6, spend: 363.13 },
    { week: "2026-02-02", trad: 4, web: 1, calls: 9, spend: 204.23 },
    { week: "2026-02-09", trad: 3, web: 2, calls: 8, spend: 258.07 },
    { week: "2026-02-16", trad: 3, web: 2, calls: 5, spend: 222.54 },
    { week: "2026-02-23", trad: 3, web: 3, calls: 11, spend: 203.93 },
    { week: "2026-03-02", trad: 2, web: 1, calls: 5, spend: 171.77 },
    { week: "2026-03-09", trad: 4, web: 0, calls: 5, spend: 229.91 },
    { week: "2026-03-16", trad: null, web: null, calls: 3, spend: 220.53 },
    { week: "2026-03-23", trad: null, web: null, calls: 8, spend: 181.25 },
    { week: "2026-03-30", trad: null, web: null, calls: 3, spend: 116.52 },
    { week: "2026-04-06", trad: null, web: null, calls: 5, spend: 0 },
    { week: "2026-04-13", trad: null, web: null, calls: 9, spend: 0 },
    { week: "2026-04-20", trad: null, web: null, calls: 13, spend: 111.73 },
    { week: "2026-04-27", trad: null, web: null, calls: 4, spend: 279.78 },
    { week: "2026-05-04", trad: null, web: null, calls: 6, spend: 226.60 },
    { week: "2026-05-11", trad: null, web: null, calls: 8, spend: 208.80 },
    { week: "2026-05-18", trad: null, web: null, calls: 11, spend: 199.09 },
    { week: "2026-05-25", trad: null, web: null, calls: 12, spend: 220.08 },
    { week: "2026-06-01", trad: null, web: null, calls: 15, spend: 144.31 },
    { week: "2026-06-08", trad: null, web: null, calls: 10, spend: 361.78 },
    { week: "2026-06-15", trad: null, web: null, calls: 6, spend: 359.44 },
    { week: "2026-06-22", trad: null, web: null, calls: 8, spend: 319.64 },
    { week: "2026-06-29", trad: null, web: null, calls: 17, spend: 327.62 },
    { week: "2026-07-06", trad: null, web: null, calls: 26, spend: 362.42 },
    { week: "2026-07-13", trad: null, web: null, calls: 75, spend: 359.58 },
    { week: "2026-07-20", trad: null, web: null, calls: 15, spend: 315.28 },
    { week: "2026-07-27", trad: null, web: null, calls: 13, spend: 297.70 },
    { week: "2026-08-03", trad: 4, web: 1, calls: 19, spend: 326.79 },
    { week: "2026-08-10", trad: 6, web: 3, calls: 45, spend: 402.85 },
    { week: "2026-08-17", trad: 2, web: 0, calls: 52, spend: 370.34 },
    { week: "2026-08-24", trad: 3, web: 1, calls: 18, spend: 214.25 },
    { week: "2026-08-31", trad: 1, web: 4, calls: null, spend: null }
  ],

  // Manual override for paused-campaign shading (week, week, label). Empty
  // until the spend backfill lands and zones can be derived from spend===0
  // runs — see backlog. Auto-derivation still runs against whatever spend
  // data exists; this array only ever ADDS zones the derivation missed, it
  // never hand-dates one.
  pausedZones: [],

  years: {

    "2023": {
      countBasis: "service-month",
      webTagComparable: false,
      months: {
        "01": { trad: 2, web: 5 }, "02": { trad: 1, web: 8 }, "03": { trad: 3, web: 8 },
        "04": { trad: 0, web: 3 }, "05": { trad: 3, web: 5 }, "06": { trad: 3, web: 3 },
        "07": { trad: 2, web: 1 }, "08": { trad: 3, web: 1 }, "09": { trad: 1, web: 4 },
        "10": { trad: 0, web: 6 }, "11": { trad: 0, web: 2 }, "12": { trad: 0, web: 3 }
      } // total 67
    },

    "2024": {
      countBasis: "service-month",
      webTagComparable: false,
      note: "pre-engagement baseline",
      months: {
        "01": { trad: 1, web: 4 }, "02": { trad: 0, web: 1 }, "03": { trad: 0, web: 2 },
        "04": { trad: 2, web: 1 }, "05": { trad: 4, web: 4 }, "06": { trad: 1, web: 2 },
        "07": { trad: 5, web: 1 }, "08": { trad: 0, web: 1 }, "09": { trad: 4, web: 0 },
        "10": { trad: 3, web: 0 }, "11": { trad: 1, web: 0 }, "12": { trad: 3, web: 0 }
      } // total 40
    },

    "2025": {
      countBasis: "service-month",
      webTagComparable: "from-09",   // Calendly era begins Sep 2025
      note: "pre-engagement",
      months: {
        "01": { trad: 2, web: 0 }, "02": { trad: 8, web: 0 }, "03": { trad: 5, web: 0 },
        "04": { trad: 3, web: 0 }, "05": { trad: 4, web: 0 }, "06": { trad: 3, web: 0 },
        "07": { trad: 3, web: 0 }, "08": { trad: 5, web: 0 }, "09": { trad: 1, web: 5 },
        "10": { trad: 4, web: 1 }, "11": { trad: 6, web: 1 }, "12": { trad: 6, web: 10 }
      } // total 67
    },

    "2026": {
      countBasis: "create-month",
      webTagComparable: true,
      months: {
        // trad/web = booked exams by EHR create month, cancellations excluded.
        // calls: null before Aug 2026 — the tracked line / call assets did not
        // exist yet, so there is nothing to report and nothing to zero.
        "01": { trad: 6,  web: 9,  cancels: null, spend: 839.52,  impressions: 3652, clicks: 263,  ctr: 7.20, cpc: 3.19, conv: 2,
                calls: null, adsSrc: "Google Ads: daily performance export 2025-10-01–2026-09-02, pulled 2026-09-02",
                note: "Ads paused Jan 17–21" },
        "02": { trad: 13, web: 8,  cancels: null, spend: 892.73,  impressions: 3736, clicks: 296,  ctr: 7.92, cpc: 3.02, conv: 6,
                calls: null, adsSrc: "Google Ads: daily performance export 2025-10-01–2026-09-02, pulled 2026-09-02" },
        "03": { trad: 19, web: 2,  cancels: null, spend: 908.35,  impressions: 3311, clicks: 326,  ctr: 9.85, cpc: 2.79, conv: 1,
                calls: null, adsSrc: "Google Ads: daily performance export 2025-10-01–2026-09-02, pulled 2026-09-02",
                note: "Ads verification pause ~Mar 9–Apr 5 suppressed web bookings" },
        "04": { trad: 14, web: 6,  cancels: null, spend: 381.35,  impressions: 1437, clicks: 108,  ctr: 7.52, cpc: 3.53, conv: 0,
                calls: null, adsSrc: "Google Ads: daily performance export 2025-10-01–2026-09-02, pulled 2026-09-02",
                note: "Ads paused Apr 3–23 (spend is real — only 9 days of the month had any activity)" },
        "05": { trad: 11, web: 14, cancels: null, spend: 914.57,  impressions: 4047, clicks: 297,  ctr: 7.17, cpc: 3.19, conv: null,
                calls: null,
                note: "record month (25)" },
        "06": { trad: 14, web: 5,  cancels: null, spend: 1272.69, impressions: 3379, clicks: 303,  ctr: 8.97, cpc: 4.20, conv: 4,
                calls: null, adsSrc: "Google Ads: daily performance export 2025-10-01–2026-09-02, pulled 2026-09-02",
                note: "tracking fixed Jun 11; GBP→tracked line Jun 25" },
        "07": { trad: 6,  web: 11, cancels: null, spend: 1505,    impressions: 4757, clicks: null, ctr: 7.21, cpc: 4.39, conv: 9,
                calls: null },
        "08": { trad: 16, web: 9,  cancels: 3,    spend: 1394.70, impressions: 3325, clicks: 260,  ctr: 7.82, cpc: 5.36, conv: 18,
                note: "ties record (25) · #1 ad impression share (22.7%) · call tracking launched",
                revised: "2026-09-03 — 2 post-close cancellations removed",
                // days = exams by create date, cancellations excluded;
                // Sulemans on the 29th (booking date). Sum MUST equal trad+web.
                days: { "4":2,"6":1,"7":2,"10":3,"11":3,"12":3,"17":1,"18":1,"24":1,"25":1,"26":1,"27":1,"29":4,"31":1 },
                weeks: [
                  { label: "Aug 1–9",   web: 1, phone: 4, spend: null, notes: "" },
                  { label: "Aug 10–16", web: 2, phone: 4, spend: null, notes: "conversion tracking rebuilt; call conversions live" },
                  { label: "Aug 17–23", web: 1, phone: 1, spend: null, notes: "" },
                  { label: "Aug 24–31", web: 5, phone: 7, spend: null, notes: "Suleman family ×4 online Sat; 3 cancels post-close" }
                  // week 4 includes 2 cancels that were later removed;
                  // displayed counts exclude them: web 5 phone 5
                ],
                calls: {
                  quoInbound:   143,  // full-month, Quo export pulled 2026-09-02
                  adCalls:      31,   // Call source = Ad, Aug 13–31 (GFN log doesn't cover Aug 1–12)
                  siteCalls:    8,    // Call source = Website, Aug 13–31
                  // callConv counts raw rows with duration >= 60s (13). It runs
                  // below the month's `conv` figure (18) on purpose, not by
                  // error: Google Ads dedupes call conversions per ad click
                  // ("one per click") before it reports `conv`, while callConv
                  // counts every qualifying call. Both are correct for what
                  // they measure — do not force them to reconcile.
                  callConv:     13,
                  sonaAnswered: 23,   // full-month, Quo export pulled 2026-09-02
                  // days = calls by date, Quo export pulled 2026-09-02. Sum MUST equal quoInbound.
                  days: { "1":1,"2":1,"3":5,"4":2,"6":2,"7":7,"8":3,"10":5,"11":6,"12":11,"13":8,"14":14,"15":1,"17":9,"18":9,"19":9,"20":9,"21":9,"22":5,"23":2,"24":10,"25":4,"27":2,"28":2,"31":7 },
                  phoneMatch: { matched: 6, of: 8,
                    note: "mid-month audit (Aug 13): Marte, Taday, Elbanna, Holder, Silvestre, Wilson verified as tracked-line callers; late-month traditionals unaudited pending fresh EHR export" }
                },
                quoSrc: "Quo export 2025-12-01–2026-09-03, pulled 2026-09-02",
                adsSrc: "Google Ads: daily performance export 2025-10-01–2026-09-02 + Call details (GFN log, since 2026-08-13), pulled 2026-09-02"
        },
        "09": { trad: 7,  web: 1,  cancels: 0,    spend: 213.00,  impressions: 314,  clicks: 28,   ctr: 8.92, cpc: 7.61, conv: 0,
                note: "MTD through Sep 4 · dry-run daily pull",
                // days = exams by create date, cancellations excluded. Sum MUST equal trad+web.
                days: { "1":3, "4":5 },
                weeks: [
                  { label: "Sep 1–7", web: 1, phone: 7, spend: 213.00, notes: "MTD through Sep 4 (week in progress)" }
                ],
                calls: {
                  quoInbound:   18,   // MTD Sep 1–4, Quo analytics
                  adCalls:      null, // GFN/call-details not pulled in this dry run
                  siteCalls:    null,
                  callConv:     null,
                  sonaAnswered: null, // Sona totals not visible in Quo analytics for this window
                  // no per-day Quo breakdown in this dry run — omit days rather than invent zeros
                },
                quoSrc: "Quo analytics MTD Sep 1–4 2026, pulled 2026-09-04 (inbound 18: forwarded 16, answered 1, missed 1)",
                adsSrc: "Google Ads Campaign report Sep 1–4 2026, Cardiacare Center PC, pulled 2026-09-04"
        }
      },
      banked_next: { label: "Booked for Oct", exams: 0, revenue: 0 }
    }

  },

  tagBreak: "Before Sep 2025, the EHR 'WEB SITE' appointment type was an internal staff label (largely returning-patient cross-sell), NOT online self-booking. Online booking via Calendly begins Sep 2025. Charts must not present pre-Sep-2025 'web' as online bookings.",

  // Known gaps to backfill. Rendered nowhere — kept here as the working list.
  backlog: [
    "Aug 2026 phone-match completion — re-run against a fresh EHR export now that full-month call data is in",
    "March 2026 note says \"Ads verification pause ~Mar 9–Apr 5\" — verified daily spend shows real spend continued through Apr 2 and the actual zero-spend pause is Apr 3–23; reconcile the note against this",
    "Quo export Sep 2026 → present — continue the weekly calls series past 2026-08-24",
    "Google Ads export Sep 2026 → present — continue weekly spend past 2026-08-24",
    "Confirm whether the tracked line existed before 2025-12-16 (current export's floor) → fill Dec 1–14 2025 if so",
    "GFN call log Aug 1–12 2026 if available → adCalls/siteCalls/callConv currently start 2026-08-13, the log's own floor",
    "Re-import Jan–Jul 2026 EHR full export → fill weekly bookings gap Mar 16–Jul 27"
  ]
};
