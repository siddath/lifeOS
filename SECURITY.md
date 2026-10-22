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
- The dashboard reads same-origin JSON files. Task/habit sync calls run only when
  `integrations.notion.enabled` is `true` in your private instance config.
- `.gitignore` excludes real `.env*` files and `.mcp.json` (the example files ship).
  It ignores the legacy repo-root config, but deliberately allows
  `dashboard/lifeos.config.json`: identity and toggles are committed only in a
  **private** instance so a private static deployment can read them. Config never
  contains secrets. Ignore rules are not a privacy boundary for the rest of the vault.
- Browser backups contain personal entries in an encoded, **unencrypted** form.
  Keep them private. Sync keys and queued network work are excluded; the dashboard
  stores its sync key only in that browser. See [browser data](docs/browser-data.md).
- An unlisted URL is still public. Use access protection for a personal deployment.

## Reporting a vulnerability

Please report security issues through **GitHub's private vulnerability
reporting** (Security tab → "Report a vulnerability") rather than a public
issue. We aim to acknowledge reports within a few days.

Please do **not** include real personal data or live tokens in a report.
