import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function ProjectNavigation({ handleGoBack, project, isEs, t, color }) {
  const btnColor = color || '#22c55e';
  return (
    <nav className="fixed top-0 inset-x-0 h-16 flex items-center justify-between px-5 md:px-10 z-50 bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/[0.04]">
      <button 
        onClick={handleGoBack}
        aria-label="Go back to projects"
        className="flex items-center gap-2.5 text-sm font-medium text-neutral-500 hover:text-white transition-all duration-300 group"
      >
        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.08] group-hover:border-white/[0.12] transition-all duration-300">
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        </div>
        <span className="hidden sm:inline">{isEs ? 'Volver' : 'Back'}</span>
      </button>
      
      <div className="flex items-center gap-3">
        {(project?.show_website == 1 || project?.show_website === true) && project?.website_url && (
          <a 
            href={project.website_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="h-9 px-5 inline-flex items-center justify-center gap-2 text-black rounded-lg font-bold text-xs hover:brightness-110 hover:shadow-lg transition-all duration-300"
            style={{ 
              backgroundColor: btnColor, 
              boxShadow: `0 10px 15px -3px ${btnColor}26` // 26 is hex for 15% opacity
            }}
          >
            {t('projects.modal.visit', 'Visit')}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        {(project?.show_repo == 1 || project?.show_repo === true) && project?.repo_url && (
          <a 
            href={project.repo_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-9 h-9 inline-flex items-center justify-center bg-white/[0.04] border border-white/[0.06] text-neutral-400 rounded-lg hover:bg-white/[0.08] hover:text-white transition-all duration-300"
            aria-label="Repository"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        )}
      </div>
    </nav>
  );
}
