import express from 'express';
const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// The POST and PUT routes need the 'upload' middleware.
// We will pass 'upload' to the router from server.js or import it from a config.

export default (upload) => {
  // POST new project (Admin)
  router.post('/', upload.array('gallery', 8), async (req, res) => {
    const {
      title_es, title_en, category, color, tags,
      description_es, description_en, overview_es, overview_en, problem_es, problem_en,
      solution_es, solution_en, learnings_es, learnings_en,
      show_website, website_url, show_repo, repo_url
    } = req.body;

    const port = process.env.PORT || 3000;
    const galleryUrls = req.files ? req.files.map(file => `http://localhost:${port}/uploads/${file.filename}`) : [];

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
  router.put('/:id', upload.array('newImages', 8), async (req, res) => {
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

    const port = process.env.PORT || 3000;
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
  router.delete('/:id', async (req, res) => {
    try {
      await req.db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  return router;
};
