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

- [ ] **Fix the stale `.gitignore` claim in `SECURITY.md`.**
      `SECURITY.md:18` says ".gitignore excludes `.env*`, `lifeos.config.json`, `.mcp.json`".
      That is no longer true for the config: `.gitignore:16` anchors **`/lifeos.config.json`**
      (repo root only), and `git check-ignore dashboard/lifeos.config.json` exits non-zero —
      the live path is **not** ignored.
      **The `.gitignore` is correct; the doc is wrong.** `.gitignore:12–15`, `AGENTS.md:14`,
      `docs/deploy.md:15` and `docs/onboarding.md:23` all deliberately say the config *should*
      be committable inside `dashboard/` in a **private** instance — that commit is exactly what
      personalizes a hosted deploy. **Trap: do not "fix" this by ignoring
      `dashboard/lifeos.config.json`** — that would break the documented personalization path.
      Reword `SECURITY.md` to state the real guarantee: secrets (`.env*`, `.mcp.json`) are
      ignored; the config holds identity + toggles and **never secrets**, and is committed only
      in a private instance.

- [ ] **Fix the pathless config instruction in `CLAUDE.md`.**
      `CLAUDE.md:5` says "copy `lifeos.config.example.json` to `lifeos.config.json`". Neither
      path exists at the repo root — the only shipped example is
      **`dashboard/lifeos.config.example.json`**. A reader following the line literally
      (`cp lifeos.config.example.json lifeos.config.json`) gets "No such file or directory".
      Qualify both paths with `dashboard/`, matching `README.md:64` and `CONTRIBUTING.md:16`,
      which already get it right. Same pathless phrasing worth a pass:
      `README.md:33`, `00_START_HERE.md:11`, `04_AI_Workflow/master_prompt.md:16`.

- [ ] **`docs/ROADMAP.md:67` calls shipped work "Landing now".**
      The bullet promises "unit tests for the Notion sync mapping, schema validation of the
      shipped demo data, and a docs link check — wired into CI". All three are **built**:
      `npm test` = `validate` + `check-links` + `test:unit` (10/10 green), and
      `.github/workflows/ci.yml` runs `npm test` on push and PR. Move the bullet to the
      "✅ Built now" section — ROADMAP's own design principle #4 is "Honest status".

## Next

- [ ] **Playwright smoke tests for the dashboard** (ROADMAP.md:66 — the only remaining item of
      the "Test coverage" phase). Desktop + mobile: page load, task/habit persistence through
      `localStorage`, module toggles. `tests/` currently holds one file (`notion.test.js`), so
      this needs a browser runner added to `package.json` and a new CI step or `npm test` leg.

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

## Parked (needs the maintainer's decision)

- **Keep or deprecate the legacy repo-root `lifeos.config.json` fallback?** The root copy is
  called "legacy" and "superseded" (`.gitignore:15`, `api/_notion.js:69`) but is still actively
  probed in four places: `api/_notion.js:69`, `dashboard/index.html:2101`,
  `dashboard/knowledge.html:285`, `dashboard/anchor.html:539`. Keeping it costs a stale path in
  every config loader; dropping it could break an early clone that followed the old layout.
  Decide before the next docs pass — the answer changes the wording of the two `Now` items above.

## Done (move here with date + PR link, prune monthly)

- _Empty — first entry lands when an item above ships._
