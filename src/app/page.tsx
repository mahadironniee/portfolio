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
  const pupilX = useMotionValue(0);
  const pupilY = useMotionValue(0);
  const pupilScale = useMotionValue(1);
  const socketX = useMotionValue(0);
  const socketY = useMotionValue(0);
  const socketScaleX = useMotionValue(1);
  const socketScaleY = useMotionValue(1);
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

    // Lock scrolling on mount
    document.body.style.overflow = "hidden";

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
      document.documentElement.removeAttribute('data-preloading');
    };
  }, []);

  // Sync preloader state with document for CSS-based hiding
  useEffect(() => {
    if (preloaderState !== "DONE") {
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

  const dropTransition = {
    type: "tween" as const,
    ease: [0.5, 0, 1, 1] as const, // cubic ease-in mapped via array tuple
    duration: 1.8
  };

  const shatterTransition = (delaySec: number) => ({
    x: { type: "spring" as const, stiffness: 250, damping: 20, mass: 0.8, delay: delaySec },
    y: { type: "spring" as const, stiffness: 250, damping: 20, mass: 0.8, delay: delaySec },
    scale: { type: "spring" as const, stiffness: 250, damping: 20, mass: 0.8, delay: delaySec },
    opacity: { type: "tween" as const, duration: 0.8, ease: "linear" as const, delay: delaySec + 0.1 }
  });

  // physics for the pupil (strictly interactive)
  const springConfig = { damping: 20, stiffness: 250, mass: 0.2 };
  const smoothX = useSpring(pupilX, springConfig);
  const smoothY = useSpring(pupilY, springConfig);

  const scaleSpringConfig = { damping: 25, stiffness: 150, mass: 0.4 };
  const smoothScale = useSpring(pupilScale, scaleSpringConfig);

  const eyeHoverMotion = useMotionValue(0);
  const smoothEyeHover = useSpring(eyeHoverMotion, { stiffness: 400, damping: 25 });

  const finalPupilScaleX = useTransform(
    [smoothScale, smoothEyeHover] as MotionValue<number>[],
    ([scale, hover]: number[]) => scale * (1 - hover) + 1.4 * hover
  );
  const finalPupilScaleY = useTransform(
    [smoothScale, smoothEyeHover] as MotionValue<number>[],
    ([scale, hover]: number[]) => scale * (1 - hover) + 0.15 * hover
  );

  const socketSpringConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const smoothSocketX = useSpring(socketX, socketSpringConfig);
  const smoothSocketY = useSpring(socketY, socketSpringConfig);
  const smoothSocketScaleX = useSpring(socketScaleX, socketSpringConfig);
  const smoothSocketScaleY = useSpring(socketScaleY, socketSpringConfig);

  const trackerRef = React.useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    let animationFrameId: number;

    const updateEye = (targetX: number, targetY: number) => {
      if (!eyeRef.current) return;
      const { left, top, width, height } = eyeRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const deltaX = targetX - centerX;
      const deltaY = targetY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = Math.atan2(deltaY, deltaX);
      const MAX_RADIUS = 7.0;
      const mappedRadius = (distance / (distance + 400)) * MAX_RADIUS;
      const MAX_SCALE = 1.35;
      const mappedScale = 1.0 + (distance / (distance + 800)) * (MAX_SCALE - 1.0);

      pupilX.set(Math.cos(angle) * mappedRadius);
      pupilY.set(Math.sin(angle) * mappedRadius);
      pupilScale.set(mappedScale);

      const MAX_SOCKET_SHIFT = 5.0;
      const mappedSocketShift = (distance / (distance + 350)) * MAX_SOCKET_SHIFT;
      const MAX_SQUISH = 0.15;
      const squishAmount = (distance / (distance + 500)) * MAX_SQUISH;
      const absCos = Math.abs(Math.cos(angle));
      const absSin = Math.abs(Math.sin(angle));
      const scaleXAmount = 1.0 - (squishAmount * absCos) + (squishAmount * absSin * 0.4);
      const scaleYAmount = 1.0 - (squishAmount * absSin) + (squishAmount * absCos * 0.4);

      socketX.set(Math.cos(angle) * mappedSocketShift);
      socketY.set(Math.sin(angle) * mappedSocketShift);
      socketScaleX.set(scaleXAmount);
      socketScaleY.set(scaleYAmount);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (preloaderState === "DONE") {
        updateEye(e.clientX, e.clientY);
      }
    };

    const trackPreloader = () => {
      if (preloaderState !== "DONE" && trackerRef.current) {
        const { left, top, width, height } = trackerRef.current.getBoundingClientRect();
        updateEye(left + width / 2, top + height / 2);
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
  }, [preloaderState, pupilX, pupilY, pupilScale, socketX, socketY, socketScaleX, socketScaleY]);

  return (
    <>
      {preloaderState === "DONE" && <CursorBrush externalX={mouseX} externalY={mouseY} />}
      {preloaderState !== "DONE" && <EnergyGathering x={mouseX} y={mouseY} />}
      <AnimatePresence>
        {preloaderState !== "DONE" && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
            className="fixed inset-0 z-60 bg-[#FFFFFF] flex flex-col items-center pt-[147px] light-bg-nav-trigger overflow-hidden"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {/* Background Grid - consistent with playground */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />
            </div>

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

              {/* The Preloader Eye (Unfiltered) */}
              <motion.div
                className="absolute pointer-events-none bg-[#D9D9D9] rounded-full"
                style={{
                  width: 39,
                  height: 39,
                  left: 636.5,
                  top: 122,
                  x: smoothSocketX,
                  y: smoothSocketY,
                  scaleX: smoothSocketScaleX,
                  scaleY: smoothSocketScaleY,
                }}
              >
                <motion.div
                  style={{
                    width: 24,
                    height: 24,
                    left: 7.5,
                    top: 7.5,
                    x: smoothX,
                    y: smoothY,
                    scaleX: finalPupilScaleX,
                    scaleY: finalPupilScaleY,
                  }}
                  className="absolute"
                >
                  <div className="w-full h-full bg-[#A3A3A3] rounded-full" />
                </motion.div>
              </motion.div>
            </div>

            {/* Motion Tracker — Viewport-wide overlay for travel between headline and navbar */}
            <motion.div
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
            </motion.div>

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
        style={{ visibility: preloaderState === "DONE" ? "visible" : "hidden" }}
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

          {/* ══════ DESKTOP LAYOUT ══════ */}
          <div className="hidden md:block">
            {/* Desktop: HeroHeadlineSVG (the "designer" text) at bottom-left */}
            <div className="absolute left-[-103px] bottom-[-100px] w-[1202px] h-[604px] pointer-events-none z-0">
              <Image
                src="/svgs/HeroHeadlineSVG-Live.svg"
                alt="Designer Creative Headline"
                fill
                className="object-contain"
                priority
              />

              <motion.div
                ref={eyeRef}
                className="absolute pointer-events-auto cursor-pointer bg-[#F0F0F0] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                onMouseEnter={() => eyeHoverMotion.set(1)}
                onMouseLeave={() => eyeHoverMotion.set(0)}
                style={{
                  width: 39,
                  height: 39,
                  left: 636.5,
                  top: 122,
                  x: smoothSocketX,
                  y: smoothSocketY,
                  scaleX: smoothSocketScaleX,
                  scaleY: smoothSocketScaleY,
                }}
              >
                <motion.div
                  style={{
                    width: 24,
                    height: 24,
                    left: 7.5,
                    top: 7.5,
                    x: smoothX,
                    y: smoothY,
                    scaleX: finalPupilScaleX,
                    scaleY: finalPupilScaleY,
                  }}
                  className="absolute"
                >
                  <div className="w-full h-full bg-black rounded-full animate-blink" />
                </motion.div>
              </motion.div>
            </div>

            {/* Desktop: TypewriterText + CTA */}
            <div className="absolute z-[210] flex flex-col items-end gap-2" style={{ left: "19%", top: "calc(40% - 132px)", width: "648px" }}>
              <div className="w-full h-[220px]">
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

          {/* Desktop-only: sub-heading label bar — must be a direct child of main for correct absolute positioning */}
          <div className="hidden md:block absolute bottom-8 md:bottom-6 w-full max-w-[1400px] h-[32px] px-3 translate-x-[60px] pointer-events-none z-[210]" style={{ filter: "brightness(0)" }}>
            <div className="relative w-full h-full">
              <Image src="/svgs/hero-sub-heading.svg" alt="" fill className="object-contain" />
            </div>
          </div>

          {/* ══════ MOBILE LAYOUT ══════ */}
          <div className="md:hidden absolute inset-0 flex flex-col" style={{ paddingTop: "80px" }}>
            {/* ── Mobile card carousel ──────────────────────────────────────────
                All 7 cards always rendered. Each computes its signed distance
                (norm) from the active card and springs to the matching slot.
                Slot positions are calculated so cards NEVER overlap.
                Card base: 230×172px
                  Center (norm=0): scale 0.75 → ~173px wide, x=0
                  Sides  (norm=±1): scale 0.45 → ~104px wide, x=±153
                  Off-screen:       opacity 0, x=±500
                Gap = 153 - 86 - 52 = 15px on each side ✓                   */}
            <div className="relative w-full overflow-hidden" style={{ height: "210px" }}>
              {PROJECTS.map((project, i) => {
                const N = PROJECTS.length;
                const cur = activeProjectIdx >= 0 ? activeProjectIdx : 0;
                const raw = ((i - cur) % N + N) % N;
                // norm: signed ring distance, range -(N/2) … +(N/2)
                const norm = raw > Math.floor(N / 2) ? raw - N : raw;

                let targetX: number, targetY: number, targetScale: number, targetOpacity: number;
                // Reverse direction: 1=coming from left, -1=leaving on right
                if (norm === 1) { targetX = -153; targetY = 22; targetScale = 0.45; targetOpacity = 0.78; }
                else if (norm === 0) { targetX = 0; targetY = 0; targetScale = 0.75; targetOpacity = 1.00; }
                else if (norm === -1) { targetX = 153; targetY = 22; targetScale = 0.45; targetOpacity = 0.78; }
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
                    <Image
                      src={project.src}
                      alt={project.alt}
                      fill
                      className="object-cover"
                      sizes="230px"
                    />
                    {/* HUD magnifying-glass brackets — center card only */}
                    {norm === 0 && (
                      <>
                        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#0066FF]" />
                        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#0066FF]" />
                        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#0066FF]" />
                        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#0066FF]" />
                        {/* Scan line animation */}
                        <motion.div
                          initial={{ top: "0%" }}
                          animate={{ top: ["0%", "100%", "0%"] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-[1px] bg-[#0066FF]/50 pointer-events-none"
                        />
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile: category label + description + CTA */}
            <div className="px-4 pb-4 flex flex-col gap-3" style={{ zIndex: 30 }}>


              <div style={{ minHeight: "80px" }}>
                <TypewriterText
                  title={activeProjectIdx !== -1 ? PROJECTS[activeProjectIdx].alt : ""}
                  text={activeProjectIdx !== -1 ? PROJECTS[activeProjectIdx].desc : PROJECTS[2].desc}
                  isActive={true}
                  isPaused={false}
                  variant="light"
                  showHighlight={true}
                />
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 border border-[#0066FF] flex items-center justify-center bg-transparent active:bg-[#0066FF] active:text-white transition-colors"
                  >
                    <span className="text-[#0066FF] font-bold active:text-white">&lt;</span>
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 border border-[#0066FF] flex items-center justify-center bg-transparent active:bg-[#0066FF] active:text-white transition-colors"
                  >
                    <span className="text-[#0066FF] font-bold active:text-white">&gt;</span>
                  </button>
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

            {/* Mobile: Bottom "designer" headline SVG */}
            <div
              className="relative w-full overflow-hidden"
              style={{ height: "clamp(100px, 22vw, 160px)", zIndex: 5 }}
            >
              {/* Left bracket arc decoration (matching the design's left-side half-circle) */}
              <div
                className="absolute left-0 top-0 h-full pointer-events-none"
                style={{
                  width: "clamp(60px, 14vw, 100px)",
                  borderRight: "14px solid black",
                  borderTopRightRadius: "999px",
                  borderBottomRightRadius: "999px",
                }}
              />
              <div
                className="absolute pointer-events-none"
                style={{
                  left: "clamp(55px, 13vw, 95px)",
                  top: 0,
                  width: "calc(100% - clamp(20px, 6vw, 50px))",
                  height: "100%",
                }}
              >
                <Image
                  src="/svgs/HeroHeadlineSVG-Live.svg"
                  alt="designer"
                  fill
                  className="object-contain object-left"
                  priority
                  style={{ filter: "brightness(0)" }}
                />
              </div>
            </div>

            {/* Mobile: bottom label row (PURPOSE / MEANING / VISUAL HIERARCHY / CLARITY / EXECUTION) */}
            <div className="px-4 pb-3" style={{ zIndex: 30 }}>
              <div className="relative w-full h-[20px]">
                <Image src="/svgs/hero-sub-heading.svg" alt="" fill className="object-contain object-left" style={{ filter: "brightness(0)" }} />
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
