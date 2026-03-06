"use client";

import Image from "next/image";

const PROJECTS = [
    { src: "/images/projects/abstract-v2.png", alt: "Abstract" },
    { src: "/images/projects/portfolio-ui.png", alt: "Modern Portfolio UI" },
    { src: "/images/projects/haus-v2.png", alt: "Haus" },
    { src: "/images/projects/dashboard-ui.png", alt: "SaaS Dashboard UI" },
    { src: "/images/projects/rokomferi-v2.png", alt: "Rokomferi" },
    { src: "/images/projects/mobile-app-ui.png", alt: "Fintech Mobile App" },
    { src: "/images/projects/ecommerce-ui.png", alt: "Fashion E-commerce" },
    { src: "/images/projects/ai-tool-ui.png", alt: "AI Tool Interface" },
];

const RADIUS = 288; // px
const SVG_WIDTH = 597;
const SVG_HEIGHT = 568;
const DURATION = 40; // seconds for one full orbit (slowed down for 8 items)

export default function AnimatedSideProjects() {
    const count = PROJECTS.length;

    return (
        <>
            <style>{`
                @keyframes orbit-track {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-orbit-track {
                    animation: orbit-track ${DURATION}s linear infinite;
                }
                
                @keyframes orbit-project {
                    from { transform: rotate(0deg) translateX(${RADIUS}px) rotate(0deg); }
                    to { transform: rotate(360deg) translateX(${RADIUS}px) rotate(-360deg); }
                }
                .animate-orbit-project {
                    animation: orbit-project ${DURATION}s linear infinite;
                }
            `}</style>

            <div
                className="absolute pointer-events-none z-20"
                style={{
                    // Moved further right by 60px to clear the headline
                    right: `-${(SVG_WIDTH / 2) + 60}px`,
                    top: "55%",
                    transform: "translateY(-50%)",
                    width: SVG_WIDTH,
                    height: SVG_HEIGHT,
                }}
            >
                {/* Layer 1: Independent Rotating Track */}
                <div className="absolute inset-0 animate-orbit-track">
                    <div className="absolute inset-0 opacity-100">
                        <Image
                            src="/svgs/hero-side-projects-full.svg"
                            alt=""
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Layer 2: Independent Projects animate along the path */}
                {PROJECTS.map((project, i) => {
                    // Use negative animation delay to evenly space projects
                    const delay = -(DURATION / count) * i;
                    return (
                        <div
                            key={i}
                            className="absolute top-1/2 left-1/2 animate-orbit-project"
                            style={{
                                width: 140,
                                height: 95,
                                marginTop: -47.5,
                                marginLeft: -70,
                                animationDelay: `${delay}s`,
                            }}
                        >
                            <div
                                className="w-full h-full rounded-lg overflow-hidden border border-white/30 relative"
                            >

                                <Image
                                    src={project.src}
                                    alt={project.alt}
                                    fill
                                    className="object-cover"
                                    sizes="140px"
                                />
                            </div>
                        </div>
                    );
                })}
            </div >
        </>
    );
}
