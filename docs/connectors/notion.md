---
title: "Notion Connector — Two-Way Sync"
area: docs
type: doc
tags: [connectors, notion, sync, setup]
updated: 2026-07
---

# Notion connector — two-way sync

The Notion connector makes Notion the **mobile front-end** for your Tasks and Habits: check a habit off on your phone, see it on the dashboard; add a task on the dashboard, find it in Notion. The repo stays the source of truth; Notion mirrors it. Setup is a one-time, roughly **10-minute** job.

It's powered by two serverless functions — `api/notion-sync.js` (push) and `api/notion-pull.js` (pull) — plus a shared helper `api/_notion.js` that maps LifeOS fields to Notion properties. The property names below are exactly what that code reads and writes, so your databases must match.

---

## Step 1 — duplicate the public Notion template

Duplicate the public **LifeOS** Notion template into your own workspace. It ships two databases — **Tasks** and **Habits** — already configured with the property names and select options LifeOS expects. Duplicating (rather than building by hand) is the reliable path: the names and option labels have to match exactly.

Prefer to build them yourself? Use the property tables in Step 4 as the spec.

---

## Step 2 — create an internal integration

1. Go to your Notion integrations settings and create a new **internal integration**.
2. Give it a name (e.g. "LifeOS Sync") and the capability to read and update content.
3. Copy the **Internal Integration Secret** — this is your `NOTION_API_KEY`.

---

## Step 3 — share the databases + grab the IDs

1. Open your duplicated **Tasks** database → **•••** menu → **Connections** → add your integration. Do the same for **Habits**. (Without this, the integration can't see the databases.)
2. Copy each **database ID** from its URL. Open the database as a full page; the ID is the 32-character slug **before `?v=`**:

   ```
   https://www.notion.so/<workspace>/<DATABASE_ID>?v=<view_id>
                                     └──────────────┘  ← this is the id you want
   ```

   > **Critical:** use the **database id** (the URL slug before `?v=`). Do **not** use a `collection://…` data-source id — the API rejects it and sync will fail. If what you copied starts with `collection://`, you copied the wrong thing; go back to the page URL.

You now have three values: `NOTION_API_KEY`, `NOTION_DATABASE_ID_TASKS`, `NOTION_DATABASE_ID_HABITS`.

---

## Step 4 — the exact property names the code expects

The sync helper (`api/_notion.js`) maps fields by **exact property name**. Match these or sync will silently write nothing.

### Tasks database

| Notion property | Type | Values LifeOS uses |
|---|---|---|
| **Task** | Title | The task text |
| **Area** | Select | One option per area code in your `lifeos.config.json` (the `notion` label — e.g. `Career`, `Health`, `Finance`) |
| **Priority** | Select | `P1 Today` · `P2 This Week` · `P3 Later` |
| **Status** | Status | `Not started` · `In progress` · `Done` |
| **Due** | Date | Optional due date |

LifeOS ↔ Notion mapping for the coded fields:

- Priority: `P1 → "P1 Today"`, `P2 → "P2 This Week"`, `P3 → "P3 Later"`.
- Status: `open → "Not started"`, `in-progress → "In progress"`, `done → "Done"`.
- Area: your local area **code** maps to the option's **label** via the `notion` field in each `areas[]` entry of `lifeos.config.json`, so the two never drift.

### Habits database

| Notion property | Type | Notes |
|---|---|---|
| **Habit** | Title | The habit name |
| **Keystone** | Checkbox | A foundational habit that protects the others |
| **Active** | Checkbox | Whether it's currently tracked |
| **Cadence** | Select | e.g. `Daily`, `Weekdays`, `3x/week` |
| **Week Of** | Date | The Monday of the tracked week |
| **Mon … Sun** | Checkbox (7) | One checkbox per day: `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun` |

The weekly matrix on the dashboard maps directly onto the seven day-checkboxes plus `Week Of`.

---

## Step 5 — set the environment variables

Put these in a gitignored `.env` for local dev **and** in your host's environment variables for the deployed functions (templates in `.env.example`):

```bash
NOTION_API_KEY=<your-notion-integration-token>       # starts with "ntn_" (or legacy "secret_")
NOTION_DATABASE_ID_TASKS=<tasks-database-id>          # 32 hex chars from the DB URL
NOTION_DATABASE_ID_HABITS=<habits-database-id>
SYNC_SHARED_SECRET=<any-long-random-string>
```

### About `SYNC_SHARED_SECRET`

This authenticates the **dashboard → serverless** calls. The dashboard sends it as an `X-Sync-Secret` header; the function compares it to `SYNC_SHARED_SECRET`. The dashboard doesn't read the value from an env var (it's static — it can't), so you set the matching key **in the dashboard itself**: click **🔑 Sync key** in the sync bar and paste the same string. It's stored in that browser's local storage and never committed, so do it once per device.

- **If unset on the server**, the sync endpoints are **open** — acceptable for local development only. For any deployment reachable on the internet, set it, or anyone who finds your function URL can write to your Notion.
- **If set on the server but not in the dashboard**, sync returns `401`. Set the key with the 🔑 button.

---

## Step 6 — sync

- **Pull** hydrates local task/habit data from Notion (`api/notion-pull.js`, or the pull control in the dashboard's sync bar).
- **Push** sends dashboard changes up (`api/notion-sync.js`).

If nothing happens, the usual causes are: the integration wasn't shared with the database (Step 3.1), a property name doesn't match exactly (Step 4), or a `collection://` id was used instead of the database id (Step 3.2).

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| "Notion sync not configured" | One of `NOTION_API_KEY` / `NOTION_DATABASE_ID_TASKS` / `NOTION_DATABASE_ID_HABITS` is missing. |
| `401 Unauthorized` on sync | The dashboard's 🔑 Sync key doesn't match `SYNC_SHARED_SECRET` on the server (or isn't set — click 🔑 Sync key). |
| Sync runs but Notion doesn't change | Integration not added to the database's **Connections**, or a property name/type doesn't match Step 4. |
| API rejects the database id | You used a `collection://` data-source id. Use the URL slug **before `?v=`**. |
| Areas come back as the wrong label | An `areas[]` entry's `notion` label in `lifeos.config.json` doesn't match a Select option in the Tasks DB. |
