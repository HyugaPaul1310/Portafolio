import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function ProjectGallery({ gallery, title, color }) {
  const [activeImg, setActiveImg] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const galleryRef = useRef(null);
  const galleryInView = useInView(galleryRef, { once: true, margin: "-80px" });
  const themeColor = color || '#22c55e';

  if (!gallery || gallery.length === 0) return null;

  const nextImage = () => setActiveImg(p => (p + 1) % gallery.length);
  const prevImage = () => setActiveImg(p => (p - 1 + gallery.length) % gallery.length);

  return (
    <>
      <section ref={galleryRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32" aria-label="Project Gallery">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={galleryInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span 
            className="inline-block text-[10px] font-bold tracking-[0.35em] uppercase mb-3"
            style={{ color: `${themeColor}99` }} // 60% opacity
          >
            Visual Preview
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Gallery
          </h3>
        </motion.div>

        <motion.div 
          initial={false}
          animate={galleryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex flex-col items-center gap-6"
        >
          {/* Main image viewer */}
          <div className="group relative w-full aspect-video rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-900/50 border border-white/[0.06] shadow-2xl shadow-black/40">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={gallery[activeImg]}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full object-contain"
                alt={`${title} screenshot ${activeImg + 1}`}
                loading="lazy"
              />
            </AnimatePresence>

            {/* Image counter badge */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <span className="px-3 py-1.5 text-[11px] font-bold text-neutral-300 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                {activeImg + 1} / {gallery.length}
              </span>
              <button
                onClick={() => setIsFullscreen(true)}
                className="w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-neutral-300 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
                aria-label="View fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Navigation arrows */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/[0.08] rounded-xl flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-105 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/[0.08] rounded-xl flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-105 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/[0.04]">
                  <motion.div 
                    className="h-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${themeColor}, ${themeColor}cc)` 
                    }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${((activeImg + 1) / gallery.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {gallery.length > 1 && (
            <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-2 px-2 w-full max-w-2xl scrollbar-hide">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative flex-shrink-0 w-20 h-14 md:w-28 md:h-[72px] rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                    i === activeImg
                      ? 'opacity-100 shadow-lg'
                      : 'border-transparent opacity-30 hover:opacity-80 hover:border-white/10'
                  }`}
                  style={i === activeImg ? {
                    borderColor: themeColor,
                    boxShadow: `0 10px 15px -3px ${themeColor}26`
                  } : {}}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all z-10"
              aria-label="Close fullscreen"
            >
              ✕
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={gallery[activeImg]}
              alt={`${title} fullscreen`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
