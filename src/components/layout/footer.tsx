"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import BracketButton from "@/components/ui/bracket-button";

const MARQUEE_ITEMS = [
  "DESIGNER", "·", "DEVELOPER", "·", "MOTION", "·", "SYSTEMS", "·",
  "PRODUCT", "·", "BRUTALIST", "·", "CONCEPTUAL", "·", "PRECISION", "·",
  "DESIGNER", "·", "DEVELOPER", "·", "MOTION", "·", "SYSTEMS", "·",
  "PRODUCT", "·", "BRUTALIST", "·", "CONCEPTUAL", "·", "PRECISION", "·",
];

const NAME_LETTERS = ["M", "A", "H", "A", "D", "Y"];

const NAV = {
  PAGES: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Playground", href: "/playground" },
    { label: "Contact", href: "/contact" },
  ],
  CONNECT: [
    { label: "LinkedIn", href: "#" },
    { label: "Behance", href: "#" },
    { label: "Dribbble", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "Instagram", href: "#" },
  ],
  STACK: [
    { label: "Figma", href: "#" },
    { label: "Next.js", href: "#" },
    { label: "GSAP", href: "#" },
    { label: "Framer Motion", href: "#" },
    { label: "Three.js", href: "#" },
  ],
};

export default function Footer() {
  const [hoveredLetter, setHoveredLetter] = useState<number | null>(null);
  const [time, setTime] = useState("");
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  // Live clock
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer ref={ref} className="relative bg-black text-white overflow-hidden">

      {/* ── Top separator: thin blue line sliding in ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "left center" }}
        className="w-full h-[2px] bg-[#0066FF]"
      />

      {/* ── Availability beacon strip ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/5"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0066FF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0066FF]" />
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-white/40">
            STATUS: AVAILABLE FOR WORK
          </span>
        </div>
        <span className="text-[10px] font-mono opacity-20 tabular-nums hidden md:block">
          LOCAL_TIME: {time || "00:00:00"}
        </span>
      </motion.div>

      {/* ── Main body ── */}
      <div className="px-6 md:px-12 pt-16 pb-0">

        {/* ── Giant letterform Name ── */}
        <div className="mb-16 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-end gap-[0.01em] select-none"
            style={{ fontFamily: "var(--font-post-no-bills)" }}
          >
            {NAME_LETTERS.map((letter, i) => (
              <span
                key={i}
                className="block text-[clamp(80px,16vw,240px)] font-[900] leading-none tracking-[-0.05em] cursor-default transition-all duration-300"
                style={{
                  color: hoveredLetter === i ? "#0066FF" : "white",
                  transform: hoveredLetter === i ? "translateY(-8px)" : "translateY(0)",
                  WebkitTextStroke: hoveredLetter === i ? "0px" : "0px",
                  textShadow: hoveredLetter === i
                    ? "0 0 80px rgba(0,102,255,0.4), 0 0 160px rgba(0,102,255,0.15)"
                    : "none",
                }}
                onMouseEnter={() => setHoveredLetter(i)}
                onMouseLeave={() => setHoveredLetter(null)}
              >
                {letter}
              </span>
            ))}

            {/* Descriptor next to name */}
            <div className="ml-auto pb-3 flex flex-col items-end gap-1 shrink-0 hidden md:flex">
              <span className="text-[10px] font-mono opacity-20 tracking-[0.3em] uppercase">
                IRONNIEE
              </span>
              <span className="text-[10px] font-mono opacity-10 tracking-[0.25em] uppercase">
                PRODUCT DESIGNER & ENGINEER
              </span>
              <span className="text-[9px] font-mono opacity-10 tracking-widest">
                DHAKA · BANGLADESH · EARTH
              </span>
            </div>
          </motion.div>

          {/* Thin rule under name */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "left" }}
            className="w-full h-[1px] bg-white/10 mt-2"
          />
        </div>

        {/* ── Nav columns + CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20"
        >
          {(Object.entries(NAV) as [string, { label: string; href: string }[]][]).map(([section, links]) => (
            <div key={section}>
              <div className="text-[9px] font-bold tracking-[0.5em] uppercase text-white/20 mb-6">
                {section}
              </div>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-[14px] font-medium text-white/50 hover:text-white transition-colors duration-300"
                    >
                      <span className="w-0 h-[1px] bg-[#0066FF] group-hover:w-4 transition-all duration-300" />
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CTA Column */}
          <div className="col-span-2 md:col-span-1 flex flex-col justify-between">
            <div>
              <div className="text-[9px] font-bold tracking-[0.5em] uppercase text-white/20 mb-6">
                START A PROJECT
              </div>
              <p className="text-[14px] text-white/40 leading-relaxed mb-6 max-w-[200px]">
                Open for collaborations, contracts, and creative chaos.
              </p>
            </div>
            <div className="self-start mt-4">
              <BracketButton
                href="/contact"
                color="black"
                initialBgColor="#FFFFFF"
                borderColor="#0066FF"
                hoverBorderColor="#FFFFFF"
              >
                Transmit
              </BracketButton>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Blue Marquee Strip ── */}
      <div className="bg-[#0066FF] py-3 overflow-hidden">
        <div
          className="flex gap-8 whitespace-nowrap"
          style={{
            animation: "marquee-scroll 22s linear infinite",
            width: "max-content",
          }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className={`text-[11px] font-bold uppercase tracking-[0.3em] ${
                item === "·" ? "text-white/30" : "text-white"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="px-6 md:px-12 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-white/5">
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} MAHAD IRONNIEE — ALL RIGHTS RESERVED
        </span>
        <div className="flex items-center gap-8 text-[10px] font-mono text-white/10 uppercase tracking-widest">
          <span>VER: 2.0.4</span>
          <span>BUILD: TURBOPACK</span>
          <span>LAT: 23.8°N · 90.4°E</span>
        </div>
      </div>

      {/* Marquee keyframe */}
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
}
