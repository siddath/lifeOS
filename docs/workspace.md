---
title: "The LifeOS workspace"
area: docs
type: guide
tags: [dashboard, navigation, reading]
updated: 2026-10-23
---

# The LifeOS workspace

Home brings browser tasks and habits together with visible personal-reference links. Projects contains the configured mission, its plan, project context and finance. Library opens the knowledge base, Inner OS and bundled public guides. Reviews keeps the optional daily review and routine references together. Backup & settings contains export/import and explicit optional pull/push actions.

Desktop navigation has four visible labels and a bounded scroll area. Mobile uses four destinations plus More; Escape closes the sheet and returns focus. Slash focuses Library search, and arrow keys move through results. Old section links still route to their owning view. Task options open explicitly and remain optional.

The shipped data is a fictional demo. Personalize a **private instance** with your own material and retain the original config/schema contracts. The public repository and demo must never contain private upstream content. A blank list in another browser does not mean the source records were removed: browser storage is separate. Export/import a backup through Settings to transfer entries deliberately; never clear existing storage to force a seed refresh.

## Reading guides on the deployed site

Vercel serves the dashboard directory. The bundled Library makes the public repository guides available inside that deployment. Run `node scripts/build-library.mjs` after adding or changing public Markdown, review the generated catalog/copies, and commit them with the originals. This is a maintainer refresh, not a runtime build step. Generated reading copies remain byte-identical to their original files; the reader resolves their source-relative links using the catalog and sends unbundled destinations to the public repository.

The reader uses the pinned local Marked lexer and a DOM-only allowlist. HTML is inert source text, unsafe schemes are refused, and images require an explicit visit. Only catalog-listed bundled Markdown is fetched. The original guide remains available. No private source, external renderer or CDN is involved.

Run `npm test` and `bash scripts/pii-scan.sh .`, plus the private upstream privacy gate before every public push. The unit suite checks source-bundle parity and reader trust boundaries; original Markdown links remain checked at their canonical locations. Browser checks cover presentation and interactions separately. Automated accessibility checks do not certify physical devices or assistive technology.
