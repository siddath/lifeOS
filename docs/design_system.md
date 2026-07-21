---
title: "Hearth — the LifeOS Design Language"
area: docs
type: doc
tags: [design-system, hearth, palette, theme, ux]
updated: 2026-07
---

# Hearth — the LifeOS design language

**Hearth** is the look, feel, tone, and interaction model of every LifeOS surface. The goal: a **personal, calm, intuitive** knowledge base that feels like *your* life — warm paper, terracotta, and gold — not a generic SaaS dashboard. Every builder should read this first, because consistency is what makes the system feel like one thing.

The default palette in `lifeos.config.json` is `"hearth"`. It's theme-aware: a warm light mode and a warm dark mode, chosen automatically from the OS and toggleable per-device.

---

## 0. The one principle

**Surface one thing; collapse the rest.** Lead with the current hero mission — the one main thing — and tuck everything else behind maintenance and parking-lot sections. Never dump the whole life on the reader at once. Concretely:

- **Remove decisions.** Sensible defaults, a clear next action, "just execute" microcopy where it helps.
- **Reassure in the chrome.** Calm reframes over urgent red alarms.
- **Celebrate evidence, not ideas.** Make shipped artifacts visible.

---

## 1. Color palette (the core of Hearth)

```css
:root{
  --bg:#faf6ef;      /* warm cream / paper — page background */
  --card:#fffdf8;    /* near-white warm card surface */
  --ink:#2b2620;     /* soft near-black brown-ink — body text */
  --muted:#8a7f6f;   /* warm taupe/grey — secondary text */
  --line:#e7ddcc;    /* soft sand — borders, dividers */
  --accent:#b4502a;  /* terracotta / burnt sienna — PRIMARY */
  --accent2:#1f6f5c; /* deep teal / pine — SECONDARY / actions */
  --gold:#c9a24b;    /* muted gold — highlights, P2, accents */
  --shadow:0 1px 3px rgba(60,45,20,.08),0 8px 24px rgba(60,45,20,.06);
}
```

Earthy, warm, calm. **No cold blues/greys or neon.** The header uses a terracotta gradient `linear-gradient(135deg,#b4502a,#8a3c1f)` with white text.

### 1a. Dark mode — "the same warm world after dark"

Surfaces support a **warm dark** theme, toggled from the 🌙/☀️ button and remembered per-device (`localStorage['lifeos_theme']`); with no explicit choice it follows the OS via `prefers-color-scheme`. It is a *warm* dark — deep espresso, brightened terracotta — **never a cold invert.** Implemented token-first: light values on `:root`, dark values under `:root[data-theme="dark"]` and the `prefers-color-scheme:dark` query. Always style through tokens; never hardcode a hex a theme can't reach.

```css
:root[data-theme="dark"]{
  --bg:#191410; --card:#241d16; --ink:#f1e7d6; --muted:#ab9c86;
  --line:#3a3025; --accent:#e07a4e; --accent2:#57b89b; --gold:#d9b45f;
}
```

Semantic tint tokens (`--pill-*-bg`, `--tint-*`, `--rule-bg`, `--reframe-bg`, `--header-grad`, `--navbg`) carry both themes so pills, chips, and callouts stay legible in each.

**Semantic color coding (consistent everywhere):**
- Priority: **P1 = terracotta**, **P2 = gold**, **P3 = warm grey**.
- Status pills: **hero = terracotta-on-peach** (`#fbe3d8`/`--accent`), **maintenance = teal-on-mint** (`#e4efe9`/`--accent2`), **foundation/ongoing = gold-on-cream** (`#f5eccf`/`#8a6d1b`).

---

## 2. Area taxonomy (config-driven)

Areas are **not hardcoded** — they come from `areas[]` in `lifeos.config.json`, each with a `code`, `label`, and `emoji`. The dashboard's `AREA_META` reads from there, so your areas and their chips stay in sync. Render area tags as small (~.72rem) soft rounded pills (`--line` border, `--bg` fill, `--ink` text).

The demo persona's areas: `career`, `health`, `relationship`, `family`, `fieldnotes`, `pottery`, `finance`, `admin`, `learning`, `mindset`. Swap them for yours.

---

## 3. Behavioral facets (high-value personalization)

Beyond area tags, entries can carry **behavioral facets** so the system can surface the right content at the right moment:

