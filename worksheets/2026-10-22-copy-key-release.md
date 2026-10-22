---
title: "Copy, key and date reliability follow-up"
area: docs
type: worksheet
tags: [dashboard, reliability, privacy]
updated: 2026-10-22
---

# Copy, key and date reliability follow-up

## Contract

Finish concrete interaction gaps in the existing candidate using generic template mechanics. Preserve all demo/source content and browser entries. This lane commits locally; final interface acceptance, review and authorized release are separate integration work. Stop after the changed behavior and required checks are proven. No credentials, live integration, dependency or permanent automation was added.

## Behavior

Quote and daily-review copy use selectable in-page text when clipboard access is absent or denied. Rejected sharing falls back unless the user cancelled. Cancel/Escape restores focus and clears dialog text. The shared mobile dock lets an open dialog handle Escape.

Sync-key entry opens an empty password field; no saved key is displayed. Save/Clear changes only this browser, cancels a scheduled retry and sends nothing. Storage failure is visible and leaves the prior setting intact. Save, Clear, Cancel and Escape clear the input. Enabled edits and reconnects retain their documented automatic queue behavior.

Delayed Pull responses do not apply after opt-out. Already-submitted Push responses still acknowledge successful writes, preserving failed/later mutations without scheduling a disabled-sync retry. Disabling cannot retract a submitted request. Review Markdown uses the local date used by browser storage. Invalid due tokens retain quick-add input and display corrective feedback; valid leap dates pass parser/add/backup round-trip validation.

## Evidence and limits

Seven new [shipped-handler regressions](../tests/dialogs.test.js) cover clipboard denial, Unicode, selection/Escape/focus, password save/clear/cancel/storage failure without sends, delayed Pull/Push opt-out, local-date copying, rejected sharing and quick-add/backup calendar dates. `npm test` validates schemas, links and the complete test suite. Syntax, diff and generic privacy checks plus the separate upstream private contextual gate are required before public push.

Actual interface acceptance and final independent review belong to integration. These fixtures do not establish authenticated live Notion, remote convergence, physical-device, screen-reader or production deployment evidence. No personal content was ported.

## Secondary-page acceptance follow-up

The actual interface matrix found missing main landmarks on Anchor/Knowledge and undiscriminated footer links plus a low-contrast gold caption on Knowledge. Generic markup, explicit search/clear names, the existing gold-ink token and underlined footer links address those concrete findings. Top-nav brand text wraps within narrow containers. Demo data and page copy remain unchanged. Integration owns final browser readback; a sampled automated audit does not certify screen-reader or physical-device behavior.
