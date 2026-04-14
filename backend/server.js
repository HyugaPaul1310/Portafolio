import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

// Import Routes
import projectsRoutes from './routes/projects.js';
import aboutRoutes from './routes/about.js';
import analyticsRoutes from './routes/analytics.js';
import taxonomyRoutes from './routes/taxonomy.js';
import authRoutes from './routes/auth.js';

// Import Config
import { upload } from './config/multer.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.middleware = (req, res, next) => {
  req.db = pool;
  next();
};
app.use(app.middleware);

// Database Initialization
async function initDb() {
  try {
    const connection = await pool.getConnection();
    
    // Create admin_auth table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_auth (
        id INT PRIMARY KEY AUTO_INCREMENT,
        password_hash VARCHAR(255) NOT NULL,
        recovery_email VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create security_logs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS security_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        ip_address VARCHAR(45) NOT NULL,
        is_successful BOOLEAN NOT NULL,
        country VARCHAR(100),
        city VARCHAR(100),
        user_agent TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if initialized
    const [rows] = await connection.query('SELECT count(*) as count FROM admin_auth');
    if (rows[0].count === 0) {
      const defaultPass = 'admin123';
      const hash = await bcrypt.hash(defaultPass, 10);
      await connection.query('INSERT INTO admin_auth (password_hash) VALUES (?)', [hash]);
      console.log('Admin Auth initialized with default password: admin123');
    }

    connection.release();
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}
initDb();

// Register Modular Routes
app.use('/api/projects', projectsRoutes(upload));
app.use('/api/about', aboutRoutes(upload));
app.use('/api/analytics', analyticsRoutes);
app.use('/api/taxonomy', taxonomyRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
