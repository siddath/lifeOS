---
title: "Docs Assets — Screenshot Capture List"
area: docs
type: doc
tags: [assets, screenshots, launch, checklist]
updated: 2026-07
---

# Docs assets — screenshot capture list

This folder holds the images used across the README and docs. **It is intentionally empty of screenshots right now** — they have to be captured from a running browser, and none exist yet.

> **Do not fabricate images.** Every screenshot below must be captured from the **demo deployment only** (the Alex Rivera persona), never from anyone's real, personal deployment. **PII-review each image** before committing: no real names, emails, tokens, URLs with secrets, or private data anywhere in frame — including browser chrome, tabs, and notification banners.

Capture these before launch. Filenames are suggestions; keep them stable once referenced in the docs.

---

## Dashboard hero

| File | Size | Theme | Notes |
|---|---|---|---|
| `hero-desktop-light.png` | 1440×900 | light | Full hero: mission title, countdown, one-thing, week planner. |
| `hero-desktop-dark.png` | 1440×900 | dark | Same view, dark mode. |
| `hero-mobile-light.png` | 390×844 | light | Mobile hero (portrait). |
| `hero-mobile-dark.png` | 390×844 | dark | Mobile hero, dark mode. |

Demo mission in frame: **"Operation Launch Week"** (ship *Fieldnotes* to 50 beta users).

---

## Trackers

| File | Size | Notes |
|---|---|---|
| `tasks-habits.png` | 1440×900 | Tasks + habits cards, **with the sync pill visible** (show a "synced" or "local-only" state — never a real token or URL). |

---

## Knowledge base

| File | Size | Notes |
|---|---|---|
| `knowledge-search.png` | 1440×900 | Knowledge search with the query **"pottery"** typed and results showing (ties to the demo persona's Weekend Pottery venture). |

---

## The Anchor (Inner OS)

| File | Size | Notes |
|---|---|---|
| `anchor.png` | 1440×900 | The Anchor page — grounding protocols / reframes / guardrails. Generic demo content only. |

---

## Finance

| File | Size | Notes |
|---|---|---|
| `finance.png` | 1440×900 | Finance card: net worth + monthly budget. **USD** demo numbers only. |

---

## Terminal / skills GIF

| File | Notes |
|---|---|
| `skills-demo.gif` | A short terminal recording of running **`/setup`** followed by **`/daily-brief`** in Claude Code. Keep it under ~15s; ensure the terminal shows only demo-persona output — no real paths, usernames, or tokens in the prompt or scrollback. |

---

## Notion template

| File | Notes |
|---|---|
| `notion-side-by-side.png` | The Notion template (Tasks + Habits databases) shown **side by side** with the dashboard, to illustrate the mirror. Use a demo workspace; scrub any real workspace name, avatar, or URL from the Notion chrome. |

---

## Capture checklist (per image)

- [ ] Captured from the **demo deployment** (Alex Rivera / Fieldnotes / Portland / USD), not a personal one.
- [ ] Correct dimensions and theme as specified above.
- [ ] **PII review passed** — no real names/emails/tokens/URLs/notifications in frame.
- [ ] Sync pill / status shows a state, never a secret.
- [ ] File committed with the stable name referenced by the docs.
