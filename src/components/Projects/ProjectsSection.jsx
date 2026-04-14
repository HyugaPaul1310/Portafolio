import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import './Projects.css';

export default function ProjectsSection() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/projects')
      .then(res => res.json())
      .then(data => {
        // Parse JSON strings back to arrays just in case they come as strings
        const formattedData = data.map(p => ({
          ...p,
          tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
          gallery: typeof p.gallery === 'string' ? JSON.parse(p.gallery) : p.gallery
        }));
        setProjects(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      });
  }, []);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const goNext = useCallback(() => {
    if (projects.length === 0) return;
    goTo((currentIndex + 1) % projects.length);
  }, [currentIndex, goTo, projects.length]);

  const goPrev = useCallback(() => {
    if (projects.length === 0) return;
    goTo((currentIndex - 1 + projects.length) % projects.length);
  }, [currentIndex, goTo, projects.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Drag / swipe support
  const dragStartX = useRef(0);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const handleDragStart = (clientX) => {
    dragStartX.current = clientX;
    isDraggingRef.current = true;
    setIsDragging(true);
  }

  const handleDragMove = (clientX) => {
    if (!isDraggingRef.current) return;
    setDragOffset(clientX - dragStartX.current);
  }

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    // sensitivity
    const sensitivity = 80;
    const steps = Math.round(dragOffset / sensitivity);

    if (steps !== 0 && projects.length > 0) {
      setCurrentIndex((prev) => {
        let newIndex = prev - steps;
        return ((newIndex % projects.length) + projects.length) % projects.length;
      });
    }

    setDragOffset(0);
  }

  const onMouseDown = (e) => handleDragStart(e.clientX);
  const onMouseMove = (e) => handleDragMove(e.clientX);
  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => handleDragEnd();

  const onTouchStart = (e) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleDragMove(e.touches[0].clientX);
  const onTouchEnd = () => handleDragEnd();

  const getPosition = (index) => {
    let diff = (index - currentIndex) + (dragOffset / 80);
    const max = projects.length;
    const limit = max / 2;
    diff = ((diff + limit) % max + max) % max - limit;
    return diff;
  }

  return (
    <section className="projects-section" id="projects">
      <div className="projects-bg-effects">
        <div className="projects-orb projects-orb-1"></div>
        <div className="projects-orb projects-orb-2"></div>
        <div className="projects-particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`,
                '--size': `${Math.random() * 3 + 1}px`,
                '--duration': `${Math.random() * 4 + 3}s`,
                '--delay': `${Math.random() * 5}s`,
                '--opacity': Math.random() * 0.4 + 0.1,
              }}
            />
          ))}
        </div>
      </div>

      <header className="projects-header">
        <p className="section-label">{t('projects.label')}</p>
        <h2 className="section-title">{t('projects.title')}</h2>
        <p className="section-desc">{t('projects.desc')}</p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>Cargando proyectos...</div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>No hay proyectos disponibles.</div>
      ) : (
        <div className="carousel-wrapper">
        <div
          className="carousel-stage"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              position={getPosition(index)}
              isDragging={isDragging}
              onViewDetails={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}

        <div className="carousel-controls">
          <button className="carousel-arrow carousel-prev" onClick={goPrev} aria-label="Previous project">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <div className="carousel-pagination">
            <span className="page-current">{String(currentIndex + 1).padStart(2, '0')}</span>
            <div className="page-dots">
              {projects.map((_, i) => (
                <button
                  key={i}
                  className={`page-dot ${i === currentIndex ? 'active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to project ${i + 1}`}
                />
              ))}
            </div>
            <span className="page-total">/ {String(projects.length).padStart(2, '0')}</span>
          </div>

          <button className="carousel-arrow carousel-next" onClick={goNext} aria-label="Next project">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
        </div>
      )}
    </section>
  );
}
