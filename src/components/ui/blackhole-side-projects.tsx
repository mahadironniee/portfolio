import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate, MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export const PROJECTS = [
    { src: "/images/projects/blackhole-1.png", alt: "SaaS Dashboard", desc: "A comprehensive analytics platform for enterprise SaaS, featuring real-time data visualization and user behavior tracking.", href: "#" },
    { src: "/images/projects/blackhole-2.png", alt: "Fintech App", desc: "A secure and intuitive mobile banking experience designed for seamless cross-border transactions and wealth management.", href: "#" },
    { src: "/images/projects/blackhole-3.png", alt: "E-commerce", desc: "High-conversion storefront with dynamic 3D product previews and AI-driven personalized shopping recommendations.", href: "#" },
    { src: "/images/projects/blackhole-4.png", alt: "AI Tool", desc: "Generative AI interface for creative workflows, streamlining asset generation through natural language processing.", href: "#" },
    { src: "/images/projects/blackhole-5.png", alt: "Portfolio", desc: "Minimalist brutalist portfolio showcasing digital products through bold typography and experimental motion design.", href: "#" },
    { src: "/images/projects/blackhole-6.png", alt: "Food Delivery", desc: "Real-time logistics platform tracking deliveries with predictive ETAs and an engaging consumer-facing order interface.", href: "#" },
    { src: "/images/projects/abstract-v2.png", alt: "Abstract", desc: "Experimental visual exploration of algorithmic patterns and generative geometry rendered in WebGL.", href: "#" },
];

const CARD_W = 360;
const CARD_H = 270; // 4:3 ratio
const CONTAINER_H = 1740;

// 4 slot positions (translateY from bottom:0)
// Recalculated for visible edges (Scale 0.7 = 63px visible height)
// P1 Center: 165.5 -> y: -369.5 (Gap to glass top: 24)
// P2 Center: 290.0 -> y: -245.0 (Magnified at container center)
// P3 Center: 414.5 -> y: -120.5 (Gap to glass bottom: 24)
// P4 Center: 501.5 -> y: -33.5  (Gap to P3: 24)
const POS_4 = 744;
const POS_3 = 372;
const POS_2 = 0;
const POS_1 = -372;
const POS_ENTER = 1116;
const POS_EXIT = -1116;

// Timing: 3s hold, 0.5s move -> 3.5s per slot. 7 cards * 3.5s = 24.5s cycle.
const CYCLE = 24.5;

