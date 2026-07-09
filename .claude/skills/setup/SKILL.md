---
name: setup
description: First-run onboarding for a fresh LifeOS clone. Use when the owner says "set up LifeOS", "onboard me", "get started", "make this mine", or is running the vault for the first time. Runs an AI-guided interview, writes lifeos.config.json, invites a brain-dump about their life, maps it into the schemas and templates, and generates the first daily brief.
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

## Phase 2 — Write `lifeos.config.json`

Write `lifeos.config.json` at the repo root (it is gitignored — it holds identity, not secrets), validated against `schemas/lifeos.config.schema.json`. Start from `lifeos.config.example.json` and replace the demo values. Keep the `product` block. Leave `integrations.*.enabled` false until the owner wires them (secrets go in `.env`, never here).

## Phase 3 — "Paste anything about your life"

Invite the owner: *"Paste anything — a brain-dump, an old journal, notes, goals, whatever. Messy is fine. I'll sort it."* Then map what they give you into the vault, honoring the schemas:

- **Tasks** → `06_Trackers/tasks.md` (shape: `tasks.schema.json` — title, area code, priority, status).
- **Habits / routines** → `06_Trackers/habits.md` (`habits.schema.json`).
- **Dated things** → `06_Trackers/reminders.md`.
- **Loose ideas / worries** → `06_Trackers/inbox.md` (append, timestamped).
- **"About me" facts** (strengths, values, watch-outs, preferences) → `02_Areas/knowledge_base/` as entries following `kb.schema.json` (this powers the searchable knowledge base).
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
