"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

function Section({ children, title, subtitle, align = "left" }: { children: React.ReactNode, title: string, subtitle: string, align?: "left" | "right" }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div ref={ref} className={`flex flex-col ${align === "right" ? "md:items-end text-right" : "md:items-start text-left"} space-y-8 py-24 md:py-48`}>
            <motion.div
                initial={{ opacity: 0, x: align === "right" ? 50 : -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-4"
            >
                <span className="text-[#76CA00] font-mono text-sm tracking-widest uppercase block">
                    {subtitle}
                </span>
                <h2 
                    className="text-5xl md:text-8xl font-bold leading-none tracking-tighter"
                    style={{ fontFamily: 'var(--font-post-no-bills)' }}
                >
                    {title}
                </h2>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className={`max-w-2xl text-lg md:text-xl text-white/70 leading-relaxed font-light ${align === "right" ? "md:text-right" : "md:text-left"}`}
            >
                {children}
            </motion.div>
        </div>
    );
}

export default function AboutContent() {
    return (
        <section className="relative px-4 pb-32">
            <div className="container mx-auto">
                <Section title="THE VISION" subtitle="DESIGN PHILOSOPHY" align="left">
                    <p>
                        Design is not just what it looks like and feels like. Design is how it works. 
                        In my world, aesthetics and utility are two sides of the same coin. I believe in 
                        **brutalist clarity**—removing the noise to let the essence of a concept breathe. 
                        Every pixel has a purpose, every animation tells a story.
                    </p>
                </Section>

                <Section title="THE ENGINE" subtitle="TECHNICAL PROWESS" align="right">
                    <p>
                        The most beautiful design is useless if it doesn't move with intention. 
                        I build high-performance, physics-based experiences that bridge the gap 
                        between digital interface and human emotion. From **GSAP** orchestrations 
                        to **Next.js** foundations, I code with the precision of a craftsman and 
                        the soul of an artist.
                    </p>
                </Section>

                <Section title="THE FUSION" subtitle="THE CONCEPTUAL HERO" align="left">
                    <p>
                        Where most see a boundary between "Designer" and "Developer," I see a portal. 
                        I don't just hand off designs; I breathe life into them. This synergy allows me 
                        to build products that are technically sound, visually stunning, and 
                        deeply evocative. I am the bridge between what is imagined and what exists.
                    </p>
                </Section>
            </div>

            {/* Subtle Grid Background for this section */}
            <div className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#76CA00 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </section>
    );
}
