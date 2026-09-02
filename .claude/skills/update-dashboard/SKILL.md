---
name: update-dashboard
description: Update the UME master performance dashboard (unitedmedicalexams.com/reports/dashboard) from a fresh AdvancedMD EHR CSV export, plus — at monthly close — a Quo call export and Google Ads numbers. Use whenever Tog says "update the dashboard", "dashboard update", "new EHR export", "recount the month", "close out the month", mentions Quo call data or phone attribution, drops a CSV from ~/Downloads and asks for the numbers refreshed, or asks to finalize a month. Encodes the counting rules (create-date basis, families = individual exams, cancellations excluded), the boundary checks that catch a truncated export, the provenance stamping, and the deploy + live-verify + stealth checks.
---

# Update the UME master dashboard

The dashboard lives at `reports/dashboard/` and is two files:

| file | role |
|---|---|
| `reports/dashboard/index.html` | all markup / CSS / JS. **Built once. Never edit it for a data update.** |
| `reports/dashboard/data.js`    | `window.UME_DATA = {…}` — every number. **This is the only file you touch.** |

If a data update seems to require an `index.html` change, stop and say so — it almost
certainly means the schema needs a new field, which is a separate decision.

## Two cadences — know which one you are running

| | input | touches |
|---|---|---|
| **Weekly** | EHR CSV only | `trad` / `web` / `days` / `weeks` / `cancels`. **`calls` is not touched** — never infer phone numbers from a booking export. |
| **Monthly close** | EHR CSV **+ Quo month export + Ads figures** | everything above, plus the whole `calls` block and the `revised` note |

If Tog hands you only a CSV, it is a weekly run. Do not leave `calls` half-filled
from a partial month — say what is still needed and add it to `backlog`.

**Every weekly run, regardless of cadence, also appends one row to
`weeklyFunnel`** — the source for the "Ad Spend → Calls → Bookings" chart:

```js
{ week: "YYYY-MM-DD", trad: N, web: N, calls: N|null, spend: N|null }
```

- `week` is the Monday (ISO, Mon-start) the booking week falls in.
- `trad` / `web` come from the same EHR CSV as the month's own recount —
  do not recompute differently.
- `calls` is that week's Quo inbound count if a Quo export came with this
  run, else `null`. Never estimate it from a partial pull.
- `spend` is `null` until month close fills it in from the Ads UI. A week
  genuinely worth $0 (a real pause) is `spend: 0`, not `null` — the funnel
  chart's paused-zone shading depends on that distinction, and a `null`
  written where a `0` belongs will silently swallow a pause from the chart.
- If the week is missing from `weeklyFunnel` entirely, the chart renders it
  as a true gap (hatched, no bar). Never invent a row to fill a week you
  have not actually recounted.

---

## 1. Read the export before you trust it

Input is normally a fresh AdvancedMD CSV in `~/Downloads`.

**Parse with `csv.DictReader` and `encoding='utf-8-sig'`. Never pandas.**
The BOM silently corrupts the first column name, and pandas' type coercion has
mangled these exports before.

```python
import csv
with open(path, newline='', encoding='utf-8-sig') as f:
    rows = list(csv.DictReader(f))
```

**Boundary-check before counting anything.** Print and compare:

- `Textbox35` — the date range the report *claims* to cover
- actual `min()` / `max()` of `Textbox39` (appointment **create** date)
- actual `min()` / `max()` of `StartDate2` (appointment **service** date)

If the actual create-date range is narrower than `Textbox35`, the export is
truncated or filtered — **stop and re-pull it**. Counting a truncated export is
how a month silently loses bookings. Report the three ranges to Tog before
moving on.

---

## 2. Recount the current month

Basis for 2026 onward is the **create month** (`Textbox39`), matching
`countBasis: "create-month"` in `data.js`.

- **Every person / every row = one exam.** A family of four booking together is
  four exams, not one. Do not de-duplicate by household, phone, or surname.
- **Web vs traditional:** appointment type `"IMMIGRATION - WEB SI"` → `web`.
  Everything else → `trad`.
- **Cancellations:** rows present in a prior export but missing from this one are
  cancellations. For each: decrement the count it was in, increment `cancels`,
  and say so in the summary. Never leave a cancellation silently absorbed.
- Recompute, for the current month: `trad`, `web`, `days` (by create date),
  and the `weeks` array (`web` / `phone` per week).

**The sanity rule.** Before writing anything:

```
sum(days) === sum(week.web + week.phone) === trad + web
```

