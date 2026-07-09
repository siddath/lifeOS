---
title: "Onboarding — Make LifeOS Yours"
area: docs
type: doc
tags: [onboarding, setup, adoption, skills, mcp]
updated: 2026-07
---

# Onboarding — make LifeOS yours

A fresh clone already runs. Out of the box it renders as the demo persona — **Alex Rivera**, a product engineer in Portland, mid-way through *"Operation Launch Week"* (shipping the app *Fieldnotes* to 50 beta users), with ventures *Fieldnotes* and *Weekend Pottery*. That's on purpose: you can see the whole system working before you change a thing.

Making it *yours* means replacing that persona's identity and content with your own. There are **four ways in**. They aren't mutually exclusive — most people start with path (a) and layer on a connector later.

The important principle underneath all of them: **ingestion is prompt-driven against `schemas/`, not code-driven.** There is no rigid importer to satisfy. You hand Claude your raw material — a paragraph, a Notion export, a calendar — and it writes schema-valid `tasks`, `habits`, `mission`, and `kb` data. The schemas are the contract; the AI does the shaping.

---

## Path A — the `/setup` skill (flagship, recommended)

The fastest path. In Claude Code, from the repo root, run:

```
/setup
```

The skill interviews you briefly — name, timezone, currency, the life **areas** you want to track, your current **one main thing** — and then:

1. Writes `lifeos.config.json` (copied and personalized from `lifeos.config.example.json`): your identity, area codes, enabled modules, integration toggles.
2. Drafts your first **mission** into `dashboard/mission.json` (validated against `schemas/mission.schema.json`) — hero title, gate date, week plan, evidence.
3. Seeds starter **tasks**, **habits**, and **knowledge-base** entries against their schemas.
4. Tells you what's next (deploy, or wire a connector).

Because it writes against the schemas, everything it produces renders immediately in the dashboard. You review, tweak the wording, and you're live. This is the path to reach for first — the other three are for when you already have data somewhere else.

---

## Path B — plain-text copy-paste import

Already keep notes, a task list, or a brain-dump somewhere? You don't need to reformat it. Paste it to Claude and ask it to import against the schemas:

```
Here's my current task list and some notes about my goals.
Import them into LifeOS: write tasks to the tasks schema, pull out any
recurring habits, and draft a knowledge-base entry per life area.
```

Claude reads `schemas/tasks.schema.json`, `schemas/habits.schema.json`, and `schemas/kb.schema.json`, then emits conforming JSON — inferring `area` codes from your config, `priority` (P1/P2/P3), `status`, and due dates from natural language. Messy input is fine; the schemas define the target, the model does the mapping. Review the result and commit.

This is the "I have stuff, just make it structured" path.

---

## Path C — Notion import

If you'd rather live in Notion on mobile and use the dashboard on desktop, hydrate from a Notion template:

1. **Duplicate the public Notion template** into your own workspace (the template ships the Tasks and Habits databases with the exact property names LifeOS expects).
2. **Create an internal integration** and share those databases with it; copy the **API key** and the two **database IDs**.
3. **Set the env vars** — `NOTION_API_KEY`, `NOTION_DATABASE_ID_TASKS`, `NOTION_DATABASE_ID_HABITS`, and a `SYNC_SHARED_SECRET` — locally in `.env` and in your host.
4. **Run the pull** (`api/notion-pull.js`, or the pull button in the dashboard's sync bar). It hydrates local task/habit data from Notion, and pushes flow back the same way.

Full walkthrough with the exact property names and select-option values: **[connectors/notion.md](connectors/notion.md)**.

This is the "Notion is my mobile front-end" path. From here on, edits converge in both directions.

---

## Path D — MCP bootstrap

The most hands-off path: let Claude *read your existing life* over MCP and build the vault for you. Enable one or more MCP connectors (Notion, Google Calendar, Gmail, Drive) in `.mcp.json` (copy from `.mcp.example.json`), then ask:

```
Read my calendar and my recent notes over MCP, then bootstrap LifeOS:
set up my config, infer my active projects as areas, draft this week's
mission, and seed tasks and habits from what you find.
```

Claude uses the connectors to gather raw context, then writes schema-valid config and data exactly as in the other paths. Nothing external is written until you say so — the connectors read; the vault is authored locally and stays source of truth.

This is the "start from what I already have, not from a blank page" path.

---

## After any path

- **Verify it renders.** Open `dashboard/index.html` locally — your name, areas, and mission should appear. No network or keys required.
- **Deploy** if you want it on your phone: [deploy.md](deploy.md).
- **Layer on connectors** as you need them: [connectors/README.md](connectors/README.md).
- **Keep it current** with the routine skills — `/daily-brief`, `/quick-capture`, `/weekly-review` — which read and update the same schema-valid data.

## What you never have to do

- Reformat your notes by hand — the schemas are the target, the AI does the shaping.
- Put secrets in `lifeos.config.json` — keys live in `.env` / host env only.
- Enable anything to get started — every connector is optional and off by default.