- `non-negotiable` — the basics you protect (sleep, health, integrity, key relationships).
- `spiral-risk` — things that trigger overthinking or doom-loops.
- `calming-reframe` — reassuring scripts and mantras.
- `guardrail` — rules you set to protect yourself.
- `evidence` — shipped artifacts.

These render with a distinct **gold/amber left-border treatment** — a gentle highlight, never an alarm.

---

## 4. Typography

- **UI / action content:** system sans stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`). Clean, calm, legible.
- **Reflective content** (quotes, values, mantras) **and display headings** (hero title, page `<h1>`): the **`--serif`** token — `"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif` — a warm book-serif (system-available, no webfont/CDN). Italic for reflection to signal "slow down"; upright 600 for display headings.
- **Personal home-band:** the dashboard opens with a warm, time-of-day greeting from `lifeos.config.json` (`greeting`, e.g. "Hey, Alex") plus the live date and a rotating calm anchor. Warm and personal — never a generic "Welcome back".
- Sizes: page title ~1.55rem; card h2 ~1.05rem; body .92rem; sub/meta .78–.8rem. Line-height 1.5.
- Emoji are first-class visual anchors for fast scanning — use them in headings and area chips, but sparingly in body text.

---

## 5. Layout & components

- **Rounded soft cards** (radius 14–20px), generous padding (18–20px), warm soft shadow, `--card` on `--bg`.
- **Responsive grid:** `repeat(auto-fit, minmax(300px, 1fr))`, 16px gap. Single column under ~520px.
- **Dashed dividers** (`1px dashed var(--line)`) between list rows.
- **Pill tags** for status/area/priority.
- **Progress bars:** `linear-gradient(90deg,var(--accent2),var(--gold))` on a `--line` track.
- **Collapsible sections** (`<details>`/`<summary>` or JS accordions) for anything that isn't the current hero — this is how "one thing at a time" is honored visually.
- **Sticky/prominent "one main thing"** treatment at the top.

---

## 6. Voice & microcopy

- **Direct, warm, calm, second-person imperative.** "Do the one thing." "Stay calm." Reassuring reframes over urgency.
- Celebrate wins plainly ("That is the win."). Honest, not hype — "what I actually did vs. planned."

---

## 7. Interaction & accessibility baseline

- Everything keyboard-reachable; visible focus states (gold ring `0 0 0 2px var(--gold)`).
- Search must be **instant and forgiving** (fuzzy/substring, case-insensitive), keyboard-first (focus on `/`, arrow-key results, Enter to open).
- Persist UI state in `localStorage`; degrade gracefully offline.
- Contrast: `--ink` on `--card`/`--bg` passes AA; don't put `--muted` on colored fills for essential text.
- No layout shift on load; countdowns/dynamic bits reserve space.

---

## 8. "Courtyard" — the calm interaction layer

The palette (§1) is untouched; **Courtyard** is the motion and ambience layer that keeps floating chrome and transitions consistent across surfaces.

### Motion tokens & rules
```css
--ease:cubic-bezier(.2,.7,.3,1); --dur-1:150ms; --dur-2:300ms; --dur-3:450ms;
```
- **All motion is gated on `html.motion-ok`**, set pre-paint from `prefers-reduced-motion`. A global `@media (prefers-reduced-motion:reduce)` reset is the second net. Reduce Motion ON must render static, identical content.
- **Reveal-on-scroll:** the pre-hidden state is applied *only* by JS adding `.js-reveal-ready` (never raw CSS), inside a try/catch with a timed safety net — content is never trapped invisible with JS off or on error. One-way; no scroll-snap.
- **Ambient layer** (`#ambient`, fixed, `z-index:-1`): two ≤10%-opacity terracotta/gold/teal radials with a slow 60s drift plus a faint full-page dot lattice. `data-daypart` on `<html>` (morning/afternoon/evening/night) retints it. Content cards stay opaque.
- **Micro-interactions:** a one-shot gold ring on completion; a cross-fade helper for swapping content (quotes, review steps). Both no-op / run synchronously when motion is off.
- **Glassmorphism only on floating chrome** (dock, top-nav, popovers): `background: var(--glass)` (`color-mix(in srgb, var(--card) 78–82%, transparent)`) + `backdrop-filter: blur(12px) saturate(1.15)`, with an `@supports` solid-`--card` fallback.

