# Changelog

All notable changes to LifeOS are documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/).

## Unreleased

- Preserve first-run edits when seed files arrive late, including intentionally empty seeds.
- Add validated `LIFEOS3:` browser backups for tasks, habits, checks, reviews, history and
  favorites, with confirmation before restore and rollback on storage failure. Keep legacy
  imports; exclude sync keys and queued requests.
- Respect the Notion opt-in toggle, keep edits made during an in-flight push, and retain
  missing/failed acknowledgements for retry. Empty queues no longer claim remote parity.
- Use local calendar dates for due shortcuts, review days and habit weeks. Label the
  fictional demo and improve task/habit control names and pressed states.
- Explain browser/file ownership, correct config paths and fail-closed authentication docs,
  and make focus coaching optional in the assistant instructions.
- Add focused state regression tests without changing the dashboard's no-build contract.

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
