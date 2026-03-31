"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CursorBrush } from "@/components/ui/cursor-brush";
import BracketButton from "@/components/ui/bracket-button";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";

const SKILLS = [
  { id: "01", title: "UI/UX DESIGN", tools: "FIGMA / FRAMER / PRINCIPLE", years: "5 YRS" },
  { id: "02", title: "FRONTEND ENG", tools: "REACT / NEXT.JS / GSAP", years: "4 YRS" },
  { id: "03", title: "MOTION DESIGN", tools: "AFTER EFFECTS / LOTTIE", years: "3 YRS" },
  { id: "04", title: "DESIGN SYSTEM", tools: "TOKENS / STORYBOOK / A11Y", years: "4 YRS" },
  { id: "05", title: "PROTOTYPING", tools: "ORIGAMI / WEBGL / CANVAS", years: "3 YRS" },
];

const TIMELINE = [
  { year: "2025", role: "Lead Product Designer", company: "Freelance / Independent", type: "CURRENT" },
  { year: "2024", role: "UI Engineer & Designer", company: "Digital Studio — Remote", type: "CONTRACT" },
  { year: "2023", role: "Product Designer", company: "SaaS Platform", type: "FULL-TIME" },
  { year: "2022", role: "Junior Designer", company: "Creative Agency", type: "ENTRY" },
];

