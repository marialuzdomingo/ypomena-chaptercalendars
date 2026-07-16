# Chapter Events Registry (static version)

A single filterable, searchable site — plus a month calendar view — showing
every chapter's events. No Airtable API, no tokens, no live syncing: you
update a spreadsheet, redeploy, and the site refreshes.

## How it works

- `data/events.csv` — the data. One row per event, one `Chapter` column to
  say which chapter it belongs to.
- `scripts/build-data.js` — converts that CSV into `data/events.json` at
  build time (runs automatically as part of `npm run build`, see
  `package.json`).
- `app/page.tsx` — reads `data/events.json` directly and renders the
  filterable list / calendar UI. No API calls, no loading spinners needed.

## Your workflow going forward

1. In your consolidated Airtable base, add all your chapters' events with a
   `Chapter` column identifying which chapter each row belongs to.
2. When you want to update the site: in Airtable, select all rows → **Download CSV**
   (or use the base's export option), and save the file as `data/events.csv`,
   overwriting the sample data.
3. Commit and push (if using GitHub → Vercel), or run `vercel --prod` again
   if deploying from your machine. The build automatically regenerates
   `events.json` from your new CSV — you don't need to run anything by hand.

That's it — no tokens, no scheduled jobs, no background syncing to reason about.

## CSV column format

The build script expects these column headers (case-sensitive, matching
your Airtable field names):

| Column | Required? | Notes |
|---|---|---|
| `Chapter` | required | e.g. "YPO Bahrain" |
| `Event Name` | required | |
| `Date` | optional | any common date format works; events without a date still show in the list view under "Undated," just not on the calendar |
| `Status` | optional | e.g. Confirmed / Tentative / Cancelled — drives the colored pill and calendar dot |
| `Event Type` | optional | |
| `Location` | optional | |
| `Description` | optional | shown when you click into an event on the calendar |
| `Link` | optional | if present, clicking the event opens this (e.g. the Airtable record itself) |

If your exported CSV uses different column names, edit the `COLUMNS`
mapping at the top of `scripts/build-data.js` to match — no other code
changes needed.

## Local setup

```bash
npm install
npm run build:data   # generates data/events.json from data/events.csv
npm run dev           # preview at localhost:3000
```

## Deploying to Vercel

Simplest path — no environment variables, no storage integrations required:

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project**, import the repo, leave defaults (Next.js
   auto-detected), **Deploy**.
3. Whenever you update `data/events.csv`, commit + push — Vercel rebuilds
   and the site reflects the new data within a minute or two.

If you'd rather not use GitHub at all, you can also deploy straight from
your machine with the Vercel CLI (`npx vercel --prod` from inside the
project folder) and re-run that command each time you update the CSV.

## If you later want it to auto-update from Airtable

This static version trades live-sync for zero maintenance. If down the
road you want the site to pull automatically whenever chapters edit
Airtable (no manual export/redeploy step), that's a different, slightly
more involved setup — happy to build that version when you're ready for it.
