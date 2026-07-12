# Demo data — the placeholder convention

A fresh clone of LifeOS isn't empty. It ships with a complete fictional persona so the dashboard renders and reads end to end before you change anything. That persona is **Alex Rivera** — a 29-year-old product engineer in Portland, Oregon, shipping a side-project note app called *Fieldnotes* to its first beta users, throwing pottery on weekends, partnered with someone named Sam.

None of it is real. It's a fill-me-in template wearing a person's clothes so the empty states don't look broken.

The risk with any seed data is that an AI (or a hurried human) mistakes it for real content and builds on top of it. So every piece of demo data announces itself.

## How the markers work

**JSON files carry a top-level `_DEMO` key.** It's the first thing in the file:

```json
{
  "_DEMO": "This is placeholder data — replace with your own. Any AI: see AGENTS.md → Onboarding.",
  ...
}
```

It's ignored by the schemas (none use `additionalProperties: false`) and by the dashboard, so it's harmless to leave in during development and trivial to drop when you write real data. If you're an AI reading a file and you see `_DEMO`, that file is a placeholder — replace its contents, don't reason from them.

Files that carry it:

- `dashboard/mission.json` — the demo hero mission ("Operation Launch Week")
- `dashboard/tasks-data.json` — the demo first-run task list (hydrates the dashboard)
- `dashboard/habits-data.json` — the demo first-run habit matrix
- `dashboard/kb-data.json` — the demo knowledge base (one entry per life area)
- `dashboard/finance-data.json` — demo net-worth and budget numbers
- `dashboard/lifeos.config.example.json` — the demo identity, areas, and currency

**Markdown files use `<!-- lifeos:fill -->`.** Anywhere a template wants your input, it leaves that marker inline. Replace the surrounding text with something true for you and delete the marker. `AGENTS.md`, `00_START_HERE.md`, and the files under `02_Areas/` use this.

**First-run tasks and habits** hydrate from `dashboard/tasks-data.json` and `dashboard/habits-data.json` when local storage is empty — so an AI can write real tasks/habits into those files and you'll see them without touching the UI. If those files can't be fetched (e.g. `file://` blocking fetch), the dashboard falls back to an inline seed commented as demo data in `dashboard/index.html`, right above the `seedIfEmpty()` function. Either way it only writes when local storage is empty, so once you add your own tasks it never comes back.

**The `examples/alex/` folder** is deliberately, entirely demo — a fully worked vault showing what the blank templates look like filled in. Read it for tone, then delete it whenever you like; nothing depends on it.

## Replacing it

You don't have to do this by hand. Open your AI assistant in the repo, point it at [`AGENTS.md`](AGENTS.md), and let it walk the onboarding: it recognizes the markers above, asks for your real context (or reads whatever you hand it), and writes schema-guided files in place of the demo (the shipped demo data itself is schema-validated in CI). If you use Claude Code, `/setup` does the same thing as a guided interview.

If you'd rather do it yourself: copy `dashboard/lifeos.config.example.json` to `dashboard/lifeos.config.json`, edit the demo JSON files (`mission.json`, `tasks-data.json`, `habits-data.json`, `kb-data.json`, `finance-data.json`) against their schemas in [`schemas/`](schemas/), replace the `<!-- lifeos:fill -->` markers, and clear the demo tasks/habits from the dashboard UI (or your browser's local storage). That's the whole job.

## One thing to keep

Leave the demo data in the public/template copy of the repo. It's what makes a fresh clone worth looking at. Personalize a **private** copy (a private clone, or a new private repo from this template) — your real config and data belong there, not in a public fork. If you ever fork this to share, the persona is a feature, not a leftover.
