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

// Mobile/Desktop constants
const CARD_W = 360;
const CARD_H = 270;
const MOBILE_CARD_W = 280;
const MOBILE_CARD_H = 210;
const CONTAINER_H = 1740;

const POS_4 = 744;
const POS_3 = 372;
const POS_2 = 0;
const POS_1 = -372;
const POS_ENTER = 1116;
const POS_EXIT = -1116;

const CYCLE = 24.5;

// Static-only card — pure DOM, zero hooks, zero animations — for the preloader wireframe
function StaticProjectCard({
    x,
    y,
    scale,
    opacity = 1,
    showNoSignal = false,
    showGrain = false,
    isHighlighted = false,
}: {
    x: number;
    y: number;
    scale: number;
    opacity?: number;
    showNoSignal?: boolean;
    showGrain?: boolean;
    isHighlighted?: boolean;
}) {
    return (
        <div
            className="absolute"
            style={{
                width: CARD_W,
                height: CARD_H,
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`,
                backgroundColor: `rgba(217, 217, 217, ${opacity})`,
            }}
        >
            {/* NO SIGNAL text — only when HUD hovers this card */}
            {showNoSignal && isHighlighted && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <span
                        className="tracking-[0.3em] uppercase select-none text-white"
                        style={{ fontSize: "20px", fontFamily: "monospace", letterSpacing: "0.25em", fontWeight: 900 }}
                    >
                        NO SIGNAL
                    </span>
                </div>
            )}
            {/* Static greyscale grain — only when HUD hovers this card */}
            {showGrain && isHighlighted && (
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden" style={{ opacity: 0.18 }}>
                    <svg className="absolute w-0 h-0" aria-hidden="true">
                        <filter id="static-noise-preloader" x="0%" y="0%" width="100%" height="100%">
                            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" stitchTiles="stitch" />
                            <feColorMatrix type="saturate" values="0" />
                        </filter>
                    </svg>
                    <div className="absolute inset-[-50%]" style={{ width: "200%", height: "200%", filter: "url(#static-noise-preloader)" }} />
                </div>
            )}
        </div>
    );
}

const ProjectCard = ({
    project,
    i,
    tMotion,
    stagger,
    hoverMotion,
    splitTargetMotion,
    isStatic
}: {
    project: any;
    i: number;
    tMotion: MotionValue<number>;
    stagger: number;
    hoverMotion: MotionValue<number>;
    splitTargetMotion: MotionValue<number>;
    isStatic: boolean;
}) => {
    const cardLocalTime = useTransform(tMotion, (t) => {
        return ((t + stagger * i) % CYCLE + CYCLE) % CYCLE;
    });

    const cycleIndex = useTransform(tMotion, (t) => {
        return Math.floor((t + stagger * i) / CYCLE);
    });

    const flickerSeed = useTransform(cycleIndex, (ci) => {
        return ((i * 7) + (ci * 13) + 3) % 10;
    });

    const flickerType = useTransform(flickerSeed, (seed) => {
        return seed < 3 ? 0 : 1;
    });

    const isFullyMagnified = useTransform(cardLocalTime, (t) => {
        return t >= 7.5 && t <= 10.5 ? 1 : 0;
    });

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
                if (j === 0) {
                    if (t >= s && t < s + 0.1) return 0.92;
                    if (t >= s + 0.1 && t < s + 0.15) return 0.96;
                }
                else if (j === 1) {
                    if (t >= s && t < s + 0.08) return 0.88;
                    if (t >= s + 0.08 && t < s + 0.18) return 0.94;
                }
            }
            return 1;
        }
    );

    const jitterX = useMotionValue(0);
    const jitterY = useMotionValue(0);

    const grainBurst = useTransform(
        [cardLocalTime, flickerType, isFullyMagnified] as [MotionValue<number>, MotionValue<number>, MotionValue<number>],
        ([tVal, typeVal, isMagVal]) => {
            const baseGrain = 0.15;
            if ((isMagVal as number) === 0) return baseGrain;
            const type = typeVal as number;
            if (type === 0) return baseGrain;
            return 0.5;
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

    const combinedScale = useTransform([baseScale, cardLocalTime, hoverMotion], ([bsVal, ctVal, hmVal]) => {
        const bs = bsVal as number;
        const ct = ctVal as number;
        const hm = hmVal as number;
        const inMagnifiedSlot = ct >= 7.0 && ct <= 11.0;
        if (inMagnifiedSlot) {
            const hoverFillScale = 1.5;
            return bs + (hoverFillScale - bs) * hm;
        }
        return bs;
    });

    const borderWidth = useTransform(combinedScale,
        [0.7, 1.5],
        ["2.85px", "1.33px"]
    );

    const opacity = useTransform(cardLocalTime,
        [0, 0.5, 14.0, 14.5],
        [0, 1, 1, 0]
    );

    const splitDimOpacity = useTransform([cardLocalTime, splitTargetMotion], ([t, sm]) => {
        const tNum = t as number;
        const smNum = sm as number;
        if (smNum === 0) return 1;
        if ((tNum >= 3.5 && tNum <= 7.5) || (tNum >= 10.5 && tNum <= 14.5)) {
            return 1 - (0.5 * smNum);
        }
        return 1;
    });

    const blur = useTransform(cardLocalTime,
        [0, 7.0, 7.5, 10.5, 11.0, 24.5],
        [1, 1, 0, 0, 1, 1]
    );
    const filterStr = useTransform([blur, cardLocalTime] as MotionValue<number>[], ([b, t]: number[]) => {
        const grayscale = (t >= 7.5 && t <= 10.5) ? 0 : 1;
        return `blur(${b}px) grayscale(${grayscale * 100}%)`;
    });

    return (
        <motion.div
            className={`absolute ${isStatic ? "bg-[#D9D9D9]" : ""}`}
            style={{
                width: CARD_W,
                height: CARD_H,
                left: "50%",
                top: "50%",
                x: useTransform(jitterX, (jx) => `calc(-50% + ${jx as number}px)`),
                y: useTransform([y, jitterY] as [MotionValue<number>, MotionValue<number>], ([v, jy]) => `calc(-50% + ${(v as number) + (jy as number)}px)`),
                scale: combinedScale,
                opacity: useTransform([opacity, flickerOpacity, splitDimOpacity] as MotionValue<number>[], ([o, fo, so]: number[]) => o * fo * so),
                border: "none",
                outline: "none"
            }}
        >
            <div className={`w-full h-full overflow-hidden relative border-none outline-none ${isStatic ? "bg-[#D9D9D9]" : "bg-black shadow-xl shadow-black/40"}`}>
                {!isStatic && (
                    <motion.div
                        className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
                        style={{
                            opacity: useTransform(
                                [cardLocalTime, burstCount, burst1, burst2] as MotionValue<number>[],
                                ([t, count, b1, b2]: number[]) => {
                                    if (t < 7.0 || t > 11.0) return 1;
                                    if (t >= 7.5 && t <= 10.5) {
                                        if (count === 0) return 0;
                                        const starts = [b1, b2];
                                        for (let j = 0; j < count; j++) {
                                            const s = starts[j];
                                            if (s < 0) continue;
                                            if (j === 0 && t >= s && t < s + 0.15) return 0.30;
                                            if (j === 1 && t >= s && t < s + 0.18) return 0.45;
                                        }
                                        return 0;
                                    }
                                    return Math.min(1, (t - 10.5) / 0.5);
                                }
                            ),
                        }}
                    >
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
                                <feComponentTransfer>
                                    <feFuncR type="discrete" tableValues="0 1" />
                                    <feFuncG type="discrete" tableValues="0 1" />
                                    <feFuncB type="discrete" tableValues="0 1" />
                                </feComponentTransfer>
                            </filter>
                        </svg>
                        {!isStatic && (
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
                        )}
                        {!isStatic && (
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
                                }}
                            />
                        )}
                        {!isStatic && (
                            <>
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
                            </>
                        )}
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
                        <div
                            className="absolute inset-0 mix-blend-overlay pointer-events-none"
                            style={{
                                animation: `no-signal-bw-flicker-${i} ${3 + i * 0.7}s steps(1) ${i * 1.3}s infinite`,
                                opacity: 0,
                            }}
                        />
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
                )}
                {isStatic && i === 3 && (
                    <motion.div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                        style={{ opacity: useTransform(splitTargetMotion, [0, 1], [0, 0.4]) }}
                    >
                        <span
                            className="font-bold tracking-[0.3em] uppercase select-none"
                            style={{
                                fontSize: "16px",
                                fontFamily: "monospace",
                                color: "#000000",
                                letterSpacing: "0.25em"
                            }}
                        >
                            NO SIGNAL
                        </span>
                    </motion.div>
                )}
                {isStatic && i === 1 && (
                    <motion.div 
                        className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
                        style={{ opacity: useTransform(splitTargetMotion, [0, 1], [0, 0.4]) }}
                    >
                        <svg className="absolute w-0 h-0" aria-hidden="true">
                            <filter id={`static-grain-${i}`} x="0%" y="0%" width="100%" height="100%">
                                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch" />
                                <feColorMatrix type="saturate" values="0" />
                            </filter>
                        </svg>
                        <div
                            className="absolute inset-[-50%]"
                            style={{ width: "200%", height: "200%", filter: `url(#static-grain-${i})` }}
                        />
                    </motion.div>
                )}
                <motion.div
                    className="relative w-full h-full"
                    style={{
                        filter: filterStr,
                    }}
                >
                    {isStatic ? null : (
                        <Image
                            src={project.src}
                            alt={project.alt}
                            fill
                            className="object-cover"
                            sizes="200px"
                        />
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function BlackHoleSideProjects({
    onActiveChange,
    onHoverChange,
    isStatic = false
}: {
    onActiveChange?: (index: number) => void;
    onHoverChange?: (hovered: boolean) => void;
    isStatic?: boolean;
}) {
    const stagger = 3.5;
    const lastActiveRef = useRef<number>(-1);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const accumulatedTimeRef = useRef(0);
    const lastTickRef = useRef(Date.now());

    const tMotion = useMotionValue(isStatic ? 2.0 : 0);
    const targetTimeRef = useRef<number | null>(null);
    const hoverMotion = useMotionValue(0);

    const [isSplitTargeted, setIsSplitTargeted] = useState(false);
    const splitTargetMotion = useMotionValue(0);

    useEffect(() => {
        setIsSplitTargeted(document.documentElement.getAttribute('data-projects-split') === 'true');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-projects-split') {
                    setIsSplitTargeted(document.documentElement.getAttribute('data-projects-split') === 'true');
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-projects-split'] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        animate(splitTargetMotion, isSplitTargeted ? 1 : 0, { duration: 0.3, ease: "easeInOut" });
    }, [isSplitTargeted, splitTargetMotion]);

    // Responsive check
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        animate(hoverMotion, isHovered ? 1 : 0, { duration: 0.3, ease: "easeInOut" });
    }, [isHovered, hoverMotion]);

    useEffect(() => {
        if (isStatic) {
            tMotion.set(2.0); // Project 0 center
            return;
        }
        if (!onActiveChange) return;
        let frame: number;

        const update = () => {
            const now = Date.now();
            const delta = (now - lastTickRef.current) / 1000;
            lastTickRef.current = now;

            if (isHovered) {
                if (targetTimeRef.current === null) {
                    const t = accumulatedTimeRef.current;
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

    const sizePairA = useTransform(hoverMotion, [0, 1], [80, 40]);
    const sizePairB = useTransform(hoverMotion, [0, 1], [40, 80]);

    if (isStatic) {
        return (
            <div
                className="absolute pointer-events-none z-[210]"
                style={{
                    right: "40px",
                    top: "calc(50% + 2px)",
                    transform: "translateY(-50%) scale(0.85)",
                    transformOrigin: "right center",
                    width: 780,
                    height: CONTAINER_H,
                }}
            >
                <div className="absolute inset-0 overflow-hidden z-10">
                    {/* 3 frozen cards at tMotion=2.0 positions: i=3 top, i=2 center, i=1 bottom */}
                    <StaticProjectCard key="top" x={0} y={POS_1} scale={0.7} opacity={isSplitTargeted ? 0.65 : 1} showNoSignal={true} isHighlighted={isSplitTargeted} />
                    <StaticProjectCard key="center" x={0} y={POS_2} scale={1.35} />
                    <StaticProjectCard key="bottom" x={0} y={POS_3} scale={0.7} opacity={isSplitTargeted ? 0.65 : 1} showGrain={true} isHighlighted={isSplitTargeted} />
                </div>
            </div>
        );
    }

    if (isMobile) {
        return (
            <div className="absolute bottom-[20px] left-0 w-full overflow-hidden z-20 px-4">
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory">
                    {PROJECTS.map((project, i) => (
                        <motion.div
                            key={i}
                            className="flex-shrink-0 snap-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            onViewportEnter={() => onActiveChange?.(i)}
                        >
                            <Link href={project.href} className="block group">
                                <div
                                    className={`relative overflow-hidden border-none outline-none ${isStatic ? "bg-[#D9D9D9]" : "bg-black"}`}
                                    style={{ width: MOBILE_CARD_W, height: MOBILE_CARD_H }}
                                >
                                    {!isStatic && (
                                        <Image
                                            src={project.src}
                                            alt={project.alt}
                                            fill
                                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            sizes="300px"
                                        />
                                    )}
                                    <div className={`absolute inset-x-0 bottom-0 p-4 ${isStatic ? "" : "bg-gradient-to-t from-black/80 to-transparent"}`}>
                                        <h4 className="text-white font-bold text-sm tracking-widest uppercase">{project.alt}</h4>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            className="absolute pointer-events-none z-[210]"
            style={{
                right: "40px",
                top: "calc(50% + 2px)",
                transform: "translateY(-50%) scale(0.85)",
                transformOrigin: "right center",
                width: 780,
                height: CONTAINER_H,
            }}
        >
            <div className="absolute inset-0 overflow-hidden z-10">
                {PROJECTS.map((project, i) => (
                    <ProjectCard
                        key={i}
                        project={project}
                        i={i}
                        tMotion={tMotion}
                        stagger={stagger}
                        hoverMotion={hoverMotion}
                        splitTargetMotion={splitTargetMotion}
                        isStatic={isStatic}
                    />
                ))}
            </div>

            <motion.div
                className="absolute left-1/2 z-50 pointer-events-auto"
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
                <div className="absolute inset-0 bg-white/[0.04]" />
                {!isStatic && (
                    <div
                        className="absolute -inset-[24px]"
                        style={{
                            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, transparent 70%)",
                            filter: "blur(18px)",
                        }}
                    />
                )}
                <div
                    className="absolute inset-0 pointer-events-none z-[60]"
                    style={{
                        border: "none",
                        boxShadow: isStatic ? "none" : "0 0 60px rgba(255,255,255,0.1), inset 0 0 45px rgba(255,255,255,0.05)",
                    }}
                >
                    {isStatic && (
                        <motion.div
                            initial={{ top: "0%", opacity: 0 }}
                            animate={{
                                top: ["0%", "100%", "0%"],
                                opacity: [0, 0.4, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute left-0 right-0 h-[1px] bg-[#D9D9D9] shadow-[0_0_12px_rgba(217,217,217,0.4)] z-50"
                        />
                    )}
                </div>
                <motion.div
                    className={`absolute z-[60] pointer-events-none ${isStatic ? 'bg-[#D9D9D9]' : 'bg-[#0066FF]'}`}
                    style={{
                        top: 0,
                        left: 0,
                        width: sizePairA,
                        height: sizePairA,
                        clipPath: "polygon(0 0, 100% 0, calc(100% - 8px) 4px, 4px 4px, 4px calc(100% - 8px), 0 100%)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "translateZ(0)"
                    }}
                />
                <motion.div
                    className={`absolute z-[60] pointer-events-none ${isStatic ? 'bg-[#D9D9D9]' : 'bg-[#0066FF]'}`}
                    style={{
                        top: 0,
                        right: 0,
                        width: sizePairB,
                        height: sizePairB,
                        clipPath: "polygon(0 0, 100% 0, 100% 100%, calc(100% - 4px) calc(100% - 8px), calc(100% - 4px) 4px, 8px 4px)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "translateZ(0)"
                    }}
                />
                <motion.div
                    className={`absolute z-[60] pointer-events-none ${isStatic ? 'bg-[#D9D9D9]' : 'bg-[#0066FF]'}`}
                    style={{
                        bottom: 0,
                        left: 0,
                        width: sizePairB,
                        height: sizePairB,
                        clipPath: "polygon(0 0, 4px 8px, 4px calc(100% - 4px), calc(100% - 8px) calc(100% - 4px), 100% 100%, 0 100%)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "translateZ(0)"
                    }}
                />
                <motion.div
                    className={`absolute z-[60] pointer-events-none ${isStatic ? 'bg-[#D9D9D9]' : 'bg-[#0066FF]'}`}
                    style={{
                        bottom: 0,
                        right: 0,
                        width: sizePairA,
                        height: sizePairA,
                        clipPath: "polygon(100% 0, calc(100% - 4px) 8px, calc(100% - 4px) calc(100% - 4px), 8px calc(100% - 4px), 0 100%, 100% 100%)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "translateZ(0)"
                    }}
                />
            </motion.div>
        </div>
    );
}
