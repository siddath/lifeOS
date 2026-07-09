# AGENTS.md — Rules of engagement for AI sessions

> Read this first. It tells any AI agent — Claude, ChatGPT, Cursor, Copilot, Gemini, or anything else — how this LifeOS vault is organized and how to work inside it. This is a reusable **pattern**, not one person's story. Identity and settings live in `lifeos.config.json`; the words below use `{{owner}}` wherever your name would go. Anywhere you see `<!-- lifeos:fill -->`, replace it with something true for you and delete the marker.

## Onboarding — read this if a person just opened this repo

**Everything shipped here is demo data.** The name Alex Rivera, the town of Portland, the app "Fieldnotes," the pottery hobby, the "Operation Launch Week" mission, the sample tasks and habits — all placeholder. It exists so a fresh clone renders fully before anyone personalizes it. Every seed data file announces this: JSON files carry a top-level `"_DEMO"` key, and the marker files say `<!-- lifeos:fill -->`. See [DEMO_DATA.md](DEMO_DATA.md) for the full convention.

**Your job, the first time someone opens this repo with you, is to replace that persona with the real one.** Concretely:

1. **Recognize the placeholders.** If you see Alex Rivera / Portland / Fieldnotes / pottery, or a `"_DEMO"` key, treat it as a fill-me-in template — never as the user's real life.
2. **Get their material.** Ask them about themselves, or take whatever they hand you: a paragraph, a brain-dump, an old journal, an exported Obsidian vault, a Notion export, a folder of loose files, a task list. Whatever form it's in is fine — the mapping is your job, not theirs. Don't make them reformat anything.
3. **Map it onto the schemas.** The files in `schemas/` are the contract. Read the relevant schema, then write conforming data:
   - identity, area codes, currency, enabled modules → `dashboard/lifeos.config.json` (copy `dashboard/lifeos.config.example.json`, replace the demo values). It's **safe to commit** — identity + toggles, never secrets — and committing it inside `dashboard/` is exactly what personalizes a static deploy.
   - the one thing they're driving toward → `dashboard/mission.json` (`mission.schema.json`)
   - their tasks → `dashboard/tasks-data.json` (`tasks.schema.json`); recurring things → `dashboard/habits-data.json` (`habits.schema.json`). These two files are what the dashboard hydrates from on first run, so writing them is how the user sees tasks/habits without touching the UI. (A vault mirror at `06_Trackers/tasks.md` / `habits.md` is an optional long-form layer.)
   - facts about them (strengths, values, watch-outs, preferences, one per life area) → `dashboard/kb-data.json` (`kb.schema.json`) — the surface the Knowledge Base page renders. Keep `02_Areas/knowledge_base/*.md` as an optional long-form layer; the page reads the JSON, not the markdown.
   - money → `dashboard/finance-data.json` (`finance.schema.json`)
4. **Snapshot before you overwrite.** Move demo content into `archive/` rather than deleting it, and confirm before replacing a file the user might have touched.
5. **Stop when it renders as them.** Open `dashboard/index.html` — their name, areas, and mission should appear. Don't gold-plate the first session; get them a working vault, then iterate.

The schemas are what make this reliable across any assistant: infer the fields the schema asks for (area codes from their config, `priority` as P1/P2/P3, `status`, due dates from natural language) and emit valid JSON. Messy input in, structured data out. If you're Claude Code, the `/setup` skill walks this exact path; any other assistant does it by reading this section and the schemas directly.

## Who this is for

<!-- lifeos:fill --> One paragraph on the owner: who `{{owner}}` is, what they do, where they are, and what matters right now. Keep it short — the agent reads this to calibrate tone and priorities, not to memorize a biography.

**North Star:** <!-- lifeos:fill --> one sentence naming the life `{{owner}}` is building — the thing every mission ultimately serves.

The agent should treat this section as the standing context for every session. When it goes stale, update it; don't work around it.

## The operating principle

The whole system exists to move `{{owner}}` from *Think → Plan → Improve the plan → Think again* to **Think once → Build → Measure → Improve.**

Every week must end with **evidence (artifacts), not ideas.** A session that ends with a longer to-do list instead of one shipped thing has failed, even if the to-do list is excellent.

**Spiral guardrail.** This system is built for people who over-plan under pressure. When `{{owner}}` is spiraling — reopening decisions, widening scope, planning instead of doing — **name it plainly and push them to ship one concrete thing.** Small and honest beats complete and imaginary. Structure calms the spiral; more options feed it.

## One hero mission at a time

There is always exactly **one** active hero mission — the single most important outcome right now. Everything else runs in maintenance mode until the hero closes.

- The hero renders entirely from `dashboard/mission.json` (see the lifecycle below). Nothing else hardcodes it.
- If a task doesn't serve the active mission, it goes to the parking lot — **except** the always-OK basics: relationship/family time, sleep, food, health, and unavoidable admin. Those are never parked.
- Do not let `{{owner}}` reopen every project at once. Naming that pull ("that's the spiral — one hero at a time") is part of the job.

## File map

The vault is plain Markdown + JSON so it stays portable, greppable, and yours. Folders are numbered so they sort in order.

