"use client";

import { useEffect, useRef } from "react";

export default function BurgerMenu({ className }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleEnter = () => {
            // @ts-ignore
            if (window.burgerHoverTimeout) clearTimeout(window.burgerHoverTimeout);

            // Instantly apply hover to ALL duplicate instances on the page
            document.querySelectorAll('.burger-icon').forEach(icon => {
                icon.classList.add('is-hovered');
            });
        };

        const handleLeave = () => {
            // @ts-ignore
            window.burgerHoverTimeout = setTimeout(() => {
                // Only remove the class after a brief delay
                // This guarantees crossing the clip-path boundary doesn't prematurely kill the animation
                document.querySelectorAll('.burger-icon').forEach(icon => {
                    icon.classList.remove('is-hovered');
                });
            }, 50);
        };

        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);

        return () => {
            el.removeEventListener('mouseenter', handleEnter);
            el.removeEventListener('mouseleave', handleLeave);
        };
    }, []);

    return (
        <div ref={containerRef} className={`burger-icon flex items-center justify-center w-[44px] h-[44px] cursor-pointer ${className || ""}`}>
            <div className="relative w-[21px] h-[28px] flex items-center">
                <span className="burger-left absolute left-0 block bg-current transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" />
                <span className="burger-right absolute right-0 block bg-current transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" />
            </div>
        </div>
    );
}
