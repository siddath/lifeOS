#!/usr/bin/env node
/**
 * Validate every dashboard data file against its schema (schemas/*.schema.json),
 * then cross-check that task and knowledge-base area codes exist in the config's
 * `areas[]` list — the one relationship JSON Schema alone can't express.
 *
 * Run: npm run validate   (CI runs this on every push/PR)
 * Exit code 0 = everything conforms; 1 = at least one violation (all printed).
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(resolve(root, p), 'utf8'));

// The personalized config is authoritative when present; the shipped example
// (the demo persona) is the documented fallback — same rule the dashboard uses.
const configPath = existsSync(resolve(root, 'dashboard/lifeos.config.json'))
  ? 'dashboard/lifeos.config.json'
  : 'dashboard/lifeos.config.example.json';

const pairs = [
  [configPath, 'schemas/lifeos.config.schema.json'],
  ['dashboard/mission.json', 'schemas/mission.schema.json'],
  ['dashboard/tasks-data.json', 'schemas/tasks.schema.json'],
  ['dashboard/habits-data.json', 'schemas/habits.schema.json'],
  ['dashboard/finance-data.json', 'schemas/finance.schema.json'],
  ['dashboard/kb-data.json', 'schemas/kb.schema.json'],
];

const ajv = new Ajv({ allErrors: true, strict: false });
let failures = 0;

for (const [dataPath, schemaPath] of pairs) {
  const validate = ajv.compile(read(schemaPath));
  if (validate(read(dataPath))) {
    console.log(`ok       ${dataPath} ⇐ ${schemaPath}`);
  } else {
    failures++;
    console.error(`INVALID  ${dataPath} ⇐ ${schemaPath}`);
    for (const err of validate.errors) {
      console.error(`         ${err.instancePath || '/'} ${err.message}`);
    }
  }
}

// Cross-file check: every area code used in tasks and kb entries must be
// declared in the config. The kb additionally allows a few identity-level codes.
const config = read(configPath);
const areaCodes = new Set((config.areas || []).map((a) => a.code));
const kbExtra = new Set(['identity', 'values', 'personality']);

const badTaskAreas = (read('dashboard/tasks-data.json').tasks || [])
  .filter((t) => t.area && !areaCodes.has(t.area))
  .map((t) => `task "${t.title}" → area "${t.area}"`);
const badKbAreas = (read('dashboard/kb-data.json').entries || [])
  .filter((e) => e.area && !areaCodes.has(e.area) && !kbExtra.has(e.area))
  .map((e) => `kb entry "${e.title}" → area "${e.area}"`);

for (const bad of [...badTaskAreas, ...badKbAreas]) {
  failures++;
  console.error(`INVALID  area code not in ${configPath} areas[]: ${bad}`);
}
if (!badTaskAreas.length && !badKbAreas.length) {
  console.log(`ok       area codes cross-checked against ${configPath}`);
}

process.exit(failures ? 1 : 0);
