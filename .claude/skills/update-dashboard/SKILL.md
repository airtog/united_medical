---
name: update-dashboard
description: Update the UME master performance dashboard (unitedmedicalexams.com/reports/dashboard) from a fresh AdvancedMD EHR CSV export and optional Google Ads numbers. Use whenever Tog says "update the dashboard", "dashboard update", "new EHR export", "recount the month", drops a CSV from ~/Downloads and asks for the numbers refreshed, or asks to close out / finalize a month. Encodes the counting rules (create-date basis, families = individual exams, cancellations excluded), the boundary checks that catch a truncated export, the provenance stamping, and the deploy + live-verify + stealth checks.
---

# Update the UME master dashboard

The dashboard lives at `reports/dashboard/` and is two files:

| file | role |
|---|---|
| `reports/dashboard/index.html` | all markup / CSS / JS. **Built once. Never edit it for a data update.** |
| `reports/dashboard/data.js`    | `window.UME_DATA = {…}` — every number. **This is the only file you touch.** |

If a data update seems to require an `index.html` change, stop and say so — it almost
certainly means the schema needs a new field, which is a separate decision.

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

## 4. Ads numbers

If Tog supplies Google Ads figures, fill `spend`, `impressions`, `clicks`,
`ctr`, `cpc`, `conv` on the month.

**Fields you were not given stay `null`.** They render as "—". Never derive a
missing metric from the others (no `clicks = impressions × ctr`) and never carry
a number forward from a previous month. A blank is honest; a guess is not.

The known backfill gap is tracked in the `backlog` array at the bottom of
`data.js` — update it as items are filled.

---

## 5. Stamp provenance on every edit

Every month you touch gets:

- `src: "EHR export YYYY-MM-DD"` — the date of the CSV you counted from
- `adsSrc: "Ads UI pull YYYY-MM-DD"` — when ads fields changed

`data.js` is append/amend-only through this skill. Do not silently rewrite a
closed month's numbers without a `revised` note.

---

## 6. Ship it

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

## 7. Stealth rules — non-negotiable

- **Never** link the dashboard from any site page, the sitemap, or `robots.txt` —
  not even in a comment. `build.js` already excludes `reports/` from the sitemap
  walk (`EXCLUDE_DIRS`); keep it that way.
- The `/reports/*` `X-Robots-Tag` in `_headers` is what keeps it out of the
  index. Reports stay *crawlable* on purpose so Google can read the noindex —
  do not add a `Disallow` for it.
- The frozen monthly report pages under `reports/2026/` stay linked from nowhere.
  The dashboard does not link to them and they do not link to it.
