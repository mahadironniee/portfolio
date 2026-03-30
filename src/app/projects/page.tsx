"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CursorBrush } from "@/components/ui/cursor-brush";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/components/ui/blackhole-side-projects";

const CATEGORIES = ["ALL", "PRODUCT", "BRANDING", "MOTION", "3D"];

export default function ProjectsPage() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("ALL");

  const displayProjects = PROJECTS.map((p, i) => ({
    ...p,
    index: String(i + 1).padStart(2, "0"),
    year: [2025, 2024, 2024, 2023, 2023, 2022, 2022][i] ?? 2024,
    category: ["PRODUCT", "BRANDING", "MOTION", "PRODUCT", "3D", "BRANDING", "MOTION"][i] ?? "PRODUCT",
    role: ["Lead Designer", "Brand Architect", "Motion Director", "UI Engineer", "3D Artist", "Creative Director", "UX Researcher"][i] ?? "Designer",
  }));

  const filtered = activeCategory === "ALL" ? displayProjects : displayProjects.filter(p => p.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-white text-black pt-[180px] pb-20 px-4 md:px-8 selection:bg-[#0066FF] selection:text-white light-bg-nav-trigger overflow-hidden">
      <CursorBrush />

      {/* Background Grid — consistent with playground/contact */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-black" />
        <div className="absolute top-0 left-2/4 w-[1px] h-full bg-black" />
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-black" />
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-black" />
        <div className="absolute top-2/4 left-0 w-full h-[1px] bg-black" />
        <div className="absolute top-3/4 left-0 w-full h-[1px] bg-black" />
      </div>

      <main className="relative z-10 w-full">

        {/* ── Header ── */}
        <div className="max-w-[1400px] mx-auto mb-24 px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-[#0066FF]" />
              <span className="text-[12px] font-bold tracking-[0.5em] uppercase opacity-40">
                SELECTED_WORKS_{new Date().getFullYear()}
              </span>
            </div>

            <h1
              className="text-[clamp(60px,14vw,200px)] leading-[0.85] font-[900] uppercase tracking-[-0.04em]"
              style={{ fontFamily: "var(--font-post-no-bills)" }}
            >
              PROJECTS
            </h1>

            <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <p className="max-w-md text-[18px] leading-relaxed opacity-60 font-medium">
                A curated archive of design-led products. Each project is a collision of strategy, craft, and relentless attention to digital detail.
              </p>

              <div className="flex items-center gap-8 text-[10px] font-mono opacity-30 uppercase tracking-[0.2em]">
                <div>TOTAL: {PROJECTS.length.toString().padStart(2, "0")}</div>
                <div>STACK: REACT / FIGMA</div>
                <div>STATUS: AVAILABLE</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Category Filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center gap-2 mb-16 pb-6 border-b border-black/5 overflow-x-auto no-scrollbar"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-[11px] font-bold uppercase tracking-[0.3em] border transition-all duration-300 whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#0066FF] text-white border-[#0066FF]"
                  : "bg-transparent text-black border-black/10 hover:border-black/30"
              }`}
            >
              {cat}
            </button>
          ))}
          <div className="flex-1" />
          <span className="text-[10px] font-mono opacity-20 uppercase tracking-widest hidden md:block">
            {filtered.length.toString().padStart(2, "0")} results
          </span>
        </motion.div>

        {/* ── Project List ── */}
        <div className="flex flex-col">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => (
              <motion.div
                key={project.alt}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectRow
                  project={project}
                  isHovered={hoveredIdx === idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  isAnyHovered={hoveredIdx !== null}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Footer Technical Stats (still centered) ── */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="mt-32 pt-8 border-t border-black/5 flex flex-wrap justify-between gap-12 opacity-20 text-[10px] font-mono uppercase tracking-[0.3em]">
            <div className="flex gap-12">
              <div>ARCHIVE: COMPLETE</div>
              <div>RENDER: TURBOPACK</div>
              <div>SECURE_LAYER: SSL_ENC</div>
            </div>
            <div>LAST_SYNC: {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, "0")}.{String(new Date().getDate()).padStart(2, "0")}</div>
          </div>
        </div>

      </main>
    </div>
  );
}

function ProjectRow({
  project,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  isAnyHovered,
}: {
  project: any;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isAnyHovered: boolean;
}) {
  return (
    <Link
      href={project.href}
      className={`group relative block w-full border-b border-black/5 bg-white overflow-hidden cursor-crosshair transition-all duration-500 ${
        isAnyHovered && !isHovered ? "opacity-30" : "opacity-100"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Full-width blue fill (wipes from left on hover) */}
      <div
        className={`absolute inset-0 bg-[#0066FF] transition-transform duration-700 ease-[0.16,1,0.3,1] origin-left ${
          isHovered ? "scale-x-100" : "scale-x-0"
        }`}
        style={{ transformOrigin: "left center" }}
      />

      {/* Content Wrapper — Reintroducing max-width internally to align with header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 w-full flex items-center gap-4 md:gap-8 py-8 overflow-hidden">
        {/* Index number */}
        <span className={`text-[12px] font-mono font-bold tracking-widest transition-colors duration-500 shrink-0 ${isHovered ? "text-white" : "opacity-20"}`}>
          [{project.index}]
        </span>

        {/* Thumbnail (appears on hover) */}
        <div className={`relative shrink-0 overflow-hidden transition-all duration-500 ${isHovered ? "w-24 h-16 opacity-100" : "w-0 h-16 opacity-0"}`}>
          <Image
            src={project.src}
            alt={project.alt}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>

        {/* Title */}
        <h3
          className={`text-[clamp(28px,4vw,64px)] font-[900] leading-none uppercase tracking-[-0.02em] transition-colors duration-500 flex-1 min-w-0 truncate ${isHovered ? "text-white" : "text-black"}`}
          style={{ fontFamily: "var(--font-post-no-bills)" }}
        >
          {project.alt}
        </h3>

        {/* Metadata — hidden on mobile */}
        <div className="hidden md:flex items-center gap-8 shrink-0">
          <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border transition-all duration-500 ${isHovered ? "bg-white text-[#0066FF] border-white" : "border-black/10 opacity-40"}`}>
            {project.category}
          </div>
          <span className={`text-[12px] font-mono transition-colors duration-500 ${isHovered ? "text-white" : "opacity-30"}`}>
            {project.year}
          </span>
          <span className={`text-[12px] font-mono uppercase tracking-wider transition-colors duration-500 hidden lg:block ${isHovered ? "text-white/80" : "opacity-20"}`}>
            {project.role}
          </span>
        </div>

        {/* Arrow Icon */}
        <ArrowUpRight
          size={20}
          className={`shrink-0 transition-all duration-500 ${isHovered ? "text-white translate-x-1 -translate-y-1" : "opacity-20"}`}
        />
      </div>

      {/* Decorative corner lines (consistent with playground) */}
      <div className={`absolute top-0 right-0 w-32 h-[1px] bg-white transform transition-transform duration-700 ${isHovered ? "translate-x-0" : "translate-x-full"}`} />
      <div className={`absolute top-0 right-0 h-full w-[1px] bg-white/20 transform transition-all duration-700 ${isHovered ? "opacity-100" : "opacity-0"}`} />
    </Link>
  );
}
