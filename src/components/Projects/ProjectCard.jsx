import React from 'react';

export default function ProjectCard({ project, position, isDragging }) {
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
        <div className="card-image-placeholder" style={{ background: `linear-gradient(135deg, ${project.color}33, ${project.color}11)` }}>
          <div className="placeholder-icon" style={{ color: project.color }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div className="placeholder-lines">
            <div className="placeholder-line" style={{ background: `${project.color}22`, width: '70%' }}></div>
            <div className="placeholder-line" style={{ background: `${project.color}18`, width: '50%' }}></div>
            <div className="placeholder-line" style={{ background: `${project.color}12`, width: '60%' }}></div>
          </div>
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{project.title}</h3>
        <p className="card-category">{project.category}</p>
        <div className="card-tags">
          {project.tags.map((tag, i) => (
            <span key={i} className="card-tag" style={{ borderColor: `${project.color}40`, color: project.color }}>
              {tag}
            </span>
          ))}
        </div>
        <button className="card-btn" style={{ background: `linear-gradient(135deg, ${project.color}, ${project.color}cc)` }}>
          View Details
        </button>
      </div>
    </div>
  );
}
