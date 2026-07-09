---
title: "🧩 The Subagent Pattern"
area: ai-workflow
type: note
tags: [ai-workflow, subagents]
updated: 2026-07
---

# 🧩 The Subagent Pattern

> Think of a life as having agents — one role per area or project. **Only ONE is primary at a time (the active hero mission).** The rest run in maintenance mode. Each agent is a role you can run as a dedicated AI session, or just wear as a hat.

## Agent status (the shape)

Maintain a small table of who's active this cycle. Exactly one is primary; the others are foundation or maintenance:

| Agent | Mission | Status this cycle |
|-------|---------|-------------------|
| **Hero (current mission)** | Clear the gate | 🔴 **Primary — active** |
| Project A | Keep alive without stealing energy | 🟡 Maintenance |
| Project B | Move one step | 🟡 Maintenance |
| Relationships | Stay present | 🟢 Always active, low intensity |
| Health | Keep the body ready | 🟢 Foundation |
| Admin | Prevent chaos | ⚪ Activate as needed |

Map the rows to the owner's own area codes from `lifeos.config.json`.

## Each agent = inputs → outputs → deliverable → dependencies

Define an agent by what it consumes and what it must produce, not by vibes:

- **Inputs:** the notes, data, and context it needs (paste them — a fresh subagent starts cold).
- **Outputs:** the concrete artifacts due this cycle.
- **Deliverable:** the single thing that marks the cycle done.
- **Dependencies:** what it's waiting on / what waits on it.

## Orchestrator → subagent → review loop

1. **Orchestrator** decomposes the cycle's hero goal into tasks.
2. **Each subagent** owns one task with clear inputs → outputs → deliverable.
3. **Review loop** integrates outputs; recurring agents (daily brief, weekly review) run on schedule via skills/`loop`, not willpower.

## Writing a worker spec (not vibes)

Each subagent prompt should contain:
- **Verified context** it can't cheaply rediscover — paste it; workers start cold.
- **Exact file paths** it should read and write (shared state lives in `06_Trackers/`).
- **Decision boundaries** — "if a question is undecided, return the question, don't guess."
- **A Definition of Done** — the acceptance criteria for the artifact.

## Anti-pattern

Spinning up **all** agents at once. That's the overload trap. **One hero at a time** — everything else is maintenance until the gate clears.
