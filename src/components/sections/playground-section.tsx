"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import BracketButton from "@/components/ui/bracket-button";
const EXPERIMENTS = [
  {
    id: "01",
    title: "KINETIC TYPE",
    description: "Experimental exploration of variable fonts and motion paths.",
    tag: "Motion"
  },
  {
    id: "02",
    title: "NOISE FIELDS",
    description: "Perlin noise generated flow fields for background textures.",
    tag: "Generative"
  },
  {
    id: "03",
    title: "GLITCH UI",
    description: "Reactive components that respond to cursor proximity with visual distortion.",
    tag: "Interactive"
  },
  {
    id: "04",
    title: "SHADOW BOXING",
    description: "Dynamic shadow casting systems based on viewport light sources.",
    tag: "Visuals"
  }
];

export default function PlaygroundSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeMobileIdx, setActiveMobileIdx] = useState<number | null>(null);
  const [targetIdx, setTargetIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  // Helper to find the current target based on 30% bottom threshold
  const getTargetIdx = () => {
    if (!sectionRef.current) return -1;
    const items = sectionRef.current.querySelectorAll('[data-playground-item]');
    const thresholdLine = window.innerHeight * 0.7;
    const leaveLine = 0; // Top of viewport
    let tIdx = -1;

    items.forEach((item, idx) => {
      const rect = item.getBoundingClientRect();
      // Active if top crossed 70% line AND bottom hasn't left viewport top
      if (rect.top < thresholdLine && rect.bottom > leaveLine) {
        tIdx = idx;
      }
    });

    return tIdx;
  };

  // Update targetIdx on scroll
  useMotionValueEvent(scrollY, "change", () => {
    if (typeof window === "undefined" || window.innerWidth >= 768) return;
    const newTarget = getTargetIdx();
    if (newTarget !== -1) {
      setTargetIdx(newTarget);
    }
  });

  // Sequential catch-up effect for exclusive boolean highlights
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 768 || targetIdx === null) return;
    
    const current = activeMobileIdx ?? -1;

    // IMMEDIATE GATING: If we're out of the section, clear instantly
    if (targetIdx === -1) {
      setActiveMobileIdx(null);
      return;
    }

    if (targetIdx !== current) {
      const timeout = setTimeout(() => {
        if (targetIdx > current) {
          setActiveMobileIdx(current + 1);
        } else if (targetIdx < current) {
          setActiveMobileIdx(current - 1);
        }
      }, 250); // Increased delay for a smoother sequence
      return () => clearTimeout(timeout);
    }
  }, [activeMobileIdx, targetIdx]);

  return (
    <section ref={sectionRef} className="relative w-full py-32 bg-white text-black overflow-hidden selection:bg-[#0066FF] selection:text-white light-bg-nav-trigger">
      {/* Background Grid - consistent with playground */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-black top-[15%]" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-black top-[45%]" />
        <div className="absolute top-0 left-[15%] w-[1px] h-full bg-black" />
        <div className="absolute top-0 left-[85%] w-[1px] h-full bg-black" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-[#0066FF]" />
            <span className="text-[12px] font-bold tracking-[0.5em] uppercase opacity-40">
              LAB_RESEARCH_v1.0
            </span>
          </div>
          <h2 
            className="text-[clamp(60px,12vw,180px)] leading-[0.8] font-[900] uppercase tracking-[-0.04em]"
            style={{ fontFamily: 'var(--font-post-no-bills)' }}
          >
            PLAYGROUND
          </h2>
        </div>

        {/* Experiments Grid - Exactly same as playground page */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] bg-black/5 border border-black/5">
          {EXPERIMENTS.map((exp, idx) => {
            const isItemActive = hoveredIdx === idx || (activeMobileIdx === idx && typeof window !== "undefined" && window.innerWidth < 768);
            
            return (
              <motion.div
                key={exp.id}
                data-playground-item
                className="group relative bg-white p-12 transition-all duration-500 overflow-hidden cursor-crosshair"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * idx }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Boolean-Based Blue Highlight — smoother animation */}
                <motion.div 
                  className="absolute inset-0 bg-[#0066FF] origin-bottom pointer-events-none" 
                  initial={false}
                  animate={{ scaleY: isItemActive ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: "bottom" }}
                />
                
                <div className="relative z-10 flex flex-col h-full min-h-[320px]">
                  <div className="flex justify-between items-start mb-auto">
                    <span className={`text-[12px] font-mono font-bold tracking-widest transition-colors duration-500 ${isItemActive ? 'text-white' : 'opacity-20'}`}>
                      [{exp.id}]
                    </span>
                    <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border transition-all duration-500 ${isItemActive ? 'bg-white text-[#0066FF] border-white' : 'border-black/10 opacity-40'}`}>
                      {exp.tag}
                    </div>
                  </div>
  
                  <div className="mt-12">
                    <h3 className={`text-[48px] md:text-[64px] font-[950] leading-none mb-4 transition-colors duration-500 ${isItemActive ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'var(--font-post-no-bills)' }}>
                      {exp.title}
                    </h3>
                    <p className={`text-[16px] max-w-xs leading-relaxed transition-colors duration-500 ${isItemActive ? 'text-white/80' : 'opacity-50'}`}>
                      {exp.description}
                    </p>
                  </div>
                  
                  <div className="mt-12 flex items-center gap-3">
                     <div className={`w-8 h-[2px] transition-all duration-500 ${isItemActive ? 'bg-white' : 'bg-[#0066FF]'}`} />
                     <span className={`text-[12px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isItemActive ? 'text-white' : 'text-black'}`}>
                       LAUNCH_EXP
                     </span>
                     <ArrowUpRight size={16} className={`transition-all duration-500 ${isItemActive ? 'text-white translate-x-1 -translate-y-1' : 'opacity-20'}`} />
                  </div>
                </div>
  
                {/* Decorative Corner Lines */}
                <div className={`absolute top-0 right-0 w-24 h-[1px] bg-white transform transition-transform duration-700 ${isItemActive ? 'translate-x-0' : 'translate-x-full'}`} />
                <div className={`absolute top-0 right-0 h-24 w-[1px] bg-white transform transition-transform duration-700 ${isItemActive ? 'translate-y-0' : '-translate-y-full'}`} />
              </motion.div>
            );
          })}
        </div>

        {/* View All Lab Activity */}
        <div className="mt-20 flex justify-end">
          <BracketButton 
            href="/playground" 
            color="white" 
            initialBgColor="#000000" 
            borderColor="#0066FF"
            hoverBorderColor="#000000"
          >
            View All Activity
          </BracketButton>
        </div>

        {/* Technical Stats Footer */}
        <div className="mt-32 pt-8 flex flex-wrap justify-between gap-12 opacity-20 text-[10px] font-mono uppercase tracking-[0.3em]">
          <div className="flex gap-12">
            <div>CORE: CONCEPT_ENGINE</div>
            <div>STATUS: LOADED</div>
          </div>
          <div>{new Date().getFullYear()}.RESEARCH</div>
        </div>
      </div>
    </section>
  );
}
