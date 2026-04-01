"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

interface BracketButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string;
    color?: "white" | "black";
    className?: string;
    isStatic?: boolean;
    isWireframe?: boolean;
    hoverBgColor?: string;
    initialBgColor?: string;
    borderColor?: string;
    hoverBorderColor?: string;
    hoverTextColor?: string;
    showArrow?: boolean;
    children: React.ReactNode;
}

export default function BracketButton({
    href,
    color = "white",
    className = "",
    isStatic = false,
    isWireframe = false,
    hoverBgColor,
    initialBgColor,
    borderColor,
    hoverBorderColor,
    hoverTextColor,
    showArrow = true,
    children,
    ...props
}: BracketButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const baseColor = isStatic ? "#D9D9D9" : (isWireframe ? "#D9D9D9" : (color === "white" ? "white" : "#000000"));
    const textColor = isStatic ? "#D9D9D9" : (isWireframe ? "#FFFFFF" : baseColor);
    
    // Determine hover colors dynamically based on the bg color
    const defaultHoverBg = "#0066FF";
    const hoverBg = isStatic ? "transparent" : (hoverBgColor || defaultHoverBg);
    
    const isLightHoverBg = hoverBg === "#FFFFFF" || hoverBg === "white" || hoverBg === "#D9D9D9";
    const hoverColor = hoverTextColor || (isLightHoverBg ? "#000000" : "#FFFFFF");
    
    const bracketStroke = borderColor || baseColor;
    const bracketColor = isHovered ? (hoverBorderColor || hoverColor) : bracketStroke;

    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 151, height: 49 }); // default to approx sizes
    
    // Measure button dimensions dynamically to support any text length
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setSize({ 
                    width: Math.round(entry.contentRect.width), 
                    height: Math.round(entry.contentRect.height) 
                });
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Layout configuration based on measured dimensions
    const strokeW = 2;
    const svgW = size.width - strokeW; 
    const svgH = size.height - strokeW;
    const perimeter = 2 * (svgW + svgH);
    const bracketLength = 50;
    const bracketGap = perimeter - bracketLength;
    
    const offsetA = useMotionValue(0);
    const offsetB = useMotionValue(0);

    // Initialize with standard corners when dimensions change
    useEffect(() => {
        const p = bracketLength / 2;
        const targetA = -svgW + p;              // Top-Right corner
        const targetB = -(2 * svgW + svgH) + p; // Bottom-Left corner
        
        offsetA.set(targetA);
        offsetB.set(targetB);
    }, [svgW, svgH, bracketLength]);

    // Handle animations
    useEffect(() => {
        if (isStatic) return;

        if (!isHovered) {
            // Continuous "snake" effect: constant 78.4 px/sec velocity
            const travelDistance = perimeter * 1000; 
            const duration = travelDistance / 78.4; 

            const controlsA = animate(offsetA, offsetA.get() - travelDistance, {
                duration: duration,
                ease: "linear",
            });
            const controlsB = animate(offsetB, offsetB.get() - travelDistance, {
                duration: duration,
                ease: "linear",
            });
            return () => {
                controlsA.stop();
                controlsB.stop();
            };
        } else {
            // Snap to nearest corners instantly when hovered
            const p = bracketLength / 2;
            const baseTargets = [
                p,                       // Top-Left
                -svgW + p,               // Top-Right
                -(svgW + svgH) + p,      // Bottom-Right
                -(2 * svgW + svgH) + p   // Bottom-Left
            ];
            
            const getNearestTarget = (current: number) => {
                let bestTarget = current;
                let minDiff = Infinity;

                for (const t of baseTargets) {
                    let diff = (t - current) % perimeter;
                    // Normalize to [-perimeter/2, perimeter/2] range for shortest path finding
                    if (diff > perimeter / 2) diff -= perimeter;
                    if (diff < -perimeter / 2) diff += perimeter;

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
    }, [isHovered, isStatic, offsetA, offsetB, perimeter, bracketLength, svgW, svgH]);

    const content = (
        <div
            ref={containerRef}
            className={`relative inline-flex items-center justify-center min-w-[185px] min-h-[49px] ${isStatic ? "pointer-events-none" : ""} ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Fill Layer (Original Fade Animation) */}
            <motion.div
                className="absolute inset-0 z-0"
                initial={false}
                animate={{
                    backgroundColor: isHovered 
                        ? hoverBg 
                        : (initialBgColor ? initialBgColor : (isWireframe ? "#D9D9D9" : "rgba(0,0,0,0)")),
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            />

            {/* Dynamic SVG Bracket Canvas */}
            <svg
                width={size.width}
                height={size.height}
                viewBox={`0 0 ${size.width} ${size.height}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full z-10 overflow-visible"
            >
                {/* Full rectangle track path (visible when NOT hovered) */}
                <motion.rect
                    x="1" y="1" width={svgW} height={svgH}
                    initial={false}
                    animate={{
                        stroke: baseColor,
                        strokeOpacity: isHovered ? 0 : 0.3,
                    }}
                    transition={{ duration: 0.25 }}
                />

                {/* Snake / Corner Brackets */}
                <motion.g animate={{ scale: isHovered ? 1.02 : 1 }} style={{ transformOrigin: "center center" }}>
                    <motion.rect
                        x="1" y="1" width={svgW} height={svgH}
                        strokeWidth={isHovered || !isWireframe ? "4" : "2"}
                        strokeLinecap="square"
                        strokeDasharray={`${bracketLength} ${bracketGap}`}
                        style={{ strokeDashoffset: offsetA }}
                        initial={false}
                        animate={{ stroke: bracketColor }}
                        transition={{ duration: 0.2 }}
                    />
                    <motion.rect
                        x="1" y="1" width={svgW} height={svgH}
                        strokeWidth={isHovered || !isWireframe ? "4" : "2"}
                        strokeLinecap="square"
                        strokeDasharray={`${bracketLength} ${bracketGap}`}
                        style={{ strokeDashoffset: offsetB }}
                        initial={false}
                        animate={{ stroke: bracketColor }}
                        transition={{ duration: 0.2 }}
                    />
                </motion.g>
            </svg>

            {/* Text Content with optional Arrow */}
            <motion.span
                className="relative z-20 text-xs font-bold tracking-[0.3em] uppercase px-6 py-2 flex items-center gap-3"
                initial={false}
                animate={{ color: isStatic ? (isWireframe ? "#FFFFFF" : "#D9D9D9") : (isHovered ? hoverColor : textColor) }}
                transition={{ duration: 0.3 }}
            >
                {children}
                {showArrow && (
                    <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 18 18" 
                        fill="none" 
                        className={`transition-transform duration-300 ${isHovered ? 'translate-x-0.5 -translate-y-0.5' : ''}`}
                    >
                        <path d="M3 15L15 3M15 3H3M15 3V15" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                )}
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