### Floating dock (nav + sync)
- Left rail on ≥900px (52px collapsed → ~174px on hover/focus; labels always in the DOM), FAB → bottom sheet under 900px (scrim/Esc/anchor-tap close; focus moves in and returns to the FAB).
- Groups: **sync** (status + push/pull), **nav** (section jumps), **pages** (Anchor · Knowledge · Flashcards).
- **Sync binding contract:** `setStatus(state, text)` writes to *every* `[data-sync-dot]` / `[data-sync-text]` via `classList` state-toggling (never `className =`, so co-classes survive). Dot states, all palette-warm: `pending` gold · `syncing` gold pulse · `synced` teal · `error` deep red · `offline` muted ring · `local-only` dashed warm-grey · `idle` solid warm-grey.

### Task composer (buttons over syntax)
- Collapsed title + Add; focus expands area/priority/due chip rows. Area chips render from `AREA_META[code].emoji` (single source of truth).
- **Defaults rule:** "touched" = an explicit chip *click* only. Submit resolves per dimension: **typed token → clicked chip → parser default (`mindset` / `P3` / no due)**, so identical input always yields an identical task.

### Quote data contract (`dashboard/quotes.json`)
- Loaded like `mission.json` (fetch + inline fallback). Shape: `{version, themes:{key:{label,grad:[warm,warm]}}, quotes:[{id, text, author, tradition, themes:[], note}]}`. **Stable slug `id`s** (favorites reference ids). **All gradients palette-warm** — no cold slate/navy/violet. **Never strip attribution flags** like `(trans.)` / `(paraphrased)`. Day-seeded rotation keyed by slug id; ♡ favorites and ↗ share supported.

### localStorage keys (all additive)
`lifeos_theme` · `lifeos_composer_last_area` · `lifeos_quote_favs` · `lifeos_quote_filter` · `lifeos_quote_id`. **Mission checkbox keys are namespaced by the full mission `slug`** (e.g. `launch-week:w1`), so ticks never carry across mission swaps.

### 2026-07 (later): Temple Courtyard, Lamps Lit

The palette (§1) is untouched — this pass is restraint, not redecoration. Dusk has deepened since the revamp above; the diyas are lit. In lamplight only the essential is visible, so this pass's rule was **premium is what you remove**: one hero statement instead of a stack of hero copy, one home for the quote instead of a hero-zone tenant, maintenance surfaces collapsed behind `<details>` until asked for, emoji halved so the ones that remain still mean something, a spacing scale (`--sp-1`…`--sp-5`, `--section-gap`) replacing ad-hoc inline margins, and a shorter reveal-on-scroll lift (14px → 8px) so motion arrives rather than announces itself.

**Widget names** — the vocabulary for talking about dashboard surfaces without re-describing them each time. Forks are welcome to rename the vocabulary; nothing downstream depends on these names.

| Name | Widget |
|---|---|
| The Rail | The floating left dock (primary nav + sync surface) |
| The Vaasal | The greeting band — his own language, before the mission |
| The Sanctum | The hero one-thing card |
| The Gopuram | The countdown to the mission gate |
| The Inscription | The daily-wisdom quote card |
| The Slate | The task composer (type a title, chips are optional) |
| The Kolam | The habit grid / weekly matrix |
| The Prakaram Arc | The 4-week planner, now collapsed behind `<details>` |
| The Sandhi | The backup & sync zone (Notion, export/import) |
| The Lintels | The `.section-head` pattern — one emoji, a title, an eyebrow |
| The Aarti | The daily-review stepper — four small steps, then rest |
| The Kannadi | The Personality Mirror |

---

## 9. Reviewer checklist — "does it feel like Hearth?"

- [ ] The current hero mission is the first, most prominent thing; the rest is collapsible.
- [ ] Calm, reassuring tone; no red-alarm urgency.
- [ ] Behavioral guardrails are retrievable/visible, not buried.
- [ ] Warm cream/terracotta/teal/gold palette throughout; serif for reflection; works in light **and** dark.
- [ ] Area + behavioral facets are consistent and searchable.
- [ ] Evidence/artifacts celebrated.
- [ ] Fast, forgiving, keyboard-friendly search.
- [ ] Reduce-Motion renders static and identical.
