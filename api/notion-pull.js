const { getClient, requireAuth, TASKS_DB, HABITS_DB, taskFromPage, habitFromPage } = require('./_notion');

// Pull latest Tasks + Habits from Notion so edits made elsewhere flow back into the dashboard.
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
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

  try {
    const [tasksRes, habitsRes] = await Promise.all([
      notion.databases.query({ database_id: TASKS_DB, page_size: 100 }),
      notion.databases.query({ database_id: HABITS_DB, page_size: 100 }),
    ]);
    res.status(200).json({
      tasks: tasksRes.results.map(taskFromPage),
      habits: habitsRes.results.map(habitFromPage),
      pulledAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
