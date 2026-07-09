# schemas — the data contract

These six JSON Schemas are the reason LifeOS works with any AI. They pin down the shape of every data file, so a dashboard, a sync function, and an assistant that has never seen this repo before all agree on what a task or a mission looks like. Import isn't a bespoke parser — it's "read the schema, emit conforming JSON." That's the whole trick.

They're [JSON Schema draft-07](https://json-schema.org/). Point any validator at them, or just hand one to your AI and ask it to produce matching data.

## The files

| Schema | Describes | Lives at |
|---|---|---|
| `lifeos.config.schema.json` | Identity, area codes, enabled modules, integration toggles | `lifeos.config.json` (copy of `lifeos.config.example.json`) |
| `mission.schema.json` | The hero mission — the swappable dashboard focus | `dashboard/mission.json` |
| `tasks.schema.json` | A single task | task lists (dashboard local storage; `06_Trackers/tasks.md` in the vault) |
| `habits.schema.json` | A single habit and its weekly grid | habit lists (dashboard local storage; `06_Trackers/habits.md`) |
| `finance.schema.json` | Net worth + monthly budget snapshot | `dashboard/finance-data.json` |
| `kb.schema.json` | The searchable "about you" knowledge base | `dashboard/kb-data.json` |

## The things worth knowing

**Area codes are defined once.** Every task and knowledge entry tags an `area` — and that string must be one of the `code` values in your `lifeos.config.json` (`areas[]`). Don't invent area strings ad hoc; add the area to the config first. The knowledge base also accepts a few identity-level codes (`identity`, `values`, `personality`) that don't have to be life areas.

**Tasks use a small closed vocabulary.** `priority` is `P1` / `P2` / `P3`. `status` is `open` / `in-progress` / `done`. `due` is `YYYY-MM-DD` or empty. The Notion sync layer maps these to Notion's own labels (`P1 Today`, `Not started`, and so on) — see [docs/connectors/notion.md](../docs/connectors/notion.md).

**Habits are a week at a time.** Each habit has seven day booleans (`mon`…`sun`) and a `weekOf` (the Monday). The dashboard rolls the week over automatically and archives the old grid so streaks survive.

**Finance is manual-first.** `source` is `manual` or `broker`. Leave `total` as `null` and the dashboard computes it. Numbers are plain — currency comes from `owner.currency` in your config, not from the finance file.

**`_DEMO` and `_comment` keys are allowed.** None of these schemas set `additionalProperties: false`, so the demo files can carry a `"_DEMO"` sentinel and a `"_comment"` without failing validation. See [DEMO_DATA.md](../DEMO_DATA.md).

## Using them

Feed a schema to your assistant with your raw notes:

> Here's my task list. Read `schemas/tasks.schema.json` and give me back a JSON array of tasks that matches it — infer the area from my `lifeos.config.json`, set priorities, and parse any due dates.

Or validate by hand with any draft-07 tool, e.g.:

```bash
npx ajv-cli validate -s schemas/tasks.schema.json -d your-tasks.json
```
</content>
