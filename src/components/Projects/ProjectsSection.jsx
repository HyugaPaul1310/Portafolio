import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

export default function ProjectsSection() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const particles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: `${Math.random() * 3 + 1}px`,
    duration: `${Math.random() * 4 + 3}s`,
    delay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.4 + 0.1,
  })), []);

  useEffect(() => {
    fetch('http://localhost:3000/api/projects')
      .then(res => res.json())
      .then(data => {
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

  const categories = useMemo(() => {
    const cats = projects.map(p => p.category);
    return ['All', ...new Set(cats)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter(p => p.category === activeFilter);
  }, [projects, activeFilter]);

  return (
    <section className="relative w-full py-[120px] px-5 bg-transparent overflow-hidden" id="projects">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px] animate-pulse-slow delay-1000" />
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/40 animate-float"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                animationDuration: p.duration,
                animationDelay: p.delay,
                opacity: p.opacity,
              }}
            />
          ))}
        </div>
      </div>

      <header className="relative z-10 text-center max-w-[800px] mx-auto mb-16">
        <p className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{t('projects.label')}</p>
        <h2 className="font-heading text-[clamp(32px,5vw,56px)] font-bold text-white mb-5 leading-tight">{t('projects.title')}</h2>
        <p className="text-base text-gray-400 max-w-[600px] mx-auto leading-relaxed">{t('projects.desc')}</p>

        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full font-sans text-[13px] font-semibold transition-all duration-300 border ${activeFilter === cat ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat === 'All' ? (t('All') || 'All') : cat}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-purple-500 animate-spin" />
          <p className="text-gray-400 font-medium">{t('projects.loading') || 'Cargando proyectos...'}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-[50px] text-white">No hay proyectos disponibles.</div>
      ) : (
        <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={() => setSelectedProject(project)}
              />
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <button className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-heading font-semibold text-sm transition-all hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 group">
              {t('projects.view_all') || 'View All Projects'}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
