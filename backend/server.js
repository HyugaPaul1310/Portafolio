import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
// Servir la carpeta de imágenes estáticas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de Multer para guardar en /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

// Database connection logic
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portafoliopaul',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware to inject db pool to requests
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// GET all categories
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// POST new category
app.post('/api/categories', async (req, res) => {
  try {
    const [result] = await req.db.query('INSERT INTO categories (name) VALUES (?)', [req.body.name]);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// DELETE category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all tags
app.get('/api/tags', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT * FROM tags ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// POST new tag
app.post('/api/tags', async (req, res) => {
  try {
    const [result] = await req.db.query('INSERT INTO tags (name) VALUES (?)', [req.body.name]);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// DELETE tag
app.delete('/api/tags/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM tags WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET single project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST new project (Admin)
// Recibe hasta 8 archivos desde "gallery"
app.post('/api/projects', upload.array('gallery', 8), async (req, res) => {
  const {
    title_es, title_en, category, color, tags,
    description_es, description_en, overview_es, overview_en, problem_es, problem_en,
    solution_es, solution_en, learnings_es, learnings_en,
    show_website, website_url, show_repo, repo_url
  } = req.body;

  // req.files contiene los archivos subidos. Convertimos sus paths a URLs públicas.
  const galleryUrls = req.files ? req.files.map(file => `http://localhost:${port}/uploads/${file.filename}`) : [];

  // Transformar la entrada de tags (podría venir como string JSON o comma-separated si usamos FormData)
  let parsedTags = [];
  try {
    parsedTags = JSON.parse(tags);
  } catch (e) {
    parsedTags = typeof tags === 'string' ? tags.split(',') : (tags || []);
  }

  // Convertir a booleanos (FormData manda 'true' / 'false' como strings)
  const isShowWebsite = show_website === 'true' || show_website === true;
  const isShowRepo = show_repo === 'true' || show_repo === true;

  try {
    const query = `
      INSERT INTO projects (
        title_es, title_en, category, color, tags, gallery,
        description_es, description_en, overview_es, overview_en, problem_es, problem_en,
        solution_es, solution_en, learnings_es, learnings_en,
        show_website, website_url, show_repo, repo_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      title_es, title_en, category, color, JSON.stringify(parsedTags), JSON.stringify(galleryUrls),
      description_es, description_en, overview_es, overview_en, problem_es, problem_en,
      solution_es, solution_en, learnings_es, learnings_en,
      isShowWebsite, website_url || '', isShowRepo, repo_url || ''
    ];

    const [result] = await req.db.query(query, values);
    res.status(201).json({ id: result.insertId, message: 'Project created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT update project (Admin)
app.put('/api/projects/:id', upload.array('newImages', 8), async (req, res) => {
  const {
    title_es, title_en, category, color, tags, existingGallery,
    description_es, description_en, overview_es, overview_en, problem_es, problem_en,
    solution_es, solution_en, learnings_es, learnings_en,
    show_website, website_url, show_repo, repo_url
  } = req.body;

  let parsedExistingGallery = [];
  try {
    parsedExistingGallery = existingGallery ? JSON.parse(existingGallery) : [];
  } catch (e) {
    parsedExistingGallery = existingGallery ? [existingGallery] : [];
  }

  const newGalleryUrls = req.files ? req.files.map(file => `http://localhost:${port}/uploads/${file.filename}`) : [];
  const finalGallery = [...parsedExistingGallery, ...newGalleryUrls].slice(0, 8); // Max 8

  let parsedTags = [];
  try {
    parsedTags = JSON.parse(tags);
  } catch (e) {
    parsedTags = typeof tags === 'string' ? tags.split(',') : (tags || []);
  }

  const isShowWebsite = show_website === 'true' || show_website === true;
  const isShowRepo = show_repo === 'true' || show_repo === true;

  try {
    const query = `
      UPDATE projects SET 
        title_es = ?, title_en = ?, category = ?, color = ?, tags = ?, gallery = ?,
        description_es = ?, description_en = ?, overview_es = ?, overview_en = ?, problem_es = ?, problem_en = ?,
        solution_es = ?, solution_en = ?, learnings_es = ?, learnings_en = ?,
        show_website = ?, website_url = ?, show_repo = ?, repo_url = ?
      WHERE id = ?
    `;
    const values = [
      title_es, title_en, category, color, JSON.stringify(parsedTags), JSON.stringify(finalGallery),
      description_es, description_en, overview_es, overview_en, problem_es, problem_en,
      solution_es, solution_en, learnings_es, learnings_en,
      isShowWebsite, website_url || '', isShowRepo, repo_url || '',
      req.params.id
    ];

    await req.db.query(query, values);
    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project (Admin)
app.delete('/api/projects/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ==================== ABOUT ME ====================

// GET about me data
app.get('/api/about', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT * FROM about_me WHERE id = 1');
    if (rows.length === 0) return res.status(404).json({ error: 'About data not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch about data' });
  }
});

// PUT update about me data (Admin)
// Recibe un archivo "profileImage" y el resto como body
app.put('/api/about', upload.single('profileImage'), async (req, res) => {
  const {
    story_title_es, story_title_en,
    story_text_es, story_text_en,
    skills,
    github_url, linkedin_url, instagram_url, whatsapp_url,
    twitter_url, youtube_url, tiktok_url, facebook_url,
    existingProfileImage
  } = req.body;

  let profileImageUrl = existingProfileImage || '';
  if (req.file) {
    profileImageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  }

  let parsedSkills = [];
  try {
    parsedSkills = JSON.parse(skills);
  } catch (e) {
    parsedSkills = typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : (skills || []);
  }

  try {
    const query = `
      UPDATE about_me SET 
        profile_image_url = ?, 
        story_title_es = ?, story_title_en = ?, 
        story_text_es = ?, story_text_en = ?, 
        skills = ?, 
        github_url = ?, linkedin_url = ?, instagram_url = ?, whatsapp_url = ?,
        twitter_url = ?, youtube_url = ?, tiktok_url = ?, facebook_url = ?
      WHERE id = 1
    `;
    const values = [
      profileImageUrl,
      story_title_es, story_title_en,
      story_text_es, story_text_en,
      JSON.stringify(parsedSkills),
      github_url || '', linkedin_url || '', instagram_url || '', whatsapp_url || '',
      twitter_url || '', youtube_url || '', tiktok_url || '', facebook_url || ''
    ];

    await req.db.query(query, values);
    res.json({ message: 'About data updated successfully', profile_image_url: profileImageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update about data' });
  }
});

// ==================== ANALYTICS ====================

// POST track page view
app.post('/api/analytics/page-view', async (req, res) => {
  const { page } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const userAgent = req.headers['user-agent'] || '';
  const referrer = req.headers['referer'] || '';
  try {
    await pool.query('INSERT INTO page_views (page, visitor_ip, user_agent, referrer) VALUES (?,?,?,?)', [page || 'home', ip, userAgent, referrer]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST track project view
app.post('/api/analytics/project-view', async (req, res) => {
  const { project_id } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  try {
    await pool.query('INSERT INTO project_views (project_id, visitor_ip) VALUES (?,?)', [project_id, ip]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET dashboard stats (for admin)
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    // Total page views
    const [[{ total_page_views }]] = await pool.query('SELECT COUNT(*) as total_page_views FROM page_views');

    // Today's page views
    const [[{ today_views }]] = await pool.query('SELECT COUNT(*) as today_views FROM page_views WHERE DATE(viewed_at) = CURDATE()');

    // Total unique visitors (by IP)
    const [[{ unique_visitors }]] = await pool.query('SELECT COUNT(DISTINCT visitor_ip) as unique_visitors FROM page_views');

    // Total projects
    const [[{ total_projects }]] = await pool.query('SELECT COUNT(*) as total_projects FROM projects');

    // Total project views
    const [[{ total_project_views }]] = await pool.query('SELECT COUNT(*) as total_project_views FROM project_views');

    // Views per project (bar chart)
    const [viewsPerProject] = await pool.query(`
      SELECT p.title_es as name, COUNT(pv.id) as views 
      FROM projects p 
      LEFT JOIN project_views pv ON p.id = pv.project_id 
      GROUP BY p.id, p.title_es 
      ORDER BY views DESC
    `);

    // Views per category (pie chart)
    const [viewsPerCategory] = await pool.query(`
      SELECT p.category as name, COUNT(pv.id) as views 
      FROM projects p 
      LEFT JOIN project_views pv ON p.id = pv.project_id 
      GROUP BY p.category 
      ORDER BY views DESC
    `);

    // Page views per day (last 14 days - line/bar chart)
    const [viewsPerDay] = await pool.query(`
      SELECT DATE(viewed_at) as date, COUNT(*) as views 
      FROM page_views 
      WHERE viewed_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY) 
      GROUP BY DATE(viewed_at) 
      ORDER BY date ASC
    `);

    // Top referrers
    const [topReferrers] = await pool.query(`
      SELECT referrer as name, COUNT(*) as visits 
      FROM page_views 
      WHERE referrer != '' 
      GROUP BY referrer 
      ORDER BY visits DESC 
      LIMIT 5
    `);

    // Projects per category (pie chart)
    const [projectsPerCategory] = await pool.query(`
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

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
