---
title: "05_Checklists — reusable step-by-step lists"
area: checklists
type: index
tags: [checklists]
updated: 2026-07
---

# 05_Checklists — reusable step-by-step lists

This folder holds **checklists you run more than once** — the repeatable procedures that shouldn't live in your head or get re-derived every time. A checklist is different from a task list: tasks are one-off and time-bound; checklists are the standard steps for a recurring situation.

## Good candidates

- A pre-launch checklist (everything that must be true before you ship).
- A relocation / move checklist.
- An onboarding or admin checklist (accounts, insurance, paperwork).
- A weekly-reset checklist (inbox to zero, review filed, next week's one thing set).
- A travel-prep or event-prep checklist.

## Convention

- One file per checklist, named for the situation (e.g. `launch_checklist.md`).
- Use `- [ ]` items so you can tick a fresh copy each run.
- Group by phase or by area with `###` headings.
- Keep the steps atomic — each one either done or not, no ambiguity.

```markdown
## Before launch
- [ ] Landing page copy final
- [ ] Beta invite list confirmed (target: 50)
- [ ] Crash reporting wired up
- [ ] Rollback plan written
```

When a checklist item is date-bound for *this* run, mirror it into [`../06_Trackers/reminders.md`](../06_Trackers/reminders.md); when it's an active to-do, into [`../06_Trackers/tasks.md`](../06_Trackers/tasks.md).
