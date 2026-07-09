---
title: "🤖 AI Workflow"
area: ai-workflow
type: index
tags: [ai-workflow]
updated: 2026-07
---

# 🤖 AI Workflow

How to run a LifeOS with AI doing the heavy lifting — without AI becoming another thing to manage. This folder is framework-level: the patterns hold regardless of who the owner is, and regardless of which assistant you use.

## The core loop

1. **Orchestrator** (a lead AI session, or the owner) breaks a goal into tasks.
2. **Subagents** (AI sessions or "hats") each own one task with clear inputs and outputs.
3. **Review loop** — the orchestrator checks outputs, integrates, iterates.
4. **Loop engineering** — recurring tasks (daily brief, weekly review) run on a schedule, not on willpower.

## Files
- [`claude_guide.md`](claude_guide.md) — working with an in-repo AI coding agent (written around Claude Code; the patterns carry to any agentic assistant).
- [`subagents.md`](subagents.md) — the orchestrator → subagent → review pattern in depth.
- [`master_prompt.md`](master_prompt.md) — a reusable prompt to bootstrap any AI session with full context.
- [`model_orchestration_map.md`](model_orchestration_map.md) — routing work across a tier of models (planner / orchestrator / builder / sweeper).

## The principle

AI should produce **evidence, not more plans.** If a session ends with another to-do list instead of a shipped artifact, the loop failed. The vault's job is to make that loop cheap to run: self-describing context (`AGENTS.md` → `00_START_HERE.md` → `06_Trackers/`), shared state in `06_Trackers/`, and skills that turn recurring work into one command.

## The tier idea (one job per tier)

Give each capability tier exactly one job and never invert the pyramid:

| Tier | Job |
|------|-----|
| **Planner** (most capable) | Strategy, contested design, taste decisions, final gap/quality gates |
| **Orchestrator** | Decompose plans, launch/steer workers, review, integrate |
| **Builder** | Volume implementation from a written spec |
| **Sweeper** (fastest/cheapest) | Mechanical, well-specified, high-volume tasks |

See [`model_orchestration_map.md`](model_orchestration_map.md) for how to map concrete models onto these tiers.
