"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const PROJECTS = [
    {
        id: "rokomferi",
        title: "ROKOMFERI",
        category: "E-Commerce",
        description: "A high-fidelity digital storefront for seamless content-driven commerce.",
        year: "2024",
        link: "/projects/rokomferi",
        image: "/projects/rokomferi-v2.png"
    },
    {
        id: "haus",
        title: "HAUS SYSTEM",
        category: "Architecture",
        description: "Structural design language for minimalist architectural exploration.",
        year: "2024",
        link: "#",
        image: "/projects/haus-v2.png"
    },
    {
        id: "abstract",
        title: "ABSTRACT",
        category: "Visual Design",
        description: "Deconstructing visual paradigms through generative geometric systems.",
        year: "2025",
        link: "#",
        image: "/projects/abstract-v2.png"
    }
];

export default function ProjectsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth progress for high-fidelity feel
    const progress = useSpring(scrollYProgress, {
        stiffness: 60,
        damping: 25,
        restDelta: 0.001
    });

    // Symmetric Scroll Timeline - Phase-Locked (1400vh total depth)
    // Phase 1 (Entrance: 0.05 - 0.25): H-Expand (0.05-0.15), V-Expand (0.15-0.25)
    // Phase 2 (Presence: 0.25 - 0.75): Locked at Full Screen
    // Phase 3 (Exit: 0.75 - 0.95): V-Shrink (0.75-0.85), H-Shrink (0.85-0.95)

    const boxScaleX = useTransform(progress,
        isMobile ? [0.05, 0.25, 0.75, 0.95] : [0.05, 0.15, 0.85, 0.95],
        [1, 35, 35, 1]
    );
    const boxScaleY = useTransform(progress,
        isMobile ? [0.05, 0.25, 0.75, 0.95] : [0.15, 0.25, 0.75, 0.85],
        [1, 40, 40, 1]
    );

    // Precise Hook Tracking - Adjust base width on mobile to match the 80px gap
    const hookXPositive = useTransform(boxScaleX, (val) => (isMobile ? 40 : 60) * (val - 1));
    const hookXNegative = useTransform(boxScaleX, (val) => -(isMobile ? 40 : 60) * (val - 1));

    // For ScaleY: box height 400, edge at 200. Displacement = 200 * (boxScaleY - 1)
    const hookYPositive = useTransform(boxScaleY, (val) => 200 * (val - 1));
    const hookYNegative = useTransform(boxScaleY, (val) => -200 * (val - 1));

    // DYNAMIC CLIP-PATH (The "Hole" in the page foreground)
    // We use a double-loop polygon to create a hole in a 100% container.
    // The first loop covers the screen, the second loop (reversed) creates the hole.
    const holeClipPath = useTransform(
        [boxScaleX, boxScaleY],
        ([sX, sY]: any[]) => {
            const hw = isMobile ? 40 : 60; // half-width
            const hh = 200; // half-height
            const dx = hw * sX;
            const dy = hh * sY;

            // Exact CSS calc based on px offset from center guarantees perfect alignment with grid on all screens
            return `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, calc(50% - ${dx}px) calc(50% - ${dy}px), calc(50% - ${dx}px) calc(50% + ${dy}px), calc(50% + ${dx}px) calc(50% + ${dy}px), calc(50% + ${dx}px) calc(50% - ${dy}px), calc(50% - ${dx}px) calc(50% - ${dy}px))`;
        }
    );

    // Text transitions (Pushing out and Pulling in symmetrically)
    const featuredX = useTransform(progress,
        [0.05, 0.12, 0.88, 0.95],
        [isMobile ? 0 : 0, isMobile ? -500 : -5000, isMobile ? -500 : -5000, isMobile ? 0 : 0]
    );

    const listX_total = useSpring(
        useTransform(progress,
            isMobile ? [0.10, 0.50, 0.90] : [0.15, 0.5, 0.85],
            ["0vw", "-97vw", "-194vw"]
        ),
        // Looser spring on mobile for that "every scroll counts", highly connected smooth glide
        {
            stiffness: isMobile ? 40 : 90,
            damping: isMobile ? 20 : 25
        }
    );

    const listOpacity = useTransform(progress,
        [0, 1],
        [1, 1]
    );
    const projectX = useTransform(progress,
        [0.05, 0.12, 0.88, 0.95],
        [isMobile ? 0 : 0, isMobile ? 500 : 5000, isMobile ? 500 : 5000, isMobile ? 0 : 0]
    );

    const [isDarkBg, setIsDarkBg] = useState(false);

    useMotionValueEvent(boxScaleY, "change", (latest) => {
        const vh = typeof window !== 'undefined' ? window.innerHeight : 1000;
        if (vh / 2 - latest * 30 < 60) {
            if (!isDarkBg) setIsDarkBg(true);
        } else {
            if (isDarkBg) setIsDarkBg(false);
        }
    });

    // Dynamic height based on device to tweak scroll speed.
    // 1400vh means more scroll distance to complete the animation (slower feel).
    // 300vh means dramatically less physical scroll distance required (roughly 3x faster than 800vh).
    const sectionHeight = isMobile ? "h-[300vh]" : "h-[1400vh]";

    return (
        <section ref={containerRef} className={`relative ${sectionHeight} w-full bg-[#F5F7FF]`}>
            <div className={`sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-300 ${isDarkBg ? 'dark-bg-nav-trigger' : 'light-bg-nav-trigger'}`}>

                {/* LAYER 0: THE BACKDROP (Projects, visible through the hole) */}
                <motion.div
                    style={{
                        opacity: listOpacity,
                    }}
                    className="absolute inset-0 z-0 bg-black flex items-center overflow-hidden"
                >
                    <motion.div
                        style={{ x: listX_total }}
                        className="flex flex-row gap-[12vw] pl-[7.5vw] md:pl-[25vw] items-center h-full w-full min-w-max"
                    >
                        {PROJECTS.map((project) => (
                            <Link
                                key={project.id}
                                href={project.link}
                                className="group relative flex flex-col gap-8 w-[85vw] md:w-[65vw] max-w-[1000px] h-fit shrink-0"
                            >
                                {/* Top Side: Visual Mockup */}
                                <div className="relative w-full aspect-[16/10] rounded-sm overflow-hidden border border-white/5 bg-white/5 backdrop-blur-3xl group-hover:border-white/20 transition-all duration-1000 ease-out shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-20" />
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-1000 ease-out"
                                        sizes="(max-width: 1400px) 100vw, 1400px"
                                        priority={project.id === "rokomferi"}
                                    />
                                    <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                                </div>

                                {/* Bottom Side: Minimalist Text - Exactly like the reference */}
                                <div className="flex flex-col gap-2 px-4 md:px-0">
                                    <h2 className="text-white text-2xl md:text-5xl font-bold tracking-tight leading-none">
                                        {project.title}
                                    </h2>
                                    <p className="text-white/50 text-sm md:text-xl font-light max-w-[800px] leading-tight">
                                        {project.description}
                                    </p>
                                    <div className="flex items-center gap-4 mt-6">
                                        <span className="text-[#D2F925] font-mono text-[10px] tracking-[0.4em] uppercase opacity-40">
                                            {project.category}
                                        </span>
                                        <span className="w-8 h-[1px] bg-white/10" />
                                        <span className="text-white/20 font-mono text-[10px] tracking-[0.4em] uppercase">
                                            {project.year}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                </motion.div>

                {/* LAYER 1: THE FOREGROUND (White page with the dynamic cutout) */}
                <motion.div
                    style={{
                        clipPath: holeClipPath
                    }}
                    className="absolute inset-0 z-10 bg-[#F5F7FF] flex items-center justify-center light-bg-nav-trigger"
                >
                    <div className="relative grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center w-full max-w-full overflow-hidden">
                        <div className="flex justify-end">
                            <motion.div
                                style={{ x: featuredX }}
                                className="md:pr-16 select-none leading-none flex items-center whitespace-nowrap"
                            >
                                <img src="/Featured.svg" alt="FEATURED" className="h-[10vw] md:h-[8vw] w-auto object-contain pointer-events-none" />
                            </motion.div>
                        </div>

                        {/* Gap for the cutout area - Narrower on mobile for text visibility */}
                        <div className="w-[80px] md:w-[120px] h-[400px] shrink-0" />

                        <div className="flex justify-start">
                            <motion.div
                                style={{ x: projectX }}
                                className="md:pl-16 select-none leading-none flex items-center whitespace-nowrap"
                            >
                                <img src="/Project.svg" alt="PROJECT" className="h-[10vw] md:h-[8vw] w-auto object-contain pointer-events-none" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* LAYER 2: THE HOOKS (Always on top, purely aesthetic) */}
                <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                        <motion.div
                            style={{
                                x: hookXPositive,
                                y: hookYNegative
                            }}
                            className="absolute -top-6 -right-6 w-10 h-10 border-t-2 border-r-2 border-black"
                        />
                        <motion.div
                            style={{
                                x: hookXNegative,
                                y: hookYPositive
                            }}
                            className="absolute -bottom-6 -left-6 w-10 h-10 border-b-2 border-l-2 border-black"
                        />
                        <div className="w-[80px] md:w-[120px] h-[400px]" />
                    </div>
                </div>

            </div>
        </section>
    );
}