The dashboard renders a red "⚠ data mismatch" banner when this fails, so a bad
write is visible rather than silent — but catch it here, not there.

---

## 3. Months are not final until ~3 business days into the next month

Post-close cancellations land days after month end. A month closed on the 1st
will be wrong. When you recount a closed month:

- set `revised: "YYYY-MM-DD — reason"` on that month object
  (e.g. `"2026-09-03 — 2 post-close cancellations removed"`)
- adjust `trad` / `web` / `days` / `weeks` / `cancels` to match the new reality —
  a `revised` note whose numbers still show the old total is worse than no note

---

## 4. Ads numbers (monthly close)

From the pasted Ads block, fill `spend`, `impressions`, `clicks`, `ctr`, `cpc`,
`conv` on the month — and from the **Call details** report and the conversions
summary, the three ad-side call fields in `calls`:

- `adCalls` — calls via the ad's call button (Google forwarding), any duration
- `siteCalls` — calls via the website number-swap on paid sessions, any duration
- `callConv` — ≥60s call conversions Google counted. This is a **subset of
  `conv`**, not an addition to it. Never sum the two.

**Fields you were not given stay `null`.** They render as "—". Never derive a
missing metric from the others (no `clicks = impressions × ctr`), never carry a
number forward from a previous month, and never let a partial month stand in as
a month total — a count that starts mid-month is a floor, not a total, and
belongs in `backlog` until the full figure exists. A blank is honest; a guess is not.

---

## 5. Calls and phone attribution (monthly close)

Input is a **Quo month CSV export**. From it:

- `quoInbound` — human inbound calls on the tracked line for the full month.
  Exclude spam/robocalls where identifiable, and say how many you dropped.
- `sonaAnswered` — after-hours calls Sona handled, from the Quo log.

Then run the **phone match** against that month's traditional (non-web) EHR rows:

- normalize both sides to the **last 10 digits** before joining — Quo and
  AdvancedMD format numbers differently and a raw string join silently misses
- record the result as `phoneMatch: { matched, of, note }`

`phoneMatch` is an **attribution floor, not a rate.** It says "at least this many
phone bookings provably came from the tracked line". A booking that fails to
match is unproven, not proven-organic — households call from numbers that are
not the one in their chart. Write the note so it says what was audited and what
was not, e.g. the Aug 2026 entry naming the six verified households and flagging
late-month traditionals as unaudited.

`calls: null` means call tracking did not exist that month. Never write zeros
into it to make a month look complete.

---

## 6. Stamp provenance on every edit

Every month you touch gets:

- `src: "EHR export YYYY-MM-DD"` — the date of the CSV you counted from
- `adsSrc: "Ads UI pull YYYY-MM-DD"` — when ads fields changed
- `quoSrc: "Quo export YYYY-MM-DD"` — when anything in `calls` changed

`data.js` is append/amend-only through this skill. Do not silently rewrite a
closed month's numbers without a `revised` note.

---

## 7. Ship it

1. Edit **only** `reports/dashboard/data.js`.
2. Show Tog the diff (`git diff reports/dashboard/data.js`) plus a plain-language
   summary: month total before → after, what moved, what cancelled.
3. Commit: `Dashboard data: week of {date}`
4. Push.
5. Wait **≥ 90 s** for the Cloudflare Pages deploy.
6. Verify live:

```bash
sleep 90
curl -sI https://unitedmedicalexams.com/reports/dashboard | grep -iE '^(HTTP|x-robots-tag)'
curl -s  https://unitedmedicalexams.com/reports/dashboard/data.js | grep -n '"08"'   # this month's line
curl -s  https://unitedmedicalexams.com/robots.txt   | grep -ci reports   # must be 0
curl -s  https://unitedmedicalexams.com/sitemap.xml  | grep -ci reports   # must be 0
```

All four must pass: **200**, `X-Robots-Tag: noindex, nofollow, noarchive`
present, this month's exam total visible in `data.js`, and **zero** "reports"
mentions in `robots.txt` and `sitemap.xml`.

---

## 8. Stealth rules — non-negotiable

- **Never** link the dashboard from any site page, the sitemap, or `robots.txt` —
  not even in a comment. `build.js` already excludes `reports/` from the sitemap
  walk (`EXCLUDE_DIRS`); keep it that way.
- The `/reports/*` `X-Robots-Tag` in `_headers` is what keeps it out of the
  index. Reports stay *crawlable* on purpose so Google can read the noindex —
  do not add a `Disallow` for it.
- The frozen monthly report pages under `reports/2026/` stay linked from nowhere.
  The dashboard does not link to them and they do not link to it.
