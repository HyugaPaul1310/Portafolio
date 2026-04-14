import express from 'express';
const router = express.Router();

// POST track page view
router.post('/page-view', async (req, res) => {
  const { page } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const userAgent = req.headers['user-agent'] || '';
  const referrer = req.headers['referer'] || '';
  try {
    await req.db.query('INSERT INTO page_views (page, visitor_ip, user_agent, referrer) VALUES (?,?,?,?)', [page || 'home', ip, userAgent, referrer]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST track project view
router.post('/project-view', async (req, res) => {
  const { project_id } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  try {
    await req.db.query('INSERT INTO project_views (project_id, visitor_ip) VALUES (?,?)', [project_id, ip]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET dashboard stats (for admin)
router.get('/dashboard', async (req, res) => {
  try {
    // Total page views
    const [[{ total_page_views }]] = await req.db.query('SELECT COUNT(*) as total_page_views FROM page_views');

    // Today's page views
    const [[{ today_views }]] = await req.db.query('SELECT COUNT(*) as today_views FROM page_views WHERE DATE(viewed_at) = CURDATE()');

    // Total unique visitors (by IP)
    const [[{ unique_visitors }]] = await req.db.query('SELECT COUNT(DISTINCT visitor_ip) as unique_visitors FROM page_views');

    // Total projects
    const [[{ total_projects }]] = await req.db.query('SELECT COUNT(*) as total_projects FROM projects');

    // Total project views
    const [[{ total_project_views }]] = await req.db.query('SELECT COUNT(*) as total_project_views FROM project_views');

    // Views per project (bar chart)
    const [viewsPerProject] = await req.db.query(`
      SELECT p.title_es as name, COUNT(pv.id) as views 
      FROM projects p 
      LEFT JOIN project_views pv ON p.id = pv.project_id 
      GROUP BY p.id, p.title_es 
      ORDER BY views DESC
    `);

    // Views per category (pie chart)
    const [viewsPerCategory] = await req.db.query(`
      SELECT p.category as name, COUNT(pv.id) as views 
      FROM projects p 
      LEFT JOIN project_views pv ON p.id = pv.project_id 
      GROUP BY p.category 
      ORDER BY views DESC
    `);

    // Page views per day (last 14 days - line/bar chart)
    const [viewsPerDay] = await req.db.query(`
      SELECT DATE(viewed_at) as date, COUNT(*) as views 
      FROM page_views 
      WHERE viewed_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY) 
      GROUP BY DATE(viewed_at) 
      ORDER BY date ASC
    `);

    // Top referrers
    const [topReferrers] = await req.db.query(`
      SELECT referrer as name, COUNT(*) as visits 
      FROM page_views 
      WHERE referrer != '' 
      GROUP BY referrer 
      ORDER BY visits DESC 
      LIMIT 5
    `);

    // Projects per category (pie chart)
    const [projectsPerCategory] = await req.db.query(`
      SELECT category as name, COUNT(*) as count 
      FROM projects 
      GROUP BY category 
      ORDER BY count DESC
    `);

    res.json({
      total_page_views,
      today_views,
      unique_visitors,
      total_projects,
      total_project_views,
      viewsPerProject,
      viewsPerCategory,
      viewsPerDay,
      topReferrers,
      projectsPerCategory
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// GET security analytics
router.get('/security', async (req, res) => {
  try {
    // Total failed attempts (all time)
    const [[{ total_failed }]] = await req.db.query('SELECT COUNT(*) as total_failed FROM security_logs WHERE is_successful = 0');

    // Failed attempts last 24h
    const [[{ failed_24h }]] = await req.db.query('SELECT COUNT(*) as failed_24h FROM security_logs WHERE is_successful = 0 AND timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)');

    // Recent 10 failed attempts
    const [recent_failures] = await req.db.query(`
      SELECT ip_address, country, city, timestamp, user_agent 
      FROM security_logs 
      WHERE is_successful = 0 
      ORDER BY timestamp DESC 
      LIMIT 10
    `);

    // Top 5 attacking countries
    const [top_countries] = await req.db.query(`
      SELECT country as name, COUNT(*) as count 
      FROM security_logs 
      WHERE is_successful = 0 AND country IS NOT NULL
      GROUP BY country 
      ORDER BY count DESC 
      LIMIT 5
    `);

    // Check for "High Alert" status (> 10 failures in last hour)
    const [[{ alert_count }]] = await req.db.query('SELECT COUNT(*) as alert_count FROM security_logs WHERE is_successful = 0 AND timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)');

    res.json({
      total_failed,
      failed_24h,
      recent_failures,
      top_countries,
      isHighAlert: alert_count >= 10
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
