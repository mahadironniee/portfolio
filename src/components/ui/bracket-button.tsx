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
    const borderColorClass = color === "white" ? "border-white" : "border-black";
    const textColorClass = color === "white" ? "text-white" : "text-black";

    const content = (
        <div className={`relative group cursor-pointer inline-flex items-center justify-center ${className}`}>
            <div className={`absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 ${borderColorClass} opacity-40 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className={`absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 ${borderColorClass} opacity-40 group-hover:opacity-100 transition-opacity duration-300`} />

            <span className={`${textColorClass} text-xs font-bold tracking-[0.3em] uppercase px-4 py-2`}>
                {children}
            </span>
        </div>
    );

    if (href) {
        return (
            <Link href={href}>
                {content}
            </Link>
        );
    }

    return (
        <button {...props} className="outline-none bg-transparent border-none p-0 m-0">
            {content}
        </button>
    );
}
