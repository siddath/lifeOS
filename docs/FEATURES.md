---
title: "LifeOS Features"
area: docs
type: doc
tags: [features, overview, modules]
updated: 2026-07
---

# LifeOS features

What LifeOS does, by surface — and what's built vs. planned. Modules are toggled in `lifeos.config.json` under `modules`, so you run only the surfaces you want.

Legend: ✅ built · 🔄 available via MCP (no bundled sync) · 📋 planned · 🎯 future.

---

## Modules (toggle in `lifeos.config.json`)

| Module | Config key | Status | What it is |
|---|---|---|---|
| Missions | `missions` | ✅ | The swappable hero: one main thing, countdown, week plan, evidence. |
| Trackers | `trackers` | ✅ | Tasks (P1/P2/P3 × area × status × due) and a weekly habits matrix. |
| Finance | `finance` | ✅ | Net-worth + budget card, manual-first JSON; optional broker feed. |
| Knowledge base | `knowledge_base` | ✅ | Searchable "about you" — strengths, watch-outs, preferences per area. |
| Anchor | `anchor` | ✅ | The Inner OS: grounding protocols, reframes, guardrails. |
| Flashcards | `flashcards` | 🔜 planned (off by default) | An optional study-deck surface; config flag reserved, page not shipped in v1. |

Setting `finance`, `anchor`, or `knowledge_base` to `false` **hides that surface and its nav/dock links** on the dashboard (the toggle is read at load). `missions` and `trackers` are the always-on core surfaces — their flags are reserved for future use and don't hide anything yet; `flashcards` is reserved for a page not shipped in v1.

---

## The dashboard (`dashboard/`)

Static, single-page, no build. Theme-aware (light + dark, per §Hearth). All of the following are **built**:

- **Hero mission** — renders entirely from `dashboard/mission.json`: kicker, title, countdown to a gate, the one-thing (do / why / reframe), a week planner, and an evidence panel. Swap the file to swap the whole hero (~10 min).
- **Task composer** — buttons over syntax: title + area/priority/due chips; last-used area suggested; deterministic defaults.
- **Habits matrix** — weekly Mon–Sun grid with keystone flags and cadence.
- **Knowledge search** — instant, forgiving, keyboard-first (`/` to focus) over your `kb` entries.
- **Finance card** — net worth and monthly budget from `finance-data.json`; currency from config.
- **The Anchor** — break-glass grounding page, reframes, guardrails.
- **Quotes** — day-seeded rotation with favorites and share.
- **Sync bar** — status pill + push/pull (lights up only when a connector is configured).

---

## The vault (Markdown + Git / Obsidian)

- **Plain-text source of truth** — evergreen notes, project specs, routines, reviews. ✅
- **Obsidian-native** — YAML frontmatter, relative links, Dataview-friendly, graph view. ✅
- **Templates** — daily journal, weekly review, project story, decision log. ✅

---

## AI workflow

The whole system is driven by an AI assistant reading `AGENTS.md` and the schemas — Claude, ChatGPT, Cursor, Copilot, or Gemini all work, because the contract is written down, not baked into one tool.

For Claude Code users, a set of skills under `.claude/` scripts the common flows (a convenience, not a requirement):

- **`/setup`** — onboarding interview → writes config + first mission + seed data against the schemas. ✅
- **`/daily-brief`** — a calm morning summary: mission cadence, P1 tasks, habits. ✅
- **`/quick-capture`** — drop a thought into the inbox without breaking flow. ✅
- **`/weekly-review`** — summarize evidence, roll incomplete tasks, set next week's one thing. ✅

Every one reads and writes **schema-guided** data — no bespoke format — so the same work is one prompt away in any other assistant.

---

## The contract

- **`lifeos.config.json`** — identity, areas, modules, integration toggles. Nothing hardcodes a person. ✅
- **`schemas/`** — `tasks`, `habits`, `mission`, `finance`, `kb`. The shared shape every surface and importer agrees on. ✅

---

## Connectors

See [connectors/README.md](connectors/README.md) for the full table.

| Connector | Status |
|---|---|
| Vercel deploy | ✅ |
| Notion two-way sync (Tasks + Habits, optional, best-effort) | ✅ |
| GitHub (`repo.url` config) | ✅ |
| Broker (generic, MCP) / manual finance JSON | 🔄 / ✅ |
| Google Calendar / Gmail / Drive | 🔄 (MCP reads) → 📋 (serverless sync) |

---

## Planned & future

- 📋 Serverless Google Calendar + Gmail sync functions (calendar blocks, email → task capture).
- 📋 Frictionless capture pipeline (one line anywhere → structured task).
- 📋 Deep broker/finance integration beyond manual JSON + MCP reads.
- 📋 Extended trackers (energy/sleep, reading, meditation streaks).
- 🎯 AI-driven insights — spending trends, habit correlations, gentle nudges.

Full detail and sequencing: [ROADMAP.md](ROADMAP.md).
