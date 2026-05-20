import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

export default function ProjectContentGrid({ sections, color }) {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const themeColor = color || '#22c55e';

  if (!sections || sections.length === 0) return null;

  return (
    <section ref={sectionRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <span 
          className="inline-block text-[10px] font-bold tracking-[0.35em] uppercase mb-3"
          style={{ color: `${themeColor}99` }} // 60% opacity
        >
          Deep Dive
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Project Scope
        </h3>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="flex flex-col lg:flex-row gap-8 lg:gap-14"
      >
        <div className="w-full lg:w-auto flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide lg:min-w-[220px] shrink-0">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={sec.key}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-3 px-4 py-3.5 lg:px-5 lg:py-4 rounded-xl text-left transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  isActive ? `bg-white/[0.08] ${sec.color} shadow-lg` : 'text-neutral-500 hover:bg-white/[0.04] hover:text-neutral-300'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${isActive ? sec.bg : 'bg-white/[0.04]'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">{sec.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 relative min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <span className="absolute -top-10 -left-4 lg:-left-8 text-[160px] lg:text-[200px] font-black text-white/[0.02] leading-none pointer-events-none select-none z-0">
                0{activeTab + 1}
              </span>
              
              <div className="relative z-10 bg-neutral-900/40 backdrop-blur-2xl border border-white/[0.06] rounded-2xl lg:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl shadow-black/20">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${sections[activeTab].bg}`}>
                    {React.createElement(sections[activeTab].icon, { className: `w-6 h-6 ${sections[activeTab].color}` })}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {sections[activeTab].label}
                  </h2>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-transparent mb-8" />

                <div className="prose prose-invert max-w-none text-neutral-300 leading-[1.85] whitespace-pre-line text-[15px] md:text-base">
                  {sections[activeTab].content}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
