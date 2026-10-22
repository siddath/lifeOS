---
title: "AI Coding Agent — Leverage Guide"
area: ai-workflow
type: note
tags: [ai-workflow]
updated: 2026-07
---

# AI Coding Agent — Leverage Guide

How to get the most out of an in-repo AI agent (e.g. Claude Code) running this LifeOS vault.

## What an in-repo agent is best at
- Live, in-repo pairing: reading the whole vault and editing files in place.
- Architecture and design conversations.
- Multi-step tasks with tools (search, edit, run, git, and MCP connectors like Notion / GitHub / Calendar).
- Running **skills** (`setup`, `daily-brief`, `quick-capture`, `weekly-review`, `mission-swap`) — see [`../.claude/skills/`](../.claude/skills/).

## How to start any session
Paste or reference [`master_prompt.md`](master_prompt.md), or just say *"read `AGENTS.md` and `00_START_HERE.md` first."* The vault is self-describing on purpose — identity comes from `lifeos.config.json`, the mission from `dashboard/mission.json`, and live state from `06_Trackers/`.

## Good jobs to hand it
- "Update my trackers from this brain-dump."
- "Review my week and propose what to keep or reschedule."
- "Swap my hero mission — this one's done."
- "Mirror these changes to Notion."
- "Refactor the dashboard."

## Orchestrator pattern
- Use one **lead session** as orchestrator.
- Use subagents for independent work only when the owner or applicable instructions authorize delegation.
- Keep `06_Trackers/` as the shared state subagents read and write.

## Hygiene
- Commit often; let PRs be the review surface.
- Keep `AGENTS.md` and `lifeos.config.json` accurate — they are the context contract.
- Match the requested outcome. Log shipped work when useful; do not turn rest or reflection into an obligation to produce an artifact.
