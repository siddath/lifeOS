---
title: "🧠 Model Orchestration Map"
area: ai-workflow
type: reference
tags: [ai, orchestration, models, subagents]
updated: 2026-07
---

# 🧠 Model Orchestration Map

> How LifeOS work gets routed across a tier of models. **A planner plans, an orchestrator coordinates, builders build, a sweeper cleans.** This is a pattern, not a price list — map your available models onto the four tiers and let the defaults route the work.

## The four tiers

| Tier | Character | Route to it |
|------|-----------|-------------|
| **Planner** | Most capable; deepest long-horizon reasoning, ambiguity navigation, taste | Strategy, contested/novel design, final gap and quality gates |
| **Orchestrator** | Strong agentic *execution* and memory; cheap enough to stay resident across a long run | Decomposing plans, launching and steering workers, code review, integrating results |
| **Builder** | Near-top coding quality at lower cost; literal, strong tool use | Volume implementation from a written spec — components, scripts, dashboards, analysis |
| **Sweeper** | Fastest and cheapest; great at simple, well-specified work | Mechanical, high-volume, low-ambiguity tasks — inventories, link checks, formatting, find-and-replace |

Pick the actual models you have access to and assign one to each tier. When a provider ships new models, re-map the tiers — verify current model names and limits against the provider's live catalog rather than from memory.

## Task-category → tier routing

| Category | Tier | Why |
|----------|------|-----|
| Max-level planning, strategy, life-architecture decisions | **Planner** | Deep reasoning changes the outcome. One good plan → many cheap executions. |
| Gap evaluation / adversarial review of finished plans and builds | **Planner** | Finds what the builder missed; taste + long-horizon judgment. |
| System / architecture design | **Planner** (novel/contested) → **Orchestrator** (established patterns) | If the design space is genuinely open, use the planner; if it's applying known patterns, the orchestrator is equal and cheaper. |
| Orchestration — decompose, launch/steer workers, integrate | **Orchestrator** | Long-horizon execution + memory; cheap enough to stay resident. |
| Code / correctness review | **Orchestrator** | Strongest real-bug finding. Prompt it to report everything and filter downstream. |
| Complex implementation — tricky state, concurrency | **Orchestrator** or **Builder** | Orchestrator when correctness of stateful logic matters; builder otherwise. |
| Coding / prototyping at volume | **Builder** | Near-top quality; literal instruction-following is a feature when executing a detailed spec. |
| Analysis / research synthesis | **Builder** | Strong comprehension at volume cost. |
| Taste comparison / aesthetics | **Planner** decides, **Builder** renders the candidates | Don't pay planner rates to write CSS. |
| Mechanical sweeps — link checks, frontmatter tagging, inventories, formatting | **Sweeper** | Well-specified, low-ambiguity, high-volume. |
| Search / locate in a repo | **Sweeper / Builder** | Finding ≠ judging. Route the judgment up. |

## Operating rules

1. **Plan once at the top, execute cheap below.** The planner writes the spec; builders and sweepers never improvise architecture — if a worker hits an undecided question, it *returns* the question instead of guessing.
2. **Spec quality is the multiplier.** Builders follow instructions literally. A vague prompt costs more (retries) than a well-written spec plus one clean pass.
3. **Full task spec up front, one turn.** State the complete goal once — no drip-feeding.
4. **Verification is a separate, fresh-context agent.** Builders don't grade their own work. A review agent gets *no* builder context beyond the artifact plus acceptance criteria (the "no-context preview" test).
5. **Escalate on ambiguity, delegate on volume.** If a sweeper task turns out ambiguous, route it up; if a planner task turns out mechanical, route it down.
6. **Manual override always wins.** Any request can name a tier or model explicitly; this map is the default, not a cage.
7. **Never invert the pyramid.** Putting the planner on sweeps multiplies cost for zero gain. A typical work cycle is one plan, one orchestration, a few builds, and cheap sweeps — in that proportion.

## Related

- [`subagents.md`](subagents.md) — the orchestrator → subagent → review loop.
- [`../.claude/skills/`](../.claude/skills/) — the skills that turn recurring work into one command.
