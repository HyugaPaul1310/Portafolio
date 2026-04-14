import express from 'express';
const router = express.Router();

// GET all categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new category
router.post('/categories', async (req, res) => {
  try {
    const [result] = await req.db.query('INSERT INTO categories (name) VALUES (?)', [req.body.name]);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE category
router.delete('/categories/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all tags
router.get('/tags', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT * FROM tags ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new tag
router.post('/tags', async (req, res) => {
  try {
    const [result] = await req.db.query('INSERT INTO tags (name) VALUES (?)', [req.body.name]);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE tag
router.delete('/tags/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM tags WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
