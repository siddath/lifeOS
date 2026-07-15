# CLAUDE.md

This project uses the rules in [`AGENTS.md`](AGENTS.md). Read it first — it defines how to work inside this LifeOS vault: one hero mission at a time, evidence not ideas, the spiral guardrail, the file map, the data contracts, and the mission-swap lifecycle.

Identity and per-instance settings (owner name, timezone, area codes, enabled modules) live in **`lifeos.config.json`** — copy `lifeos.config.example.json` to `lifeos.config.json` and make it yours, or run the `setup` skill to generate it. Nothing hardcodes a person; everything reads from that config.

Start any session by reading `AGENTS.md`, then `00_START_HERE.md`, then `06_Trackers/`.

Build-level work for this repo is queued in [`TODOS.md`](TODOS.md); agent traces and the friction log live in [`worksheets/`](worksheets/).

## Verification

**What command proves a change works: `npm test`.** It chains the three checks
(`package.json`), and CI runs exactly this on every push and PR (`.github/workflows/ci.yml`):

| Command | Proves |
|---|---|
| `npm run validate` | Every `dashboard/*.json` matches its schema in `schemas/`, and every task/KB `area` is a real area code from the config. |
| `npm run check-links` | Every relative Markdown link in the repo resolves. Run this after touching any doc. |
| `npm run test:unit` | The Notion sync mapping and auth gate (`tests/notion.test.js`). |
| `bash scripts/pii-scan.sh .` | No secrets or personal data are about to be committed. **Not part of `npm test`** — it runs as its own CI job (`.github/workflows/pii-scan.yml`). Run it before pushing; this is a public repo. |

The dashboard has **no build step** — for a UI change, open `dashboard/index.html` directly
(or `python3 -m http.server`) and look at it. There is nothing to compile and no dev server.
