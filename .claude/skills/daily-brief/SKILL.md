---
name: daily-brief
description: Generate the owner's morning brief from the LifeOS. Use when they say "daily brief", "what's my day", "morning brief", "what should I do today", or any morning check-in asking what to focus on — even casual/scattered phrasings like "ok what now" at the start of a day. Pulls the mission cadence, P1 tasks, reminders, and habits into a short, calm, do-this-now summary.
---

# Daily Brief

Give the owner a short, calm "here's today" so they don't have to think. Execution, not planning. Many people who reach for this skill spiral under pressure — a brief that dumps everything, or confidently repeats stale tasks, makes things worse. Honest and small beats complete.

Read the owner's name, timezone, and locale from `lifeos.config.json` (`owner.shortName`, `owner.timezone`, `owner.locale`). Address them in second person; use their timezone for "today".

## Steps

1. **Establish today.** Note today's weekday and date first (in the owner's timezone) — several decisions below depend on it.
2. **Read the sources** (all paths relative to the repo root):
   - `dashboard/mission.json` — the active hero mission: title, `gate` date, `oneThing`, `rule`, and the week cadence.
   - `06_Trackers/tasks.md` — P1/P2 items.
   - `06_Trackers/reminders.md` — dated rows + recurring reminders.
   - `01_Focus/` — the mission's working plan, only if the mission's `oneThing` points at a daily cadence there.
3. **Staleness check on tasks.md (important).** Compare today's date against the file's `updated:` frontmatter and any day-specific headings (e.g. "Tonight (Thu)", "~36h to the gate"). If the P1 section was written for a day or gate that has already passed, **do not present those P1s as today's list** — that erodes trust in the whole brief. Instead: derive today's focus from `mission.json`'s `oneThing` (plus today's block from `01_Focus/` if the mission has one), and add one gentle ⚠️ line noting the tracker needs a refresh at the next review. Still-valid undated P1s (e.g. relationship/family time, sleep) may carry over. Never invent tasks that appear in no file.
4. **Filter time-bound items.** From `reminders.md` include only: rows dated today or tomorrow, and any recurring reminder that fires today (e.g. Sunday → weekly review; 1st of month → finance check). Skip everything already in the past.
5. **Compute the countdown.** Days from today until the mission `gate`. If the gate has passed, use the mission's `gatePassedMessage` framing instead of a countdown.

## Output format

Use exactly this shape, ≤12 lines total, no essays:

```
**🌅 [Weekday D Mon] · [mission title] · [N] days to [gateLabel]**
🎯 **One main thing:** [single most important thing — from mission oneThing / today's block]
🔴 **P1s:** [3–6 max, honest; omit the section if none are genuinely live]
⏰ **Time-bound:** [today/tomorrow reminders only; omit if none]
🔁 **Don't-skip basics:** [the owner's daily anchors — walk · water · relationship/family time · sleep]
🧘 [one calm grounding line tied to the mission's reframe — e.g. "One honest rep today is the win."]
```

Optional single ⚠️ line (only when step 3 found staleness): `⚠️ tasks.md still shows [old context] — refresh it at the next review; today's focus comes from the mission.`

## Rules

- Honor the current hero's rule (in `mission.json`): if an item doesn't serve the active gate, it's not in today's brief — except relationship/family time, sleep, food, health, and admin-critical items, which are always allowed.
- If a mission has a per-day cadence, the one main thing is **today's single block**, never "catch up on the whole plan."
- Tone: direct, warm, calm. Second person. No scolding about what's undone; no motivational padding.
- The brief must be self-contained — the owner should be able to act on it without opening any file.

## Example

Input: "what's my day?" on a Tuesday mid-mission (gate two weeks out, tasks.md fresh)
Output:
```
**🌅 Tue 14 Jul · Operation Launch Week · 12 days to beta launch day**
🎯 **One main thing:** Week 2 block — loading + error states across the core loop (ship one, tick it).
🔴 **P1s:** reply to the two beta-tester intros · draft the invite email
⏰ **Time-bound:** none today
🔁 **Don't-skip basics:** morning walk · water · read 20 min · time with Sam · sleep on time
🧘 Finished, not perfect. One shipped block is the win.
```

## Automating it (optional)

This skill can run on a schedule (e.g., a morning trigger / `loop`) to push the brief automatically. See `docs/` if present, or set up a Routine via the Claude Code remote tools.
