---
title: "Browser data and backups"
area: docs
type: doc
tags: [storage, backup, restore, privacy]
updated: 2026-10-22
---

# Browser data and backups

Dashboard edits save in **this browser, on this origin**. They do not update the repository.
Use this guide before moving devices, changing seed files or restoring a backup.

## Where changes live

- `dashboard/tasks-data.json` and `habits-data.json` seed an empty browser once. An empty
  array means an intentionally empty list. Later file edits do not replace browser entries.
- Task and habit edits, mission checks, daily reviews, habit history and quote favorites
  live in `localStorage`. Clearing site data, moving to another URL/port or using a different
  browser gives you a separate store. Private browsing may discard it on exit.
- Mission, config, knowledge and finance files remain file-backed. They are not edited by
  the dashboard and are not included in a browser backup. Keep the private repository too.

Serve the repository locally with `python3 -m http.server 8000`, then open
`http://localhost:8000/dashboard/`. Direct `file://` opening can block JSON fetches and show
the inline demo instead of your config. No build or package installation is needed to view it.

## Keep a separate copy

Open **Backup & sync → Export backup**. The full `LIFEOS3:` code appears in an in-page
dialog. Use **Copy code**, or **Select code** and your browser's Copy command, then save it
in a private file. The code stays visible even when clipboard access is denied. **Done**
or Escape closes the dialog and returns focus to the control that opened it.

The backup includes tasks, habits, checks, daily reviews, habit history, Anchor checks,
quote favorites and display preferences. It excludes the sync key, pending sync requests,
and file-backed data. The code is encoded text, **not encryption**; anyone with it can read
the entries. Never put a personal backup in this public template or a public issue.

## Restore deliberately

Export the current browser state first. Choose **Import backup**, paste the complete code
and choose **Review backup**. Validation shows counts and replacement information without
changing stored entries. Choose **Restore these saved entries** only after reviewing it.
**Cancel** or Escape leaves current entries unchanged and returns focus. Invalid or edited
codes must be reviewed again before the Restore button becomes available. A valid restore replaces only the entries included in that backup and clears
pending sync work, so old requests cannot overwrite the restored state. It sends nothing to
Notion. Existing entries absent from an older backup remain in place.

`LIFEOS2:` backups restore tasks, habits and checks; legacy `LIFEOS:` codes restore checks.
Habit weeks older than the current local week roll into history. Reload after restoring to
apply theme and quote preferences. Restore into the same private instance: Notion page IDs
belong to the workspace that created them. Browser-storage failures are reported with a
rollback attempt; keep your exported copy until you have checked the result.

## Reconcile browser edits with files

An assistant cannot infer current browser entries from the repository's seed JSON. Give it
a private export from the intended browser, ask it to compare entries with the seed files,
and review the proposed merge. Keep local IDs stable and preserve entries from both sides
until conflicts are resolved. Never reset `localStorage` just to reload a changed seed file.

## Optional Notion sync

Sync is off unless `integrations.notion.enabled` is `true` in
`dashboard/lifeos.config.json`. Follow the [Notion setup guide](connectors/notion.md), set the
server environment variables and enter the matching sync key in this browser.

Only subsequent task/habit mutations queue automatically. **Push** submits pending work;
an empty queue says **No pending changes**, which does not certify that the remote database
matches this browser. **Pull** reads remote data; push pending work first. If you type into a task or habit while
a pull is pending, its response is paused without replacing your text. Finish the edit,
push pending changes and pull again. Reviews, checks,
favorites and history remain local. See the guide's limitations before relying on sync.
