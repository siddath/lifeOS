#!/usr/bin/env node
// Run the unit tests when the tests directory exists; succeed quietly when
// it doesn't (keeps `npm test` usable in trimmed-down forks of the template).
// Test files are passed explicitly: the bare directory form (`node --test tests/`)
// misreports results on some Node versions (seen on 26.x).
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const dirURL = new URL('../tests', import.meta.url);
if (!existsSync(dirURL)) {
  console.log('no tests/ directory — skipping unit tests');
  process.exit(0);
}
const files = readdirSync(fileURLToPath(dirURL))
  .filter((f) => f.endsWith('.test.js'))
  .map((f) => `tests/${f}`);
if (files.length === 0) {
  console.log('no *.test.js files in tests/ — skipping unit tests');
  process.exit(0);
}
const { status } = spawnSync('node', ['--test', ...files], { stdio: 'inherit' });
process.exit(status ?? 1);
