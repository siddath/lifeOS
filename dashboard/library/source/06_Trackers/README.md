---
title: "06_Trackers — the working memory"
area: trackers
type: index
tags: [trackers]
updated: 2026-07
---

# 06_Trackers — the working memory

These are the vault's file-based working records. AI sessions and skills can read and append here. Dashboard tasks/habits live separately in browser storage after first-run seeding; file edits do not update that store. Reconcile a private export when you need a current combined view (see [browser data](../docs/browser-data.md)).

Every file ships as a `*.template.md` with the format preserved but no real data (one demo row for shape). Copy each to its plain name and make it yours.

| Template | What it holds |
|----------|---------------|
| [`inbox.template.md`](inbox.template.md) | Quick capture — dump anything, sort later. |
| [`tasks.template.md`](tasks.template.md) | Active tasks, bucketed by area and priority. |
| [`habits.template.md`](habits.template.md) | A weekly habit grid for a few keystone habits. |
| [`reminders.template.md`](reminders.template.md) | Date-bound reminders and deadlines. |
| [`finance.template.md`](finance.template.md) | Budget / net-worth snapshot. |
| [`evidence.template.md`](evidence.template.md) | The shipped-artifact log — evidence, not ideas. |

## How to add things

- **A thought / anything** → `inbox.md` (or run the quick-capture skill).
- **A task** → `tasks.md` under the right area, with `[ ]`, a priority, and an optional due date.
- **A date deadline** → `reminders.md`.
- **Something you shipped** → `evidence.md` (this is the memory that makes weekly review honest).

## Conventions

- Tasks: `- [ ] (P1) Task text — due 2026-08-22 #area`. Priorities: **P1** = today, **P2** = this week, **P3** = later.
- `#area` codes come from your `lifeos.config.json` (e.g. `#career`, `#health`, `#fieldnotes`).

> The evidence log is the heart of the system: LifeOS runs on *Think once → Build → Measure → Improve*, and "Measure" needs a record of what actually shipped. Log artifacts, not intentions.

See [`../examples/alex/06_Trackers/`](../examples/alex/06_Trackers/) for filled versions.
