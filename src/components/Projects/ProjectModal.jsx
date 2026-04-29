import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ProjectModal.css';

export default function ProjectModal({ project, onClose }) {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language.startsWith('es');
  const getF = (key) => project[`${key}_${isEs ? 'es' : 'en'}`];
  const [activeIdx, setActiveIdx] = useState(0);
  const activeImage = project.gallery[activeIdx];
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % project.gallery.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + project.gallery.length) % project.gallery.length);
  };

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // Track view
  useEffect(() => {
    if (project?.id) {
      fetch('http://localhost:3000/api/analytics/project-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: project.id })
      }).catch(() => {});
    }
  }, [project?.id]);

  // Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (isZoomed) setIsZoomed(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, isZoomed]);

  if (!project) return null;

  const sections = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      ),
      label: t('projects.modal.overview'),
      text: getF('description'),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      ),
      label: t('projects.modal.problem'),
      text: getF('problem'),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      label: t('projects.modal.solution'),
      text: getF('solution'),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
      label: t('projects.modal.tech_learnings'),
      text: getF('learnings'),
    },
  ];

  return (
    <>
      <div className="pm-overlay" onClick={onClose}>
        <div
          className="pm-container"
          onClick={(e) => e.stopPropagation()}
          style={{ '--accent': project.color || '#a855f7', '--accent-rgb': hexToRgb(project.color) }}
        >
          {/* ── Top bar ── */}
          <div className="pm-topbar">
            <div className="pm-topbar-left">
              {project.category && (
                <span className="pm-category-badge">{project.category}</span>
              )}
              {project.date && (
                <span className="pm-meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {project.date.split(' ').pop()}
                </span>
              )}
              {project.team && (
                <span className="pm-meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  {isEs ? 'Equipo de desarrollo' : 'Development team'}
                </span>
              )}
            </div>
            <button className="pm-close" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* ── Body ── */}
          <div className="pm-body">
            {/* Left — gallery */}
            <div className="pm-gallery">
              <div
                className="pm-gallery-main"
                onClick={() => setIsZoomed(true)}
                title="Click to enlarge"
              >
                <img src={activeImage} alt={project.title} />
                
                <button className="pm-nav-btn pm-nav-prev" onClick={prevImage} aria-label="Previous image">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button className="pm-nav-btn pm-nav-next" onClick={nextImage} aria-label="Next image">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>

                <div className="pm-gallery-counter">
                  {activeIdx + 1} / {project.gallery.length}
                </div>
                <div className="pm-gallery-zoom-hint">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
              </div>

              <div className="pm-thumbs">
                {project.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    className={`pm-thumb ${activeIdx === idx ? 'active' : ''}`}
                    onClick={() => setActiveIdx(idx)}
                  >
                    <img src={img} alt={`View ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right — info */}
            <div className="pm-info">
              <div className="pm-info-header">
                <h2 className="pm-title">{getF('title') || project.title}</h2>
                <p className="pm-description">{getF('description')}</p>

                {project.tags?.length > 0 && (
                  <div className="pm-tags-section">
                    <span className="pm-tags-label">
                      {isEs ? 'TECNOLOGÍAS' : 'TECHNOLOGIES'}
                    </span>
                    <div className="pm-tags">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="pm-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Case study cards */}
              <div className="pm-sections">
                {sections.filter(s => s.text).map((sec, i) => (
                  <div key={i} className="pm-section-card">
                    <div className="pm-section-icon">{sec.icon}</div>
                    <div className="pm-section-body">
                      <h4 className="pm-section-title">{sec.label}</h4>
                      <p className="pm-section-text">{sec.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer buttons */}
              <div className="pm-footer">
                {!!project.show_website && project.website_url && (
                  <a
                    href={project.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pm-btn pm-btn-primary"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    {t('projects.modal.visit')}
                  </a>
                )}
                {!!project.show_repo && project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pm-btn pm-btn-secondary"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"></path>
                    </svg>
                    {t('projects.modal.repo')}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {isZoomed && (
        <div className="pm-lightbox" onClick={() => setIsZoomed(false)}>
          <img src={activeImage} alt="Zoomed view" className="pm-lightbox-img" />
          <button className="pm-lightbox-close" onClick={() => setIsZoomed(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '168, 85, 247';
}
