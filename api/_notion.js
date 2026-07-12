const fs = require('fs');
const path = require('path');

const TASKS_DB = process.env.NOTION_DATABASE_ID_TASKS;
const HABITS_DB = process.env.NOTION_DATABASE_ID_HABITS;

function getClient() {
  if (!process.env.NOTION_API_KEY) return null;
  // Lazy require: the module stays loadable (tests, unconfigured deploys) without the SDK.
  const { Client } = require('@notionhq/client');
  return new Client({ auth: process.env.NOTION_API_KEY });
}

// Authenticate dashboard -> serverless calls with a shared secret (set SYNC_SHARED_SECRET
// in the environment AND via the dashboard's 🔑 Sync key button).
// Fail closed: if Notion credentials exist but no shared secret is set, refuse to serve —
// otherwise a deployed function URL would be an open write path into the owner's Notion.
function requireAuth(req, res) {
  const expected = process.env.SYNC_SHARED_SECRET;
  if (!expected) {
    if (process.env.NOTION_API_KEY) {
      res.status(503).json({
        error: 'Sync is configured but unprotected: set SYNC_SHARED_SECRET in the environment, then paste the same value via the dashboard\'s 🔑 Sync key button.',
      });
      return false;
    }
    return true; // Notion not configured either -> handlers answer with their own 503
  }
  const got = req.headers['x-sync-secret'] || (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '');
  if (got && got === expected) return true;
  res.status(401).json({ error: 'Unauthorized: missing or invalid X-Sync-Secret.' });
  return false;
}

// Query a Notion database to exhaustion (cursor pagination), capped so a runaway
// database can't blow up the function. Notion pages are 100 items max per request.
const PULL_MAX_ITEMS = 1000;
async function queryAllPages(notion, databaseId, { pageSize = 100, maxItems = PULL_MAX_ITEMS } = {}) {
  const results = [];
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: databaseId,
      page_size: pageSize,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    results.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor && results.length < maxItems);
  return results.slice(0, maxItems);
}

// Area code -> Notion select-option label, driven by the committed config in the static
// root (dashboard/), falling back to the shipped example. The config lives under dashboard/
// because that is the deploy root; vercel.json's `functions.includeFiles` bundles
// dashboard/lifeos.config*.json into this function so the paths below resolve at runtime.
// Paths are explicit literals (not a loop-built filename) so Vercel's file tracer can see them.
function readConfig(p) {
  try {
    const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (Array.isArray(cfg.areas) && cfg.areas.length) return cfg;
  } catch (e) { /* not here */ }
  return null;
}
function loadAreaMap() {
  const cfg =
    readConfig(path.join(__dirname, '..', 'dashboard', 'lifeos.config.json')) ||
    readConfig(path.join(__dirname, '..', 'dashboard', 'lifeos.config.example.json')) ||
    readConfig(path.join(__dirname, '..', 'lifeos.config.json')) ||         // legacy repo-root copy
    readConfig(path.join(__dirname, '..', 'lifeos.config.example.json'));   // legacy repo-root copy
  if (cfg) {
    const map = {};
    cfg.areas.forEach((a) => { map[a.code] = a.notion || a.label || a.code; });
    return map;
  }
  return { mindset: 'Mindset' };
}

const AREA_TO_NOTION = loadAreaMap();
const AREA_FROM_NOTION = Object.fromEntries(Object.entries(AREA_TO_NOTION).map(([k, v]) => [v, k]));
const DEFAULT_AREA = Object.keys(AREA_TO_NOTION).includes('mindset') ? 'mindset' : Object.keys(AREA_TO_NOTION)[0];
const DEFAULT_AREA_LABEL = AREA_TO_NOTION[DEFAULT_AREA];

const PRIORITY_TO_NOTION = { P1: 'P1 Today', P2: 'P2 This Week', P3: 'P3 Later' };
const PRIORITY_FROM_NOTION = Object.fromEntries(Object.entries(PRIORITY_TO_NOTION).map(([k, v]) => [v, k]));

const STATUS_TO_NOTION = { open: 'Not started', 'in-progress': 'In progress', done: 'Done' };
const STATUS_FROM_NOTION = Object.fromEntries(Object.entries(STATUS_TO_NOTION).map(([k, v]) => [v, k]));

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_PROP = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };

function taskToProperties(payload) {
  const props = {
    Task: { title: [{ text: { content: (payload.title || 'Untitled').slice(0, 2000) } }] },
    Area: { select: { name: AREA_TO_NOTION[payload.area] || DEFAULT_AREA_LABEL } },
    Priority: { select: { name: PRIORITY_TO_NOTION[payload.priority] || 'P3 Later' } },
    Status: { status: { name: STATUS_TO_NOTION[payload.status] || 'Not started' } },
  };
  props.Due = payload.due ? { date: { start: payload.due } } : { date: null };
  return props;
}

function taskFromPage(page) {
  const p = page.properties;
  return {
    notionId: page.id,
    title: p.Task?.title?.[0]?.plain_text || '',
    area: AREA_FROM_NOTION[p.Area?.select?.name] || DEFAULT_AREA,
    priority: PRIORITY_FROM_NOTION[p.Priority?.select?.name] || 'P3',
    status: STATUS_FROM_NOTION[p.Status?.status?.name] || 'open',
    due: p.Due?.date?.start || '',
    updatedAt: page.last_edited_time,
  };
}

function habitToProperties(payload) {
  const props = {
    Habit: { title: [{ text: { content: (payload.name || 'Untitled habit').slice(0, 2000) } }] },
    Keystone: { checkbox: !!payload.keystone },
    Active: { checkbox: payload.active !== false },
    Cadence: { select: { name: payload.cadence || 'Daily' } },
  };
  if (payload.weekOf) props['Week Of'] = { date: { start: payload.weekOf } };
  DAYS.forEach((d) => {
    props[DAY_PROP[d]] = { checkbox: !!(payload.days && payload.days[d]) };
  });
  return props;
}

function habitFromPage(page) {
  const p = page.properties;
  const days = {};
  DAYS.forEach((d) => { days[d] = !!p[DAY_PROP[d]]?.checkbox; });
  return {
    notionId: page.id,
    name: p.Habit?.title?.[0]?.plain_text || '',
    keystone: !!p.Keystone?.checkbox,
    active: p.Active?.checkbox !== false,
    cadence: p.Cadence?.select?.name || 'Daily',
    weekOf: p['Week Of']?.date?.start || '',
    days,
    updatedAt: page.last_edited_time,
  };
}

module.exports = {
  getClient, requireAuth, TASKS_DB, HABITS_DB,
  taskToProperties, taskFromPage,
  habitToProperties, habitFromPage,
  queryAllPages, PULL_MAX_ITEMS,
};
