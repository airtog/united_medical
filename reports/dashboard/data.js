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
  weeklyFunnel: [
    { week: "2025-09-01", trad: 1, web: 1, calls: null, spend: null },
    { week: "2025-09-22", trad: 0, web: 2, calls: null, spend: null },
    { week: "2025-09-29", trad: 0, web: 2, calls: null, spend: null },
    { week: "2025-10-06", trad: 1, web: 1, calls: null, spend: null },
    { week: "2025-10-13", trad: 1, web: 0, calls: null, spend: null },
    { week: "2025-10-20", trad: 1, web: 0, calls: null, spend: null },
    { week: "2025-10-27", trad: 1, web: 0, calls: null, spend: null },
    { week: "2025-11-03", trad: 2, web: 0, calls: null, spend: null },
    { week: "2025-11-10", trad: 1, web: 0, calls: null, spend: null },
    { week: "2025-11-17", trad: 1, web: 1, calls: null, spend: null },
    { week: "2025-11-24", trad: 4, web: 0, calls: null, spend: null },
    { week: "2025-12-01", trad: 0, web: 5, calls: null, spend: null },
    { week: "2025-12-08", trad: 2, web: 3, calls: null, spend: null },
    { week: "2025-12-15", trad: 2, web: 0, calls: 19, spend: null },
    { week: "2025-12-22", trad: 0, web: 1, calls: 19, spend: null },
    { week: "2025-12-29", trad: 1, web: 1, calls: 15, spend: null },
    { week: "2026-01-05", trad: 4, web: 0, calls: 15, spend: null },
    { week: "2026-01-12", trad: 2, web: 4, calls: 13, spend: null },
    { week: "2026-01-19", trad: 0, web: 4, calls: 5, spend: null },
    { week: "2026-01-26", trad: 0, web: 0, calls: 6, spend: null },
    { week: "2026-02-02", trad: 4, web: 1, calls: 9, spend: null },
    { week: "2026-02-09", trad: 3, web: 2, calls: 8, spend: null },
    { week: "2026-02-16", trad: 3, web: 2, calls: 5, spend: null },
    { week: "2026-02-23", trad: 3, web: 3, calls: 11, spend: null },
    { week: "2026-03-02", trad: 2, web: 1, calls: 5, spend: null },
    { week: "2026-03-09", trad: 4, web: 0, calls: 5, spend: null },
    { week: "2026-03-16", trad: null, web: null, calls: 3, spend: null },
    { week: "2026-03-23", trad: null, web: null, calls: 8, spend: null },
    { week: "2026-03-30", trad: null, web: null, calls: 3, spend: null },
    { week: "2026-04-06", trad: null, web: null, calls: 5, spend: null },
    { week: "2026-04-13", trad: null, web: null, calls: 9, spend: null },
    { week: "2026-04-20", trad: null, web: null, calls: 13, spend: null },
    { week: "2026-04-27", trad: null, web: null, calls: 4, spend: null },
    { week: "2026-05-04", trad: null, web: null, calls: 6, spend: null },
    { week: "2026-05-11", trad: null, web: null, calls: 8, spend: null },
    { week: "2026-05-18", trad: null, web: null, calls: 11, spend: null },
    { week: "2026-05-25", trad: null, web: null, calls: 12, spend: null },
    { week: "2026-06-01", trad: null, web: null, calls: 15, spend: null },
    { week: "2026-06-08", trad: null, web: null, calls: 10, spend: null },
    { week: "2026-06-15", trad: null, web: null, calls: 6, spend: null },
    { week: "2026-06-22", trad: null, web: null, calls: 8, spend: null },
    { week: "2026-06-29", trad: null, web: null, calls: 17, spend: null },
    { week: "2026-07-06", trad: null, web: null, calls: 26, spend: null },
    { week: "2026-07-13", trad: null, web: null, calls: 75, spend: null },
    { week: "2026-07-20", trad: null, web: null, calls: 15, spend: null },
    { week: "2026-07-27", trad: null, web: null, calls: 13, spend: null },
    { week: "2026-08-03", trad: 4, web: 1, calls: 19, spend: null },
    { week: "2026-08-10", trad: 6, web: 3, calls: 45, spend: null },
    { week: "2026-08-17", trad: 2, web: 0, calls: 52, spend: null },
    { week: "2026-08-24", trad: 3, web: 1, calls: 18, spend: null },
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
        "01": { trad: 6,  web: 9,  cancels: null, spend: null,    impressions: null, clicks: null, ctr: null, cpc: null, conv: null,
                calls: null },
        "02": { trad: 13, web: 8,  cancels: null, spend: null,    impressions: null, clicks: null, ctr: null, cpc: null, conv: null,
                calls: null },
        "03": { trad: 19, web: 2,  cancels: null, spend: null,    impressions: null, clicks: null, ctr: null, cpc: null, conv: null,
                calls: null,
                note: "Ads verification pause ~Mar 9–Apr 5 suppressed web bookings" },
        "04": { trad: 14, web: 6,  cancels: null, spend: null,    impressions: null, clicks: null, ctr: null, cpc: null, conv: null,
                calls: null },
        "05": { trad: 11, web: 14, cancels: null, spend: 914.57,  impressions: 4047, clicks: 297,  ctr: 7.17, cpc: 3.19, conv: null,
                calls: null,
                note: "record month (25)" },
        "06": { trad: 14, web: 5,  cancels: null, spend: null,    impressions: null, clicks: null, ctr: null, cpc: null, conv: null,
                calls: null,
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
                  adCalls:      null,  // call asset live Aug 14 (5 calls its first morning); full-month total → Ads Call details
                  siteCalls:    null,  // number-swap live Aug 13 (verified end-to-end); full-month total → Ads Call details
                  callConv:     null,  // the month's 18 `conv` mixes web bookings + ≥60s calls; split → conversions summary
                  sonaAnswered: 23,   // full-month, Quo export pulled 2026-09-02
                  // days = calls by date, Quo export pulled 2026-09-02. Sum MUST equal quoInbound.
                  days: { "1":1,"2":1,"3":5,"4":2,"6":2,"7":7,"8":3,"10":5,"11":6,"12":11,"13":8,"14":14,"15":1,"17":9,"18":9,"19":9,"20":9,"21":9,"22":5,"23":2,"24":10,"25":4,"27":2,"28":2,"31":7 },
                  phoneMatch: { matched: 6, of: 8,
                    note: "mid-month audit (Aug 13): Marte, Taday, Elbanna, Holder, Silvestre, Wilson verified as tracked-line callers; late-month traditionals unaudited pending fresh EHR export" }
                },
                quoSrc: "Quo export 2025-12-01–2026-09-03, pulled 2026-09-02"
        }
      },
      banked_next: { label: "Booked for Sept", exams: 6, revenue: 3594 }
    }

  },

  tagBreak: "Before Sep 2025, the EHR 'WEB SITE' appointment type was an internal staff label (largely returning-patient cross-sell), NOT online self-booking. Online booking via Calendly begins Sep 2025. Charts must not present pre-Sep-2025 'web' as online bookings.",

  // Known gaps to backfill. Rendered nowhere — kept here as the working list.
  backlog: [
    "Ads monthlies Jan–Apr + Jun 2026 (spend/impressions/clicks/CTR/CPC) — pull from Ads UI month-by-month",
    "Aug 2026 phone-match completion — re-run against a fresh EHR export now that full-month call data is in",
    "Aug 2026 Call details pull (Aug 14–31) → adCalls, siteCalls; conversions summary → callConv split",
    "Weekly spend backfill, Oct 2025 → present — Ads UI segmented by week (Claude/chat session, one pull)",
    "Quo export Sep 2026 → present — continue the weekly calls series past 2026-08-24",
    "Confirm whether the tracked line existed before 2025-12-16 (current export's floor) → fill Dec 1–14 2025 if so",
    "Re-import Jan–Jul 2026 EHR full export → fill weekly bookings gap Mar 16–Jul 27",
    "Reconcile derived pause zones against remembered verification-pause ranges once spend series lands"
  ]
};
