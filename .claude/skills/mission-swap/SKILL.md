---
name: mission-swap
description: Swap the active hero mission. Use when the owner says "swap the mission", "new hero mission", "change my focus", "this mission is done", or a weekly review decides the hero is changing. Snapshots the old dashboard/mission.json into archive/, writes the new one, resets the check state, and updates the pointers.
---

# Mission Swap

The dashboard hero — header, countdown, one-thing, week planner, evidence — renders entirely from `dashboard/mission.json`. Nothing else hardcodes the mission, so swapping it is a small, mechanical edit. This skill is the procedure; the pattern is documented in `AGENTS.md`.

There is always exactly **one** active hero mission. Swapping means closing the old one cleanly and opening the next.

## Steps

1. **Confirm the close.** Briefly confirm the current mission is actually done (or being intentionally set down). Capture what shipped — log any outstanding wins to `06_Trackers/evidence.md` (create it from `06_Trackers/evidence.template.md` if it doesn't exist yet) before archiving.

2. **Snapshot the old mission.** Read the current `dashboard/mission.json`, note its `slug`, and copy it to `archive/mission_<old-slug>.json`. If the mission had working files under `01_Focus/`, move them under `archive/<old-slug>/` so `01_Focus/` is clear for the new hero.

3. **Write the new `dashboard/mission.json`.** Follow `schemas/mission.schema.json`:
   - Pick a fresh, unique `slug` (this namespaces the week/evidence checkbox keys — a new slug guarantees old ticks don't bleed into the new mission).
   - Fill `hero`: `kicker`, `title`, `subtitle`, `gate` (ISO 8601), `gateLabel`, `gatePassedTitle`, `gatePassedMessage`, `mission`, `oneThing` (`tag`/`do`/`why`/`reframe`), `rule`, `reframeStrip`.
   - Fill `week` (theme per week, with day/week rows and their `items`) and `evidence` (the artifacts that will mark success).

4. **Reset the check state.** Because the new `slug` differs, the dashboard's persisted week/evidence ticks for the old mission no longer apply. Clear or archive the previous mission's stored check keys so nothing shows pre-ticked.

5. **Update the pointers.** So the written context matches the dashboard:
   - `00_START_HERE.md` — the "Today's hero" line (title + one main thing + gate).
   - `AGENTS.md` / project context — any "current state" note that names the active mission.

6. **Confirm.** Show the owner the new hero line and gate, and offer to run the `daily-brief` skill against the fresh mission.

## Rules
- One hero at a time — finish the swap; don't leave two missions half-active.
- Validate the new `mission.json` against `schemas/mission.schema.json` before saving.
- Archive, don't delete — closed missions are the memory for the "Measure" step.
