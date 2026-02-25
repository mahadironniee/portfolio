"use client";

import { useState } from "react";

const SERVICES = [
    {
        id: "ux-design",
        label: "USER EXPERIENCE DESIGN",
        svg: "/User experience design.svg",
    },
    {
        id: "ui-visual",
        label: "UI / VISUAL DESIGN",
        svg: "/Visual Design01.svg",
    },
    {
        id: "research",
        label: "RESEARCH / STRATEGY",
        svg: "/Strategy01.svg",
    },
    {
        id: "prototype",
        label: "PROTOTYPE",
        svg: "/Prototype.svg",
    },
    {
        id: "frontend",
        label: "FRONT-END DEVELOPMENT",
        svg: "/Front-end development.svg",
    }
];

export default function ServicesSection() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <section className="relative w-full bg-white py-32 px-8 flex flex-col items-center overflow-hidden light-bg-nav-trigger">
            <div className="w-full max-w-[1400px] flex flex-col relative">

                {/* Section Header */}
                <div className="mb-20">
                    <span className="text-black font-mono text-xs uppercase tracking-[0.2em] opacity-80">
                        [ Expertise and Services ]
                    </span>
                </div>

                {/* Services List */}
                <div className="flex flex-col border-t border-black/10">
                    {SERVICES.map((service) => {
                        const isActive = hoveredId === service.id;

                        return (
                            <div
                                key={service.id}
                                className="relative border-b border-black/10 group cursor-default"
                                onMouseEnter={() => setHoveredId(service.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div className="py-8 md:py-12 flex items-center transition-all duration-500">
                                    {/* Responsive container: h-[6vw] ensures the longest SVG doesn't exceed screen width but keeps height uniform across all elements */}
                                    <div className="relative h-[6vw] md:h-[60px] w-full max-w-[1000px]">
                                        <div
                                            className={`w-full h-full transition-all duration-500 ${isActive ? "bg-[#0004D9]" : "bg-black/20"
                                                }`}
                                            style={{
                                                maskImage: `url("${service.svg}")`,
                                                WebkitMaskImage: `url("${service.svg}")`,
                                                maskRepeat: "no-repeat",
                                                WebkitMaskRepeat: "no-repeat",
                                                maskSize: "auto 100%", /* Forces exact same height scale for all SVGs */
                                                WebkitMaskSize: "auto 100%",
                                                maskPosition: "left",
                                                WebkitMaskPosition: "left",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
