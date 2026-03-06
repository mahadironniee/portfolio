"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, animate, useScroll, useTransform } from "framer-motion";
import HeadingSvg from "@/components/ui/heading-svg";
import SmokeCanvas from "@/components/ui/smoke-canvas";
import GeometricBackground from "@/components/ui/geometric-background";

const GREY = "#BABABA";
const DARK = "#515055";
const BLUE = "#0004D9";
const EASE = [0.22, 1, 0.36, 1] as any;

export default function SecondSection() {
    // Ref on the SVG wrapper — hover triggers only when cursor is over the actual heading
    const svgRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const fillValue = useMotionValue(GREY);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    // Geometric background scrolling
    const backgroundX = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"], { clamp: true });
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"], { clamp: true });

    // Map scroll progress for "unfill" animation
    // When section enters (scrollYProgress 0 to 0.5), the blocks unfill (isInverse=true)
    const geoProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1], { clamp: true });

    // Map scroll progress to a height percentage for the blue lines.
    const topLineHeight = useTransform(scrollYProgress, [0, 0.25], ["0%", "100%"]);

    // Calculate when the BOTTOM of the section intersects the BOTTOM of the viewport
    const { scrollYProgress: bottomScrollYProgress } = useScroll({
        target: sectionRef,
        // "end end" -> when the bottom of section hits bottom of viewport (lines just appeared)
        // "end 40%" -> when the bottom of section hits 40% up the viewport
        offset: ["end end", "end 40%"],
    });

    // Animate from 0 to 100% over the first ~20-30% of that distance, 
    // starting immediately when `bottomScrollYProgress` hits 0 (end of section hits bottom of viewport)
    const bottomLineHeight = useTransform(bottomScrollYProgress, [0, 0.25], ["0%", "100%"]);

    // Sync the emptying of the top line with the filling of the bottom line
    // As the bottom line fills (0% -> 100%), the top line empties from the top (top: 0% -> 100%)
    const topLineTop = useTransform(bottomScrollYProgress, [0, 0.25], ["0%", "100%"]);

    // Opacity for the continuous smoke effect
    // Fades in when top lines finish filling (0.25), stays until bottom lines start filling (0.4)
    const smokeOpacity = useTransform(
        scrollYProgress,
        [0.2, 0.25, 0.35, 0.4],
        [0, 1, 1, 0]
    );

    // Crossfade the crisp vector out so WebGL text takes over seamlessly
    const crispVectorOpacity = useTransform(smokeOpacity, [0, 0.05], [1, 0]);

    // Separate distortion amount: peaks slightly at the start and end of the smoke phase, 95% reduced in middle
    const distortionAmount = useTransform(
        scrollYProgress,
        [0.2, 0.25, 0.28, 0.32, 0.35, 0.4],
        [0, 1, 0.05, 0.05, 1, 0]
    );

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
                animate(fillValue, inside ? DARK : GREY, {
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
    }, [fillValue]);

    return (
        <section ref={sectionRef} className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-6 overflow-hidden light-bg-nav-trigger">
            {/* Reusable Geometric Background - Cut-out mask mode */}
            <GeometricBackground
                progress={geoProgress}
                x={backgroundX}
                y={backgroundY}
                opacity={0.3}
                isMask={true}
                isInverse={true}
                maskBaseColor="#F5F5FA"
                triggerRange={[0, 1]}
                strokeColor="#E1E1E6"
            />

            {/* Top vertical lines */}
            {/* Top vertical lines - Commented out for future use */}
            {/* <div className="absolute top-0 left-0 w-full h-[244px] px-6 flex justify-between pointer-events-none">
                {[...Array(9)].map((_, i) => (
                    <div key={`top-${i}`} className="relative w-[4px] h-full bg-[#E1E1E6] rounded-b-[4px] overflow-hidden">
                        <motion.div
                            className="absolute left-0 w-full bg-[#0004D9]/85 rounded-b-[4px]"
                            style={{
                                height: topLineHeight,
                                top: topLineTop
                            }}
                        />
                    </div>
                ))}
            </div> */}

            <div className="w-full flex flex-col items-center justify-center z-10">
                {/* ref is on the SVG wrapper — only this bounds box triggers hover */}
                <motion.div
                    ref={svgRef}
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: EASE }}
                    className="w-full max-w-[1751px] aspect-[1751/336] relative select-none"
                >
                    {/* Realistic Particle Smoke Effect driven by the exact same text paths */}
                    <SmokeCanvas
                        smokeOpacity={smokeOpacity}
                        fillValue={fillValue}
                        distortionAmount={distortionAmount}
                    />

                    <motion.div style={{ opacity: crispVectorOpacity }} className="w-full h-full relative z-10 pointer-events-auto">
                        <HeadingSvg fillValue={fillValue} />
                    </motion.div>
                </motion.div>
            </div>

        </section>
    );
}
