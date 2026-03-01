"use client";

import Link from "next/link";
import React from "react";

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
    const strokeColor = color === "white" ? "white" : "#000121";

    const content = (
        <div className={`relative group cursor-pointer inline-flex items-center justify-center min-w-[151px] h-[49px] ${className}`}>
            {/* SVG bracket border */}
            <svg
                width="151"
                height="49"
                viewBox="0 0 151 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
            >
                {/* Thin lines (50% opacity) */}
                <path d="M1 38V1H111" stroke={strokeColor} strokeOpacity="0.5" />
                <path d="M150 11V48H41" stroke={strokeColor} strokeOpacity="0.5" />
                {/* Thick corner accents */}
                <path d="M110 1H130H150V11" stroke={strokeColor} strokeWidth="2" />
                <path d="M41 48H0.999999V38" stroke={strokeColor} strokeWidth="2" />
            </svg>
            <span
                className="relative z-10 text-xs font-bold tracking-[0.3em] uppercase px-4 py-2"
                style={{ color: strokeColor }}
            >
                {children}
            </span>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="inline-block hover:scale-105 active:scale-95 transition-transform">
                {content}
            </Link>
        );
    }

    return (
        <button {...props} className="outline-none bg-transparent border-none p-0 m-0 hover:scale-105 active:scale-95 transition-transform">
            {content}
        </button>
    );
}
