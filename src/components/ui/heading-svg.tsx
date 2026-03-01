"use client";

import { motion, MotionValue } from "framer-motion";
import { BLACK_PATHS, GREY_PATHS } from "./heading-svg-data";

interface HeadingSvgProps {
    fillValue: MotionValue<string>;
}

const GREY = "#BABABA";

export default function HeadingSvg({ fillValue }: HeadingSvgProps) {
    return (
        <svg
            width="1751"
            height="336"
            viewBox="0 0 1751 336"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto max-w-[1751px]"
            style={{ pointerEvents: "none" }}
        >
            {/* Grey paths: always #BABABA */}
            {GREY_PATHS.map((d, i) => (
                <path key={`g-${i}`} d={d} fill={GREY} />
            ))}

            {/* Black paths: fill driven directly by the motion value from parent */}
            {BLACK_PATHS.map((d, i) => (
                <motion.path
                    key={`b-${i}`}
                    d={d}
                    style={{ fill: fillValue }}
                />
            ))}
        </svg>
    );
}
