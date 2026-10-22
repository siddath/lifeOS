# TODOS.md — LifeOS build queue

> **Summary (greppable):** The build-level queue for the LifeOS **template** — what a maintainer
> of this repo builds next. It is *not* a personal task list: your own tasks live in
> `06_Trackers/tasks.md` and `dashboard/tasks-data.json`, never here. Agents may append items;
> only the maintainer reorders priorities.
>
> **Before you start anything below:** `npm test` is the check that proves a change works
> (see the Verification section in [`CLAUDE.md`](CLAUDE.md)). CI runs it on every push and PR.
>
> This repo ships its own Claude Code skills in `.claude/skills/` — `setup`, `daily-brief`,
> `quick-capture`, `weekly-review`, `mission-swap`. Prefer an existing skill over improvising,
> and don't re-create them per session.

## Now (top = next)

The three documentation fixes below are implemented locally on 2026-10-22 and await
review/release; no PR or production deployment is claimed.

- [x] **Fix the stale `.gitignore` claim in `SECURITY.md`.** It now distinguishes ignored
      secrets from the deliberately committable `dashboard/lifeos.config.json` in a private
      instance, and states that an unlisted URL is public.
- [x] **Qualify config paths** in `CLAUDE.md`, `README.md`, `00_START_HERE.md` and the master prompt.
- [x] **Move shipped verification to Built now** in `docs/ROADMAP.md`; browser smoke automation
      remains planned.

## Next

- [ ] **Playwright smoke tests for the dashboard** (ROADMAP.md:66 — the only remaining item of
      the "Test coverage" phase). Desktop + mobile: page load, task/habit persistence through
      `localStorage`, module toggles. State regressions now run in `tests/state.test.js`;
      a browser runner and CI coverage are still needed for complete interaction flows.

- [ ] **Serverless Google connectors** (ROADMAP.md:69–71). Calendar sync function
      (mission/P1 tasks → time blocks, habits → weekly events, event-done → task-done) and a
      Gmail capture function (email → inbox → schema-valid task). Contract to follow:
      `docs/connectors/README.md`; `api/notion-sync.js` is the worked precedent.

- [ ] **Capture pipeline** (ROADMAP.md:74) — one-line thought from anywhere → schema-valid task
      or note, ready for weekly triage. The `quick-capture` skill covers the Claude Code path
      only; this is the no-assistant path.

- [ ] **Extended trackers** (ROADMAP.md:80) — energy/sleep, reading, meditation streaks. Each
      needs a schema in `schemas/` plus a dashboard lens, per ROADMAP principle #2.

- [ ] **Deep broker / finance integration** (ROADMAP.md:76–77) — continuous portfolio and
      net-worth sync into `finance.schema.json`, beyond today's manual JSON and MCP reads.
      Gated by ROADMAP principle #1: the manual-first mode already exists, so a connector is
      allowed.

- [ ] **Report unavailable/corrupt browser storage without losing entries.** Several existing
      direct `localStorage` reads/writes can still fail in restricted browsing or at quota.
      Backup restore now validates and attempts rollback, but the rest of the app needs a
      visible recovery mode that preserves the original bytes before allowing replacement.

- [ ] **Honor every advertised module toggle.** `applyConfig` handles finance/Anchor/knowledge
      links, but `modules.missions` and `modules.trackers` do not yet hide their surfaces.
      Add browser scenarios for these flags; do not claim full module-toggle coverage today.

- [ ] **Make remaining reflective demo content configurable.** The Anchor and dashboard
      still contain fixed example prompts and a past demo mission. The visible demo notice
      identifies sample state; personal config alone does not rewrite this content. Keep
      reflective methods optional and use synthetic examples when extending the public template.

- [ ] **Complete broader accessibility coverage.** The detector identified dark-mode action
      contrast, now addressed with theme-specific foreground tokens; verify all three pages
      with keyboard/screen-reader and physical-device checks. Its accent-border warnings
      refer to the incumbent Hearth treatment, which this refinement preserves.

## Parked (needs the maintainer's decision)

- **Keep or deprecate the legacy repo-root `lifeos.config.json` fallback?** The root copy is
  called "legacy" and "superseded" (`.gitignore:15`, `api/_notion.js:69`) but is still actively
  probed in four places: `api/_notion.js:69`, `dashboard/index.html:2101`,
  `dashboard/knowledge.html:285`, `dashboard/anchor.html:539`. Keeping it costs a stale path in
  every config loader; dropping it could break an early clone that followed the old layout.
  Decide before the next docs pass — the answer changes the wording of the two `Now` items above.

## Done (move here with date + PR link, prune monthly)

- _Empty — first entry lands when an item above ships._
