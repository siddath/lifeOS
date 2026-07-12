---
name: setup
description: First-run onboarding for a fresh LifeOS clone. Use when the owner says "set up LifeOS", "onboard me", "get started", "make this mine", or is running the vault for the first time. Runs an AI-guided interview, writes dashboard/lifeos.config.json, invites a brain-dump about their life, maps it into the schemas and templates, and generates the first daily brief.
---

# Setup — Make this LifeOS yours

This is the front door. A fresh clone ships with the "Alex Rivera" demo persona so everything renders; this skill replaces it with the real owner. Be warm, brief, and concrete — ask a little, write real files, show a result fast. Don't turn onboarding into a planning marathon.

The contract you are filling lives in `schemas/`. Read `schemas/lifeos.config.schema.json` before writing config, and the other schemas before writing any state.

## Phase 1 — Identity interview (short)

Ask, a few at a time (accept partial answers, infer sensible defaults, confirm rather than interrogate):

1. **Name** — full name + what they like to be called (`owner.name`, `owner.shortName`, `owner.greeting`).
2. **Where / when** — timezone (IANA, e.g. `America/Los_Angeles`), locale (BCP-47), currency (ISO 4217).
3. **Life areas** — the handful of areas they want to track. Offer a starter set and let them edit. Each becomes an entry in `areas[]` with a lowercase `code` (`^[a-z0-9_]+$`), a `label`, and an `emoji`.
4. **Modules** — which parts to switch on (`modules`): `missions`, `trackers`, `finance`, `knowledge_base`, `anchor`, `flashcards`. Default most on, `flashcards` off.
5. **Current hero mission** (if `missions` is on) — the one outcome they're racing toward right now, and its gate date. This seeds `dashboard/mission.json`.

## Phase 2 — Write `dashboard/lifeos.config.json`

Copy `dashboard/lifeos.config.example.json` to `dashboard/lifeos.config.json` and replace the demo values, validated against `schemas/lifeos.config.schema.json`. It holds identity + toggles, not secrets — but it *is* personal data. **Check the instance is private first:** if this clone is (or pushes to) a public repo, tell the owner to move to a private repo (private clone, or a new private repo from the template) before committing personal config or data. In a private instance, committing the config inside `dashboard/` (the deploy root) is what makes a hosted dashboard render as the owner instead of the demo persona. Keep the `product` block. Leave `integrations.*.enabled` false until the owner wires them (secrets go in `.env`, never here).

## Phase 3 — "Paste anything about your life"

Invite the owner: *"Paste anything — a brain-dump, an old journal, notes, goals, whatever. Messy is fine. I'll sort it."* Then map what they give you into the vault, honoring the schemas:

- **Tasks** → `dashboard/tasks-data.json` (shape: `tasks.schema.json` — title, area code, priority, status). This is the file the dashboard hydrates on first run, so the owner sees the tasks immediately. Mirror to `06_Trackers/tasks.md` only if you also want a long-form vault copy.
- **Habits / routines** → `dashboard/habits-data.json` (`habits.schema.json`) — the weekly matrix renders from this file.
- **"About me" facts** (strengths, values, watch-outs, preferences, one per area) → `dashboard/kb-data.json` following `kb.schema.json`. This is the surface the Knowledge Base page renders — it reads the JSON, not markdown. Keep `02_Areas/knowledge_base/*.md` as an optional long-form layer.
- **Dated things** → `06_Trackers/reminders.md`.
- **Loose ideas / worries** → `06_Trackers/inbox.md` (append, timestamped).
- A fresh clone ships only `06_Trackers/*.template.md` — when a live tracker file you need doesn't exist yet, create it from its matching template rather than failing. The dashboard JSON in `dashboard/` is the authoritative state; the `06_Trackers/*.md` files are its human-readable mirror layer.
- **Area notes** → one file per area under `02_Areas/`, each starting with frontmatter (`title/area/type/tags/updated`).
- **The hero mission** → `dashboard/mission.json` following `mission.schema.json` (pick a `slug`, fill `hero`, `week`, `evidence`). Snapshot the demo mission into `archive/` first if you're replacing it.

Use `templates/` for any new note's shape. Tag every task and note with an area **code that exists in the config** — don't invent new ones.

## Phase 4 — First daily brief

Once state exists, run the `daily-brief` skill so the owner immediately sees the payoff: a calm "here's today" built from their own mission and tasks. Then point them at `00_START_HERE.md` and the dashboard.

## Rules
- Write real files, not just suggestions — onboarding should leave the vault populated.
- Confirm before overwriting the demo persona's files; snapshot demo content to `archive/` rather than deleting outright.
- Keep the owner's own words in their notes; you organize, you don't rewrite their voice.
- Stop when the vault renders end-to-end with the real owner. Don't gold-plate the first session.
