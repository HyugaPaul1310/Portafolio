import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import './Projects.css';

export default function ProjectCard({ project, position, isDragging, onViewDetails }) {
  const { t } = useTranslation();
  const absPos = Math.abs(position);

  // Continuous interpolated values
  const scale = Math.max(0.7, 1 - absPos * 0.15);
  const opacity = Math.max(0, 1 - absPos * 0.45);
  const blur = Math.min(4, absPos * 2);
  const zIndex = 100 - Math.round(absPos * 10);

  // Subtle shadow only when near center
  const isActive = absPos < 0.5;

  return (
    <div
      className={`carousel-card ${isActive ? 'active' : ''}`}
      style={{
        '--offset': position,
        '--card-color': project.color,
        '--scale': scale,
        '--opacity': opacity,
        '--blur': `${blur}px`,
        zIndex: zIndex,
        transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <div className="card-image">
        {project.gallery && project.gallery.length > 0 ? (
          <img 
            src={project.gallery[0]} 
            alt={i18n.language.startsWith('es') ? project.title_es : project.title_en}
            className="card-cover-img"
          />
        ) : (
          <div className="card-image-placeholder" style={{ background: `linear-gradient(135deg, ${project.color}33, ${project.color}11)` }}>
            <div className="placeholder-icon" style={{ color: project.color }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title">{i18n.language.startsWith('es') ? project.title_es : project.title_en}</h3>
        <p className="card-category">{project.category}</p>
        <div className="card-tags">
          {project.tags.map((tag, i) => (
            <span key={i} className="card-tag" style={{ borderColor: `${project.color}40`, color: project.color }}>
              {tag}
            </span>
          ))}
        </div>
        <button 
          className="card-btn" 
          style={{ background: project.color }}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(project);
          }}
        >
          {t('projects.view_details')}
        </button>
      </div>
    </div>
  );
}
