const { getClient, requireAuth, TASKS_DB, HABITS_DB, taskToProperties, habitToProperties } = require('./_notion');

// Push local dashboard edits (tasks/habits) up to Notion. Body: { items: [{ type, action, payload }] }
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!requireAuth(req, res)) return;

  const notion = getClient();
  if (!notion) {
    res.status(503).json({
      error: 'Notion sync not configured. Set NOTION_API_KEY, NOTION_DATABASE_ID_TASKS, NOTION_DATABASE_ID_HABITS as environment variables.',
    });
    return;
  }

  const { items } = req.body || {};
  if (!Array.isArray(items)) {
    res.status(400).json({ error: 'Expected body.items to be an array' });
    return;
  }

  const results = [];
  for (const item of items) {
    const { type, action, payload } = item || {};
    try {
      if (type === 'task') {
        results.push({ localId: payload.id, ...(await syncTask(notion, action, payload)) });
      } else if (type === 'habit') {
        results.push({ localId: payload.id, ...(await syncHabit(notion, action, payload)) });
      } else {
        results.push({ localId: payload?.id, ok: false, error: `Unknown item type: ${type}` });
      }
    } catch (err) {
      results.push({ localId: payload?.id, ok: false, error: err.message });
    }
  }

  res.status(200).json({ results, syncedAt: new Date().toISOString() });
};

async function syncTask(notion, action, payload) {
  if (action === 'delete') {
    if (payload.notionId) await notion.pages.update({ page_id: payload.notionId, archived: true });
    return { ok: true, notionId: null };
  }
  const properties = taskToProperties(payload);
  if (payload.notionId) {
    await notion.pages.update({ page_id: payload.notionId, properties });
    return { ok: true, notionId: payload.notionId };
  }
  const created = await notion.pages.create({ parent: { database_id: TASKS_DB }, properties });
  return { ok: true, notionId: created.id };
}

async function syncHabit(notion, action, payload) {
  if (action === 'delete') {
    if (payload.notionId) await notion.pages.update({ page_id: payload.notionId, archived: true });
    return { ok: true, notionId: null };
  }
  const properties = habitToProperties(payload);
  if (payload.notionId) {
    await notion.pages.update({ page_id: payload.notionId, properties });
    return { ok: true, notionId: payload.notionId };
  }
  const created = await notion.pages.create({ parent: { database_id: HABITS_DB }, properties });
  return { ok: true, notionId: created.id };
}
