---
title: "Deploy the Dashboard"
area: docs
type: doc
tags: [deploy, vercel, hosting, env-vars]
updated: 2026-07
---

# Deploy the dashboard

The LifeOS dashboard (`dashboard/`) is a **static site** — plain HTML/JS, no build step. Serve it (locally with `python3 -m http.server`, or hosted) so its JSON fetches work; opening `index.html` straight from disk mostly works but `file://` blocks some fetches. This guide covers Vercel; any static host works the same way.

**It works with zero configuration.** Deployed with **no environment variables**, the dashboard renders fully from the committed JSON in `dashboard/` (`lifeos.config.json` or its `.example`, `mission.json`, `tasks-data.json`, `habits-data.json`, `kb-data.json`, `finance-data.json`, `quotes.json`) and stores checkbox state in the browser's `localStorage`. Connectors like Notion sync simply stay dormant until you add their keys — this is intentional **graceful degradation**, not an error state.

**To personalize a deploy**, commit `dashboard/lifeos.config.json` (copied from the `.example` and edited) **in your private instance** — the public repo stays the clean template. The config holds identity + toggles, never secrets, and because it lives in the deploy root, the hosted dashboard renders as you instead of the demo persona. A personalized deploy is *your life on a URL*: gate it behind your host's access protection, or treat it as public.

---

## Option A — one-click "Deploy to Vercel"

The fastest path. A deploy button is just a link with your repo URL:

```
https://vercel.com/new/clone?repository-url=https://github.com/YOUR_ORG/YOUR_REPO
```

Drop that into your README as a button:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_ORG/YOUR_REPO)
```

Vercel clones the repo, reads `vercel.json`, and deploys. You can add env vars in the same flow or later (see below). You'll get a URL like `https://your-deployment.vercel.app`.

---

## Option B — import the repo

1. Push your repo to GitHub.
2. Go to Vercel → **Add New… → Project** → import your repo.
3. Vercel reads **`vercel.json`** at the repo root, which pins the static output directory:
   ```json
   {
     "version": 2,
     "buildCommand": "",
     "outputDirectory": "dashboard"
   }
   ```
   No build command (it's static); output is the `dashboard/` folder. If you configure via the UI instead, set **Framework Preset:** Other, **Build Command:** *(empty)*, **Output Directory:** `dashboard`.
4. **Deploy.** Every push to the branch auto-redeploys. Your site is at `https://your-deployment.vercel.app`.

---

## Option C — Vercel CLI (one-off)

```bash
npm i -g vercel
vercel          # link/create project, follow prompts
vercel --prod   # promote to production
```

---

## Environment variables (all optional)

None of these are required to deploy. Add them only for the features you want. Set them under **Project → Settings → Environment Variables** (and mirror them into a gitignored `.env` for local dev). Templates live in **`.env.example`**.

| Variable | Enables | Notes |
|---|---|---|
| `NOTION_API_KEY` | Notion two-way sync | Internal integration token. |
| `NOTION_DATABASE_ID_TASKS` | Tasks sync | The **database id** (URL slug), not a `collection://` id. |
| `NOTION_DATABASE_ID_HABITS` | Habits sync | Same rule. |
| `SYNC_SHARED_SECRET` | Auth for dashboard → serverless calls | Any long random string. Set the **identical** value in the dashboard via the **🔑 Sync key** button in the sync bar (stored per-browser, never committed). If unset on the server, the sync endpoints are open (fine locally, **not** for a public deployment). |

Full Notion walkthrough (including the exact property names and where to find the database id): **[connectors/notion.md](connectors/notion.md)**.

Planned connectors (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BROKER_API_KEY`, …) are listed commented-out in `.env.example`. They are docs-only in v1 — see [connectors/README.md](connectors/README.md) and [ROADMAP.md](ROADMAP.md).

---

## Serverless functions

If you set the Notion env vars, Vercel automatically serves the functions in `api/` (`notion-sync.js`, `notion-pull.js`) alongside the static dashboard — no extra configuration. With the vars unset, those endpoints return a clear "not configured" message and the dashboard carries on in local-only mode.

---

## Keep it private

The dashboard holds your personal planning. To keep a deployment from being public:

- **Deployment Protection** — require login to view (Project → Settings → Deployment Protection), or
- **Password Protection** if your plan offers it, or
- Keep the URL unlisted (weakest — avoid once finance data is involved).

---

## Put it on your phone

Open your `https://your-deployment.vercel.app` URL in mobile Safari/Chrome → **Share → Add to Home Screen**. It behaves like an app; checkbox state persists per-device via `localStorage`. If you want state shared across devices, enable the Notion connector so tasks and habits live in a database instead of the browser.
