---
title: "LifeOS Documentation"
area: docs
type: doc
tags: [index, docs, overview]
updated: 2026-07
---

# LifeOS Documentation

**LifeOS** is an AI-native personal operating system: a plain-text vault + a static dashboard + Claude Code skills + a small set of optional connectors. Everything renders from one config file (`lifeos.config.json`) and a folder of JSON schemas (`schemas/`) — nothing hardcodes a person, so a fresh clone runs end-to-end with zero setup as the demo persona and becomes *yours* by editing config and content.

This folder is the map. Start with whichever door fits you.

## Start here

| If you want to… | Read |
|---|---|
| Understand how the whole thing fits together | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Adopt it as your own (4 ways) | [onboarding.md](onboarding.md) |
| Put the dashboard on the web | [deploy.md](deploy.md) |
| See what's built vs. planned | [ROADMAP.md](ROADMAP.md) · [FEATURES.md](FEATURES.md) |
| Wire up an integration | [connectors/README.md](connectors/README.md) |
| Understand the look and feel | [design_system.md](design_system.md) |

## The docs

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — system design: the vault, the dashboard, the config-and-schemas contract, the serverless sync layer, and the MCP connectors. Includes the data-flow diagram.
- **[onboarding.md](onboarding.md)** — the four adoption paths: the `/setup` Claude skill (flagship), plain-text import, Notion import, and MCP bootstrap. Ingestion is prompt-driven against `schemas/`, not code-driven.
- **[deploy.md](deploy.md)** — deploy the static dashboard to Vercel, the one-click "Deploy to Vercel" button, and environment variables. Works with **no** env vars (graceful local-only degradation).
- **[ROADMAP.md](ROADMAP.md)** — phased plan, honest about built-now vs. planned.
- **[FEATURES.md](FEATURES.md)** — the feature grid across surfaces.
- **[design_system.md](design_system.md)** — **Hearth**, the warm, theme-aware design language.
- **[connectors/README.md](connectors/README.md)** — the connector contract and the v1 connector table.
- **[connectors/notion.md](connectors/notion.md)** — step-by-step Notion two-way sync setup with the exact property names the code expects.
- **[assets/README.md](assets/README.md)** — the screenshot capture list for launch.

## Core files referenced throughout

- `lifeos.config.json` — your identity, areas, enabled modules, and integration toggles (copy from `lifeos.config.example.json`).
- `schemas/` — JSON Schemas for tasks, habits, mission, finance, and the knowledge base. These are the contract every surface and every importer agrees on.
- `dashboard/` — the static single-page dashboard and its data files (`mission.json`, `finance-data.json`, `quotes.json`).
- `api/` — optional Vercel serverless functions for Notion sync.
- `.env.example` / `.mcp.example.json` — connector configuration templates.

## Conventions

- Product name **LifeOS**, slug **lifeos**, config file **lifeos.config.json**.
- The concrete life examples in these docs use a demo persona — **Alex Rivera**, a product engineer in Portland — so nothing here is anyone's real data. Replace it with yours via config and content.
