# FEEDBACK.md — friction log

> Append-only. At the end of a working session, add honest notes: what slowed you down, which
> docs were wrong, what you wished existed. Be specific — cite the file and line. This is the
> input for improving the repo's own docs and workflow; entries get ingested periodically and
> pruned once acted on. A fix that belongs in the queue goes to [`../TODOS.md`](../TODOS.md);
> this file is for the friction that produced it.

**Format:** `## YYYY-MM-DD — session topic` then bullets.

---

## 2026-07-16 — first pass adding the build queue + worksheets

- `CLAUDE.md:5` cost the most time: it says to copy `lifeos.config.example.json` to
  `lifeos.config.json` with no directory, but both only exist under `dashboard/`. Every other
  doc disagrees with it. Queued in `TODOS.md`.
- The verification path existed but was undocumented — `npm test` (validate + check-links +
  test:unit) and `.github/workflows/ci.yml` were only discoverable by reading `package.json`.
  `schemas/README.md:42` mentions `npm run validate` alone, which reads like that is the whole
  check. Now stated in `CLAUDE.md`.
- `scripts/pii-scan.sh` is CI-wired via `pii-scan.yml` but is not part of `npm test`, and
  `CONTRIBUTING.md:30` hedges it as "if present" — it is present and it exits 0. The hedge made
  it unclear whether running it was expected.


## 2026-10-22 — browser state and local-only behavior

- The dashboard called an empty queue “Synced” while the example config disabled Notion.
  Local-only copy now follows the toggle; no remote-parity claim comes from queue length.
- First-run seed hydration had no comparison with subsequent user edits. The replacement
  now checks the exact original fallback before writing, and empty seed arrays are honored.
- The backup path accepted arbitrary decoded JSON and omitted daily reviews/history. It now
  validates supported entries, confirms replacement and excludes sync credentials. The
  state tests cover malformed imports, rollback and edits during a sync acknowledgement.
- The docs described JSON seeds as authoritative current tasks and said missing sync auth
  left endpoints open. Both disagreed with the code; browser ownership and fail-closed auth
  are now explicit. Remaining storage/module-toggle work is in `TODOS.md`.

## 2026-10-22 — review corrections: backup access and unfinished edits

- Live review found native `prompt()` unsupported in the intended browser. Export/import now
  use an in-page dialog with a full selectable code, clipboard-denial recovery, validation
  preview, an explicit Restore button, safe Cancel/Escape and focus return.
- A second network path still re-rendered inputs: Pull could erase text typed before blur.
  Its response now pauses if editor input occurred during the request. A regression runs the
  shipped handler with a deferred fetch and dispatches the actual input listeners.
- Mission-swap instructions did not need to clear old namespaced checks, but the old save
  function still replaced their whole store. Saving now retains earlier mission keys.
- Active setup/capture/review generators still called seed JSON authoritative or imposed
  parking, automatic roll-forward and productivity repayment. These instructions now explain
  the separate browser/file stores and leave priorities, cadence and record changes to the
  owner. Historical demo records were preserved.
