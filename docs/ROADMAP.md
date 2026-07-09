---
title: "LifeOS Roadmap"
area: docs
type: doc
tags: [roadmap, phases, planned, built]
updated: 2026-07
---

# LifeOS Roadmap

A phased plan, kept honest: **built now** vs. **planned**. LifeOS grows outward from a local plain-text core — each phase adds a lens or a pipe without reworking the vault underneath.

The rule of thumb: anything that touches your data has a **local-first, no-service** mode first, and a connector second. You never *need* an integration to use LifeOS.

---

## Phase summary

| Phase | Focus | Status |
|---|---|---|
| **Core** | Vault + dashboard + config/schemas contract + skills | ✅ Built |
| **Notion sync** | Two-way Tasks/Habits sync via serverless | ✅ Built |
| **Live reads over MCP** | Calendar / mail / drive / broker readable by Claude | 🔄 Available via MCP (no bundled sync yet) |
| **Serverless connectors** | Dedicated Google Calendar / Gmail sync functions | 📋 Planned |
| **Capture pipeline** | Frictionless inbox → structured task | 📋 Planned |
| **Deep finance** | Live broker integration + insights | 📋 Planned |
| **AI insights** | Trends, correlations, gentle nudges | 🎯 Future |

---

## ✅ Built now

**The core.**
- Plain-text **vault** (Markdown + Git, Obsidian-compatible: frontmatter, relative links, Dataview-friendly).
- Static **dashboard** (`dashboard/`) — hero mission, tasks, habits, knowledge, finance, Anchor. No build step. Theme-aware (light + dark).
- The **contract**: `lifeos.config.json` (identity, areas, modules, integration toggles) + `schemas/` (tasks, habits, mission, finance, kb). Nothing hardcodes a person.
- **Swappable mission model** — the entire hero renders from `dashboard/mission.json`; swapping it is a ~10-minute edit.
- **Claude skills** — `/setup` (onboarding), `/daily-brief`, `/quick-capture`, `/weekly-review` — all reading/writing schema-valid data.
- **Zero-config run** — a fresh clone renders fully as the demo persona with no keys and no network.

**Automated Notion sync (built).**
- Two-way sync of **Tasks** and **Habits** via `api/notion-sync.js` (push) and `api/notion-pull.js` (pull).
- Authenticated with `SYNC_SHARED_SECRET`; area/priority/status mapping driven by config so names never drift.
- Guided ~10-minute setup — see [connectors/notion.md](connectors/notion.md).

**Deployment (built).**
- One-click **Deploy to Vercel**; static `vercel.json`; graceful degradation with no env vars. See [deploy.md](deploy.md).

**Manual-first finance (built).**
- Finance card renders from `dashboard/finance-data.json` against `schemas/finance.schema.json` — no broker required.

---

## 🔄 Available now via MCP (no bundled sync yet)

An MCP-capable assistant can already **read** these live if you enable them in `.mcp.json` — useful during onboarding (Path D) and for ad-hoc queries. What's *not* yet built is a dedicated serverless sync function that keeps them continuously in step with the vault.

- **Google Calendar / Gmail / Drive** — readable over MCP today; **serverless sync functions are planned, not shipped.**
- **Broker** — a generic MCP-based finance connector (point it at a broker's public MCP endpoint). Live portfolio reads work over MCP; deep, continuous integration is planned.

---

## 📋 Planned

**Serverless Google connectors.**
- Google Calendar sync function: mission/P1 tasks → time blocks, recurring habits → weekly events, event-done → task-done.
- Gmail capture function: email → inbox → schema-valid task (title, priority from prefix, auto-area).

**Capture pipeline.**
- A frictionless inbox that turns a one-line thought (from anywhere) into a structured, schema-valid task or note, ready for weekly triage.

**Deep broker / finance integration.**
- Continuous portfolio + net-worth sync from a broker connector into the finance schema, beyond today's manual JSON and MCP reads.

**Extended trackers.**
- Energy/sleep, reading, meditation streaks — each as a schema plus a dashboard lens.

---

## 🎯 Future — AI-driven insights

Once enough structured history accumulates, the AI layer can surface **gentle, evidence-based** observations rather than raw data:

- Spending trends and subscription ROI over time.
- Habit correlations ("keystone habit X predicts the rest of the day").
- Health/energy patterns across weeks.
- Lightweight automation recipes ("P1 added → block time today").

All of it reads the same schema-valid data; none of it replaces your ownership of the vault.

---

## Design principles that gate the roadmap

1. **Local-first, always.** Every feature must have a no-service mode before it gets a connector.
2. **The contract holds.** New data means a schema; new integration means an env var and (maybe) an `api/` function — never a special case that bypasses config/schemas.
3. **Off by default.** Connectors are additive and opt-in.
4. **Honest status.** This document distinguishes built, MCP-available, planned, and future — and stays that way.
