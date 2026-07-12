// Unit tests for api/_notion.js — run with: node --test tests/
// Uses only node built-ins so a fresh clone can test without installing anything.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

function freshNotion(env = {}) {
  // _notion.js reads some env at require time (DB ids, area map) and some at call
  // time (requireAuth), so each scenario resets the cache AND leaves its env applied.
  const mod = path.resolve(__dirname, '..', 'api', '_notion.js');
  delete require.cache[mod];
  for (const k of ['NOTION_API_KEY', 'SYNC_SHARED_SECRET', 'NOTION_DATABASE_ID_TASKS', 'NOTION_DATABASE_ID_HABITS']) {
    if (k in env) process.env[k] = env[k]; else delete process.env[k];
  }
  return require(mod);
}

function mockRes() {
  return {
    statusCode: null,
    body: null,
    status(c) { this.statusCode = c; return this; },
    json(b) { this.body = b; return this; },
  };
}

test('taskToProperties maps fields and defaults', () => {
  const { taskToProperties } = freshNotion();
  const props = taskToProperties({ title: 'Write tests', area: 'nope', priority: 'P1', status: 'done', due: '2026-07-12' });
  assert.equal(props.Task.title[0].text.content, 'Write tests');
  assert.equal(props.Priority.select.name, 'P1 Today');
  assert.equal(props.Status.status.name, 'Done');
  assert.deepEqual(props.Due, { date: { start: '2026-07-12' } });
  assert.ok(props.Area.select.name); // unknown area falls back to the default label

  const bare = taskToProperties({});
  assert.equal(bare.Task.title[0].text.content, 'Untitled');
  assert.equal(bare.Priority.select.name, 'P3 Later');
  assert.equal(bare.Status.status.name, 'Not started');
  assert.deepEqual(bare.Due, { date: null });
});

test('taskToProperties truncates 2000+ char titles', () => {
  const { taskToProperties } = freshNotion();
  const props = taskToProperties({ title: 'x'.repeat(3000) });
  assert.equal(props.Task.title[0].text.content.length, 2000);
});

test('taskFromPage inverts the mapping', () => {
  const { taskFromPage } = freshNotion();
  const t = taskFromPage({
    id: 'page-1',
    last_edited_time: '2026-07-12T00:00:00.000Z',
    properties: {
      Task: { title: [{ plain_text: 'Ship it' }] },
      Area: { select: { name: 'Mindset' } },
      Priority: { select: { name: 'P2 This Week' } },
      Status: { status: { name: 'In progress' } },
      Due: { date: { start: '2026-07-15' } },
    },
  });
  assert.deepEqual(t, {
    notionId: 'page-1', title: 'Ship it', area: 'mindset',
    priority: 'P2', status: 'in-progress', due: '2026-07-15',
    updatedAt: '2026-07-12T00:00:00.000Z',
  });
});

test('habitToProperties maps days, keystone, optional weekOf', () => {
  const { habitToProperties } = freshNotion();
  const props = habitToProperties({ name: 'Walk', keystone: true, days: { mon: true, sun: true }, weekOf: '2026-07-06' });
  assert.equal(props.Habit.title[0].text.content, 'Walk');
  assert.equal(props.Keystone.checkbox, true);
  assert.equal(props.Active.checkbox, true);
  assert.equal(props.Mon.checkbox, true);
  assert.equal(props.Tue.checkbox, false);
  assert.equal(props.Sun.checkbox, true);
  assert.deepEqual(props['Week Of'], { date: { start: '2026-07-06' } });
  assert.ok(!('Week Of' in habitToProperties({ name: 'Walk' })));
});

test('requireAuth: open only when nothing at all is configured', () => {
  const { requireAuth } = freshNotion({});
  const res = mockRes();
  assert.equal(requireAuth({ headers: {} }, res), true);
  assert.equal(res.statusCode, null);
});

test('requireAuth: fails closed (503) when Notion is configured without a secret', () => {
  const { requireAuth } = freshNotion({ NOTION_API_KEY: 'ntn_test' });
  const res = mockRes();
  assert.equal(requireAuth({ headers: {} }, res), false);
  assert.equal(res.statusCode, 503);
  assert.match(res.body.error, /SYNC_SHARED_SECRET/);
});

test('requireAuth: accepts matching X-Sync-Secret and Bearer forms', () => {
  const { requireAuth } = freshNotion({ NOTION_API_KEY: 'ntn_test', SYNC_SHARED_SECRET: 's3cret' });
  assert.equal(requireAuth({ headers: { 'x-sync-secret': 's3cret' } }, mockRes()), true);
  assert.equal(requireAuth({ headers: { authorization: 'Bearer s3cret' } }, mockRes()), true);
});

test('requireAuth: rejects missing or wrong secret with 401', () => {
  const { requireAuth } = freshNotion({ NOTION_API_KEY: 'ntn_test', SYNC_SHARED_SECRET: 's3cret' });
  for (const headers of [{}, { 'x-sync-secret': 'wrong' }, { authorization: 'Bearer nope' }]) {
    const res = mockRes();
    assert.equal(requireAuth({ headers }, res), false);
    assert.equal(res.statusCode, 401);
  }
});

test('queryAllPages follows cursors to exhaustion', async () => {
  const { queryAllPages } = freshNotion();
  const pages = [
    { results: [{ id: 'a' }, { id: 'b' }], has_more: true, next_cursor: 'c1' },
    { results: [{ id: 'c' }], has_more: true, next_cursor: 'c2' },
    { results: [{ id: 'd' }], has_more: false, next_cursor: null },
  ];
  const calls = [];
  const notion = { databases: { query: async (args) => { calls.push(args); return pages[calls.length - 1]; } } };
  const out = await queryAllPages(notion, 'db-1');
  assert.deepEqual(out.map((p) => p.id), ['a', 'b', 'c', 'd']);
  assert.equal(calls.length, 3);
  assert.equal(calls[0].start_cursor, undefined);
  assert.equal(calls[1].start_cursor, 'c1');
  assert.equal(calls[2].start_cursor, 'c2');
});

test('queryAllPages respects the maxItems cap', async () => {
  const { queryAllPages } = freshNotion();
  const notion = {
    databases: {
      query: async ({ start_cursor }) => ({
        results: Array.from({ length: 100 }, (_, i) => ({ id: `${start_cursor || 'p0'}-${i}` })),
        has_more: true,
        next_cursor: `${start_cursor || 'p0'}x`,
      }),
    },
  };
  const out = await queryAllPages(notion, 'db-1', { maxItems: 250 });
  assert.equal(out.length, 250);
});
