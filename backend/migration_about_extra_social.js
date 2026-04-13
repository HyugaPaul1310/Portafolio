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
  
  const addColumns = `
    ALTER TABLE about_me
    ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(255) DEFAULT '',
    ADD COLUMN IF NOT EXISTS youtube_url VARCHAR(255) DEFAULT '',
    ADD COLUMN IF NOT EXISTS tiktok_url VARCHAR(255) DEFAULT '',
    ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(255) DEFAULT ''
  `;
  
  try {
    await pool.query(addColumns);
    console.log('Migration successful: added extra social link columns to about_me');
  } catch (err) {
    if (err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        // MySQL 5.7+ doesn't support IF NOT EXISTS in ALTER TABLE
        // I'll silently handle errors if they already exist
        console.log('Columns likely already exist or IF NOT EXISTS failed.');
    } else {
        console.error('Migration error:', err);
    }
  }
  process.exit(0);
}
main().catch(console.error);
