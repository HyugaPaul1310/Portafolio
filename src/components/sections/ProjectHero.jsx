import React from 'react';
import { ArrowDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getIconForTag } from '../../utils/techIcons';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 80, damping: 20 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.06, type: "spring", stiffness: 120, damping: 14 }
  })
};

export default function ProjectHero({ title, desc, tags, color }) {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const themeColor = color || '#22c55e';

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-6 md:px-12">
      {/* Ambient glow effects */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] blur-[160px] rounded-full pointer-events-none" 
        style={{ backgroundColor: themeColor, opacity: 0.08 }}
      />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <motion.div 
        style={{ y: heroY, opacity: heroOpacity }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center mt-16"
      >
        {/* Status badge */}
        <motion.div variants={fadeUpVariants} className="mb-8">
          <span 
            className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full"
            style={{
              backgroundColor: `${themeColor}1a`, // 10% opacity
              border: `1px solid ${themeColor}33`, // 20% opacity
              color: themeColor
            }}
          >
            <span 
              className="w-1.5 h-1.5 rounded-full animate-pulse" 
              style={{ backgroundColor: themeColor }}
            />
            Project Showcase
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUpVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] leading-[0.95] mb-6"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 40%, rgba(255,255,255,0.5) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeUpVariants}
          className="text-base sm:text-lg md:text-xl text-neutral-400 leading-relaxed max-w-2xl font-light mb-10"
        >
          {desc}
        </motion.p>

        {/* Inline tags as elegant chips */}
        {tags && tags.length > 0 && (
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-wrap items-center justify-center gap-2.5 max-w-xl"
          >
            {tags.map((tag, i) => {
              const icon = getIconForTag(tag);
              return (
                <motion.span
                  key={i}
                  custom={i}
                  variants={tagVariants}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium bg-white/[0.04] border border-white/[0.08] rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 cursor-default"
                >
                  {icon && <img src={icon} alt="" className="w-3.5 h-3.5 object-contain" loading="lazy" />}
                  {tag}
                </motion.span>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 flex flex-col items-center gap-3 text-neutral-500"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold">Scroll</span>
        <div className="w-5 h-8 border border-neutral-700 rounded-full flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 rounded-full"
            style={{ backgroundColor: themeColor }}
          />
        </div>
      </motion.div>
    </div>
  );
}
