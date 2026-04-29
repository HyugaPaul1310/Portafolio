import React, { memo, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

function hexToRgba(hex, alpha) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!r) return `rgba(124,58,237,${alpha})`;
  return `rgba(${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)},${alpha})`;
}

function ProjectCard({ project, onViewDetails }) {
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const title = i18n.language.startsWith('es') ? project.title_es : project.title_en;
  const description = i18n.language.startsWith('es') ? project.description_es : project.description_en;
  const color = project.color || '#7c3aed';

  const handleDemo = (e) => {
    e.stopPropagation();
    if (project.website_url) window.open(project.website_url, '_blank');
  };

  const handleRepo = (e) => {
    e.stopPropagation();
    if (project.repo_url) window.open(project.repo_url, '_blank');
  };

  // 3D tilt motion effect
  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    // Move the shine overlay
    const shine = card.querySelector('[data-shine]');
    if (shine) {
      shine.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${hexToRgba(color, 0.12)}, transparent 40%)`;
      shine.style.opacity = '1';
    }
  }, [color]);

  const handleMouseLeave = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    card.style.borderColor = 'rgba(255,255,255,0.06)';
    card.style.boxShadow = '0 4px 24px -6px rgba(0,0,0,0.5)';
    const shine = card.querySelector('[data-shine]');
    if (shine) shine.style.opacity = '0';
  }, []);

  const handleMouseEnter = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    card.style.borderColor = hexToRgba(color, 0.25);
    card.style.boxShadow = `0 20px 50px -12px ${hexToRgba(color, 0.2)}, 0 0 30px ${hexToRgba(color, 0.08)}`;
  }, [color]);

  return (
    <div
      ref={cardRef}
      className="group relative w-full bg-[#0c0c1a]/70 backdrop-blur-xl border border-white/[0.06] cursor-pointer overflow-hidden"
      style={{
        boxShadow: '0 4px 24px -6px rgba(0,0,0,0.5)',
        transition: 'transform 0.15s ease-out, box-shadow 0.4s ease, border-color 0.4s ease',
        willChange: 'transform',
        borderRadius: '16px',
      }}
      onClick={() => onViewDetails(project)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mouse-following shine overlay */}
      <div
        data-shine
        className="absolute inset-0 z-10 pointer-events-none opacity-0"
        style={{ transition: 'opacity 0.3s ease' }}
      />

      {/* Top colored accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, transition: 'opacity 0.5s ease' }}
      />

      {/* Image zone — edge to edge, no border-radius, no padding */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        {project.gallery && project.gallery.length > 0 ? (
          <img
            src={project.gallery[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#0a0a16]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-white/[0.07]">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
        )}
        {/* Gradient overlay from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c1a] via-[#0c0c1a]/30 to-transparent" />

        {/* Category badge */}
        <span
          className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-[0.08em] backdrop-blur-lg shadow-lg"
          style={{ background: hexToRgba(color, 0.75), border: `1px solid ${hexToRgba(color, 0.4)}` }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="9" height="9">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          {project.category}
        </span>
      </div>

      {/* Info zone */}
      <div className="p-5 pt-4 relative z-10 flex flex-col gap-3">
        <div>
          <h3 className="font-heading text-lg font-bold text-white mb-1.5 leading-snug group-hover:text-transparent group-hover:bg-clip-text transition-all duration-500"
            style={{ '--card-color': color }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = `linear-gradient(135deg, #fff, ${color})`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = 'none';
              e.currentTarget.style.color = '#fff';
            }}
          >
            {title}
          </h3>
          <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-2">{description}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.tags && project.tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-gray-500 transition-all duration-300 group-hover:border-white/10 group-hover:text-gray-400">
              {tag}
            </span>
          ))}
          {project.tags && project.tags.length > 4 && (
            <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-gray-600">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        {/* Buttons */}
        {(Boolean(project.show_website && project.website_url) || Boolean(project.show_repo && project.repo_url)) && (
          <div className="flex items-center gap-2 pt-3 mt-1 border-t border-white/[0.05]">
            {(project.show_website == 1 || project.show_website === true) && project.website_url && (
              <button
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-semibold transition-all duration-300 border"
                style={{
                  background: hexToRgba(color, 0.08),
                  borderColor: hexToRgba(color, 0.15),
                  color: '#d1d5db',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = hexToRgba(color, 0.18);
                  e.currentTarget.style.borderColor = hexToRgba(color, 0.35);
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = hexToRgba(color, 0.08);
                  e.currentTarget.style.borderColor = hexToRgba(color, 0.15);
                  e.currentTarget.style.color = '#d1d5db';
                }}
                onClick={handleDemo}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                {t('projects.modal.visit')}
              </button>
            )}
            {(project.show_repo == 1 || project.show_repo === true) && project.repo_url && (
              <button
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-gray-500 hover:text-white transition-all duration-300 border border-white/[0.06] hover:border-white/[0.12]"
                onClick={handleRepo}
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ProjectCard);
