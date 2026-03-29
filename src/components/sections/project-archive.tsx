"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/components/ui/blackhole-side-projects";

export default function ProjectArchive() {
  return (
    <section className="bg-black py-20 px-4 md:px-12 selection:bg-[#76CA00] selection:text-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {PROJECTS.map((project, idx) => (
            <ProjectCard key={idx} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.215, 0.610, 0.355, 1.000] }}
      className={`group relative flex flex-col gap-6 ${index % 2 === 1 ? 'md:mt-32' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Project Image Wrapper */}
      <Link href={project.href} className="block overflow-hidden bg-zinc-900 border border-white/5 group-hover:border-[#76CA00]/30 transition-colors duration-500">
        <motion.div
           animate={{ scale: isHovered ? 1.05 : 1 }}
           transition={{ duration: 0.6, ease: "easeOut" }}
           className="relative aspect-[4/3] w-full"
        >
          <Image
            src={project.src}
            alt={project.alt}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          
          {/* Hover Overlay Overlay (Kinetic) */}
          <div className="absolute inset-0 bg-[#76CA00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* Subtle Scanning Line Reveal */}
          <motion.div 
            initial={{ top: "-100%" }}
            whileHover={{ top: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-[#76CA00]/30 z-20 pointer-events-none shadow-[0_0_15px_rgba(118,202,0,0.4)]" 
          />
        </motion.div>
      </Link>

      {/* Metadata & Title */}
      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center gap-4 text-[10px] md:text-xs font-mono tracking-widest text-[#76CA00] uppercase mb-1">
          <span>0{index + 1}</span>
          <span className="w-8 h-[1px] bg-[#76CA00]/30" />
          <span>YEAR 2025</span>
          <span className="w-8 h-[1px] bg-[#76CA00]/30" />
          <span>PRODUCT DESIGN</span>
        </div>
        
        <div className="flex justify-between items-end">
            <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-white group-hover:text-[#76CA00] transition-colors duration-300" style={{ fontFamily: 'var(--font-post-no-bills)' }}>
            {project.alt}
            </h3>
            
            <Link href={project.href} className="group/link flex items-center gap-2 mb-2 pr-2 overflow-hidden group-hover:pr-0 transition-all duration-300">
                <span className="text-[10px] font-mono tracking-widest text-white/40 group-hover/link:text-[#76CA00] uppercase translate-x-10 group-hover/link:translate-x-0 transition-transform duration-300">View Prototype</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/40 group-hover/link:text-[#76CA00] transition-colors">
                    <path d="M3.5 11.5L11.5 3.5M11.5 3.5H3.5M11.5 3.5V11.5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            </Link>
        </div>

        <p className="max-w-md text-sm md:text-base text-gray-500 font-light leading-relaxed tracking-wide group-hover:text-gray-300 transition-colors">
          {project.desc}
        </p>
      </div>

      {/* Hover Background Accent */}
      <div className="absolute -inset-10 bg-[#76CA00]/[0.02] scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 -z-10 blur-3xl pointer-events-none" />
    </motion.div>
  );
}
