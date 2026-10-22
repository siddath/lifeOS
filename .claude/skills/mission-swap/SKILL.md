---
name: mission-swap
description: Swap the dashboard hero when the owner requests it. Archive the previous mission, write the chosen replacement with a fresh slug, preserve prior checks and update the pointers.
---

# Mission Swap

The dashboard hero — header, countdown, one-thing, week planner, evidence — renders entirely from `dashboard/mission.json`. Nothing else hardcodes the mission, so swapping it is a small, mechanical edit. This skill is the procedure; the pattern is documented in `AGENTS.md`.

The dashboard displays **one** hero mission. Swapping that slot does not decide what else the owner may pursue.

## Steps

1. **Confirm the close.** Briefly confirm the current mission is actually done (or being intentionally set down). Capture what shipped — log any outstanding wins to `06_Trackers/evidence.md` (create it from `06_Trackers/evidence.template.md` if it doesn't exist yet) before archiving.

2. **Snapshot the old mission.** Read the current `dashboard/mission.json`, note its `slug`, and copy it to `archive/mission_<old-slug>.json`. If the mission had working files under `01_Focus/`, move them under `archive/<old-slug>/` so `01_Focus/` is clear for the new hero.

3. **Write the new `dashboard/mission.json`.** Follow `schemas/mission.schema.json`:
   - Pick a fresh, unique `slug` (this namespaces the week/evidence checkbox keys — a new slug guarantees old ticks don't bleed into the new mission).
   - Fill `hero`: `kicker`, `title`, `subtitle`, `gate` (ISO 8601), `gateLabel`, `gatePassedTitle`, `gatePassedMessage`, `mission`, `oneThing` (`tag`/`do`/`why`/`reframe`), `rule`, `reframeStrip`.
   - Fill `week` (theme per week, with day/week rows and their `items`) and `evidence` (the artifacts that will mark success).

4. **Preserve check history.** A fresh `slug` isolates the new mission's week/evidence ticks. Keep previous namespaced keys and browser backups; clearing them is unnecessary. Do not clear `localStorage` or remove other checks as part of a mission swap.

5. **Update the pointers.** So the written context matches the dashboard:
   - `00_START_HERE.md` — the "Today's hero" line (title + one main thing + gate).
   - `AGENTS.md` / project context — any "current state" note that names the active mission.

6. **Confirm.** Show the owner the new hero line and gate, and offer to run the `daily-brief` skill against the fresh mission.

## Rules
- Keep the dashboard's single mission file and home pointers consistent with the owner's chosen focus.
- Validate the new `mission.json` against `schemas/mission.schema.json` before saving.
- Archive, don't delete — closed missions are the memory for the "Measure" step.
