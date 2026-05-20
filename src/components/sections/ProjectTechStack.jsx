import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { getIconForTag } from '../../utils/techIcons';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export default function ProjectTechStack({ tags, color }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const themeColor = color || '#22c55e';

  if (!tags || tags.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 md:py-28 border-y border-white/[0.06] overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #050505 100%)' }}
    >
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none" 
        style={{ backgroundColor: themeColor, opacity: 0.05 }}
      />

      {/* Section header */}
      <div className="text-center mb-14 px-6">
        <span 
          className="inline-block text-[10px] font-bold tracking-[0.35em] uppercase mb-3"
          style={{ color: `${themeColor}99` }} // 60% opacity
        >
          Technology Stack
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Built With
        </h3>
      </div>

      {/* Centered tag grid */}
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
        >
          {tags.map((tag, i) => {
            const icon = getIconForTag(tag);
            return (
              <motion.div
                key={`tag-${i}`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                className="group relative flex items-center gap-3 bg-white/[0.03] backdrop-blur-sm border border-white/[0.07] rounded-2xl px-5 py-3.5 cursor-default transition-colors duration-300 hover:bg-white/[0.07] hover:border-white/[0.14]"
              >
                {/* Glow on hover */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ 
                    boxShadow: `0 0 30px ${themeColor}10, inset 0 0 20px ${themeColor}08` 
                  }}
                />
                {icon ? (
                  <img
                    src={icon}
                    alt={tag}
                    className="w-6 h-6 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-white/[0.06] flex items-center justify-center relative z-10">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">
                      {tag.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-sm font-semibold text-neutral-300 tracking-wide relative z-10 group-hover:text-white transition-colors duration-300">
                  {tag}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Decorative bottom line */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-px" 
        style={{ 
          background: `linear-gradient(90deg, transparent, ${themeColor}33, transparent)` // 20% opacity
        }}
      />
    </section>
  );
}
