---
name: weekly-review
description: Run the owner's weekly review of the LifeOS. Use when they say "weekly review", "review my week", "Sunday review", or "what shipped this week". Reads the trackers, summarizes evidence, rolls incomplete tasks, sets next week's one main thing, and updates the files (and Notion if connected).
---

# Weekly Review

Drive the most important 20 minutes of the week. End with evidence and a clear next-week focus — not a longer to-do list.

Read the owner's identity and enabled modules from `lifeos.config.json`; use the area codes there for the areas check.

## Steps
1. Read `06_Trackers/tasks.md`, `inbox.md`, `habits.md`, `evidence.md`, and `00_START_HERE.md`.
2. Fill a copy of `templates/weekly_review.md` (or summarize inline if the owner prefers), filed under `reviews/YYYY-Www.md`:
   - **Evidence:** what actually shipped (artifacts, not intentions) — cross-check `06_Trackers/evidence.md`.
   - **Hero mission:** did it move toward its gate?
   - **Areas check:** quick 1–5 across the area codes in `lifeos.config.json`.
3. **Roll forward:** move incomplete `tasks.md` items into next week; move done items to the Done section with a date.
4. **Clear the inbox:** classify each item (task / routine / reminder / someday / delete).
5. **Set next week:** the ONE main thing, the next hero mission if it's changing (run the `mission-swap` skill), and the top 3 supporting tasks. Update `00_START_HERE.md`.
6. If Notion is connected (`integrations.notion.enabled` in config), offer to mirror the updated tasks + review to Notion.

## Rules
- Be honest about wellbeing and relationships, not just output.
- Push the *Think once → Build → Measure → Improve* principle: if nothing shipped, name it gently and pick one concrete artifact for next week.
- One hero at a time — don't let the owner reopen every project at once.
