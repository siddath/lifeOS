const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

const TASKS_DB = process.env.NOTION_DATABASE_ID_TASKS;
const HABITS_DB = process.env.NOTION_DATABASE_ID_HABITS;

function getClient() {
  if (!process.env.NOTION_API_KEY) return null;
  return new Client({ auth: process.env.NOTION_API_KEY });
}

// Authenticate dashboard -> serverless calls with a shared secret (set SYNC_SHARED_SECRET
// in the environment AND in the dashboard config). If unset, auth is disabled (local/dev).
function requireAuth(req, res) {
  const expected = process.env.SYNC_SHARED_SECRET;
  if (!expected) return true; // not configured -> open (development / no-secret deployments)
  const got = req.headers['x-sync-secret'] || (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '');
  if (got && got === expected) return true;
  res.status(401).json({ error: 'Unauthorized: missing or invalid X-Sync-Secret.' });
  return false;
}

// Area code -> Notion select-option label, driven by lifeos.config.json (falls back to the
// example). Keeps the dashboard and the sync layer from ever drifting on area names.
function loadAreaMap() {
  const roots = [path.join(__dirname, '..')];
  for (const root of roots) {
    for (const f of ['lifeos.config.json', 'lifeos.config.example.json']) {
      try {
        const cfg = JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
        if (Array.isArray(cfg.areas) && cfg.areas.length) {
          const map = {};
          cfg.areas.forEach((a) => { map[a.code] = a.notion || a.label || a.code; });
          return map;
        }
      } catch (e) { /* try next */ }
    }
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
};
