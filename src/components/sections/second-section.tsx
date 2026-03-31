"use client";

import { useEffect, useRef } from "react";
import { 
    motion, 
    useScroll, 
    useTransform, 
    useSpring,
    AnimatePresence, 
    animate, 
    useMotionValue 
} from "framer-motion";
import HeadingSvg from "@/components/ui/heading-svg";
import SmokeCanvas from "@/components/ui/smoke-canvas";
import GeometricBackground from "@/components/ui/geometric-background";

const GREY = "#BABABA";
const DARK = "#515055";
const BLUE = "#000000";
const EASE = [0.22, 1, 0.36, 1] as any;

export default function SecondSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const svgRef = useRef<HTMLDivElement>(null);
    const hoverProgress = useMotionValue(0);

    // Track scroll through the whole 200vh section (for pinned animations)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    // Track entry progress (from entering viewport to hitting the top)
    // This restores the original "unfill" animation timing
    const { scrollYProgress: entryProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "start start"],
    });

    // --- Cinematic Transformations ---

    const headingYRaw = useTransform(scrollYProgress, [0, 1], ["0px", "0px"]);
    const headingY = useSpring(headingYRaw, { stiffness: 80, damping: 20 });



    // Dedicated Navbar Sync Trigger: 
    // Hits the 600px detection threshold right at the start of expansion (0.14).
    // Once triggered, the navbar slides out independently via a 1.2s CSS transition.
    const navHideTriggerY = useTransform(scrollYProgress, [0.14, 0.18, 1], ["600px", "0px", "0px"], { clamp: true });

    // Background animation synced with entry
    const backgroundX = useTransform(entryProgress, [0, 1], ["0%", "5%"], { clamp: true });
    const backgroundY = useTransform(entryProgress, [0, 1], ["0%", "10%"], { clamp: true });
    

    // Geometric blocks fill up while the section is entering the viewport
    const geoProgress = useTransform(entryProgress, [0, 1], [0, 1], { clamp: true });

    // Smoke effect starts right before the centered text enters viewport
    const smokeOpacity = useTransform(entryProgress, [0.35, 0.42, 0.7, 0.8], [0, 1, 1, 0]);
    const crispVectorOpacity = useTransform(smokeOpacity, [0, 0.05], [1, 0]);
    const distortionAmount = useTransform(entryProgress, [0.35, 0.42, 0.5, 0.6, 0.7, 0.8], [0, 1, 0.05, 0.05, 1, 0]);

    useEffect(() => {
        let prevInside = false;
        const mouse = { x: 0, y: 0 };

        const checkBounds = () => {
            if (!svgRef.current) return;
            const r = svgRef.current.getBoundingClientRect();
            const inside =
                mouse.x >= r.left && mouse.x <= r.right &&
                mouse.y >= r.top && mouse.y <= r.bottom;

            if (inside !== prevInside) {
                prevInside = inside;
                animate(hoverProgress, inside ? 1 : 0, {
                    duration: 0.7,
                    ease: EASE,
                });
            }
        };

        const onMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            checkBounds();
        };

        const onScroll = () => checkBounds();

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("scroll", onScroll);
        };
    }, [hoverProgress]);

    return (
        <section 
            ref={sectionRef} 
            className="relative w-full h-[100vh] dark-bg-nav-trigger second-section-nav-trigger"
        >
            {/* Standard Container - The section will just flow naturally into the fully blue CTA without pinning */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                
                {/* Block 1: Geometric Reveal Background */}
                <div className="absolute inset-0 z-[1] pointer-events-none">
                    <GeometricBackground
                        progress={geoProgress}
                        x={backgroundX}
                        y={backgroundY}
                        opacity={0.3}
                        isMask={false}
                        isInverse={false}
                        fillColor="#000000"
                        triggerRange={[0, 1]}
                        strokeColor="#FFFFFF"
                    />
                </div>

                {/* Block 1.5: Structural Grid Lines (Blueprint Style) */}
                <div className="absolute inset-0 pointer-events-none z-[2] opacity-20">
                    <div className="absolute top-0 left-1/4 w-[1px] h-full bg-[#0066FF]" />
                    <div className="absolute top-0 left-2/4 w-[1px] h-full bg-[#0066FF]" />
                    <div className="absolute top-0 left-3/4 w-[1px] h-full bg-[#0066FF]" />
                    <div className="absolute top-1/4 left-0 w-full h-[1px] bg-[#0066FF]" />
                    <div className="absolute top-2/4 left-0 w-full h-[1px] bg-[#0066FF]" />
                    <div className="absolute top-3/4 left-0 w-full h-[1px] bg-[#0066FF]" />
                </div>

                {/* Technical "BG Lines" (Purely Horizontal & Vertical Technical Lines) */}
                <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden opacity-20">
                    {/* Top Marker Line (matches Transmit CTA) */}
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-[1400px] px-6 md:px-12">
                         <div className="flex items-center gap-4">
                             <div className="w-10 h-[2px] bg-[#0066FF]" />
                             <span className="text-[11px] font-bold tracking-[0.5em] uppercase text-[#0066FF]">PROCESS — SYSTEM_CORE</span>
                         </div>
                    </div>

                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                        {/* 1. Segmented Vertical Lines */}
                        <g stroke="#0066FF" strokeWidth="0.5">
                            <path d="M150 0 V1000" strokeWidth="0.2" opacity="0.6" />
                            <path d="M200 0 V150 M200 180 V450 M200 480 V1000" />
                            <path d="M198 160 H202 M198 465 H202" />
                            
                            <path d="M800 0 V300 M800 330 V650 M800 680 V1000" strokeWidth="0.3" opacity="0.8" />
                            <path d="M850 0 V1000" strokeWidth="0.2" opacity="0.6" />
                        </g>

                        {/* 2. Segmented Horizontal Lines */}
                        <g stroke="#0066FF" strokeWidth="0.5">
                            <path d="M0 333 H420 M480 333 H1000" />
                            <path d="M440 330 V336 M460 330 V336" strokeWidth="0.3" opacity="0.8" />
                            
                            <path d="M0 666 H1000" strokeWidth="0.2" opacity="0.6" />
                            <path d="M0 150 H100 M900 150 H1000" />
                        </g>

                        {/* 3. Small Technical "Plus" Markers at intersections */}
                        <g stroke="#0066FF" strokeWidth="0.4" opacity="0.8">
                            <path d="M148 333 H152 M150 331 V335" />
                            <path d="M848 333 H852 M850 331 V335" />
                            <path d="M148 666 H152 M150 664 V668" />
                            <path d="M848 666 H852 M850 664 V668" />
                        </g>
                    </svg>
                </div>


                {/* Block 2: PREVIOUS Grid removed in favor of Window Background */}


                {/* Block 3: The Heading Text - HIGHEST Z-INDEX to stay on top of sliding window */}
                <motion.div 
                    style={{ y: headingY }}
                    className="absolute z-[60] w-full flex flex-col items-center justify-center pointer-events-none"
                >
                    <div ref={svgRef} className="w-full max-w-[1751px] aspect-[1751/336] relative select-none pointer-events-auto">
                        <SmokeCanvas
                            smokeOpacity={smokeOpacity}
                            hoverProgress={hoverProgress}
                            distortionAmount={distortionAmount}
                        />
                        <motion.div style={{ opacity: crispVectorOpacity }} className="w-full h-full relative z-10">
                            <HeadingSvg hoverProgress={hoverProgress} />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Navbar Sync Trigger (Invisible but has volume for detection) */}
                <motion.div 
                    style={{ y: navHideTriggerY }}
                    data-navbar-hide="true"
                    className="absolute top-0 left-0 w-full h-[100dvh] opacity-0 pointer-events-none"
                />
            </div>
        </section>
    );
}
