# Changelog

All notable changes to LifeOS are documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/).

## [1.0.0] — 2026-07

Initial public release.

### Added
- Config-driven dashboard (`dashboard/`) with a warm, theme-aware "Temple
  Courtyard" aesthetic, mobile dock, natural-language task composer, 4-step
  daily review, and daily-wisdom quotes.
- `lifeos.config.example.json` — one file personalizes an instance (owner,
  areas, modules, integrations). Nothing hardcodes a person.
- JSON Schemas (`schemas/`) for mission, tasks, habits, finance, knowledge
  base, and config — the contract that lets any AI import your data reliably.
- Claude skills: `daily-brief`, `quick-capture`, `weekly-review`, `setup`,
  `mission-swap`.
- Optional 2-way Notion sync (`api/`) with graceful local-only fallback.
- Demo persona ("Alex Rivera") so a fresh clone renders fully with zero setup.
- Docs: architecture, connectors, onboarding, and deploy guides.
