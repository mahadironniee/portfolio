"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

interface BracketButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string;
    color?: "white" | "black";
    className?: string;
    isStatic?: boolean;
    isWireframe?: boolean;
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
    isStatic = false,
    isWireframe = false,
    children,
    ...props
}: BracketButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const baseColor = isStatic ? "#D9D9D9" : (isWireframe ? "#D9D9D9" : (color === "white" ? "white" : "#000000"));
    const textColor = isStatic ? "#D9D9D9" : (isWireframe ? "#FFFFFF" : baseColor);
    const hoverColor = "#FFFFFF"; // Always white on hover
    const hoverBg = isStatic ? "transparent" : "#0066FF";
    const bracketColor = isHovered ? "#000000" : baseColor;

    const offsetA = useMotionValue(-109);
    const offsetB = useMotionValue(-305);

    useEffect(() => {
        if (isStatic) {
            offsetA.set(-109);
            offsetB.set(-305);
            return;
        }

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
            // Hovered: snap to any of the 4 corners (nearest of [0, -149, -196, -345])
            const getNearestTarget = (current: number) => {
                // Correct targets for 149x47 rect (approx) to put a corner in the middle of a 50px segment:
                // segment=50 implies half=25.
                // Top-Left: 0+25=25, Top-Right: -149+25=-124, Bottom-Right: -196+25=-171, Bottom-Left: -345+25=-320
                const baseTargets = [25, -124, -171, -320];
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
                stiffness: 450,
                damping: 30,
            });
            const controlsB = animate(offsetB, getNearestTarget(offsetB.get()), {
                type: "spring",
                stiffness: 450,
                damping: 30,
            });
            return () => {
                controlsA.stop();
                controlsB.stop();
            };
        }
    }, [isHovered, offsetA, offsetB, isStatic]);

    const content = (
        <div
            className={`relative inline-flex items-center justify-center min-w-[151px] h-[49px] ${isStatic ? "pointer-events-none" : ""} ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Fill Layer */}
            <motion.div
                className="absolute inset-0 z-0"
                initial={false}
                animate={{
                    backgroundColor: isHovered ? hoverBg : (isWireframe ? "#D9D9D9" : "rgba(0,0,0,0)"),
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            />

            {/* SVG bracket border */}
            <svg
                width="151"
                height="49"
                viewBox="0 0 151 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full z-10 overflow-visible"
                preserveAspectRatio="none"
                style={{ transformOrigin: "center" }}
            >
                {/* ── Full rectangle mild "track" (only when NOT hovered) ── */}
                <motion.rect
                    x="1" y="1" width="149" height="47"
                    initial={false}
                    animate={{
                        stroke: baseColor,
                        strokeOpacity: isHovered ? 0 : 0.3,
                    }}
                    transition={{ duration: 0.25 }}
                />

                {/* ── Dynamic Corner Brackets ── */}
                <motion.g animate={{ scale: isHovered ? 1.02 : 1 }} style={{ transformOrigin: "center center" }}>
                    <motion.rect
                        x="1" y="1" width="149" height="47"
                        strokeWidth={isHovered || !isWireframe ? "4" : "2"}
                        strokeLinecap="square"
                        strokeDasharray="50 342"
                        style={{ strokeDashoffset: offsetA }}
                        initial={false}
                        animate={{ stroke: bracketColor }}
                        transition={{ duration: 0.2 }}
                    />
                    <motion.rect
                        x="1" y="1" width="149" height="47"
                        strokeWidth={isHovered || !isWireframe ? "4" : "2"}
                        strokeLinecap="square"
                        strokeDasharray="50 342"
                        style={{ strokeDashoffset: offsetB }}
                        initial={false}
                        animate={{ stroke: bracketColor }}
                        transition={{ duration: 0.2 }}
                    />
                </motion.g>
            </svg>

            {/* Text Content */}
            <motion.span
                className="relative z-20 text-xs font-bold tracking-[0.3em] uppercase px-4 py-2"
                initial={false}
                animate={{ color: isStatic ? (isWireframe ? "#FFFFFF" : "#D9D9D9") : (isHovered ? hoverColor : textColor) }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.span>
        </div>
    );

    const wrapperClass = `inline-block active:scale-95 transition-transform duration-200 outline-none ${isStatic ? "pointer-events-none" : ""}`;

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
