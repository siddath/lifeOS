const { getClient, requireAuth, TASKS_DB, HABITS_DB, taskFromPage, habitFromPage, queryAllPages, PULL_MAX_ITEMS } = require('./_notion');

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
    const [taskPages, habitPages] = await Promise.all([
      queryAllPages(notion, TASKS_DB),
      queryAllPages(notion, HABITS_DB),
    ]);
    res.status(200).json({
      tasks: taskPages.map(taskFromPage),
      habits: habitPages.map(habitFromPage),
      truncated: taskPages.length >= PULL_MAX_ITEMS || habitPages.length >= PULL_MAX_ITEMS,
      pulledAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
