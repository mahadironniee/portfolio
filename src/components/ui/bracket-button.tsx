"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

interface BracketButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string;
    color?: "white" | "black";
    className?: string;
    children: React.ReactNode;
}

// Full rectangle perimeter: 2*(149+47) = 392px
// L-bracket length = 50px. Gap = 342px.
// Corner positions on the rect path:
// Top-Right: -109
// Bottom-Right: -186
// Bottom-Left: -305
// Top-Left: -382

export default function BracketButton({
    href,
    color = "white",
    className = "",
    children,
    ...props
}: BracketButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    const baseColor = color === "white" ? "white" : "#000121";
    const hoverColor = "white";
    const hoverBg = "#000000";

    const offsetA = useMotionValue(-109);
    const offsetB = useMotionValue(-305);

    useEffect(() => {
        if (!isHovered) {
            // Unhovered: continue moving indefinitely at 392px per 5 seconds
            // 392000px over 5000s ensures it loops smoothly for a long time
            const controlsA = animate(offsetA, offsetA.get() - 392000, {
                duration: 5000,
                ease: "linear",
            });
            const controlsB = animate(offsetB, offsetB.get() - 392000, {
                duration: 5000,
                ease: "linear",
            });
            return () => {
                controlsA.stop();
                controlsB.stop();
            };
        } else {
            // Hovered: calculate nearest corner and spring to it
            const getNearestTarget = (current: number) => {
                const baseTargets = [-109, -186, -305, -382];
                let bestTarget = current;
                let minDiff = Infinity;

                for (const t of baseTargets) {
                    let diff = (t - current) % 392;
                    // Normalize difference to shortest path (-196 to 196)
                    if (diff > 196) diff -= 392;
                    if (diff < -196) diff += 392;

                    if (Math.abs(diff) < minDiff) {
                        minDiff = Math.abs(diff);
                        bestTarget = current + diff;
                    }
                }
                return bestTarget;
            };

            const controlsA = animate(offsetA, getNearestTarget(offsetA.get()), {
                type: "spring",
                stiffness: 400,
                damping: 40,
            });
            const controlsB = animate(offsetB, getNearestTarget(offsetB.get()), {
                type: "spring",
                stiffness: 400,
                damping: 40,
            });
            return () => {
                controlsA.stop();
                controlsB.stop();
            };
        }
    }, [isHovered, offsetA, offsetB]);

    const content = (
        <div
            className={`relative inline-flex items-center justify-center min-w-[151px] h-[49px] ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Fill Layer */}
            <motion.div
                className="absolute inset-0 z-0"
                initial={false}
                animate={{
                    backgroundColor: isHovered ? hoverBg : "rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            />

            {/* SVG bracket border */}
            <svg
                width="151"
                height="49"
                viewBox="0 0 151 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full z-10"
                preserveAspectRatio="none"
            >
                {/* ── Full rectangle mild "track" ── */}
                <motion.rect
                    x="1" y="1" width="149" height="47"
                    initial={false}
                    animate={{
                        stroke: baseColor,
                        strokeOpacity: isHovered ? 0 : 0.3,
                    }}
                    transition={{ duration: 0.25 }}
                />

                {/* ── Dynamic Corner Brackets / Train Segments ── */}
                <motion.rect
                    x="1" y="1" width="149" height="47"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeDasharray="50 342"
                    style={{ strokeDashoffset: offsetA }}
                    initial={false}
                    animate={{ stroke: isHovered ? hoverColor : baseColor }}
                    transition={{ duration: 0.3 }}
                />
                <motion.rect
                    x="1" y="1" width="149" height="47"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeDasharray="50 342"
                    style={{ strokeDashoffset: offsetB }}
                    initial={false}
                    animate={{ stroke: isHovered ? hoverColor : baseColor }}
                    transition={{ duration: 0.3 }}
                />
            </svg>

            {/* Text Content */}
            <motion.span
                className="relative z-20 text-xs font-bold tracking-[0.3em] uppercase px-4 py-2"
                initial={false}
                animate={{ color: isHovered ? hoverColor : baseColor }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.span>
        </div>
    );

    const wrapperClass = "inline-block active:scale-95 transition-transform duration-200 outline-none";

    if (href) {
        return (
            <Link href={href} className={wrapperClass}>
                {content}
            </Link>
        );
    }

    return (
        <button {...props} className={`${wrapperClass} bg-transparent border-none p-0 m-0`}>
            {content}
        </button>
    );
}
