# INHERITANCE.md — how this template stays current

> **Summary:** LifeOS is the sanitized public template of a private, heavily-used original. It
> inherits **functionality** from that upstream on a per-era cadence — design languages, widget
> mechanics, interaction patterns, performance and accessibility fixes — and it inherits **no
> content, ever**. This file is the downstream half of the contract; the upstream holds the other
> half privately.

## The one law

**Functionality crosses. Content never.** What arrives here: CSS tokens, JS logic, markup
structure, motion/accessibility discipline, design-era vocabulary. What can never arrive, in any
form including paraphrase: the upstream owner's personal data — names, relationships, employers,
applications, finances, places, missions, tasks, habits, journals, audits. Ports keep this repo's
**demo persona** wording; when new label text is needed it is written fresh and generic.

## How a port happens

1. A functionality era lands upstream (e.g. *Temple Courtyard at Dusk* — the dock/theme/quote
   engine; *Temple Courtyard, Lamps Lit* — the 2026-07 de-clutter). The upstream queues a port.
2. The port is a **hand-port of mechanics on a branch here** — never a file copy, never a diff
   apply. The porter reads the upstream implementation and re-expresses it against this repo's
   demo content.
3. **Two gates, in order, both mandatory:**
   - an upstream **private deny-list scan** runs against this working tree before anything is
     pushed (its patterns are themselves sensitive, so the list lives upstream — by design this
     repo cannot see it, only require that it ran);
   - this repo's **generic scan** (`scripts/pii-scan.sh`) runs locally and in CI on every push —
     tokens, emails, UUIDs, binaries.
4. PR → CI green → merge. **A merge here is a deployment** — the Vercel demo redeploys from
   `main` — so merges get production discipline.

## What "inherited" looks like in this repo

Each era is recorded in [`design_system.md`](design_system.md) (the era registry names the design
language and its widgets) and in the PR that ported it. If you fork this template you inherit the
same machinery: keep `scripts/pii-scan.sh` in your CI, and if you maintain your own private
upstream, keep your deny-list *there*, not here.

## Era ledger

| Era | Arrived | What it brought |
|---|---|---|
| Temple Courtyard at Dusk | template founding | Warm dual-theme tokens, the dock + mobile FAB, the quote engine, mission.json-driven hero |
| **Temple Courtyard, Lamps Lit** | 2026-07 | The de-clutter: hero thinned to one-thing-first, quote card into Reflect, sync collapsed to a foot zone, one-emoji-per-header discipline, spacing scale, collapsed reference/week-planner zones, restrained motion, the named-widget registry |
