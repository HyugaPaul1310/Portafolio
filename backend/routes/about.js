import express from 'express';
const router = express.Router();

export default (upload) => {
  // GET about me data
  router.get('/', async (req, res) => {
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
  router.put('/', upload.single('profileImage'), async (req, res) => {
    const {
      story_title_es, story_title_en,
      story_text_es, story_text_en,
      skills,
      github_url, linkedin_url, instagram_url, whatsapp_url,
      twitter_url, youtube_url, tiktok_url, facebook_url,
      existingProfileImage
    } = req.body;

    const port = process.env.PORT || 3000;
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

  return router;
};
