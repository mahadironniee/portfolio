"use client";

import Image from "next/image";
import { useMotionValue, useSpring, useTransform, motion, MotionValue, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import TypewriterText from "@/components/ui/typewriter-text";
import SmoothScroll from "@/components/ui/smooth-scroll";
import SecondSection from "@/components/sections/second-section";
import ProjectsSection from "@/components/sections/projects-section";
import PlaygroundSection from "@/components/sections/playground-section";
import { PROJECTS } from "@/components/ui/blackhole-side-projects";
import dynamic from "next/dynamic";
import BracketButton from "@/components/ui/bracket-button";
import MotionTracker from "@/components/ui/motion-tracker";
import { CursorBrush } from "@/components/ui/cursor-brush";
import { EnergyGathering } from "@/components/ui/energy-gathering";
import HeroEye from "@/components/ui/hero-eye";
import MobilePreloader from "@/components/ui/mobile-preloader";
const BlackHoleSideProjects = dynamic(
  () => import("@/components/ui/blackhole-side-projects"),
  { ssr: false }
);

// Module-level variable survives client-side navigations but resets on hard reload (F5)
let hasFinishedIntroGlobal = false;

export default function Home() {
  const [activeProjectIdx, setActiveProjectIdx] = useState(-1);
  const [isProjectHovered, setIsProjectHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // --- Mobile Navigation ---
  const handlePrev = () => {
    setActiveProjectIdx((prev) => (prev <= 0 ? PROJECTS.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setActiveProjectIdx((prev) => (prev >= PROJECTS.length - 1 ? 0 : prev + 1));
  };
  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const eyeRef = React.useRef<HTMLDivElement>(null);

  // --- Preloader Logic ---
  const [preloaderState, setPreloaderState] = useState<"A" | "LOGO" | "NAV" | "QUOTE" | "PROJECTS_CENTER" | "PROJECTS_SPLIT" | "B" | "DONE">(hasFinishedIntroGlobal ? "DONE" : "A");
  const [activeTarget, setActiveTarget] = useState(3);
  const [isNavbarWireframe, setIsNavbarWireframe] = useState(!hasFinishedIntroGlobal);
  const [isLogoWireframe, setIsLogoWireframe] = useState(!hasFinishedIntroGlobal);
  const [isQuoteWireframe, setIsQuoteWireframe] = useState(!hasFinishedIntroGlobal);
  const [isProjectsDimmed, setIsProjectsDimmed] = useState(false);

  useEffect(() => {
    const isNavigatingBack = typeof window !== "undefined" && sessionStorage.getItem("navigating_to_home") === "true";
    if (isNavigatingBack) {
      sessionStorage.removeItem("navigating_to_home");
      hasFinishedIntroGlobal = true;
    }

    // Set mobile state
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (hasFinishedIntroGlobal) {
      document.body.style.overflow = "auto";
      setPreloaderState("DONE");
      setIsNavbarWireframe(false);
      setIsLogoWireframe(false);
      setIsQuoteWireframe(false);
      setIsProjectsDimmed(false);
      if (window.innerWidth < 768) setActiveProjectIdx(0);
      return () => window.removeEventListener("resize", checkMobile);
    }

    // Lock scrolling on mount — also lock html and touch-action for mobile browsers
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.style.overscrollBehavior = "none";

    // 1. Initial State A (Headline Center) - 0-700ms

    // 2. Move to LOGO
    const tLogo = setTimeout(() => {
      console.log(`[Preloader] 700ms - State LOGO`);
      setPreloaderState("LOGO");
    }, 700);

    // 3. Unlock Logo
    const tLogoReveal = setTimeout(() => {
      console.log(`[Preloader] 1600ms - Logo Revealed`);
      setIsLogoWireframe(false);
    }, 1600);

    // 4. Move to NAV
    const tNav = setTimeout(() => {
      console.log(`[Preloader] 1800ms - State NAV`);
      setPreloaderState("NAV");
    }, 1800);

    // 5. Unlock Navbar
    const tUnveil = setTimeout(() => {
      console.log(`[Preloader] 2900ms - Navbar Revealed`);
      setIsNavbarWireframe(false);
    }, 2900);

    // 6. Move to QUOTE
    const tQuote = setTimeout(() => {
      console.log(`[Preloader] 3300ms - State QUOTE`);
      setPreloaderState("QUOTE");
    }, 3300);

    // 7. Unlock Quote Button
    const tQuoteReveal = setTimeout(() => {
      console.log(`[Preloader] 4300ms - Quote Button Revealed`);
      setIsQuoteWireframe(false);
    }, 4300);

    // 8. Move to Side Projects Center (Magnifying Glass)
    const tProjectsCenter = setTimeout(() => {
      console.log(`[Preloader] 4800ms - State PROJECTS_CENTER`);
      setPreloaderState("PROJECTS_CENTER");
    }, 4800);

    // 9. Split reticles and target small project cards
    const tProjectsSplit = setTimeout(() => {
      console.log(`[Preloader] 5900ms - State PROJECTS_SPLIT`);
      setPreloaderState("PROJECTS_SPLIT");
    }, 5900);

    // 9.5. Dim the targeted cards (Wait for reticles to arrive)
    const tProjectsDim = setTimeout(() => {
      console.log(`[Preloader] 6900ms - Projects Dimmed`);
      setIsProjectsDimmed(true);
    }, 6900);

    // 10. Return to Headline (after undim has time to visually animate)
    const tReturn = setTimeout(() => {
      console.log(`[Preloader] 8200ms - State A (Return)`);
      setPreloaderState("A");
    }, 8200);

    // 11. Trigger Shatter
    const tB = setTimeout(() => {
      console.log(`[Preloader] 9200ms - State B (Shatter)`);
      setPreloaderState("B");
    }, 9200);

    // 12. End preloader
    const tDone = setTimeout(() => {
      console.log(`[Preloader] 11000ms - DONE (Live State)`);
      setPreloaderState("DONE");
      setIsProjectsDimmed(false);
      hasFinishedIntroGlobal = true;
      if (window.innerWidth < 768) setActiveProjectIdx(0);
      console.log(`[Preloader] Projects Restored`);
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.overscrollBehavior = "";
      window.scrollTo(0, 0);
    }, 11000);

    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(tLogo);
      clearTimeout(tLogoReveal);
      clearTimeout(tNav);
      clearTimeout(tUnveil);
      clearTimeout(tQuote);
      clearTimeout(tQuoteReveal);
      clearTimeout(tProjectsCenter);
      clearTimeout(tProjectsSplit);
      clearTimeout(tProjectsDim);
      clearTimeout(tReturn);
      clearTimeout(tB);
      clearTimeout(tDone);
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.overscrollBehavior = "";
      document.documentElement.removeAttribute('data-preloading');
    };
  }, []);

  // Sync preloader state with document for CSS-based hiding
  useEffect(() => {
    // On mobile: clear data-preloading at state B (when the mobile preloader fades)
    // so Navbar .preloader-active elements go live immediately — not 1.4s late at DONE.
    // On desktop: keep the original behaviour (only clear at DONE).
    const mobilePreloaderDone = isMobile && (preloaderState === 'B' || preloaderState === 'DONE');
    if (preloaderState !== "DONE" && !mobilePreloaderDone) {
      document.documentElement.setAttribute('data-preloading', 'true');
    } else {
      document.documentElement.removeAttribute('data-preloading');
    }

    // Sync navbar wireframe state
    if (isNavbarWireframe) {
      document.documentElement.setAttribute('data-navbar-wireframe', 'true');
    } else {
      document.documentElement.setAttribute('data-navbar-wireframe', 'false');
    }
    // Sync logo wireframe state
    if (isLogoWireframe) {
      document.documentElement.setAttribute('data-logo-wireframe', 'true');
    } else {
      document.documentElement.setAttribute('data-logo-wireframe', 'false');
    }
    // Sync side projects split state based on exact trigger timing
    if (isProjectsDimmed) {
      document.documentElement.setAttribute('data-projects-split', 'true');
    } else {
      document.documentElement.setAttribute('data-projects-split', 'false');
    }
  }, [preloaderState, isNavbarWireframe, isLogoWireframe, isProjectsDimmed]);

  const trackerRef = React.useRef<HTMLDivElement>(null);

  const dropTransition = {
    type: "tween" as const,
    ease: [0.5, 0, 1, 1] as const,
    duration: 1.8
  };

  const shatterTransition = (delaySec: number) => ({
    x: { type: "spring" as const, stiffness: 250, damping: 20, mass: 0.8, delay: delaySec },
    y: { type: "spring" as const, stiffness: 250, damping: 20, mass: 0.8, delay: delaySec },
    scale: { type: "spring" as const, stiffness: 250, damping: 20, mass: 0.8, delay: delaySec },
    opacity: { type: "tween" as const, duration: 0.8, ease: "linear" as const, delay: delaySec + 0.1 }
  });
  
  // Auto-cycle projects on mobile ONLY (Desktop is handled by BlackHoleSideProjects)
  useEffect(() => {
    if (!isMobile || preloaderState !== "DONE") return;
    const interval = setInterval(() => {
      setActiveProjectIdx((prev) => (prev + 1) % PROJECTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isMobile, preloaderState]);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (preloaderState === "DONE") {
        eyeX.set(e.clientX);
        eyeY.set(e.clientY);
      }
    };

    const trackPreloader = () => {
      if (preloaderState !== "DONE" && trackerRef.current) {
        const { left, top, width, height } = trackerRef.current.getBoundingClientRect();
        eyeX.set(left + width / 2);
        eyeY.set(top + height / 2);
        animationFrameId = requestAnimationFrame(trackPreloader);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    if (preloaderState !== "DONE") {
      trackPreloader();
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [preloaderState, eyeX, eyeY, mouseX, mouseY]);

  return (
    <>
      {preloaderState === "DONE" && <CursorBrush externalX={mouseX} externalY={mouseY} />}
      {preloaderState !== "DONE" && !isMobile && <EnergyGathering x={mouseX} y={mouseY} />}
      <AnimatePresence>
        {preloaderState !== "DONE" && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
            className="fixed inset-0 z-60 bg-transparent md:bg-[#FFFFFF] flex flex-col items-center pt-[147px] light-bg-nav-trigger overflow-hidden"
          >
            {/* ── Mobile preloader — CSS-gated (md:hidden) so it appears on first paint
                 before JS runs, eliminating the desktop-flashes-first bug.
                 z-[350] keeps it above the desktop-only motion tracker (z-[300])
                 which is in the same stacking context. ── */}
            <div className="md:hidden absolute inset-0 z-[350]">
              <MobilePreloader
                preloaderState={preloaderState}
                isQuoteWireframe={isQuoteWireframe}
                isProjectsDimmed={isProjectsDimmed}
              />
            </div>
            {/* Background Grid - consistent with playground */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />
            </div>

            {/* ── Desktop-only preloader content: hidden on mobile ── */}
            <div className="hidden md:block absolute inset-0">

              <div className="absolute top-[44px] md:top-[59px] left-[40px] z-20" style={{ filter: "brightness(0) invert(0.85)" }}>
                <Image src="/svgs/top-left-line.svg" alt="" width={76} height={184} />
              </div>

              <div className="absolute bottom-[40px] right-[40px] z-20" style={{ filter: "brightness(0) invert(0.85)" }}>
                <Image src="/svgs/right-below-line.svg" alt="" width={126} height={81} />
              </div>

              <div className="absolute left-[-103px] bottom-[-100px] w-[1202px] h-[604px] z-0">
                <div className="absolute inset-0" style={{ filter: "brightness(0) invert(0.85)" }}>
                  <Image
                    src="/svgs/HeroHeadlineSVG-Live.svg"
                    alt=""
                    fill
                    className="object-contain"
                    priority
                  />

                  <motion.svg
                    width="100%" height="100%"
                    viewBox="0 0 1821 915"
                    className="absolute inset-0"
                  >
                    {/* Group 1: Left Blocks (Drops when B is reached) */}
                    <motion.g initial={{ y: 0 }} animate={{ y: (preloaderState === "A" || preloaderState === "LOGO" || preloaderState === "NAV" || preloaderState === "QUOTE" || preloaderState === "PROJECTS_CENTER" || preloaderState === "PROJECTS_SPLIT") ? 0 : 1500 }} transition={{ ...dropTransition, delay: 0.0 }}>
                      {/* Top Block 1 (shattered) */}
                      <motion.path d="M610 243 L638 243 L638 265 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 30, y: preloaderState !== "B" ? 0 : -45, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M610 243 L610 286 L638 265 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : -45, y: preloaderState !== "B" ? 0 : -10, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M610 286 L638 286 L638 265 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 25, y: preloaderState !== "B" ? 0 : 50, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />

                      {/* Droplet 1 (shattered) */}
                      <motion.path d="M610 496.207 L638 496.207 L638 515 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 45, y: preloaderState !== "B" ? 0 : -60, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M610 496.207 L610 538.207 L638 515 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : -55, y: preloaderState !== "B" ? 0 : -20, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M610 538.207 L638 538.207 L638 515 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 35, y: preloaderState !== "B" ? 0 : 80, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                    </motion.g>

                    {/* Group 2: Middle Blocks (Drops when B is reached) */}
                    <motion.g initial={{ y: 0 }} animate={{ y: (preloaderState === "A" || preloaderState === "LOGO" || preloaderState === "NAV" || preloaderState === "QUOTE" || preloaderState === "PROJECTS_CENTER" || preloaderState === "PROJECTS_SPLIT") ? 0 : 1500 }} transition={{ ...dropTransition, delay: 0.0 }}>
                      {/* Top Block 2 (shattered) */}
                      <motion.path d="M833 242 L861 242 L861 263 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 20, y: preloaderState !== "B" ? 0 : -50, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M833 242 L833 284 L861 263 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : -55, y: preloaderState !== "B" ? 0 : -5, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M833 284 L861 284 L861 263 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 35, y: preloaderState !== "B" ? 0 : 40, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />

                      {/* Droplet 2 (shattered) */}
                      <motion.path d="M833 498.207 L861 498.207 L861 520 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 35, y: preloaderState !== "B" ? 0 : -55, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M833 498.207 L833 541.207 L861 520 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : -70, y: preloaderState !== "B" ? 0 : 15, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M833 541.207 L861 541.207 L861 520 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 40, y: preloaderState !== "B" ? 0 : 90, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />

                      {/* Droplet 3 (shattered) */}
                      <motion.path d="M1115 493.707 L1143 494.707 L1143 515 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 55, y: preloaderState !== "B" ? 0 : -30, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M1115 493.707 L1115 536.707 L1143 515 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : -45, y: preloaderState !== "B" ? 0 : -25, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M1115 536.707 L1143 536.707 L1143 515 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 25, y: preloaderState !== "B" ? 0 : 65, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />

                      {/* Top Block 3 (shattered) */}
                      <motion.path d="M1115 241 L1143 241 L1143 262 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 40, y: preloaderState !== "B" ? 0 : -35, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M1115 241 L1115 284 L1143 262 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : -30, y: preloaderState !== "B" ? 0 : -15, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M1115 284 L1143 284 L1143 262 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 20, y: preloaderState !== "B" ? 0 : 60, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                    </motion.g>

                    {/* Group 3: Right Blocks (Drops when B is reached) */}
                    <motion.g initial={{ y: 0 }} animate={{ y: (preloaderState === "A" || preloaderState === "LOGO" || preloaderState === "NAV" || preloaderState === "QUOTE" || preloaderState === "PROJECTS_CENTER" || preloaderState === "PROJECTS_SPLIT") ? 0 : 1500 }} transition={{ ...dropTransition, delay: 0.0 }}>
                      {/* Top Block 4 (shattered) */}
                      <motion.path d="M1336 242 L1364 242 L1364 265 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 25, y: preloaderState !== "B" ? 0 : -55, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M1336 242 L1336 287 L1364 265 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : -50, y: preloaderState !== "B" ? 0 : -20, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M1336 287 L1364 287 L1364 265 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 45, y: preloaderState !== "B" ? 0 : 35, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />

                      {/* Droplet 4 (shattered) */}
                      <motion.path d="M1560 494.207 L1588 494.207 L1588 515 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 40, y: preloaderState !== "B" ? 0 : -70, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M1560 494.207 L1560 537.207 L1588 515 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : -65, y: preloaderState !== "B" ? 0 : 20, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M1560 537.207 L1588 537.207 L1588 515 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 50, y: preloaderState !== "B" ? 0 : 85, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />

                      {/* Top Block 5 (shattered) */}
                      <motion.path d="M1560 242 L1588 242 L1588 263 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 35, y: preloaderState !== "B" ? 0 : -40, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M1560 242 L1560 285 L1588 263 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : -40, y: preloaderState !== "B" ? 0 : 10, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                      <motion.path d="M1560 285 L1588 285 L1588 263 Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth={0.8} strokeLinejoin="round" initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: preloaderState !== "B" ? 0 : 55, y: preloaderState !== "B" ? 0 : 45, scale: preloaderState !== "B" ? 1 : 0.65, opacity: preloaderState !== "B" ? 1 : 0 }} transition={shatterTransition(0.0)} />
                    </motion.g>
                  </motion.svg>
                </div>

                <HeroEye
                  mouseX={eyeX}
                  mouseY={eyeY}
                  isPreloader={true}
                  className="absolute"
                  style={{
                    left: 636.5,
                    top: 122,
                  }}
                />
              </div>

              {/* Motion Tracker — desktop only (mobile uses MobilePreloader's built-in reticle) */}
              {!isMobile && <motion.div
                ref={trackerRef}
                className="fixed inset-0 z-[300] pointer-events-none"
                animate={{
                  top: preloaderState === "LOGO" ? "35px" : preloaderState === "NAV" ? "30px" : preloaderState === "QUOTE" ? "calc(40% + 140px)" : (preloaderState === "PROJECTS_CENTER" || preloaderState === "PROJECTS_SPLIT") ? "calc(50% - 207px)" : "calc(100% - 350px)",
                  left: preloaderState === "LOGO" ? "180px" : preloaderState === "NAV" ? "50%" : preloaderState === "QUOTE" ? "calc(19% + 490px)" : (preloaderState === "PROJECTS_CENTER" || preloaderState === "PROJECTS_SPLIT") ? "calc(100% - 371.5px)" : "50%",
                  x: preloaderState === "LOGO" ? "0%" : preloaderState === "NAV" ? "-50%" : preloaderState === "QUOTE" ? "-50%" : (preloaderState === "PROJECTS_CENTER" || preloaderState === "PROJECTS_SPLIT") ? "-50%" : "-50%",
                  y: preloaderState === "LOGO" ? "-50%" : preloaderState === "NAV" ? "0%" : preloaderState === "QUOTE" ? "-50%" : (preloaderState === "PROJECTS_CENTER" || preloaderState === "PROJECTS_SPLIT") ? "0%" : "-50%",
                  width: preloaderState === "LOGO" ? "140px" : preloaderState === "NAV" ? "400px" : preloaderState === "QUOTE" ? "220px" : (preloaderState === "PROJECTS_CENTER" || preloaderState === "PROJECTS_SPLIT") ? "540px" : "1200px",
                  height: preloaderState === "LOGO" ? "50px" : preloaderState === "NAV" ? "80px" : preloaderState === "QUOTE" ? "80px" : (preloaderState === "PROJECTS_CENTER" || preloaderState === "PROJECTS_SPLIT") ? "418px" : "400px",
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
              >
                <MotionTracker
                  preloaderState={preloaderState}
                  activeTarget={3}
                  x={0}
                  y={0}
                  width="100%"
                  height="100%"
                  color="#C0C0C0"
                />
              </motion.div>}

              <div
                className="absolute z-30 flex flex-col items-end gap-2"
                style={{ left: "19%", top: "calc(40% - 132px)", width: "648px" }}
              >
                <div className="w-full h-[220px]">
                  <TypewriterText
                    title="conceptual design"
                    text="A bold fusion of wireframe raw concepts and high-fidelity motion interactive design."
                    isActive={true}
                    isStatic={true}
                    variant="grey"
                    className="!text-[#D9D9D9]"
                  />
                </div>
                <BracketButton isStatic={true} color="black" isWireframe={isQuoteWireframe} className="preloader-active">
                  {isQuoteWireframe ? "BUTTOn" : "Get a quote"}
                </BracketButton>
              </div>

              <BlackHoleSideProjects
                onActiveChange={() => { }}
                onHoverChange={() => { }}
                isStatic={true}
              />

              <div className="absolute bottom-8 md:bottom-6 w-full max-w-[1400px] h-[32px] px-3 translate-x-[60px]" style={{ filter: "brightness(0) invert(0.85)" }}>
                <div className="relative w-full h-full">
                  <Image src="/svgs/hero-sub-heading.svg" alt="" fill className="object-contain" />
                </div>
              </div>

            </div>{/* end desktop-only preloader content */}

            {/* Placeholder for future transformations hook */}
            {preloaderState === "B" && (
              <div data-hook="future-transformations"></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        data-hero
        className="fixed inset-0 z-0 w-full h-screen bg-white light-bg-nav-trigger"
        style={{ visibility: (preloaderState === "DONE" || preloaderState === "B") ? "visible" : "hidden" }}
      >
        <main id="hero" className="relative w-full h-screen flex flex-col items-center pt-[147px] z-[200] overflow-hidden">
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

          {/* Desktop-only decorative corner SVGs */}
          <div className="hidden md:block absolute top-[44px] md:top-[59px] left-[40px] z-20 pointer-events-none" style={{ filter: "brightness(0)" }}>
            <Image src="/svgs/top-left-line.svg" alt="" width={76} height={184} />
          </div>

          <div className="hidden md:block absolute bottom-[40px] right-[40px] z-20 pointer-events-none" style={{ filter: "brightness(0)" }}>
            <Image src="/svgs/right-below-line.svg" alt="" width={126} height={81} />
          </div>

          {/* ══════ DESKTOP LAYOUT (LARGE 1920+) ══════ */}
          <div className="hidden 2xl:block">
            {/* Desktop: HeroHeadlineSVG (the "designer" text) at bottom-left */}
            <div className="absolute left-[-103px] bottom-[-100px] w-[1202px] h-[604px] pointer-events-none z-0">
              <Image
                src="/svgs/HeroHeadlineSVG-Live.svg"
                alt="Designer Creative Headline"
                fill
                className="object-contain"
                priority
              />

              <HeroEye
                mouseX={eyeX}
                mouseY={eyeY}
                isInteractive={true}
                className="absolute"
                style={{
                  left: 636.5,
                  top: 122,
                }}
              />
            </div>

            {/* Desktop: TypewriterText + CTA */}
            <div className="absolute z-[210] flex flex-col items-end gap-2" style={{ left: "19%", top: "calc(40% - 132px)", width: "648px" }}>
              <div className="w-full h-[220px] relative top-1">
                <TypewriterText
                  title={activeProjectIdx !== -1 ? PROJECTS[activeProjectIdx].alt : ""}
                  text={activeProjectIdx !== -1 ? PROJECTS[activeProjectIdx].desc : ""}
                  isActive={activeProjectIdx !== -1}
                  isPaused={isProjectHovered}
                  variant="light"
                />
              </div>
              <BracketButton
                href="/contact"
                color="white"
                initialBgColor="#000000"
                borderColor="#0066FF"
                hoverBorderColor="#000000"
              >
                Get a quote
              </BracketButton>
            </div>
          </div>

          {/* ══════ LAPTOP LAYOUT (13-15") ══════ */}
          <div className="hidden md:block 2xl:hidden">
            {/* Laptop: Scaled-down SVG headline */}
            <div className="absolute left-[-150px] bottom-[-100px] w-[950px] h-[478px] pointer-events-none z-0">
              <Image
                src="/svgs/HeroHeadlineSVG-Live.svg"
                alt="Designer Creative Headline"
                fill
                className="object-contain"
                priority
              />

              <HeroEye
                mouseX={eyeX}
                mouseY={eyeY}
                size={32}
                isInteractive={true}
                className="absolute"
                style={{
                  left: 503,
                  top: 96,
                }}
              />
            </div>

            {/* Laptop: Scaled-down TypewriterText + CTA */}
            <div className="absolute z-[210] flex flex-col items-end gap-2 origin-top-left" style={{ left: "15%", top: "calc(40% - 100px)", width: "550px", transform: "scale(0.85)" }}>
              <div className="w-full h-[220px] relative top-1">
                <TypewriterText
                  title={activeProjectIdx !== -1 ? PROJECTS[activeProjectIdx].alt : ""}
                  text={activeProjectIdx !== -1 ? PROJECTS[activeProjectIdx].desc : ""}
                  isActive={activeProjectIdx !== -1}
                  isPaused={isProjectHovered}
                  variant="light"
                />
              </div>
              <BracketButton
                href="/contact"
                color="white"
                initialBgColor="#000000"
                borderColor="#0066FF"
                hoverBorderColor="#000000"
              >
                Get a quote
              </BracketButton>
            </div>
          </div>

          {/* LARGE DESKTOP: sub-heading label bar */}
          <div className="hidden 2xl:block absolute bottom-8 md:bottom-6 w-full max-w-[1400px] h-[32px] px-3 translate-x-[60px] pointer-events-none z-[210]" style={{ filter: "brightness(0)" }}>
            <div className="relative w-full h-full">
              <Image src="/svgs/hero-sub-heading.svg" alt="" fill className="object-contain" />
            </div>
          </div>

          {/* LAPTOP: scaled-down sub-heading label bar */}
          <div className="hidden md:block 2xl:hidden absolute bottom-6 w-full max-w-[1000px] h-[24px] px-3 translate-x-[0px] pointer-events-none z-[210]" style={{ filter: "brightness(0)" }}>
            <div className="relative w-full h-full">
              <Image src="/svgs/hero-sub-heading.svg" alt="" fill className="object-contain" />
            </div>
          </div>

          {/* ══════ MOBILE LAYOUT ══════ */}
          <div className="md:hidden absolute inset-0 flex flex-col">
            {/* ── Mobile card carousel ──────────────────────────────────────────
                All 7 cards always rendered. Each computes its signed distance
                (norm) from the active card and springs to the matching slot.
                Slot positions are calculated so cards NEVER overlap.
                Card base: 230×172px
                  Center (norm=0): scale 0.75 → ~173px wide, x=0
                  Sides  (norm=±1): scale 0.45 → ~104px wide, x=±153
                  Off-screen:       opacity 0, x=±500
                Gap = 153 - 86 - 52 = 15px on each side ✓                   */}
            <div className="relative w-full overflow-hidden shrink-0" style={{ height: 310, paddingTop: 110 }}>
              {PROJECTS.map((project, i) => {
                const N = PROJECTS.length;
                const cur = activeProjectIdx >= 0 ? activeProjectIdx : 0;
                const raw = ((i - cur) % N + N) % N;
                // norm: signed ring distance, range -(N/2) … +(N/2)
                const norm = raw > Math.floor(N / 2) ? raw - N : raw;

                let targetX: number, targetY: number, targetScale: number, targetOpacity: number;
                // Reverse direction: 1=coming from left, -1=leaving on right
                if (norm === 1) { targetX = -153; targetY = 0; targetScale = 0.45; targetOpacity = 0.78; }
                else if (norm === 0) { targetX = 0; targetY = 0; targetScale = 0.75; targetOpacity = 1.00; }
                else if (norm === -1) { targetX = 153; targetY = 0; targetScale = 0.45; targetOpacity = 0.78; }
                else { targetX = (norm > 0 ? -500 : 500); targetY = 0; targetScale = 0.30; targetOpacity = 0; }

                // Determine if this is the antipodal wrap point (furthest card)
                const isAntipodal = Math.abs(norm) >= Math.floor(N / 2);

                return (
                  <motion.div
                    key={i}
                    animate={{ x: targetX, y: targetY, scale: targetScale, opacity: targetOpacity }}
                    transition={
                      isAntipodal
                        ? { duration: 0 } 
                        : { type: "spring", stiffness: 220, damping: 30 }
                    }
                    className="absolute overflow-hidden bg-black"
                    style={{
                      width: 230,
                      height: 172,
                      left: "50%",
                      top: "50%",
                      marginLeft: -115,
                      marginTop: -86,
                      zIndex: norm === 0 ? 20 : Math.abs(norm) === 1 ? 10 : 1,
                      transformOrigin: "center center",
                    }}
                  >
                    {/* CRT, Grain, and NO SIGNAL overlays (copied from desktop) */}
                    {norm !== 0 && (
                      <div className="absolute inset-0 pointer-events-none z-10">
                          <svg className="absolute w-0 h-0" aria-hidden="true">
                              <filter id={`mobile-crt-noise-${i}`} x="0%" y="0%" width="100%" height="100%">
                                  <feTurbulence
                                      type="fractalNoise"
                                      baseFrequency="1.2"
                                      numOctaves="1"
                                      seed={i * 13}
                                      stitchTiles="stitch"
                                  >
                                      <animate
                                          attributeName="seed"
                                          values={`${i * 7};${50 + i * 3};${100 - i * 5};${30 + i * 11};${80 - i * 9};${10 + i * 6};${60 - i * 4};${90 + i * 2};${20 - i * 8};${70 + i * 5}`}
                                          dur={`${2 + (i % 7) * 0.15}s`}
                                          repeatCount="indefinite"
                                      />
                                  </feTurbulence>
                                  <feComponentTransfer>
                                      <feFuncR type="discrete" tableValues="0 1" />
                                      <feFuncG type="discrete" tableValues="0 1" />
                                      <feFuncB type="discrete" tableValues="0 1" />
                                  </feComponentTransfer>
                              </filter>
                          </svg>
                          <div
                              className="absolute inset-[-50%]"
                              style={{
                                  width: "200%",
                                  height: "200%",
                                  filter: `url(#mobile-crt-noise-${i})`,
                                  animation: `no-signal-grain-${i} ${3 + i * 0.7}s steps(1) ${i * 1.3}s infinite`,
                                  opacity: 0.04,
                              }}
                          />
                          <div
                              className="absolute inset-0"
                              style={{
                                  background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
                              }}
                          />
                          <style>{`
                              @keyframes mobile-crt-flicker-${i} {
                                  0%, 100% { opacity: ${0.30 + (i % 3) * 0.02}; }
                                  ${10 + i * 2}% { opacity: ${0.38 - (i % 4) * 0.01}; }
                                  ${25 + i * 3}% { opacity: ${0.28 + (i % 5) * 0.02}; }
                                  ${45 + i}% { opacity: ${0.36 - (i % 3) * 0.015}; }
                                  ${65 + i * 2}% { opacity: ${0.31 + (i % 4) * 0.01}; }
                                  ${85 - i}% { opacity: ${0.37 - (i % 5) * 0.01}; }
                              }
                              @keyframes mobile-no-signal-show-${i} {
                                  0%, 65% { opacity: 0; }
                                  ${68 + (i % 3)}% { opacity: 0.9; }
                                  ${70 + (i % 4)}% { opacity: 0; }
                                  ${73 + (i % 3)}% { opacity: 0.85; }
                                  ${82 + (i % 5)}% { opacity: 0.85; }
                                  ${83 + (i % 4)}% { opacity: 0; }
                                  ${86 + (i % 3)}% { opacity: 0.9; }
                                  95% { opacity: 0.9; }
                                  97% { opacity: 0; }
                              }
                              @keyframes mobile-no-signal-bw-flicker-${i} {
                                  0%, 65% { opacity: 0; background: transparent; }
                                  ${68 + (i % 3)}% { opacity: 0.8; background: white; }
                                  ${69 + (i % 2)}% { opacity: 0.5; background: black; }
                                  ${70 + (i % 4)}% { opacity: 0; background: transparent; }
                                  ${73 + (i % 3)}% { opacity: 0.9; background: white; }
                                  ${76 + (i % 5)}% { opacity: 0.6; background: black; }
                                  ${78 + (i % 2)}% { opacity: 0.7; background: white; }
                                  ${82 + (i % 5)}% { opacity: 1.0; background: black; }
                                  ${83 + (i % 4)}% { opacity: 0; background: transparent; }
                                  ${86 + (i % 3)}% { opacity: 0.8; background: white; }
                                  ${88 + (i % 2)}% { opacity: 0.4; background: black; }
                                  95% { opacity: 0.6; background: white; }
                                  97%, 100% { opacity: 0; background: transparent; }
                              }
                              @keyframes mobile-no-signal-glitch-${i} {
                                  0%, 100% { transform: translate(0, 0); text-shadow: -1px 0 #ff0000, 1px 0 #00ffff; }
                                  20% { transform: translate(-2px, 1px); text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
                                  40% { transform: translate(1px, -1px); text-shadow: -1px 0 #ff0000, 1px 0 #00ffff; }
                                  60% { transform: translate(2px, 0); text-shadow: 1px 0 #ff0000, -1px 0 #00ffff; }
                                  80% { transform: translate(-1px, 1px); text-shadow: -2px 0 #ff0000, 2px 0 #00ffff; }
                              }
                          `}</style>
                          <div
                              className="absolute inset-0 bg-black"
                              style={{
                                  animation: `mobile-crt-flicker-${i} ${1.5 + (i % 7) * 0.15}s ease-in-out infinite`,
                              }}
                          />
                          <div
                              className="absolute inset-0 mix-blend-overlay pointer-events-none"
                              style={{
                                  animation: `mobile-no-signal-bw-flicker-${i} ${3 + i * 0.7}s steps(1) ${i * 1.3}s infinite`,
                                  opacity: 0,
                              }}
                          />
                          <div
                              className="absolute inset-0 flex items-center justify-center p-4 text-center"
                              style={{
                                  animation: `mobile-no-signal-show-${i} ${3 + i * 0.7}s ease-in-out ${i * 1.3}s infinite`,
                              }}
                          >
                              <span
                                  className="text-white font-bold tracking-[0.3em] uppercase select-none"
                                  style={{
                                      fontSize: "14px",
                                      fontFamily: "monospace",
                                      animation: `mobile-no-signal-glitch-${i} ${0.3 + (i % 3) * 0.1}s steps(1) infinite`,
                                      letterSpacing: "0.25em",
                                  }}
                              >
                                  NO SIGNAL
                              </span>
                          </div>
                      </div>
                    )}

                    <div className="relative w-full h-full">
                      <Image
                        src={project.src}
                        alt={project.alt}
                        fill
                        className="object-cover"
                        sizes="230px"
                      />
                    </div>

                  </motion.div>
                );
              })}
            </div>

            {/* Mobile: category label + description + CTA */}
            <div className="px-4 pb-0 flex flex-col gap-1 relative z-30 mt-2 shrink-0">

              {/* Fixed height container for Project Description to stabilize button position */}
              <div className="w-full origin-top-left" style={{ height: "120px", transform: "scale(0.85)", width: "117%" }}>
                <TypewriterText
                  title={PROJECTS[activeProjectIdx] ? PROJECTS[activeProjectIdx].alt : PROJECTS[0].alt}
                  text={PROJECTS[activeProjectIdx] ? PROJECTS[activeProjectIdx].desc : PROJECTS[0].desc}
                  isActive={true}
                  variant="light"
                  delay={0}
                />
              </div>

              <div className="flex justify-end items-center mt-1 origin-right" style={{ transform: "scale(0.85)" }}>
                {/* Manual navigation buttons removed as per request for auto-cycling */}
                <BracketButton
                  href="/contact"
                  color="white"
                  initialBgColor="#000000"
                  borderColor="#0066FF"
                  hoverBorderColor="#000000"
                >
                  Get a quote
                </BracketButton>
              </div>
            </div>

            {/* Mobile: Bottom "designer" headline SVG */}
            {/* Mobile: Bottom-aligned group containing Labels and Designer Headline */}
            <div className="mt-auto relative shrink-0">
              {/* Designer headline SVG */}
              <div
                className="relative w-full overflow-hidden"
                style={{ height: "clamp(300px, 82vw, 550px)", zIndex: 5 }}
              >
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: "-12vw", // Frame out the 'D' moderately
                      bottom: "-10vw", // Push image down slightly to avoid cropping top edge
                      width: "125%", 
                      height: "110%",
                    }}
                  >
                  <Image
                    src="/svgs/Mobile Hero Headline.svg"
                    alt="designer"
                    fill
                    className="object-contain object-left-bottom"
                    priority
                    style={{ filter: "brightness(0)" }}
                  />
                </div>
              </div>

              {/* bottom label row (PURPOSE / MEANING / VISUAL HIERARCHY / CLARITY / EXECUTION) floating over SVG */}
              <div className="absolute bottom-4 left-0 w-full px-4" style={{ zIndex: 30 }}>
                <div className="relative w-full h-[20px]">
                  <Image src="/svgs/hero-sub-heading.svg" alt="" fill className="object-contain object-left" style={{ filter: "brightness(0)" }} />
                </div>
              </div>
            </div>
          </div>

          {/* BlackHoleSideProjects — only mount on desktop to allow manual control on mobile */}
          {preloaderState === "DONE" && !isMobile && (
            <div className="hidden md:block">
              <BlackHoleSideProjects
                onActiveChange={setActiveProjectIdx}
                onHoverChange={setIsProjectHovered}
              />
            </div>
          )}
        </main>
      </div>

      <div className="relative z-10 w-full mt-[100vh]">
        <SecondSection />

        <ProjectsSection />

        <PlaygroundSection />

        {/* ═══════ CTA — TRANSMIT ═══════ */}
        <section className="bg-[#0066FF] text-white px-6 md:px-12 py-32 selection:bg-black selection:text-white overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white" />
            <div className="absolute top-0 left-3/4 w-[1px] h-full bg-white" />
            <div className="absolute top-1/3 left-0 w-full h-[1px] bg-white" />
            <div className="absolute top-2/3 left-0 w-full h-[1px] bg-white" />
          </div>
          <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-[2px] bg-white/40" />
              <span className="text-[11px] font-bold tracking-[0.5em] uppercase text-white/40">CTA — TRANSMIT</span>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
              <div>
                <h2 className="text-[clamp(48px,9vw,140px)] font-[900] leading-none tracking-[-0.04em] uppercase" style={{ fontFamily: "var(--font-post-no-bills)" }}>
                  HAVE AN<br />IDEA?
                </h2>
                <p className="mt-6 text-[16px] md:text-[20px] text-white/60 max-w-md leading-relaxed">
                  Open a channel. Let&apos;s build something worth archiving.
                </p>
              </div>
              <BracketButton href="/contact" color="white" initialBgColor="#000000" borderColor="#FFFFFF" hoverBgColor="#FFFFFF">
                Transmit a Message
              </BracketButton>
            </div>
            <div className="mt-24 pt-8 border-t border-white/10 flex flex-wrap justify-between gap-8 text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">
              <div className="flex gap-8">
                <span>CHANNEL: OPEN</span>
                <span>ENC: AES-256</span>
                <span>RESPONSE: WITHIN 24H</span>
              </div>
              <span>LAT: 23.8°N · 90.4°E</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
