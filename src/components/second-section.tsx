"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import HeadingSvg from "@/components/ui/heading-svg";

const GREY = "#BABABA";
const DARK = "#515055";
const EASE = [0.22, 1, 0.36, 1] as any;

export default function SecondSection() {
    // Ref on the SVG wrapper — hover triggers only when cursor is over the actual heading
    const svgRef = useRef<HTMLDivElement>(null);
    const fillValue = useMotionValue(GREY);

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
        <section className="relative w-full h-[100dvh] bg-[#F5F5FA] flex flex-col items-center justify-center px-6 overflow-hidden light-bg-nav-trigger">
            <div className="w-full flex flex-col items-center justify-center">
                {/* ref is on the SVG wrapper — only this bounds box triggers hover */}
                <motion.div
                    ref={svgRef}
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: EASE }}
                    className="w-full max-w-[1751px] aspect-[1751/336] relative select-none"
                >
                    <HeadingSvg fillValue={fillValue} />
                </motion.div>
            </div>
        </section>
    );
}
