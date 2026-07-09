---
title: "Connectors — The Contract"
area: docs
type: doc
tags: [connectors, contract, integrations, mcp, notion, vercel]
updated: 2026-07
---

# Connectors

A **connector** links LifeOS to an outside system — Notion, Google Workspace, a broker, GitHub, or a host. LifeOS ships with a small, honest set: some are fully built, most are docs-first and planned. This page is the **contract**: how any connector plugs in, and exactly what's built today.

---

## The connector contract

Every connector touches at most three well-defined places. To add one, you provide as many of these as it needs:

1. **Config / secrets.** Add env var(s) to **`.env.example`** (and set the real values in `.env` locally / your host's environment). Secrets never go in `lifeos.config.json` or the vault. If the connector is user-visible, add a toggle under `integrations` in `lifeos.config.json` (e.g. `"notion": { "enabled": true }`) and, for MCP, an entry in `.mcp.json` (template: `.mcp.example.json`).
2. **Data shape.** Add or reuse a JSON shape in **`schemas/`** so the dashboard and importers agree on what the connector's data looks like. (The finance card, for example, reads `schemas/finance.schema.json` whether the numbers came from a broker or from a hand-edited JSON.)
3. **Transport (optional).** If the connector needs server-side calls, add a small serverless function under **`api/`** (as Notion sync does). Many connectors need no code at all — they're **MCP-based**, meaning your assistant talks to them directly, and the connector is really just documentation plus a `.mcp.json` entry.

That's the whole extension surface: **env var → schema → (optional) `api/` function.** Nothing bypasses the config-and-schemas contract described in [../ARCHITECTURE.md](../ARCHITECTURE.md).

---

## v1 connectors

Honest status. "Built" means it works today; "planned" means designed and documented but not yet shipped as code (usually reachable now via MCP).

| Connector | Method | Status | What it does |
|---|---|---|---|
| **Vercel** | Deploy button + `vercel.json` | **Built** | Hosts the static dashboard; one-click deploy. See [../deploy.md](../deploy.md). |
| **Notion** | `api/` serverless + env vars | **Built** — guided ~10-min setup | Two-way sync of Tasks + Habits. Repo stays source of truth; Notion is the mobile front-end. See [notion.md](notion.md). |
| **Google — Calendar / Gmail / Drive** | MCP | **Planned** (docs-only) | An MCP-capable assistant can read these live today; dedicated serverless sync functions are on the roadmap, not shipped. |
| **GitHub** | Config (`repo.url`) | **Built** (config-level) | The vault is a Git repo; `repo.url` in `lifeos.config.json` wires links. Deeper automation (webhooks) is planned. |
| **Broker** | MCP (generic) | **Planned** (docs-only) | A generic finance connector — e.g. a broker's public MCP endpoint. The finance card also works with **manual JSON** (`dashboard/finance-data.json`) with no connector at all. |

### Notes on status

- **MCP-based connectors** (Google, broker) require no code in this repo — you enable them in `.mcp.json` and Claude reads/writes them directly. In v1 they're documented and optional; the "planned" label means there's no bundled `api/` sync function yet, not that they can't be used.
- **The broker connector is deliberately generic.** Point it at any broker's public MCP endpoint (see the `broker` entry in `.mcp.example.json`). Don't want a live feed? The finance card is manual-first: edit `dashboard/finance-data.json` against `schemas/finance.schema.json` and it just renders.
- **Everything is off by default.** With no env vars and no `.mcp.json`, LifeOS runs fully local. Connectors are additive.

---

## Adding your own connector — checklist

1. Add its secret(s) to `.env.example`; set real values in `.env` / host env.
2. If user-visible, add an `integrations` toggle in `lifeos.config.json`; if MCP, add a server to `.mcp.json`.
3. Reuse or add a shape in `schemas/` for its data.
4. Only if it needs server calls, add a function under `api/` (authenticate dashboard calls with `SYNC_SHARED_SECRET`, as `api/_notion.js` does).
5. Document it here and, if it warrants a walkthrough, add a page like [notion.md](notion.md).

---

## Deep-dives

- **[notion.md](notion.md)** — full Notion two-way sync setup: template, integration, database IDs, and the exact property names the code expects.
