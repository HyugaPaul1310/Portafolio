import React from 'react';
import { motion } from 'framer-motion';

export default function ProjectFooter({ handleGoBack, isEs, color }) {
  const themeColor = color || '#22c55e';
  return (
    <footer className="relative border-t border-white/[0.04] py-16 md:py-20 px-6 overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] blur-[150px] rounded-full pointer-events-none" 
        style={{ backgroundColor: themeColor, opacity: 0.05 }}
      />

      <div className="max-w-3xl mx-auto flex flex-col items-center text-center relative z-10">
        <span 
          className="inline-block text-[10px] font-bold tracking-[0.35em] uppercase mb-4"
          style={{ color: `${themeColor}99` }} // 60% opacity
        >
          What&apos;s Next
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
          {isEs ? '¿Listo para algo increíble?' : 'Ready to build something amazing?'}
        </h2>
        <p className="text-neutral-500 text-sm mb-10 max-w-md">
          {isEs ? 'Explora más proyectos y descubre lo que podemos crear juntos.' : 'Explore more projects and discover what we can build together.'}
        </p>
        <motion.button
          onClick={handleGoBack}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-7 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.15] text-white font-semibold text-sm transition-all duration-300 mb-14"
        >
          {isEs ? '← Explorar más proyectos' : '← Explore more projects'}
        </motion.button>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-8" />

        <p className="text-neutral-600 text-xs font-medium tracking-wide">
          © {new Date().getFullYear()} Paul Gonzalez. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
