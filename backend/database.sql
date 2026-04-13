CREATE DATABASE IF NOT EXISTS portafoliopaul;
USE portafoliopaul;

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title_es VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    color VARCHAR(20) DEFAULT '#a855f7',
    
    tags JSON NOT NULL,
    gallery JSON NOT NULL,
    
    description_es TEXT NOT NULL,
    description_en TEXT NOT NULL,
    overview_es TEXT NOT NULL,
    overview_en TEXT NOT NULL,
    problem_es TEXT NOT NULL,
    problem_en TEXT NOT NULL,
    solution_es TEXT NOT NULL,
    solution_en TEXT NOT NULL,
    learnings_es TEXT NOT NULL,
    learnings_en TEXT NOT NULL,

    show_website BOOLEAN DEFAULT FALSE,
    website_url VARCHAR(255) DEFAULT '',
    show_repo BOOLEAN DEFAULT FALSE,
    repo_url VARCHAR(255) DEFAULT '',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Agregar Categorías por defecto
INSERT INTO categories (name) VALUES 
('Frontend'), ('Backend'), ('Front y Backend'), ('Apps móviles'), ('Multiplataforma'), ('Videojuegos');

-- Agregar Etiquetas por defecto
INSERT INTO tags (name) VALUES 
('HTML'), ('CSS'), ('JavaScript'), ('TypeScript'), ('Python'), ('Java'), ('C#'), ('PHP'), ('Go'), 
('Kotlin'), ('Swift'), ('Dart'), ('Expo'), ('React'), ('Tailwind CSS'), ('Vite'), ('Cloudflare'), ('Node.js');

-- Tabla de vistas de página (analytics)
CREATE TABLE IF NOT EXISTS page_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page VARCHAR(100) NOT NULL DEFAULT 'home',
    visitor_ip VARCHAR(45) DEFAULT '',
    user_agent TEXT DEFAULT '',
    referrer VARCHAR(500) DEFAULT '',
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de vistas de proyecto (analytics)
CREATE TABLE IF NOT EXISTS project_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    visitor_ip VARCHAR(45) DEFAULT '',
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Insert dummy project data so it works out of the box
INSERT INTO projects (
    title_es, title_en, category, color, tags, gallery, 
    description_es, description_en, overview_es, overview_en, problem_es, problem_en, 
    solution_es, solution_en, learnings_es, learnings_en,
    show_website, website_url, show_repo, repo_url
) VALUES (
    'Sistema de Reportes', 'Report System', 'Web App', '#a855f7', 
    '["React", "Node.js"]', '["https://picsum.photos/seed/p1/800/600"]',
    'Breve descripción.', 'Short description.',
    'Un sistema de control amplio.', 'A broad control system.', 'Falta de control.', 'Lack of control.',
    'Sistema digital.', 'Digital system.', 'Aprendí React.', 'Learned React.',
    TRUE, 'https://mipagina.com', TRUE, 'https://github.com/miproyecto'
);

-- Table for editable About Me section
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
);
