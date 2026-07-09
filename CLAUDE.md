# CLAUDE.md

This project uses the rules in [`AGENTS.md`](AGENTS.md). Read it first — it defines how to work inside this LifeOS vault: one hero mission at a time, evidence not ideas, the spiral guardrail, the file map, the data contracts, and the mission-swap lifecycle.

Identity and per-instance settings (owner name, timezone, area codes, enabled modules) live in **`lifeos.config.json`** — copy `lifeos.config.example.json` to `lifeos.config.json` and make it yours, or run the `setup` skill to generate it. Nothing hardcodes a person; everything reads from that config.

Start any session by reading `AGENTS.md`, then `00_START_HERE.md`, then `06_Trackers/`.