- `00_START_HERE.md` — the daily home base / index. Where a session starts.
- `01_Focus/` — the current mission's working files: study/prep notes, plans, checklists, scripts specific to the hero mission.
- `02_Areas/` — the standing life areas (one file per area code from `lifeos.config.json`), plus `02_Areas/knowledge_base/` — the searchable "about you" notes that power the knowledge base.
- `03_Projects/` — ongoing ventures and projects, each with its own notes and (optionally) subagent roles.
- `04_AI_Workflow/` — how AI runs this vault: the orchestrator/subagent pattern, the master prompt, the model-orchestration map.
- `05_Checklists/` — reusable checklists (topic-wise and situational).
- `06_Trackers/` — the live state layer. The repo ships blank `*.template.md` files here (`tasks.template.md`, `habits.template.md`, `reminders.template.md`, `inbox.template.md`, `evidence.template.md`, `finance.template.md`); your live `tasks.md`, `habits.md`, etc. are created from them on first setup. This is the shared memory that skills and subagents read and write. (What the *dashboard* renders lives as JSON in `dashboard/` — `tasks-data.json`, `habits-data.json`, `kb-data.json`, `finance-data.json` — per the schemas.)
- `templates/` — blank templates (daily journal, weekly review, project story, decision log).
- `dashboard/` — the interactive dashboard (`index.html`) whose hero renders from `mission.json`.
- `api/` — serverless sync functions (e.g. optional two-way Notion sync).
- `schemas/` — the JSON Schemas that define the data contracts (config, mission, tasks, habits, finance, knowledge base). When in doubt about a shape, read the schema.
- `reviews/` — filed weekly reviews (`YYYY-Www.md`) — the memory for the "Measure" step.
- `examples/alex/` — a fully worked demo instance (the "Alex Rivera" persona) so a fresh clone renders and reads end-to-end before you personalize it.
- `archive/` — closed hero missions and retired `mission.json` snapshots.

## Data contracts

Live state has schemas in `schemas/`. Skills and sync code should honor them:

- `lifeos.config.schema.json` — identity, area codes, enabled modules. Read `dashboard/lifeos.config.json` for the current instance (falling back to `dashboard/lifeos.config.example.json`).
- `mission.schema.json` — the hero mission (`dashboard/mission.json`).
- `tasks.schema.json`, `habits.schema.json`, `finance.schema.json`, `kb.schema.json` — trackers and knowledge base.

Area codes are defined once in `lifeos.config.json`. Every task/note tags one of those codes — don't invent new area strings ad hoc.

## Mission lifecycle — how to swap the hero

The dashboard hero (header, countdown, one-thing, week planner, evidence) renders entirely from `dashboard/mission.json`. Swapping the hero is a small, mechanical edit — not a rewrite. The `mission-swap` skill automates it; the steps are:

1. **Snapshot the old mission.** Copy the current `dashboard/mission.json` to `archive/mission_<old-slug>.json`. Move any mission-specific working folder under `archive/<old-slug>/`.
2. **Write the new `mission.json`.** New `slug`, new `hero` block (kicker, title, subtitle, `gate` date, `gateLabel`, `oneThing`, `rule`), new `week` rows, new `evidence` items. Validate against `schemas/mission.schema.json`.
3. **Reset the check state.** The `slug` namespaces the week/evidence checkbox keys so ticks never carry across missions — pick a fresh slug and the previous mission's ticks won't bleed in. Clear or archive the old mission's persisted checks.
4. **Update the pointers.** Refresh the hero line in `00_START_HERE.md` and the "current state" note in this file so the written context matches the dashboard.

That's the whole swap — a ~10-minute edit.

## Rules of engagement

1. **Everything answers one question:** *does this serve the active hero mission?* If no, it's parked — except relationship/family time, sleep, food, health, and admin-critical items, which are always allowed.
2. **Don't over-plan.** Prefer shipping a usable artifact over a perfect plan. When `{{owner}}` is planning a third time, that's the signal to ship.
3. **Keep tone direct and calm.** Structure helps someone who spirals under pressure; walls of options don't.
4. **Preserve `{{owner}}`'s entries.** When updating trackers, append — don't overwrite.
5. **Log evidence, not ideas.** Every session that ships something adds a line to `06_Trackers/evidence.md`.
6. **Privacy first.** A personal LifeOS holds sensitive detail (finances, relationships, IDs). Keep your instance private. For anything public, extract a sanitized showcase instead of publishing the vault. <!-- lifeos:fill --> add any owner-specific privacy rules.
7. **Self-describing on purpose.** Any session can get oriented from `CLAUDE.md` → `AGENTS.md` → `00_START_HERE.md` → `06_Trackers/`. Keep that chain accurate.

## Sync

- Source of truth is this Git repo. Optionally mirror to Notion and/or host `dashboard/` (see `04_AI_Workflow/` and `api/`).
- The repo doubles as an Obsidian vault: relative Markdown links (not wikilinks), YAML frontmatter on content files (`title`/`area`/`type`/`tags`/`updated`). When you add a note, give it frontmatter so it joins the computed layer.
