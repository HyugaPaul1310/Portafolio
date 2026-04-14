import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ProjectModal.css';

export default function ProjectModal({ project, onClose }) {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language.startsWith('es');
  const getF = (key) => project[`${key}_${isEs ? 'es' : 'en'}`];
  const [activeImage, setActiveImage] = useState(project.gallery[0]);
  const [isZoomed, setIsZoomed] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Track project view silently
  useEffect(() => {
    if (project?.id) {
      fetch('http://localhost:3000/api/analytics/project-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: project.id })
      }).catch(() => {});
    }
  }, [project?.id]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, isZoomed]);

  if (!project) return null;

  return (
    <>
      <div className="project-modal-overlay" onClick={onClose}>
        <div 
          className="project-modal-container" 
          onClick={(e) => e.stopPropagation()}
          style={{ '--accent-color': project.color, '--accent-rgb': hexToRgb(project.color) }}
        >
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="modal-content">
            <div className="modal-gallery">
              <div 
                className="gallery-main" 
                onClick={() => setIsZoomed(true)}
                style={{ cursor: 'zoom-in' }}
                title="Click to enlarge"
              >
                <img src={activeImage} alt={project.title} />
              </div>
              <div className="gallery-thumbs">
                {project.gallery.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`gallery-thumb ${activeImage === img ? 'active' : ''}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} alt={`${project.title} view ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-info">
              <header className="modal-header">
                <span className="modal-category">{project.category}</span>
                <h2 className="modal-title">{getF('title')}</h2>
                <div className="modal-tags">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="modal-tag">{tag}</span>
                  ))}
                </div>
              </header>

              <div className="case-study-sections">
                <section className="case-study-section">
                  <h4>
                    <span className="section-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </span>
                    {t('projects.modal.overview')}
                  </h4>
                  <p>{getF('description')}</p>
                </section>

                <section className="case-study-section">
                  <h4>
                    <span className="section-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </span>
                    {t('projects.modal.problem')}
                  </h4>
                  <p>{getF('problem')}</p>
                </section>

                <section className="case-study-section">
                  <h4>
                    <span className="section-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </span>
                    {t('projects.modal.solution')}
                  </h4>
                  <p>{getF('solution')}</p>
                </section>

                <section className="case-study-section">
                  <h4>
                    <span className="section-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    </span>
                    {t('projects.modal.tech_learnings')}
                  </h4>
                  <p>{getF('learnings')}</p>
                </section>
              </div>

              <footer className="modal-footer">
                {!!project.show_website && project.website_url && (
                  <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="modal-btn modal-btn-primary">
                    {t('projects.modal.visit')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                )}
                {!!project.show_repo && project.repo_url && (
                  <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="modal-btn modal-btn-secondary">
                    {t('projects.modal.repo')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"></path>
                    </svg>
                  </a>
                )}
              </footer>
            </div>
          </div>
        </div>
      </div>

      {isZoomed && (
        <div className="image-zoom-overlay" onClick={() => setIsZoomed(false)}>
          <img src={activeImage} alt="Zoomed view" className="zoomed-image" />
        </div>
      )}
    </>
  );
}

// Helper function to convert hex to RGB for CSS variables
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '255, 255, 255';
}
