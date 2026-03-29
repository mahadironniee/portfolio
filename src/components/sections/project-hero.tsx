"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ProjectHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-black selection:bg-[#76CA00] selection:text-black"
    >
      {/* Background Outlines (Kinetic) */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <motion.div 
            style={{ y: y1, rotate: -2 }}
            className="absolute top-1/4 -left-10 text-[20vw] font-bold whitespace-nowrap text-transparent border-text-white"
            css={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}
        >
          ARCHIVE ARCHIVE ARCHIVE
        </motion.div>
        <motion.div 
            style={{ y: y2, rotate: 2 }}
            className="absolute bottom-1/4 -right-10 text-[20vw] font-bold whitespace-nowrap text-transparent border-text-white"
            css={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}
        >
          VAULT VAULT VAULT
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-4">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
        >
          <span className="text-[#76CA00] font-mono text-xs tracking-[0.4em] uppercase mb-4">
            Curated Selection
          </span>
          <h1 className="text-[12vw] md:text-[10vw] font-bold leading-none tracking-tighter text-white" style={{ fontFamily: 'var(--font-post-no-bills)' }}>
            PROJECTS
          </h1>
        </motion.div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-md text-sm md:text-base text-gray-400 font-light leading-relaxed tracking-wide"
        >
          A fusion of design instinct and technical precision. Exploring the boundaries of brutalist aesthetics and high-performance digital physics.
        </motion.div>
      </div>

      {/* Decorative Corner Lines (Consistent with theme) */}
      <div className="absolute top-10 left-10 w-24 h-24 border-t border-l border-white/20 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-24 h-24 border-b border-r border-white/20 pointer-events-none" />

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translateX-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#76CA00] to-transparent" />
      </motion.div>

      <style jsx>{`
        .border-text-white {
          -webkit-text-stroke: 1px rgba(255,255,255,0.2);
        }
      `}</style>
    </section>
  );
}
