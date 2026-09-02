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

   Self-enforced sanity rule (index.html checks this on every render):
     for each month, sum(days) === sum(weeks) === trad + web
   A mismatch renders a red "⚠ data mismatch" banner instead of a quiet chart.
--------------------------------------------------------------------------- */

window.UME_DATA = {
  price: 599,
  baselineMonthly: 3.4,            // 2024–25 avg bookings/mo, dashed line on charts

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
        "01": { trad: 6,  web: 9,  cancels: null, spend: null,    impressions: null, clicks: null, ctr: null, cpc: null, conv: null },
        "02": { trad: 13, web: 8,  cancels: null, spend: null,    impressions: null, clicks: null, ctr: null, cpc: null, conv: null },
        "03": { trad: 19, web: 2,  cancels: null, spend: null,    impressions: null, clicks: null, ctr: null, cpc: null, conv: null,
                note: "Ads verification pause ~Mar 9–Apr 5 suppressed web bookings" },
        "04": { trad: 14, web: 6,  cancels: null, spend: null,    impressions: null, clicks: null, ctr: null, cpc: null, conv: null },
        "05": { trad: 11, web: 14, cancels: null, spend: 914.57,  impressions: 4047, clicks: 297,  ctr: 7.17, cpc: 3.19, conv: null,
                note: "record month (25)" },
        "06": { trad: 14, web: 5,  cancels: null, spend: null,    impressions: null, clicks: null, ctr: null, cpc: null, conv: null,
                note: "tracking fixed Jun 11; GBP→tracked line Jun 25" },
        "07": { trad: 6,  web: 11, cancels: null, spend: 1505,    impressions: 4757, clicks: null, ctr: 7.21, cpc: 4.39, conv: 9 },
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
                ]
        }
      },
      banked_next: { label: "Booked for Sept", exams: 6, revenue: 3594 }
    }

  },

  tagBreak: "Before Sep 2025, the EHR 'WEB SITE' appointment type was an internal staff label (largely returning-patient cross-sell), NOT online self-booking. Online booking via Calendly begins Sep 2025. Charts must not present pre-Sep-2025 'web' as online bookings.",

  // Known gaps to backfill. Rendered nowhere — kept here as the working list.
  backlog: [
    "Ads monthlies Jan–Apr + Jun 2026 (spend/impressions/clicks/CTR/CPC) — pull from Ads UI month-by-month"
  ]
};
