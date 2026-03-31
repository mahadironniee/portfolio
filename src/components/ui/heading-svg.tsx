"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { BLACK_PATHS, GREY_PATHS } from "./heading-svg-data";

interface HeadingSvgProps {
    hoverProgress: MotionValue<number>;
}

const BRIGHT = "#FFFFFF";
const GREY = "#515055";

export default function HeadingSvg({ hoverProgress }: HeadingSvgProps) {
    // Group A (GREY_PATHS): Starts BRIGHT, goes GREY on hover
    const colorA = useTransform(hoverProgress, [0, 1], [BRIGHT, GREY]);
    
    // Group B (BLACK_PATHS): Starts BRIGHT, stays BRIGHT on hover
    const colorB = useTransform(hoverProgress, [0, 1], [BRIGHT, BRIGHT]);

    return (
        <svg
            width="1751"
            height="336"
            viewBox="0 0 1751 336"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto max-w-[1751px]"
            style={{ pointerEvents: "none" }}
        >
            {/* Group A: GREY -> BRIGHT */}
            {GREY_PATHS.map((d, i) => (
                <motion.path 
                    key={`g-${i}`} 
                    d={d} 
                    style={{ fill: colorA }} 
                />
            ))}

            {/* Group B: BRIGHT -> GREY */}
            {BLACK_PATHS.map((d, i) => (
                <motion.path
                    key={`b-${i}`}
                    d={d}
                    style={{ fill: colorB }}
                />
            ))}
        </svg>
    );
}

