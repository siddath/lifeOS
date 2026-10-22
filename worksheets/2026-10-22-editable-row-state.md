# Editable row state · 22 October 2026

## Contract

Keep visible values, accessible names and saved task/habit state consistent after interaction. Preserve unfinished editor text and focus; reject blank names without discarding the previous valid entry. Use synthetic data only. No credentials, integration activation or publication.

## Change

Priority cycling refreshes the announced priority immediately. Rename commits refresh the existing row’s contextual labels in place; handlers do not re-render its editors. Habit day and keystone clicks set pressed state and visual state to the same persisted boolean. Nonempty guards retain prior valid names.

`tests/editable-rows.test.js` executes the shipped accessors, mutations and delegated handlers with synthetic storage and a minimal editor fixture. It checks priority text/class/name/storage; day and keystone toggles in both directions; rename label/focus preservation; and blank edits leaving exportable entries without a new queued mutation. Render hooks throw if these handlers replace an editor.

## Verification and limits

`npm test` passes schema/area validation, Markdown links and 26 tests, including three new shipped-row handler tests. `bash scripts/pii-scan.sh .` and `git diff --check` pass. Node 26.3.0 was installed locally; the package declares Node 24.x, so this is not a Node 24/CI claim. Actual browser/assistive technology checks remain integration evidence; the fixture does not certify screen-reader output. No push, merge or deployment.

Root’s actual browser recheck confirmed priority text and accessible name update immediately from P1 to P2. This supports the focused handler regression; it does not establish physical-device or screen-reader acceptance.
