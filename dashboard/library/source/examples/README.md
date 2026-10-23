---
title: "examples — a filled demo vault"
area: examples
type: index
tags: [examples, demo]
updated: 2026-07
---

# examples — a filled demo vault

The templates elsewhere in this repo are intentionally blank. This folder shows what they look like **filled in**, using a fictional demo persona so a fresh clone renders fully and screenshots well with zero setup.

## Meet Alex

[`alex/`](alex/) is the vault of **Alex Rivera** — 29, a product engineer in Portland, Oregon, partnered with Sam. Alex's current mission is **Operation Launch Week**: ship a side-project note-taking app called *Fieldnotes* to 50 beta users by late August. On weekends Alex throws pottery and sells the occasional piece. Alex over-plans under pressure and is learning to ship one thing at a time — which is exactly the pattern LifeOS is built to fix.

Everything about Alex is fictional and safe to publish. It exists only to demonstrate the format.

## What's inside

```
alex/
  00_START_HERE.md            the home page / daily index
  north_star.md               filled direction
  one_year_vision.md          filled twelve-month vision
  knowledge_base/             a few filled profile entries
    01_identity.md
    04_career.md
    05_relationships.md
    07_health_habits.md
  06_Trackers/                live state with demo rows
    tasks.md
    habits.md
    evidence.md
  reviews/
    2026-W28.md               one filed weekly review
```

## How to use it

Read `alex/` to see the tone and depth each template is aiming for, then fill your own copies. When you're comfortable, you can delete `examples/` entirely — nothing in the system depends on it.

The demo persona's identity, areas, and currency all come from [`../dashboard/lifeos.config.example.json`](../dashboard/lifeos.config.example.json), so the dashboard and skills render "Alex Rivera" out of the box until you drop in your own `lifeos.config.json`.
