"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import GeometricBackground from "./ui/geometric-background";

export default function WorksSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map vertical scroll (0 to 1) to horizontal translation
    const backgroundX = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"], { clamp: true });

    // Project cards horizontal movement
    const projectsX = useTransform(
        scrollYProgress,
        [0, 0.82, 1],
        ["65vw", "-695vw", "-695vw"],
        { clamp: true }
    );

    // Header horizontal movement
    const headerX = useTransform(scrollYProgress, [0, 1], ["0vw", "-500vw"], { clamp: true });

    // Subtle vertical parallax remains
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"], { clamp: true });

    // Opacity and scale for the content
    const contentOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0], { clamp: true });
    // Stable scale to start with
    const headingScale = useTransform(scrollYProgress, [0, 0.2], [1, 1]);

    // Section exit upwards - Final transition
    const sectionExitY = useTransform(scrollYProgress, [0.98, 1], ["0%", "-100%"], { clamp: true });

    return (
        <section
            ref={containerRef}
            className="relative w-full h-[400vh] bg-white light-bg-nav-trigger"
        >
            <motion.div
                style={{ y: sectionExitY }}
                className="sticky top-0 w-full h-[100dvh] overflow-hidden"
            >
                {/* Reusable Geometric Background - STAYS UNDER (z-0) */}
                <GeometricBackground
                    progress={scrollYProgress}
                    x={backgroundX}
                    y={backgroundY}
                    opacity={0.3}
                    triggerRange={[0.82, 0.98]}
                    strokeColor="#EBEBEB"
                    fillColor="#0004D9"
                />

                {/* Content Wrapper - Absolute positioning for precise corner anchoring */}
                <div className="relative z-10 w-full h-full">

                    {/* Horizontally Scrolling Projects Row - Vertically Centered */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center overflow-visible">
                        <motion.div
                            style={{ x: projectsX, opacity: contentOpacity }}
                            className="flex gap-[40vw] md:gap-[50vw] w-max cursor-grab active:cursor-grabbing items-center"
                        >
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className="w-[130vw] md:w-[900px] lg:w-[1000px] shrink-0"
                                >

                                    <motion.div
                                        whileHover="hover"
                                        initial="initial"
                                        variants={{
                                            initial: { scale: 1 },
                                            hover: { scale: 1.05 }
                                        }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="aspect-[3/2] bg-black rounded-none flex flex-col group overflow-hidden relative shadow-2xl transition-all duration-300 ease-out z-20 cursor-pointer"
                                    >
                                        {/* Background hover color layer */}
                                        <motion.div
                                            className="absolute inset-0 bg-[#0004D9] z-0"
                                            variants={{
                                                initial: { opacity: 0 },
                                                hover: { opacity: 1 }
                                            }}
                                            transition={{ duration: 0.3, ease: "circOut" }}
                                        />

                                        {/* Top Image Section */}
                                        <div className="h-[80%] w-full overflow-hidden relative border-b border-black/[0.1] z-10 p-0 group-hover:p-6 transition-all duration-300 ease-out">
                                            <div className="w-full h-full relative overflow-hidden">
                                                <motion.div
                                                    className="w-full h-full relative"
                                                    variants={{
                                                        initial: { scale: 1 },
                                                        hover: { scale: 0.95 }
                                                    }}
                                                    transition={{ duration: 0.3, ease: "circOut" }}
                                                >
                                                    <Image
                                                        src={`https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=1000&auto=format&fit=crop`}
                                                        alt={`Project ${item}`}
                                                        fill
                                                        className="object-cover opacity-90 transition-transform duration-1000"
                                                    />
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative z-20">
                                            <motion.h3
                                                className="text-white font-black text-[clamp(1.5rem,4vw,2.5rem)] leading-none tracking-tight uppercase"
                                                variants={{
                                                    initial: { y: 0 },
                                                    hover: { y: -12 }
                                                }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                            >
                                                EDOM LIVES
                                            </motion.h3>

                                            <div className="flex items-center gap-4 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] pt-6 border-t border-white/20">
                                                <span>Teaser</span>
                                                <span className="opacity-30">|</span>
                                                <span>00.46</span>
                                                <span className="opacity-30">|</span>
                                                <span>YouTube</span>
                                            </div>
                                        </div>

                                        {/* Subtle Overlay Pattern */}
                                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-30" />
                                    </motion.div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* SVG Works Heading - Anchored to Bottom Left corner */}
                    <motion.div
                        style={{ x: headerX, opacity: contentOpacity, scale: headingScale }}
                        className="absolute bottom-0 left-[-10vw] z-20 pointer-events-none"
                    >
                        <div className="relative w-[1150px] h-[350px] md:h-[450px] lg:h-[600px]">
                            <Image
                                src="/svgs/Works.svg"
                                alt="Works Heading"
                                fill
                                className="object-contain object-bottom"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
