---
title: "Onboarding — Make LifeOS Yours"
area: docs
type: doc
tags: [onboarding, setup, adoption, skills, mcp]
updated: 2026-07
---

# Onboarding — make LifeOS yours

A fresh clone already runs. Out of the box it renders as the demo persona — **Alex Rivera**, a product engineer in Portland, mid-way through *"Operation Launch Week"* (shipping the app *Fieldnotes* to 50 beta users), with ventures *Fieldnotes* and *Weekend Pottery*. That's on purpose: you can see the whole system working before you change a thing.

Making it *yours* means replacing that persona's identity and content with your own. There are **four ways in**, and they work with **whatever AI assistant you already use** — Claude, ChatGPT, Cursor, Copilot, Gemini. They aren't mutually exclusive; most people start with path A and layer on a connector later.

The principle underneath all of them: **ingestion is prompt-driven against `schemas/`, not code-driven.** There's no rigid importer to satisfy. You hand your assistant raw material — a paragraph, a Notion export, a calendar — and it writes schema-valid `tasks`, `habits`, `mission`, and `kb` data. The schemas are the contract; the AI does the shaping. The instructions it needs are in [`AGENTS.md`](../AGENTS.md) → Onboarding.

---

## Path A — talk to your AI (recommended)

Open your assistant in the repo folder and tell it: *"Read `AGENTS.md` and help me set up LifeOS."* It follows the Onboarding section there — recognizes the demo persona as placeholder, asks you a few things (name, timezone, currency, the life **areas** you track, your current **one main thing**), then:

1. Writes `dashboard/lifeos.config.json` (copied from `dashboard/lifeos.config.example.json`): identity, area codes, enabled modules, integration toggles. It's safe to commit — no secrets live in it — and committing it inside `dashboard/` is what personalizes a deploy.
2. Drafts your first **mission** into `dashboard/mission.json` (validated against `schemas/mission.schema.json`) — hero title, gate date, week plan, evidence.
3. Seeds starter **tasks** (`dashboard/tasks-data.json`), **habits** (`dashboard/habits-data.json`), and **knowledge-base** entries (`dashboard/kb-data.json`) against their schemas — the exact files the dashboard renders from.
4. Tells you what's next (deploy, or wire a connector).

Because it writes against the schemas, everything renders in the dashboard immediately. Review, tweak the wording, and you're live.

**Using Claude Code?** There's a shortcut for exactly this: run `/setup` and it does the interview and the writing as a bundled skill. It's a convenience, not a requirement — any assistant reaches the same result from `AGENTS.md` and the schemas.

---

## Path B — paste your notes

Already keep notes, a task list, or a brain-dump somewhere? Don't reformat it. Paste it to your assistant and ask it to import against the schemas:

```
Here's my current task list and some notes about my goals.
Read schemas/tasks.schema.json, schemas/habits.schema.json, and
schemas/kb.schema.json, then import: write my tasks, pull out any
recurring habits, and draft a knowledge-base entry per life area.
```

It reads those schemas and emits conforming JSON — inferring `area` codes from your config, `priority` (P1/P2/P3), `status`, and due dates from natural language. Messy input is fine; the schema defines the target, the model does the mapping. Review the result and commit.

This is the "I have stuff, just make it structured" path.

---

## Path C — Notion import

If you'd rather live in Notion on mobile and use the dashboard on desktop, hydrate from a Notion template:

1. **Create two Notion databases — Tasks and Habits — with the exact property names LifeOS expects.** The property tables in [connectors/notion.md](connectors/notion.md) (Step 4) are the spec; building them by hand takes a couple of minutes. (A prebuilt duplicate-me template is planned but not shipped yet.)
2. **Create an internal integration** and share those databases with it; copy the **API key** and the two **database IDs**.
3. **Set the env vars** — `NOTION_API_KEY`, `NOTION_DATABASE_ID_TASKS`, `NOTION_DATABASE_ID_HABITS`, and a `SYNC_SHARED_SECRET` — locally in `.env` and in your host.
4. **Run the pull** (`api/notion-pull.js`, or the **Pull** button in the dashboard's dock). It hydrates local task/habit data from Notion, and pushes flow back the same way.

Full walkthrough with the exact property names and select-option values: **[connectors/notion.md](connectors/notion.md)**.

This is the "Notion is my mobile front-end" path. From here on, edits converge in both directions.

---

## Path D — MCP bootstrap

The most hands-off path: let an MCP-capable assistant *read your existing life* and build the vault for you. Enable one or more MCP connectors (Notion, Google Calendar, Gmail, Drive) in `.mcp.json` (copy from `.mcp.example.json`), then ask:

```
Read my calendar and my recent notes over MCP, then bootstrap LifeOS:
set up my config, infer my active projects as areas, draft this week's
mission, and seed tasks and habits from what you find.
```

It uses the connectors to gather raw context, then writes schema-valid config and data exactly as in the other paths. Nothing external is written until you say so — the connectors read; the vault is authored locally and stays the source of truth.

This is the "start from what I already have, not from a blank page" path.

---

## After any path

- **Verify it renders.** Open `dashboard/index.html` locally — your name, areas, and mission should appear. No network or keys required.
- **Deploy** if you want it on your phone: [deploy.md](deploy.md).
- **Layer on connectors** as you need them: [connectors/README.md](connectors/README.md).
- **Keep it current** by asking your assistant for a daily brief, a quick capture, or a weekly review — all reading and writing the same schema-valid data. On Claude Code these are the bundled `/daily-brief`, `/quick-capture`, and `/weekly-review` skills.

## What you never have to do

- Reformat your notes by hand — the schemas are the target, the AI does the shaping.
- Put secrets in `lifeos.config.json` — keys live in `.env` / host env only.
- Enable anything to get started — every connector is optional and off by default.
