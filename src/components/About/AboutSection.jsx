import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import profilePic from '../../assets/islam.jpg';
import './About.css';

const AboutSection = () => {
  const { t, i18n } = useTranslation();
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/about')
      .then(res => res.json())
      .then(data => setAboutData(data))
      .catch(err => console.error('Failed to fetch about data', err));
  }, []);

  const defaultSkills = ['React', 'Node.js', 'Tailwind', 'MySQL', 'Expo', 'CSS3', 'JavaScript', 'Git', 'PHP'];

  let parsedSkills = defaultSkills;
  if (aboutData && aboutData.skills) {
    try {
      parsedSkills = typeof aboutData.skills === 'string' ? JSON.parse(aboutData.skills) : aboutData.skills;
    } catch (e) {
      parsedSkills = defaultSkills;
    }
  }

  const currentLang = i18n?.language || 'es';
  const storyTitle = aboutData ? (currentLang.startsWith('en') ? aboutData.story_title_en : aboutData.story_title_es) : (t ? t('about.cards.story.title') : 'Sobre Mí');
  const storyText = aboutData ? (currentLang.startsWith('en') ? aboutData.story_text_en : aboutData.story_text_es) : (t ? t('about.cards.story.text') : 'Texto...');
  const profileImage = aboutData?.profile_image_url || profilePic;

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <header className="about-header">
          <span className="section-label">{t('about.label')}</span>
          <h2 className="section-title">{t('about.title')}</h2>
        </header>

        <div className="about-grid">
          {/* Profile Card */}
          <div className="about-card card-profile">
            <div className="card-glow"></div>
            <div className="profile-image-wrapper">
              <div className="profile-ring"></div>
              <img src={profileImage} alt="Paul Eduardo Gonzalez" className="profile-image" />
              <div className="profile-badge">
                <span className="badge-dot"></span>
                {t('about.cards.profile.badge')}
              </div>
            </div>

            <div className="profile-identity">
              <p className="profile-name">Paul González</p>
              <p className="profile-role">Frontend &amp; Mobile Dev</p>
            </div>

            <div className="profile-divider"></div>

            <div className="profile-links">
              <a href={aboutData?.github_url || "https://github.com"} target="_blank" rel="noreferrer" className="profile-link">
                <div className="link-icon github">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                </div>
                GitHub
                <svg className="link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a href={aboutData?.linkedin_url || "https://linkedin.com"} target="_blank" rel="noreferrer" className="profile-link">
                <div className="link-icon linkedin">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </div>
                LinkedIn
                <svg className="link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a href={aboutData?.instagram_url || "https://www.instagram.com/paul_estrella10/"} target="_blank" rel="noreferrer" className="profile-link">
                <div className="link-icon instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.353 2.615 6.77 6.978 6.97 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.351-.2 6.77-2.618 6.97-6.97.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.353-2.615-6.77-6.97-6.97C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </div>
                Instagram
                <svg className="link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a href={aboutData?.whatsapp_url || "https://wa.me/"} target="_blank" rel="noreferrer" className="profile-link">
                <div className="link-icon whatsapp">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.871 11.871 0 005.715 1.472h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </div>
                WhatsApp
                <svg className="link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>

              {aboutData?.twitter_url && (
                <a href={aboutData.twitter_url} target="_blank" rel="noreferrer" className="profile-link">
                  <div className="link-icon twitter">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </div>
                  Twitter / X
                </a>
              )}

              {aboutData?.youtube_url && (
                <a href={aboutData.youtube_url} target="_blank" rel="noreferrer" className="profile-link">
                  <div className="link-icon youtube">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </div>
                  YouTube
                </a>
              )}

              {aboutData?.tiktok_url && (
                <a href={aboutData.tiktok_url} target="_blank" rel="noreferrer" className="profile-link">
                  <div className="link-icon tiktok">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.3-.85.51-1.44 1.43-1.58 2.41-.09.7-.01 1.4.22 2.06.45 1.09 1.45 1.9 2.6 2.1 1.1.23 2.34-.04 3.2-.8.95-.82 1.48-2.01 1.54-3.27.01-3.89 0-7.78.02-11.67z"/></svg>
                  </div>
                  TikTok
                </a>
              )}

              {aboutData?.facebook_url && (
                <a href={aboutData.facebook_url} target="_blank" rel="noreferrer" className="profile-link">
                  <div className="link-icon facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  Facebook
                </a>
              )}
            </div>
          </div>

          {/* Story Card */}
          <div className="about-card card-main">
            <div className="card-glow"></div>
            <h3>{storyTitle}</h3>
            <div className="card-content">
              <p>{storyText}</p>
            </div>
          </div>

          {/* Philosophy Card */}
          <div className="about-card card-values">
            <div className="card-glow"></div>
            <h3>{t('about.cards.values.title')}</h3>
            <ul className="values-list">
              <li>
                <div className="value-icon performance">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
                <div>
                  <strong>{t('about.cards.values.v1_title')}</strong>
                  <p>{t('about.cards.values.v1_desc')}</p>
                </div>
              </li>
              <li>
                <div className="value-icon design">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2v20"></path>
                    <path d="M2 12h20"></path>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <div>
                  <strong>{t('about.cards.values.v2_title')}</strong>
                  <p>{t('about.cards.values.v2_desc')}</p>
                </div>
              </li>
              <li>
                <div className="value-icon user">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <strong>{t('about.cards.values.v3_title')}</strong>
                  <p>{t('about.cards.values.v3_desc')}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Tech Stack Card */}
          <div className="about-card card-skills">
            <div className="card-glow"></div>
            <h3>{t('about.cards.skills.title')}</h3>
            <div className="skills-tags">
              {parsedSkills.map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div className="about-card card-stats">
            <div className="card-glow"></div>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">5+</span>
                <span className="stat-label">{t('about.cards.stats.projects_label')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">9</span>
                <span className="stat-label">{t('about.cards.stats.tech_label')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">{t('about.cards.stats.reliability_label')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
