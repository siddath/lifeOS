---
title: "templates — reusable document scaffolds"
area: templates
type: index
tags: [templates]
updated: 2026-07
---

# templates — reusable document scaffolds

These are the **document templates** you instantiate over and over: a fresh daily note, a nightly review, a weekly review, a decision record, and so on. Copy one, fill it in, save it where it belongs (a daily note in your journal, a weekly review under [`../reviews/`](../reviews/)).

These differ from the `*.template.md` files in `02_Areas/` and `06_Trackers/`: those are set up *once* to become your living files. The ones here are meant to be **copied repeatedly** — one new instance per day, week, or event.

| Template | Use it for | Frequency |
|----------|-----------|-----------|
| [`daily_journal.md`](daily_journal.md) | A two-minute end-of-day note. | Daily |
| [`daily_review.md`](daily_review.md) | A slightly fuller nightly review with a life-dashboard rating. | Daily |
| [`obsidian_daily.md`](obsidian_daily.md) | An Obsidian daily-note template (uses `{{date}}` tokens). | Daily |
| [`weekly_review.md`](weekly_review.md) | The most important 20 minutes of the week — files to `../reviews/`. | Weekly |
| [`decision_log.md`](decision_log.md) | Record a big call once so you stop re-deciding it. | Per decision |
| [`project_story.md`](project_story.md) | A crisp, tellable story of a project (for interviews, pitches, retros). | Per project |
| [`session_debrief.md`](session_debrief.md) | A generic post-event debrief (interview, meeting, launch, pitch). | Per event |

## Conventions

- Templates use `{{DATE}}`, `{{TITLE}}`, `{{PROJECT}}` style tokens — replace them when you copy.
- Keep the guidance quotes (`>` lines) or delete them once the habit sticks; they're training wheels.
- Everything is plain Markdown with relative links, so it renders on GitHub and in Obsidian alike.