export default function BlackHoleSideProjects({
    onActiveChange,
    onHoverChange
}: {
    onActiveChange?: (index: number) => void;
    onHoverChange?: (hovered: boolean) => void;
}) {
    const stagger = 3.5; // EXACTLY 3.5s stagger between each card
    const lastActiveRef = useRef<number>(-1);
    const [isHovered, setIsHovered] = useState(false);
    const accumulatedTimeRef = useRef(0);
    const lastTickRef = useRef(Date.now());

    const tMotion = useMotionValue(0);
    const targetTimeRef = useRef<number | null>(null);
    const hoverMotion = useMotionValue(0);

    useEffect(() => {
        animate(hoverMotion, isHovered ? 1 : 0, { duration: 0.3, ease: "easeInOut" });
    }, [isHovered, hoverMotion]);

    useEffect(() => {
        if (!onActiveChange) return;
        let frame: number;

        const update = () => {
            const now = Date.now();
            const delta = (now - lastTickRef.current) / 1000;
            lastTickRef.current = now;

            if (isHovered) {
                if (targetTimeRef.current === null) {
                    const t = accumulatedTimeRef.current;
                    // Snap to the nearest perfectly centered point (offset 2.0s)
                    targetTimeRef.current = Math.round((t - 2.0) / 3.5) * 3.5 + 2.0;
                }
                accumulatedTimeRef.current += (targetTimeRef.current - accumulatedTimeRef.current) * 0.15;
            } else {
                accumulatedTimeRef.current += delta;
                targetTimeRef.current = null;
            }

            const t = accumulatedTimeRef.current;
            tMotion.set(t);

            const tLocal = (t - 0.5 + CYCLE) % CYCLE;
            const tName = (tLocal + 0.25 + CYCLE) % CYCLE;
            const slot = Math.floor(tName / 3.5);
            const currentIdx = (2 - slot + 700) % 7;
            const phase = tName % 3.5;
            const isHolding = (phase >= 0 && phase <= 3.35) || isHovered;
            const activeIdx = isHolding ? currentIdx : -1;

            if (activeIdx !== lastActiveRef.current) {
                lastActiveRef.current = activeIdx;
                onActiveChange(activeIdx);
            }

            frame = requestAnimationFrame(update);
        };
        frame = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frame);
    }, [onActiveChange, isHovered, tMotion]);

    // Map the hover expansion specifically to the corner lines sizes (80px to 40px, shrinks on hover)
    const cornerSize = useTransform(hoverMotion, [0, 1], [80, 40]);

    return (
        <div
            className="absolute pointer-events-none z-20"
            style={{
                right: "40px",
                top: "calc(50% + 2px)",
                transform: "translateY(-50%) scale(0.85)",
                transformOrigin: "right center",
                width: 780,
                height: CONTAINER_H,
            }}
        >


            {/* Card Flow Track */}
            <div className="absolute inset-0 overflow-hidden">
                {PROJECTS.map((project, i) => {
                    const cardLocalTime = useTransform(tMotion, (t) => {
                        return ((t + stagger * i) % CYCLE + CYCLE) % CYCLE;
                    });

                    // Calculate the current "cycle index" for this specific card
                    // This number increments every time the card does a full loop
                    const cycleIndex = useTransform(tMotion, (t) => {
                        return Math.floor((t + stagger * i) / CYCLE);
                    });

                    // Not every transition should flicker. Using a dynamic seed based on BOTH
                    // project index and the current cycle, so it changes every loop!
                    const flickerSeed = useTransform(cycleIndex, (ci) => {
                        return ((i * 7) + (ci * 13) + 3) % 10;
                    });

                    const flickerType = useTransform(flickerSeed, (seed) => {
                        return seed < 3 ? 0 : 1; // 0 = clean, 1 = slight flicker only
                    });

                    // Allow glitches anywhere during the magnified hold (7.5 → 10.5)
                    const isFullyMagnified = useTransform(cardLocalTime, (t) => {
                        return t >= 7.5 && t <= 10.5 ? 1 : 0;
                    });

                    // Separate numeric MotionValues for burst data (TS-safe)
                    // seed 0-3: clean | seed 4-6: 1 burst | seed 7-9: 2 bursts
                    const burstCount = useTransform(flickerSeed, (seed) => {
                        if (seed < 4) return 0;
                        if (seed < 7) return 1;
                        return 2;
                    });
                    const burst1 = useTransform(flickerSeed, (seed) => {
                        if (seed < 4) return -1;
                        if (seed < 7) return 8.0 + (seed - 4) * 0.5;
                        return 8.0 + (seed - 7) * 0.4;
                    });
                    const burst2 = useTransform(flickerSeed, (seed) => {
                        if (seed < 7) return -1;
                        return 9.2 + (seed - 7) * 0.3;
                    });

                    const flickerOpacity = useTransform(
                        [cardLocalTime, burstCount, burst1, burst2, isFullyMagnified] as MotionValue<number>[],
                        ([t, count, b1, b2, isMag]: number[]) => {
                            if (isMag === 0 || count === 0) return 1;

                            const starts = [b1, b2];
                            for (let j = 0; j < count; j++) {
                                const s = starts[j];
                                if (s < 0) continue;

                                // First burst: subtle, quick dip
                                if (j === 0) {
                                    if (t >= s && t < s + 0.1) return 0.92;
                                    if (t >= s + 0.1 && t < s + 0.15) return 0.96;
                                }
                                // Second burst: distinct effect (slightly deeper, slightly longer)
                                else if (j === 1) {
                                    if (t >= s && t < s + 0.08) return 0.88;
                                    if (t >= s + 0.08 && t < s + 0.18) return 0.94;
                                }
                            }
                            return 1;
                        }
                    );

                    // No jitter — major glitch shake removed
                    const jitterX = useMotionValue(0);
                    const jitterY = useMotionValue(0);

                    // Grain intensity — always a subtle base, bursts during flicker
                    const grainBurst = useTransform(
                        [cardLocalTime, flickerType, isFullyMagnified] as [MotionValue<number>, MotionValue<number>, MotionValue<number>],
                        ([tVal, typeVal, isMagVal]) => {
                            const baseGrain = 0.15; // Always-present subtle CRT grain
                            if ((isMagVal as number) === 0) return baseGrain;
                            const type = typeVal as number;
                            if (type === 0) return baseGrain; // Clean transition, no burst
                            return 0.5; // Slight burst
                        }
                    );

                    const y = useTransform(cardLocalTime,
                        [0, 0.5, 3.5, 4.0, 7.0, 7.5, 10.5, 11.0, 14.0, 14.5, 24.5],
                        [POS_ENTER, POS_4, POS_4, POS_3, POS_3, POS_2, POS_2, POS_1, POS_1, POS_EXIT, POS_EXIT]
                    );

                    const baseScale = useTransform(cardLocalTime,
                        [0, 0.5, 7.0, 7.5, 10.5, 11.0, 14.0, 14.5],
                        [0.4, 0.7, 0.7, 1.35, 1.35, 0.7, 0.7, 0.4]
                    );

                    // If at POS_2 (t between 7.5 and 10.5), we want to scale up even more on hover
                    const combinedScale = useTransform([baseScale, cardLocalTime, hoverMotion], ([bsVal, ctVal, hmVal]) => {
                        const bs = bsVal as number;
                        const ct = ctVal as number;
                        const hm = hmVal as number;
                        // Calculate if we are in the magnified slot
                        const inMagnifiedSlot = ct >= 7.0 && ct <= 11.0;
                        if (inMagnifiedSlot) {
                            const hoverFillScale = 1.5; // Perfect 4:3 fit for 120x90 base
                            return bs + (hoverFillScale - bs) * hm;
                        }
                        return bs;
                    });

                    // We want the border to visually be 2px thick at all scales to match the magnifying glass frame
                    // At scale 0.7 (normal), we need a ~2.85px border so it renders as 2px (2 / 0.7 = 2.85)
                    // At scale 1.5 (magnified), we need a ~1.33px border so it renders as 2px (2 / 1.5 = 1.33)
                    const borderWidth = useTransform(combinedScale,
                        [0.7, 1.5],
                        ["2.85px", "1.33px"]
                    );

                    const opacity = useTransform(cardLocalTime,
                        [0, 0.5, 14.0, 14.5],
                        [0, 1, 1, 0]
                    );

                    const blur = useTransform(cardLocalTime,
                        [0, 7.0, 7.5, 10.5, 11.0, 24.5],
                        [1, 1, 0, 0, 1, 1]
                    );
                    const blurStr = useTransform(blur, (v) => `blur(${v}px)`);

                    return (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{
                                width: CARD_W,
                                height: CARD_H,
                                left: "50%",
                                top: "50%",
                                x: useTransform(jitterX, (jx) => `calc(-50% + ${jx as number}px)`),
                                y: useTransform([y, jitterY] as [MotionValue<number>, MotionValue<number>], ([v, jy]) => `calc(-50% + ${(v as number) + (jy as number)}px)`),
                                scale: combinedScale,
                                opacity: useTransform([opacity, flickerOpacity] as [MotionValue<number>, MotionValue<number>], ([o, fo]) => (o as number) * (fo as number)),
                            }}
                        >
                            <div className="w-full h-full overflow-hidden relative shadow-xl shadow-black/40 bg-black">
                                <motion.div
                                    className="absolute inset-0 z-10 border-white/30 border-solid pointer-events-none"
                                    style={{ borderWidth }}
                                />
                                {/* Retro CRT TV Static Overlay — subtle dynamic peek during flicker */}
                                <motion.div
                                    className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
                                    style={{
                                        opacity: useTransform(
                                            [cardLocalTime, burstCount, burst1, burst2] as MotionValue<number>[],
                                            ([t, count, b1, b2]: number[]) => {
                                                // Full grain on non-magnified cards
                                                if (t < 7.0 || t > 11.0) return 1;
                                                // During magnified hold
                                                if (t >= 7.5 && t <= 10.5) {
                                                    if (count === 0) return 0;
                                                    const starts = [b1, b2];
                                                    for (let j = 0; j < count; j++) {
                                                        const s = starts[j];
                                                        if (s < 0) continue;

                                                        // First burst: standard peek
                                                        if (j === 0 && t >= s && t < s + 0.15) return 0.30;
                                                        // Second burst: slightly stronger/different peek
                                                        if (j === 1 && t >= s && t < s + 0.18) return 0.45;
                                                    }
                                                    return 0;
                                                }
                                                // Transition back to full
                                                return Math.min(1, (t - 10.5) / 0.5);
                                            }
                                        ),
                                    }}
                                >
                                    {/* SVG Filter — High-contrast B&W grain */}
                                    <svg className="absolute w-0 h-0" aria-hidden="true">
                                        <filter id={`crt-noise-${i}`} x="0%" y="0%" width="100%" height="100%">
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
                                            {/* Crush to pure B&W */}
                                            <feComponentTransfer>
                                                <feFuncR type="discrete" tableValues="0 1" />
                                                <feFuncG type="discrete" tableValues="0 1" />
                                                <feFuncB type="discrete" tableValues="0 1" />
                                            </feComponentTransfer>
                                        </filter>
                                    </svg>
                                    {/* Grain Layer */}
                                    <motion.div
                                        className="absolute inset-[-50%]"
                                        style={{
                                            width: "200%",
                                            height: "200%",
                                            filter: `url(#crt-noise-${i})`,
                                            animation: `no-signal-grain-${i} ${3 + i * 0.7}s steps(1) ${i * 1.3}s infinite`,
                                            opacity: useTransform(grainBurst, (v) => Math.min(1, 0.04 * (v as number))),
                                        }}
                                    />
                                    {/* CRT Scan Lines */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
                                        }}
                                    />
                                    {/* Subtle flicker — unique timing per card */}
                                    <style>{`
                                        @keyframes crt-flicker-${i} {
                                            0%, 100% { opacity: ${0.30 + (i % 3) * 0.02}; }
                                            ${10 + i * 2}% { opacity: ${0.38 - (i % 4) * 0.01}; }
                                            ${25 + i * 3}% { opacity: ${0.28 + (i % 5) * 0.02}; }
                                            ${45 + i}% { opacity: ${0.36 - (i % 3) * 0.015}; }
                                            ${65 + i * 2}% { opacity: ${0.31 + (i % 4) * 0.01}; }
                                            ${85 - i}% { opacity: ${0.37 - (i % 5) * 0.01}; }
                                        }
                                    `}</style>
                                    <div
                                        className="absolute inset-0 bg-black"
                                        style={{
                                            animation: `crt-flicker-${i} ${1.5 + (i % 7) * 0.15}s ease-in-out infinite`,
                                        }}
                                    />
                                    {/* NO SIGNAL Text — intermittent with glitch */}
                                    <style>{`
                                        @keyframes no-signal-show-${i} {
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
                                        @keyframes no-signal-grain-${i} {
                                            0%, 65% { opacity: 0.35; }
                                            ${68 + (i % 3)}% { opacity: 0.85; }
                                            ${70 + (i % 4)}% { opacity: 0.35; }
                                            ${73 + (i % 3)}% { opacity: 0.85; }
                                            ${82 + (i % 5)}% { opacity: 0.85; }
                                            ${83 + (i % 4)}% { opacity: 0.35; }
                                            ${86 + (i % 3)}% { opacity: 0.85; }
                                            95% { opacity: 0.85; }
                                            97%, 100% { opacity: 0.35; }
                                        }
                                        @keyframes no-signal-bw-flicker-${i} {
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
                                        @keyframes no-signal-glitch-${i} {
                                            0%, 100% { transform: translate(0, 0); text-shadow: -1px 0 #ff0000, 1px 0 #00ffff; }
                                            20% { transform: translate(-2px, 1px); text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
                                            40% { transform: translate(1px, -1px); text-shadow: -1px 0 #ff0000, 1px 0 #00ffff; }
                                            60% { transform: translate(2px, 0); text-shadow: 1px 0 #ff0000, -1px 0 #00ffff; }
                                            80% { transform: translate(-1px, 1px); text-shadow: -2px 0 #ff0000, 2px 0 #00ffff; }
                                        }
                                    `}</style>
                                    {/* B&W Flash layer — synced with NO SIGNAL */}
                                    <div
                                        className="absolute inset-0 mix-blend-overlay pointer-events-none"
                                        style={{
                                            animation: `no-signal-bw-flicker-${i} ${3 + i * 0.7}s steps(1) ${i * 1.3}s infinite`,
                                            opacity: 0,
                                        }}
                                    />
                                    {/* NO SIGNAL text */}
                                    <div
                                        className="absolute inset-0 flex items-center justify-center"
                                        style={{
                                            animation: `no-signal-show-${i} ${3 + i * 0.7}s ease-in-out ${i * 1.3}s infinite`,
                                        }}
                                    >
                                        <span
                                            className="text-white font-bold tracking-[0.3em] uppercase select-none"
                                            style={{
                                                fontSize: "16px",
                                                fontFamily: "monospace",
                                                animation: `no-signal-glitch-${i} ${0.3 + (i % 3) * 0.1}s steps(1) infinite`,
                                                letterSpacing: "0.25em",
                                            }}
                                        >
                                            NO SIGNAL
                                        </span>
                                    </div>
                                </motion.div>
                                {/* Content static container */}
                                <motion.div
                                    className="relative w-full h-full"
                                    style={{
                                        filter: blurStr,
                                    }}
                                >
                                    <Image
                                        src={project.src}
                                        alt={project.alt}
                                        fill
                                        className="object-cover"
                                        sizes="200px"
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Magnifying Glass Rectangle at Position 2 */}
            <motion.div
                className="absolute left-1/2 z-40 pointer-events-auto"
                onMouseEnter={() => {
                    setIsHovered(true);
                    onHoverChange?.(true);
                }}
                onMouseLeave={() => {
                    setIsHovered(false);
                    onHoverChange?.(false);
                }}
                style={{
                    top: 660.75,
                    width: 540,
                    height: 418.5,
                    transform: "translateX(-50%)",
                    cursor: "pointer"
                }}
            >
                {/* Visit Live Overlay */}
                <div
                    className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[6px] transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <Link
                        href={lastActiveRef.current !== -1 ? PROJECTS[lastActiveRef.current].href : "#"}
                        className="relative px-[72px] py-[24px] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="relative z-10 text-white font-bold text-[30px] tracking-[0.2em] uppercase">
                            Visit Live
                        </span>
                        <div className="absolute inset-x-0 top-0 h-[3px] bg-white/30" />
                        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/30" />
                    </Link>
                </div>

                {/* Glass backdrop effect - Removed blur to keep image sharp */}
                <div className="absolute inset-0 bg-white/[0.04]" />

                {/* Outer glow */}
                <div
                    className="absolute -inset-[24px]"
                    style={{
                        background: "radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, transparent 70%)",
                        filter: "blur(18px)",
                    }}
                />
                {/* Glass frame base border */}
                <div
                    className="absolute inset-0 pointer-events-none border-[2px] border-white/40 border-solid z-[60]"
                    style={{
                        boxShadow: "0 0 60px rgba(255,255,255,0.1), inset 0 0 45px rgba(255,255,255,0.05)",
                    }}
                />

                {/* Corner accents - stationary, but they expand in length outward symmetrically */}
                <motion.div
                    className="absolute border-white z-[60] pointer-events-none"
                    style={{ top: 0, left: 0, width: cornerSize, height: cornerSize, borderTopWidth: 4, borderLeftWidth: 4 }}
                />
                <motion.div
                    className="absolute border-white z-[60] pointer-events-none"
                    style={{ top: 0, right: 0, width: cornerSize, height: cornerSize, borderTopWidth: 4, borderRightWidth: 4 }}
                />
                <motion.div
                    className="absolute border-white z-[60] pointer-events-none"
                    style={{ bottom: 0, left: 0, width: cornerSize, height: cornerSize, borderBottomWidth: 4, borderLeftWidth: 4 }}
                />
                <motion.div
                    className="absolute border-white z-[60] pointer-events-none"
                    style={{ bottom: 0, right: 0, width: cornerSize, height: cornerSize, borderBottomWidth: 4, borderRightWidth: 4 }}
                />
            </motion.div>
        </div>
    );
}

