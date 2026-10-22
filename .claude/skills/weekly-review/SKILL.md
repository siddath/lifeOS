---
name: weekly-review
description: Review the owner's week from available LifeOS records, distinguish current evidence from stale files, and propose changes to priorities or trackers for the owner to choose.
---

# Weekly Review

Offer a manageable review of what happened and what the owner wants next. They choose the depth and whether to change any records; rest, reflection and maintenance are valid outcomes.

Read the owner's identity and enabled modules from `dashboard/lifeos.config.json` (falling back to `dashboard/lifeos.config.example.json`); use the area codes there for the areas check.

## Steps
1. Read `06_Trackers/tasks.md`, `inbox.md`, `habits.md`, `evidence.md`, and `00_START_HERE.md`. The dashboard JSON (`dashboard/tasks-data.json`, `habits-data.json`) is first-run seed data. Existing browser tasks/habits can be newer; reconcile a private dashboard export before rewriting the files or claiming the review is complete. Never clear browser storage to force a seed refresh; see `docs/browser-data.md`. Note missing tracker files without treating them as empty history. Create one from its template only when file updates are within the owner's request.
2. Fill a copy of `templates/weekly_review.md` (or summarize inline if the owner prefers), filed under `reviews/YYYY-Www.md`:
   - **Evidence:** what actually shipped (artifacts, not intentions) — cross-check `06_Trackers/evidence.md`.
   - **Hero mission:** did it move toward its gate?
   - **Areas check:** quick 1–5 across the area codes in `dashboard/lifeos.config.json`.
3. **Review incomplete work:** propose keep, reschedule, park or stop choices. Preserve existing dates and entries until the owner chooses; a review does not automatically roll everything into next week.
4. **Triage the inbox if wanted:** suggest classifications. Keep the original capture or an archive pointer; do not delete entries merely to empty the inbox.
5. **Choose next steps:** offer a focus or several priorities according to the owner's preference. Update trackers and `00_START_HERE.md` only within the requested editing scope. Run `mission-swap` only when they choose a change.
6. Notion configuration is not send permission. Offer to mirror approved task/habit changes if useful, then follow the owner's explicit authorization. Built-in sync does not mirror weekly reviews; those stay local unless a separate destination and write are authorized.

## Rules
- Be honest about wellbeing and relationships, not just output.
- Use *Think once → Build → Measure → Improve* as an optional method, not a judgment of the week. Do not assign an artifact to compensate for rest or unfinished work.
- The dashboard has one hero slot; the owner decides how many real-life priorities need attention.
