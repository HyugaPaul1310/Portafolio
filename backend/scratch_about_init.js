import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portafoliopaul'
  });
  
  const createTable = `
    CREATE TABLE IF NOT EXISTS about_me (
      id INT PRIMARY KEY DEFAULT 1,
      profile_image_url VARCHAR(255) DEFAULT '',
      story_title_es VARCHAR(255) DEFAULT '',
      story_title_en VARCHAR(255) DEFAULT '',
      story_text_es TEXT,
      story_text_en TEXT,
      skills JSON,
      github_url VARCHAR(255) DEFAULT '',
      linkedin_url VARCHAR(255) DEFAULT '',
      instagram_url VARCHAR(255) DEFAULT '',
      whatsapp_url VARCHAR(255) DEFAULT ''
    )
  `;
  await pool.query(createTable);
  
  const [rows] = await pool.query('SELECT * FROM about_me WHERE id = 1');
  if (rows.length === 0) {
    await pool.query(`
      INSERT INTO about_me (id, story_title_es, story_title_en, story_text_es, story_text_en, skills)
      VALUES (
        1, 
        'Sobre Mí', 
        'About Me', 
        'Graduado en Tecnologías de la Información con experiencia en desarrollo frontend y aplicaciones móviles. Hábil en HTML, CSS, JavaScript, PHP, y React Native (Expo), con experiencia integrando APIs REST, autenticación de usuarios, y optimización usando Cloudflare. Enfocado en construir aplicaciones funcionales, seguras, y centradas en el usuario (UI/UX), con la habilidad de adaptarse rápidamente a nuevas tecnologías.', 
        'Graduate in Information Technology with experience in frontend development and mobile applications. Skilled in HTML, CSS, JavaScript, PHP, and React Native (Expo), with experience integrating REST APIs, user authentication, and optimization using Cloudflare. Focused on building functional, secure, and user-centered (UI/UX) applications, with the ability to quickly adapt to new technologies.', 
        '["React", "Node.js", "Tailwind", "MySQL", "Expo", "CSS3", "JavaScript", "Git", "PHP"]'
      )
    `);
    console.log('Inserted default about_me row');
  } else {
    console.log('about_me table already has a row');
  }
  process.exit(0);
}
main().catch(console.error);
