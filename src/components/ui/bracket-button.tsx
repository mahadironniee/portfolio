"use client";

import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BracketButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string;
    color?: "white" | "black";
    className?: string;
    children: React.ReactNode;
}

export default function BracketButton({
    href,
    color = "white",
    className = "",
    children,
    ...props
}: BracketButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    // The "base" color of the stroke/text when NOT hovered
    const baseColor = color === "white" ? "white" : "#000121";
    // The color of the strokes/text when HOVERED
    const hoverColor = "white";
    // The background fill color on hover - Pure black for studio look
    const hoverBg = "#000000";

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
                {/* Thin lines (fading out on hover) */}
                <motion.path
                    d="M1 38V1H111"
                    initial={false}
                    animate={{
                        stroke: baseColor,
                        strokeOpacity: isHovered ? 0 : 0.5
                    }}
                    transition={{ duration: 0.2 }}
                />
                <motion.path
                    d="M150 11V48H41"
                    initial={false}
                    animate={{
                        stroke: baseColor,
                        strokeOpacity: isHovered ? 0 : 0.5
                    }}
                    transition={{ duration: 0.2 }}
                />

                {/* Thick corner accents (always visible, converting to white if needed) */}
                <motion.path
                    d="M110 1H130H150V11"
                    initial={false}
                    animate={{ stroke: isHovered ? hoverColor : baseColor }}
                    strokeWidth="2"
                    transition={{ duration: 0.3 }}
                />
                <motion.path
                    d="M41 48H0.999999V38"
                    initial={false}
                    animate={{ stroke: isHovered ? hoverColor : baseColor }}
                    strokeWidth="2"
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
