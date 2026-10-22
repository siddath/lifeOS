---
name: daily-brief
description: Generate the owner's morning brief from the LifeOS. Use when they say "daily brief", "what's my day", "morning brief", "what should I do today", or any morning check-in asking what to focus on — even casual/scattered phrasings like "ok what now" at the start of a day. Pulls the mission cadence, P1 tasks, reminders, and habits into a short, calm, do-this-now summary.
---

# Daily Brief

Give the owner a short, calm summary of confirmed current priorities. Do not infer their emotional state or assume that execution is what they need. Mark uncertainty rather than repeating stale tasks as current.

Read the owner's name, timezone, and locale from `dashboard/lifeos.config.json` (`owner.shortName`, `owner.timezone`, `owner.locale`), falling back to `dashboard/lifeos.config.example.json` if it doesn't exist. Address them in second person; use their timezone for "today".

## Steps

1. **Establish today.** Note today's weekday and date first (in the owner's timezone) — several decisions below depend on it.
2. **Read the sources** (all paths relative to the repo root):
   - `dashboard/mission.json` — the active hero mission: title, `gate` date, `oneThing`, `rule`, and the week cadence.
   - `06_Trackers/tasks.md` — P1/P2 items. On a fresh instance this may not exist yet — read `dashboard/tasks-data.json` (the first-run seed) instead. Browser edits may be newer: ask for a private dashboard export before claiming a complete current task list or rewriting seeds; see `docs/browser-data.md`, and offer to create `06_Trackers/tasks.md` from `06_Trackers/tasks.template.md`.
   - `06_Trackers/reminders.md` — dated rows + recurring reminders. If missing, skip this source (offer to create it from its template); don't fail.
   - `01_Focus/` — the mission's working plan, only if the mission's `oneThing` points at a daily cadence there.
3. **Check both tasks and mission for staleness.** Compare today with `updated:` dates, day-specific headings, the mission gate and demo markers. Do not present past-day tasks or a passed/demo mission as today's direction. Use the mission's `oneThing` only when its currentness is supported. If both sources are stale, say that today's priority is unconfirmed and ask the owner what needs attention; do not manufacture a fallback task. Undated items may carry over when there is evidence they still apply.
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

Optional single ⚠️ line when step 3 found staleness: `⚠️ [source] still shows [old context]. Today's priority [comes from verified source / is not yet confirmed].`

## Rules

- Use the mission as one input, alongside the owner's current priorities and commitments. Do not exclude a requested item merely because it falls outside the mission.
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

Only create or change a schedule when the owner explicitly requests it. A brief request does not authorize recurring runs or external messages. Use the current assistant's supported scheduling tools when authorized.
