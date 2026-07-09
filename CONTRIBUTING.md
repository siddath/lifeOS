# Contributing to LifeOS

Thanks for wanting to help. LifeOS is a small, focused framework — a plain-text life vault, a static dashboard, Claude skills, and a few optional connectors. Contributions that keep it simple and private-by-default are very welcome.

## Ground rules

1. **No personal data in PRs.** This project holds *your own* life data when you run it. Never commit real names, family details, finances, tokens, Notion IDs, or deployment URLs. The demo persona ("Alex Rivera") is the only allowed example content. CI runs a generic secret/PII scan on every PR.
2. **No build step.** The dashboard is a static site — open `dashboard/index.html` over `file://` and it works. Keep it dependency-free in the browser.
3. **Config over hardcode.** Anything user-specific belongs in `lifeos.config.json` / `schemas/`, never inline in HTML or JS.

## Running locally

```bash
git clone <this-repo>
cd lifeos
cp lifeos.config.example.json lifeos.config.json   # optional; example is the fallback
open dashboard/index.html                           # or: python3 -m http.server
```

The serverless functions in `api/` only run when deployed to Vercel (or `vercel dev`) with Notion env vars set. Without them, the dashboard degrades gracefully to local-only.

## Adding a connector

See `docs/connectors/README.md` for the contract. In short: add env vars to `.env.example`, a data JSON shape to `schemas/`, and (optionally) a serverless function in `api/`. Keep secrets in environment variables only.

## PR conventions

- One focused change per PR; describe the user-visible effect.
- Update `docs/` and `schemas/` when you change a data shape.
- Run the local PII scan (`scripts/pii-scan.sh` if present) before pushing.
- Be kind in review — see `CODE_OF_CONDUCT.md`.
