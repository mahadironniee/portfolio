"use client";

import { motion } from "framer-motion";

export default function BurgerMenu({ className }: { className?: string }) {
    // Animation variants for swapping states
    // Using sub-pixel stroke and precision rendering to prevent "scars" in dual-layer masking

    return (
        <motion.svg
            width="21"
            height="28"
            viewBox="0 0 21 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            whileHover="hover"
            animate="initial"
            initial="initial"
            shapeRendering="geometricPrecision"
            style={{
                WebkitFontSmoothing: "antialiased",
                backfaceVisibility: "hidden"
            }}
        >
            {/* Left Rectangle */}
            <motion.rect
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.2" // Tiny bleed to cover sub-pixel gaps between layers
                variants={{
                    initial: { x: 0, y: 0, width: 10, height: 28, rx: 1 },
                    hover: { x: 0, y: 6, width: 7, height: 16, rx: 0.5 }
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />

            {/* Right Rectangle */}
            <motion.rect
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.2" // Tiny bleed to cover sub-pixel gaps between layers
                variants={{
                    initial: { x: 14, y: 6, width: 7, height: 16, rx: 0.5 },
                    hover: { x: 11, y: 0, width: 10, height: 28, rx: 1 }
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
        </motion.svg>
    );
}
