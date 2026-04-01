"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import BracketButton from "@/components/ui/bracket-button";
import { PROJECTS } from "@/components/ui/blackhole-side-projects";
import { ArrowUpRight } from "lucide-react";

export default function ProjectsSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeMobileIdx, setActiveMobileIdx] = useState<number | null>(null);
  const [targetIdx, setTargetIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  const displayProjects = PROJECTS.map((p, i) => ({
    ...p,
    index: String(i + 1).padStart(2, "0"),
    year: [2025, 2024, 2024, 2023, 2023, 2022, 2022][i] ?? 2024,
    category: ["PRODUCT", "BRANDING", "MOTION", "PRODUCT", "3D", "BRANDING", "MOTION"][i] ?? "PRODUCT",
    role: ["Lead Designer", "Brand Architect", "Motion Director", "UI Engineer", "3D Artist", "Creative Director", "UX Researcher"][i] ?? "Designer",
  })).slice(0, 5); // Just show the top 5 for the homepage

  // Helper to find the current target based on 30% bottom threshold
  const getTargetIdx = () => {
    if (!sectionRef.current) return -1;
    const rows = sectionRef.current.querySelectorAll('[data-project-row]');
    const thresholdLine = window.innerHeight * 0.7;
    const leaveLine = 0; // Top of viewport
    let tIdx = -1;
    
    rows.forEach((row, idx) => {
      const rect = row.getBoundingClientRect();
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
    <section ref={sectionRef} className="relative w-full py-32 bg-white text-black overflow-hidden selection:bg-white selection:text-[#0066FF] light-bg-nav-trigger">
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

      {/* Project List */}
      <div className="flex flex-col border-t border-black/5 relative z-10">
        {displayProjects.map((project, idx) => (
          <ProjectRow
            key={project.alt}
            project={project}
            isHovered={hoveredIdx === idx}
            isActiveScroll={activeMobileIdx === idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            isAnyHovered={hoveredIdx !== null}
            data-project-row
          />
        ))}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
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
  isActiveScroll,
  onMouseEnter,
  onMouseLeave,
  isAnyHovered,
  ...props
}: {
  project: any;
  isHovered: boolean;
  isActiveScroll: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isAnyHovered: boolean;
  [key: string]: any;
}) {
  const isActive = isHovered || (isActiveScroll && typeof window !== "undefined" && window.innerWidth < 768);

  return (
    <Link
      href={project.href}
      className={`group relative block w-full border-b border-black/5 bg-white overflow-hidden cursor-crosshair transition-all duration-500 ${
        isAnyHovered && !isHovered ? "opacity-30" : "opacity-100"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {/* Boolean-Based Blue Fill — No mid-points, always 0 or 100 */}
      <motion.div
        className="absolute inset-0 bg-[#0066FF] origin-left pointer-events-none"
        initial={false}
        animate={{ scaleX: isActive ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 w-full flex items-center gap-4 md:gap-8 py-8 overflow-hidden">
        {/* Index */}
        <span className={`text-[12px] font-mono font-bold tracking-widest transition-colors duration-500 shrink-0 ${isActive ? "text-white" : "opacity-20"}`}>
          [{project.index}]
        </span>

        {/* Thumbnail */}
        <div className={`relative shrink-0 overflow-hidden transition-all duration-500 ${isActive ? "w-24 h-16 opacity-100" : "w-0 h-16 opacity-0"}`}>
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
          className={`text-[clamp(28px,4vw,64px)] font-[900] leading-none uppercase tracking-[-0.02em] transition-colors duration-500 flex-1 min-w-0 truncate ${isActive ? "text-white" : "text-black"}`}
          style={{ fontFamily: "var(--font-post-no-bills)" }}
        >
          {project.alt}
        </h3>

        {/* Metadata */}
        <div className="hidden md:flex items-center gap-8 shrink-0">
          <span className={`text-[12px] font-mono transition-colors duration-500 ${isActive ? "text-white" : "opacity-30"}`}>
            {project.year}
          </span>
        </div>

        {/* Arrow */}
        <ArrowUpRight
          size={20}
          className={`shrink-0 transition-all duration-500 ${isActive ? "text-white translate-x-1 -translate-y-1" : "opacity-20"}`}
        />
      </div>

      {/* Decorative corner lines */}
      <div className={`absolute top-0 right-0 w-32 h-[1px] bg-white transform transition-transform duration-700 ${isActive ? "translate-x-0" : "translate-x-full"}`} />
    </Link>
  );
}
