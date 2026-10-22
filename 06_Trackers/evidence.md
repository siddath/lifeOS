---
title: "Public template maintenance evidence"
area: trackers
type: tracker
tags: [trackers, maintenance]
updated: 2026-10-22
---

# Public template maintenance evidence

This log records maintenance of the public template.

| Date | Area | Artifact (what shipped) |
|------|------|-------------------------|
| 2026-10-12 | meta | Updated the development dependency `fast-uri` from 3.1.3 to 3.1.8 in [`package-lock.json`](../package-lock.json), within Ajv's existing compatible range, to address the reported dependency advisories. |
| 2026-10-22 | meta | Implemented locally: guarded browser hydration/sync, validated in-page backups, preserved mission check history, and corrected active template/privacy/storage docs. Verification is in [`tests/`](../tests/) and the limits in [`TODOS.md`](../TODOS.md). No release, live Notion sync or deployment is claimed. |
