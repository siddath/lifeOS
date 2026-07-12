#!/usr/bin/env node
/**
 * Check that every relative link in the repo's Markdown files points at a file
 * that actually exists in a fresh clone. External URLs and #anchors are skipped;
 * so are gitignored paths (they can't be promised to exist).
 *
 * Run: npm run check-links   (CI runs this on every push/PR)
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', '.vercel', '.obsidian', '.trash', '.agents']);

function* mdFiles(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* mdFiles(p);
    else if (name.endsWith('.md')) yield p;
  }
}

// [text](target) — tolerate titles and <angled> targets; also bare <path.md> refs.
const LINK_RE = /\[[^\]]*\]\(\s*<?([^)\s>#]+)[^)]*\)/g;

let failures = 0;
for (const file of mdFiles(root)) {
  const src = readFileSync(file, 'utf8');
  for (const [, target] of src.matchAll(LINK_RE)) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue; // http(s):, mailto:, etc.
    const resolved = resolve(dirname(file), decodeURI(target));
    if (existsSync(resolved)) continue;
    // Template convention: `foo.md` links inside *.template.md files point at the
    // personalized file setup creates from `foo.template.md`. If that template
    // sibling exists, the link is valid in a personalized vault — allow it.
    if (file.endsWith('.template.md') && existsSync(resolved.replace(/\.md$/, '.template.md'))) continue;
    failures++;
    console.error(`BROKEN   ${file.slice(root.length + 1)} → ${target}`);
  }
}

if (failures) {
  console.error(`\n${failures} broken relative link(s).`);
  process.exit(1);
}
console.log('ok       all relative Markdown links resolve');
