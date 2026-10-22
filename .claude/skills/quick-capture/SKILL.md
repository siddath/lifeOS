---
name: quick-capture
description: Capture a thought, task, idea, or worry into the LifeOS inbox without breaking flow. Use when the owner says "capture", "add to inbox", "note this", "remind me later", or dumps a quick idea. Appends to 06_Trackers/inbox.md and optionally classifies it.
---

# Quick Capture

Capture anything into the LifeOS with zero friction. The point is to get it out of the owner's head and into the system, then sort later.

## Steps
1. Read `06_Trackers/inbox.md` — if it doesn't exist yet (fresh instance ships only templates), create it from `06_Trackers/inbox.template.md` first.
2. Append the captured item as a bullet with a timestamp: `- [YYYY-MM-DD] <text>`.
3. If it's obviously a task, a routine, a reminder, or a someday-item, say so in one line and offer to file it directly. This skill writes vault files; it does not update existing browser tasks/habits. Explain that boundary if the owner expects the dashboard to change (see `docs/browser-data.md`):
   - Task → `06_Trackers/tasks.md` (with priority + area code from `dashboard/lifeos.config.json`; create the file from its template if missing)
   - Recurring → `06_Trackers/habits.md`
   - Date-bound → `06_Trackers/reminders.md`
   - Someday → the relevant `02_Areas/` note (or a dedicated someday file)
4. Do **not** overwrite existing entries — always append.
5. Keep the reply to one or two lines. Don't turn a capture into a planning session.

## Rules
- Capture the owner's stated priority without automatically parking it until a mission gate. Offer a parking-lot label only if they ask for focus support or choose it themselves.
- When tagging an area, use only the area codes defined in `dashboard/lifeos.config.json` (fall back to the `.example` config if it doesn't exist).
