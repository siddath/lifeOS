---
title: "Generic workspace port"
area: docs
type: worksheet
tags: [dashboard, release, privacy]
updated: 2026-10-23
---

# Generic workspace port

The owner requested the published update. This hand-port implements labelled bounded navigation, Home/Projects/Library/Reviews, explicit task options, settings-only pull/push and the generic safe source reader. Existing demo content, config identity/modules, mission, state keys and handlers are preserved. No upstream private file, directory, record or metadata was copied.

The output directory is dashboard-only, so 81 public guides are bundled from this public repository. They retain canonical bytes; the reader resolves Markdown links against the catalog and sends unbundled targets to the public repository. Canonical link checks plus bundle-parity tests replace duplicate path checks inside generated copies. A maintainer script refreshes the bundle and removes stale catalogued copies; no runtime build is added.

Separate single-agent code, adversarial, UX and dependency-security passes honor the owner's one-agent constraint. No independent/fresh-context model approval is claimed. Changes include paired theme/hover colors, unique table landmark names, original task handlers/keys, module hiding, config product labels and versioned changed assets. Imported HTML stays inert, images need an explicit visit, and only catalogued source paths load.

Local validation: 38 unit tests, schema/area checks, canonical links, source-bundle parity, syntax/whitespace and both privacy gates. The contextual privacy gate lacks optional exact-value patterns for bare dates, times and coordinates; that limit remains. Existing data JSON are unchanged. Browser proof is recorded externally: 37 final route/viewport/theme samples across public/private changed surfaces have zero reported axe violations or horizontal overflow. Firefox desktop plus in-app responsive checks were used; Firefox responsive-mode readings became unreliable and are not counted. Search/reader round trip retained the query; More/Escape restored focus. Physical devices, assistive technology, field performance and authenticated integration remain unverified. CI, merge and production readback are separate release receipts.

| Before | After | Why |
|---|---|---|
| Tall icon rail | Labelled bounded navigation | Reachable destinations in short windows |
| Long mixed dashboard | Four views and settings | Clear purpose per visit |
| Raw or undeployed guide links | Bundled read-only Library | Reading works on the deployed output |
| Typing opens task taxonomy | Explicit options | Keep entry light |