export default function AboutPage() {
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);
  const [hoveredTimeline, setHoveredTimeline] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen bg-white text-black pt-[180px] pb-20 px-4 md:px-8 selection:bg-[#0066FF] selection:text-white light-bg-nav-trigger overflow-hidden">
      <CursorBrush />

      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-black" />
        <div className="absolute top-0 left-2/4 w-[1px] h-full bg-black" />
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-black" />
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-black" />
        <div className="absolute top-2/4 left-0 w-full h-[1px] bg-black" />
        <div className="absolute top-3/4 left-0 w-full h-[1px] bg-black" />
      </div>

      <main className="max-w-[1400px] mx-auto relative z-10">

        {/* ── HEADER ── */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-[#0066FF]" />
              <span className="text-[12px] font-bold tracking-[0.5em] uppercase opacity-40">
                PROFILE_v1.0
              </span>
            </div>

            <h1
              className="text-[clamp(60px,14vw,200px)] leading-[0.85] font-[900] uppercase tracking-[-0.04em]"
              style={{ fontFamily: "var(--font-post-no-bills)" }}
            >
              ABOUT
            </h1>

            <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <p className="max-w-md text-[18px] leading-relaxed opacity-60 font-medium">
                A designer who codes and a developer who thinks in systems. Building products where brutalist clarity meets relentless technical precision.
              </p>
              <div className="flex items-center gap-8 text-[10px] font-mono opacity-30 uppercase tracking-[0.2em]">
                <div>EXP: 5+ YEARS</div>
                <div>MODE: AVAILABLE</div>
                <div>BASE: DHAKA, BD</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── SPLIT: BIO + IDENTITY ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32 lg:grid lg:grid-cols-12 lg:gap-8"
        >
          {/* Left: Bio */}
          <div className="lg:col-span-5 mb-16 lg:mb-0">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 mb-6 block">
              01 — BIO
            </span>
            <div className="space-y-6 text-[16px] leading-relaxed opacity-70 font-medium">
              <p>
                I exist at the intersection of two disciplines that most people treat as separate — design and engineering. My work is the result of that collision: intentional, fast, and brutally functional.
              </p>
              <p>
                I design in Figma by day and write TypeScript by night. I've shipped products for SaaS startups, leading creative agencies, and independent clients across the globe.
              </p>
              <p>
                The throughline? Every pixel has a reason. Every animation has a cost. I know both.
              </p>
            </div>
          </div>

          {/* Right: Stat Grid */}
          <div className="lg:col-start-7 lg:col-span-6 grid grid-cols-2 gap-[2px] bg-black/5 border border-black/5 self-start">
            {[
              { label: "PROJECTS SHIPPED", value: "40+" },
              { label: "YEARS ACTIVE",     value: "05"   },
              { label: "CLIENTS SERVED",   value: "18+"  },
              { label: "CUPS OF COFFEE",   value: "∞"    },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 group hover:bg-[#0066FF] transition-colors duration-500 cursor-default">
                <div className="text-[48px] md:text-[64px] font-[900] leading-none tracking-tighter text-black group-hover:text-white transition-colors duration-500" style={{ fontFamily: "var(--font-post-no-bills)" }}>
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-30 group-hover:opacity-60 group-hover:text-white transition-all duration-500 mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── SKILLS TABLE ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-[2px] bg-[#0066FF]" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">02 — CAPABILITIES</span>
          </div>

          <div className="flex flex-col">
            {SKILLS.map((skill, idx) => (
              <div
                key={skill.id}
                className={`group relative flex items-center gap-4 md:gap-8 py-7 border-b border-black/5 overflow-hidden cursor-crosshair transition-all duration-500 ${
                  hoveredSkill !== null && hoveredSkill !== idx ? "opacity-30" : "opacity-100"
                }`}
                onMouseEnter={() => setHoveredSkill(idx)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                {/* Blue wipe fill */}
                <div
                  className={`absolute inset-0 bg-[#0066FF] transition-transform duration-700 origin-left ${
                    hoveredSkill === idx ? "scale-x-100" : "scale-x-0"
                  }`}
                  style={{ transformOrigin: "left center" }}
                />

                <div className="relative z-10 w-full flex items-center gap-4 md:gap-8">
                  <span className={`text-[12px] font-mono font-bold tracking-widest shrink-0 transition-colors duration-500 ${hoveredSkill === idx ? "text-white" : "opacity-20"}`}>
                    [{skill.id}]
                  </span>
                  <h3
                    className={`text-[clamp(20px,3vw,48px)] font-[900] leading-none uppercase tracking-[-0.02em] flex-1 transition-colors duration-500 ${hoveredSkill === idx ? "text-white" : "text-black"}`}
                    style={{ fontFamily: "var(--font-post-no-bills)" }}
                  >
                    {skill.title}
                  </h3>
                  <div className="hidden md:flex items-center gap-6 shrink-0">
                    <span className={`text-[11px] font-mono uppercase tracking-wider transition-colors duration-500 ${hoveredSkill === idx ? "text-white/70" : "opacity-20"}`}>
                      {skill.tools}
                    </span>
                    <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border transition-all duration-500 ${hoveredSkill === idx ? "bg-white text-[#0066FF] border-white" : "border-black/10 opacity-40"}`}>
                      {skill.years}
                    </div>
                  </div>
                  <ArrowUpRight size={18} className={`shrink-0 transition-all duration-500 ${hoveredSkill === idx ? "text-white translate-x-1 -translate-y-1" : "opacity-20"}`} />
                </div>

                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-32 h-[1px] bg-white transition-transform duration-700 ${hoveredSkill === idx ? "translate-x-0" : "translate-x-full"}`} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── TIMELINE ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-[2px] bg-[#0066FF]" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">03 — EXPERIENCE LOG</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] bg-black/5 border border-black/5">
            {TIMELINE.map((item, idx) => (
              <div
                key={idx}
                className="group relative bg-white p-10 overflow-hidden cursor-default transition-all duration-500"
                onMouseEnter={() => setHoveredTimeline(idx)}
                onMouseLeave={() => setHoveredTimeline(null)}
              >
                {/* Blue fill */}
                <div className={`absolute inset-0 bg-[#0066FF] transition-transform duration-700 ${hoveredTimeline === idx ? "translate-y-0" : "translate-y-full"}`} />

                <div className="relative z-10 flex flex-col h-full min-h-[180px]">
                  <div className="flex justify-between items-start mb-auto">
                    <span className={`text-[11px] font-mono font-bold tracking-widest transition-colors duration-500 ${hoveredTimeline === idx ? "text-white" : "opacity-20"}`}>
                      {item.year}
                    </span>
                    <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border transition-all duration-500 ${hoveredTimeline === idx ? "bg-white text-[#0066FF] border-white" : "border-black/10 opacity-40"}`}>
                      {item.type}
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className={`text-[28px] md:text-[36px] font-[900] leading-none mb-3 transition-colors duration-500 ${hoveredTimeline === idx ? "text-white" : "text-black"}`} style={{ fontFamily: "var(--font-post-no-bills)" }}>
                      {item.role}
                    </h3>
                    <p className={`text-[14px] leading-relaxed transition-colors duration-500 ${hoveredTimeline === idx ? "text-white/70" : "opacity-40"}`}>
                      {item.company}
                    </p>
                  </div>
                </div>

                {/* Decorative corner lines */}
                <div className={`absolute top-0 right-0 w-16 h-[1px] bg-white transform transition-transform duration-700 ${hoveredTimeline === idx ? "translate-x-0" : "translate-x-full"}`} />
                <div className={`absolute top-0 right-0 h-16 w-[1px] bg-white transform transition-transform duration-700 ${hoveredTimeline === idx ? "translate-y-0" : "-translate-y-full"}`} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="pt-8 border-t border-black/5"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 block mb-3">04 — NEXT STEP</span>
              <p className="text-[20px] md:text-[28px] font-medium opacity-60 max-w-lg leading-tight">
                Have a project in mind? Let's open a channel and make something worth archiving.
              </p>
            </div>
            <BracketButton 
              href="/contact" 
              color="white" 
              initialBgColor="#000000"
              borderColor="#FFFFFF"
              hoverBgColor="#FFFFFF"
            >
              Transmit a Message
            </BracketButton>
          </div>
        </motion.div>

        {/* ── Technical Footer ── */}
        <div className="mt-20 pt-8 border-t border-black/5 flex flex-wrap justify-between gap-12 opacity-20 text-[10px] font-mono uppercase tracking-[0.3em]">
          <div className="flex gap-12">
            <div>SYS: MAHAD_OS_v1</div>
            <div>MODE: CREATIVE</div>
            <div>RENDER: TURBOPACK</div>
          </div>
          <div>EST_UPTIME: {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, "0")}.{String(new Date().getDate()).padStart(2, "0")}</div>
        </div>

      </main>
    </div>
  );
}
