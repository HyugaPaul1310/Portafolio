import profilePic from '../../assets/islam.jpg';
import { projects } from '../../data/projectsData';
import './About.css';

export default function AboutSection() {
  const skills = ['React', 'Node.js', 'Tailwind', 'MySQL', 'Expo', 'CSS3', 'JavaScript', 'Git', 'PHP'];
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-header">
          <p className="section-label">About me</p>
          <h2 className="section-title">Passion for Digital Innovation</h2>
        </div>

        <div className="about-grid">

          {/* Profile Image Card */}
          <div className="about-card card-profile">
            <div className="card-glow"></div>
            <div className="profile-image-wrapper">
              <div className="profile-ring"></div>
              <img src={profilePic} alt="Paul Eduardo Gonzalez" className="profile-image" />
              <div className="profile-badge">
                <span className="badge-dot"></span>
                <span>Available</span>
              </div>
            </div>
            <div className="profile-links">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="profile-link">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="profile-link">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                LinkedIn
              </a>
              <a href="https://www.instagram.com/paul_estrella10/" target="_blank" rel="noreferrer" className="profile-link">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.353 2.615 6.77 6.978 6.97 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.351-.2 6.77-2.618 6.97-6.97.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.353-2.615-6.77-6.97-6.97C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                Instagram
              </a>
              <a href="https://wa.me/yourphonenumber" target="_blank" rel="noreferrer" className="profile-link">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.871 11.871 0 005.715 1.472h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Whatsapp
              </a>
            </div>
          </div>

          {/* Main Story Card */}
          <div className="about-card card-main">
            <div className="card-glow"></div>
            <div className="card-content">
              <h3>About me</h3>
              <p>
                Graduate in Information Technology with experience in frontend development and mobile applications. Skilled in HTML, CSS, JavaScript, PHP, and React Native (Expo), with experience integrating REST APIs, user authentication, and optimization using Cloudflare. Focused on building functional, secure, and user-centered (UI/UX) applications, with the ability to quickly adapt to new technologies.
              </p>
            </div>
          </div>

          {/* Core Values Card */}
          <div className="about-card card-values">
            <div className="card-glow"></div>
            <div className="card-content">
              <h3>Philosophy</h3>
              <ul className="values-list">
                <li>
                  <span className="value-icon">⚡</span>
                  <div>
                    <strong>Performance</strong>
                    <p>Building high-speed, fluid interfaces.</p>
                  </div>
                </li>
                <li>
                  <span className="value-icon">🎨</span>
                  <div>
                    <strong>Design</strong>
                    <p>Modern and functional aesthetics.</p>
                  </div>
                </li>
                <li>
                  <span className="value-icon">📱</span>
                  <div>
                    <strong>User-First</strong>
                    <p>Total focus on the final user experience.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Skills Card */}
          <div className="about-card card-skills">
            <div className="card-glow"></div>
            <div className="card-content">
              <h3>Tech Stack</h3>
              <div className="skills-tags">
                {skills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="about-card card-stats">
            <div className="card-glow"></div>
            <div className="card-content stats-grid">
              <div className="stat-item">
                <span className="stat-number">{projects.length}+</span>
                <span className="stat-label">Deployed Apps</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{skills.length}</span>
                <span className="stat-label">Technologies Known</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Reliability</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
