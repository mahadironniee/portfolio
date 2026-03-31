"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import BracketButton from "@/components/ui/bracket-button";
import { PROJECTS } from "@/components/ui/blackhole-side-projects";
import { ArrowUpRight } from "lucide-react";

export default function ProjectsSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const displayProjects = PROJECTS.map((p, i) => ({
    ...p,
    index: String(i + 1).padStart(2, "0"),
    year: [2025, 2024, 2024, 2023, 2023, 2022, 2022][i] ?? 2024,
    category: ["PRODUCT", "BRANDING", "MOTION", "PRODUCT", "3D", "BRANDING", "MOTION"][i] ?? "PRODUCT",
    role: ["Lead Designer", "Brand Architect", "Motion Director", "UI Engineer", "3D Artist", "Creative Director", "UX Researcher"][i] ?? "Designer",
  })).slice(0, 5); // Just show the top 5 for the homepage

  return (
    <section className="relative w-full py-32 bg-white text-black overflow-hidden selection:bg-white selection:text-[#0066FF] light-bg-nav-trigger">
      {/* Background Grid — consistent with projects page */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-black" />
        <div className="absolute top-0 left-2/4 w-[1px] h-full bg-black" />
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-black" />
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-black" />
        <div className="absolute top-2/4 left-0 w-full h-[1px] bg-black" />
        <div className="absolute top-3/4 left-0 w-full h-[1px] bg-black" />
      </div>
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-[#0066FF]" />
            <span className="text-[12px] font-bold tracking-[0.5em] uppercase opacity-40">
              SELECTED_WORKS_v2.0
            </span>
          </div>
          <h2
            className="text-[clamp(60px,12vw,180px)] leading-[0.8] font-[900] uppercase tracking-[-0.04em]"
            style={{ fontFamily: 'var(--font-post-no-bills)' }}
          >
            CASE STUDIES
          </h2>
        </div>
      </div>

      {/* Project List — Now outside max-width to allow edge-to-edge fill */}
      <div className="flex flex-col border-t border-black/5 relative z-10">
        {displayProjects.map((project, idx) => (
          <ProjectRow
            key={project.alt}
            project={project}
            isHovered={hoveredIdx === idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            isAnyHovered={hoveredIdx !== null}
          />
        ))}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* Link to all projects */}
        <div className="mt-20 flex justify-end">
          <BracketButton
            href="/projects"
            color="white"
            initialBgColor="#000000"
            borderColor="#0066FF"
            hoverBorderColor="#000000"
          >
            View Case Studies
          </BracketButton>
        </div>

        {/* Technical Stats Footer */}
        <div className="mt-32 pt-8 flex flex-wrap justify-between gap-8 opacity-20 text-[10px] font-mono uppercase tracking-[0.3em]">
          <div className="flex gap-12">
            <div>DB_SRC: SELECTED_ARCHIVE</div>
            <div>STATUS: LOADED</div>
          </div>
          <div>EST: {new Date().getFullYear()}.CONCEPT</div>
        </div>
      </div>
    </section>
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
      className={`group relative block w-full border-b border-black/5 bg-white overflow-hidden cursor-crosshair transition-all duration-500 ${isAnyHovered && !isHovered ? "opacity-30" : "opacity-100"
        }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Full-width blue fill (wipes from left on hover) */}
      <div
        className={`absolute inset-0 bg-[#0066FF] transition-transform duration-700 ease-[0.16,1,0.3,1] origin-left ${isHovered ? "scale-x-100" : "scale-x-0"
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
        </div>

        {/* Arrow Icon */}
        <ArrowUpRight
          size={20}
          className={`shrink-0 transition-all duration-500 ${isHovered ? "text-white translate-x-1 -translate-y-1" : "opacity-20"}`}
        />
      </div>

      {/* Decorative corner lines (also spanning full width or relative to centered content?) */}
      {/* We'll keep them relative to the full viewport for now as they are "edge" decorations */}
      <div className={`absolute top-0 right-0 w-32 h-[1px] bg-white transform transition-transform duration-700 ${isHovered ? "translate-x-0" : "translate-x-full"}`} />
      <div className={`absolute top-0 right-0 h-full w-[1px] bg-white/20 transform transition-all duration-700 ${isHovered ? "opacity-100" : "opacity-0"}`} />
    </Link>
  );
}
