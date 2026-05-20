import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import i18n from '../i18n';
import { AlertCircle, Code2, Target, Lightbulb, Zap } from 'lucide-react';

import ProjectNavigation from '../components/sections/ProjectNavigation';
import ProjectHero from '../components/sections/ProjectHero';
import ProjectTechStack from '../components/sections/ProjectTechStack';
import ProjectGallery from '../components/sections/ProjectGallery';
import ProjectContentGrid from '../components/sections/ProjectContentGrid';
import ProjectFooter from '../components/sections/ProjectFooter';

const safeParseArray = (data) => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
  return [];
};

const ProjectSkeleton = () => (
  <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] font-sans flex flex-col items-center justify-center" aria-label="Loading project details">
    <div className="animate-pulse w-full max-w-4xl mx-auto flex flex-col items-center px-6">
      <div className="h-5 w-28 bg-white/[0.04] rounded-full mb-10" />
      <div className="h-14 md:h-20 w-4/5 bg-white/[0.04] rounded-2xl mb-6" />
      <div className="h-5 w-2/3 bg-white/[0.03] rounded-lg mb-4" />
      <div className="h-5 w-1/2 bg-white/[0.03] rounded-lg mb-12" />
      <div className="flex gap-3 mb-16">
        <div className="h-8 w-20 bg-white/[0.03] rounded-lg" />
        <div className="h-8 w-24 bg-white/[0.03] rounded-lg" />
        <div className="h-8 w-16 bg-white/[0.03] rounded-lg" />
      </div>
    </div>
  </div>
);

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/projects/${id}`);
        if (!response.ok) throw new Error('Project not found or API error.');
        const data = await response.json();
        setProject({
          ...data,
          tags: data.technologies ? data.technologies.split(',').map(s => s.trim()) : safeParseArray(data.tags),
          gallery: safeParseArray(data.gallery),
        });
      } catch (err) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleGoBack = useCallback(() => navigate(-1), [navigate]);
  const isEs = useMemo(() => i18n.language ? i18n.language.startsWith('es') : false, [i18n.language]);

  const { title, desc, overview, problem, solution, learnings, gallery, tags } = useMemo(() => {
    if (!project) return {};
    return {
      title: isEs ? project.title_es : project.title_en,
      desc: isEs ? project.description_es : project.description_en,
      overview: isEs ? project.overview_es : project.overview_en,
      problem: isEs ? project.problem_es : project.problem_en,
      solution: isEs ? project.solution_es : project.solution_en,
      learnings: isEs ? project.learnings_es : project.learnings_en,
      gallery: Array.isArray(project.gallery) ? project.gallery : [],
      tags: Array.isArray(project.tags) ? project.tags : [],
    };
  }, [project, isEs]);

  const sections = useMemo(() => [
    { key: 'overview', label: 'Overview', content: overview, icon: Code2, color: 'text-green-400', borderColor: 'border-green-400', bg: 'bg-green-500/10' },
    { key: 'problem', label: 'Challenge', content: problem, icon: Target, color: 'text-amber-400', borderColor: 'border-amber-400', bg: 'bg-amber-500/10' },
    { key: 'solution', label: 'Solution', content: solution, icon: Lightbulb, color: 'text-blue-400', borderColor: 'border-blue-400', bg: 'bg-blue-500/10' },
    { key: 'learnings', label: 'Learnings', content: learnings, icon: Zap, color: 'text-purple-400', borderColor: 'border-purple-400', bg: 'bg-purple-500/10' },
  ].filter(s => s.content), [overview, problem, solution, learnings]);

  if (loading) return <ProjectSkeleton />;

  if (error || !project) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-[#fafafa] font-sans p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-6">
        <AlertCircle className="w-7 h-7 text-neutral-600" />
      </div>
      <h2 className="text-xl font-bold mb-2 text-white">{isEs ? 'Proyecto no encontrado' : 'Project Not Found'}</h2>
      <p className="text-neutral-500 mb-8 max-w-sm text-sm leading-relaxed">{error || (isEs ? 'El proyecto solicitado no se pudo encontrar.' : 'The requested project could not be found.')}</p>
      <button onClick={handleGoBack} className="h-10 px-6 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white font-semibold text-sm transition-all duration-300">
        {isEs ? '← Volver' : '← Go Back'}
      </button>
    </div>
  );

  return (
    <HelmetProvider>
      <div 
        className="min-h-screen bg-[#0a0a0a] text-[#fafafa] font-sans selection:bg-[var(--sel-color)]/30 selection:text-white"
        style={{ '--sel-color': project?.color || '#22c55e' }}
      >

        <Helmet>
          <title>{title ? `${title} – Paul Gonzalez` : 'Project Details'}</title>
          <meta name="description" content={desc || 'Detailed view of the project.'} />
        </Helmet>

        <ProjectNavigation handleGoBack={handleGoBack} project={project} isEs={isEs} t={t} color={project?.color} />
        <ProjectHero title={title} desc={desc} tags={tags} color={project?.color} />
        <ProjectTechStack tags={tags} color={project?.color} />
        <ProjectGallery gallery={gallery} title={title} color={project?.color} />
        <ProjectContentGrid sections={sections} color={project?.color} />
        <ProjectFooter handleGoBack={handleGoBack} isEs={isEs} color={project?.color} />
      </div>
    </HelmetProvider>
  );
}
