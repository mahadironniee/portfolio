"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CursorBrush } from "@/components/ui/cursor-brush";
import { ArrowUpRight } from "lucide-react";

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

export default function PlaygroundPage() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen bg-white text-black pt-[180px] pb-20 px-4 md:px-8 selection:bg-[#0066FF] selection:text-white light-bg-nav-trigger overflow-hidden">
      <CursorBrush />
      
      {/* Background Grid - Intense Brutalist version */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-black top-[15%]" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-black top-[45%]" />
        <div className="absolute top-0 left-[15%] w-[1px] h-full bg-black" />
        <div className="absolute top-0 left-[85%] w-[1px] h-full bg-black" />
      </div>

      <main className="max-w-[1400px] mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-[#0066FF]" />
              <span className="text-[12px] font-bold tracking-[0.5em] uppercase opacity-40">
                LAB_ENVIRONMENT_v2.0
              </span>
            </div>
            
            <h1 
              className="text-[clamp(60px,15vw,220px)] leading-[0.8] font-[900] uppercase tracking-[-0.04em]"
              style={{ fontFamily: 'var(--font-post-no-bills)' }}
            >
              PLAY<br />GROUND
            </h1>
            
            <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <p className="max-w-md text-[18px] leading-relaxed opacity-60 font-medium">
                A digital sandbox for visual testing, experimental interactions, and raw conceptual ideas.
              </p>
              
              <div className="flex items-center gap-8 text-[10px] font-mono opacity-30 uppercase tracking-[0.2em]">
                <div>STATUS: ACTIVE</div>
                <div>CORE: REACT_FRAMEWORK</div>
                <div>RENDER: TURBOPACK</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] bg-black/5 border border-black/5">
          {EXPERIMENTS.map((exp, idx) => (
            <motion.div
              key={exp.id}
              className="group relative bg-white p-12 transition-all duration-500 overflow-hidden cursor-crosshair"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Hover Background Distortion */}
              <div className={`absolute inset-0 bg-[#0066FF] transition-transform duration-700 ease-[0.16,1,0.3,1] ${hoveredIdx === idx ? 'translate-y-0' : 'translate-y-full'}`} />
              
              <div className="relative z-10 flex flex-col h-full min-h-[320px]">
                <div className="flex justify-between items-start mb-auto">
                  <span className={`text-[12px] font-mono font-bold tracking-widest transition-colors duration-500 ${hoveredIdx === idx ? 'text-white' : 'opacity-20'}`}>
                    [{exp.id}]
                  </span>
                  <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border transition-all duration-500 ${hoveredIdx === idx ? 'bg-white text-[#0066FF] border-white' : 'border-black/10 opacity-40'}`}>
                    {exp.tag}
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className={`text-[48px] md:text-[64px] font-[950] leading-none mb-4 transition-colors duration-500 ${hoveredIdx === idx ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'var(--font-post-no-bills)' }}>
                    {exp.title}
                  </h3>
                  <p className={`text-[16px] max-w-xs leading-relaxed transition-colors duration-500 ${hoveredIdx === idx ? 'text-white/80' : 'opacity-50'}`}>
                    {exp.description}
                  </p>
                </div>
                
                <div className="mt-12 flex items-center gap-3">
                   <div className={`w-8 h-[2px] transition-all duration-500 ${hoveredIdx === idx ? 'bg-white' : 'bg-[#0066FF]'}`} />
                   <span className={`text-[12px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${hoveredIdx === idx ? 'text-white' : 'text-black'}`}>
                     LAUNCH_EXP
                   </span>
                   <ArrowUpRight size={16} className={`transition-all duration-500 ${hoveredIdx === idx ? 'text-white translate-x-1 -translate-y-1' : 'opacity-20'}`} />
                </div>
              </div>

              {/* Decorative Corner Lines */}
              <div className={`absolute top-0 right-0 w-24 h-[1px] bg-white transform translate-x-full transition-transform duration-700 ${hoveredIdx === idx ? 'translate-x-0' : ''}`} />
              <div className={`absolute top-0 right-0 h-24 w-[1px] bg-white transform -translate-y-full transition-transform duration-700 ${hoveredIdx === idx ? 'translate-y-0' : ''}`} />
            </motion.div>
          ))}
        </div>

        {/* Footer Technical Stats */}
        <div className="mt-32 pt-8 border-t border-black/5 flex flex-wrap justify-between gap-12 opacity-20 text-[10px] font-mono uppercase tracking-[0.3em]">
          <div className="flex gap-12">
            <div>MEM_ALLOC: 256MB</div>
            <div>THREAD_01: RUNNING</div>
            <div>SECURE_LAYER: SSL_ENC</div>
          </div>
          <div>EST_SYNC: {new Date().getFullYear()}.03.29.04.12</div>
        </div>
      </main>
    </div>
  );
}
