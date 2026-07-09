# Security Policy

## Threat model

LifeOS is a **self-hosted personal system**: when you run it, it holds *your*
life data. There is no LifeOS server and no shared backend — your data lives in
your own Git repo, your browser's `localStorage`, and (optionally) your own
Notion workspace and Vercel deployment.

Security therefore means: **your secrets stay yours.**

- All secrets (Notion API key, sync shared secret, connector tokens) live in
  environment variables — `.env` locally, Vercel Environment Variables in
  production. They are **never** placed in `lifeos.config.json` or any committed
  file.
- The dashboard is a static site; it makes no network calls except to the sync
  functions *you* deploy.
- `.gitignore` excludes `.env*`, `lifeos.config.json`, `.mcp.json`, and your
  private vault content by default.

## Reporting a vulnerability

Please report security issues through **GitHub's private vulnerability
reporting** (Security tab → "Report a vulnerability") rather than a public
issue. We aim to acknowledge reports within a few days.

Please do **not** include real personal data or live tokens in a report.
