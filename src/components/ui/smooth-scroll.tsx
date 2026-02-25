"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export default function SmoothScroll() {
    const pathname = usePathname();
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Prevent browser from restoring scroll position automatically
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Only initialize Lenis on desktop/tablet (>= 768px)
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        const lenis = new Lenis({
            lerp: 0.08,
            wheelMultiplier: 1.0,
            touchMultiplier: 2.0,
            infinite: false,
        });

        lenisRef.current = lenis;

        // HARD-CLAMP: Prevent targetScroll from going past document boundaries.
        // This ensures reverse scroll is INSTANT with no ghost momentum.
        lenis.on('scroll', ({ scroll, limit }: any) => {
            if (scroll <= 0) {
                (lenis as any).targetScroll = 0;
            } else if (scroll >= limit) {
                (lenis as any).targetScroll = limit;
            }
        });

        // Keep scroll limits accurate when DOM height changes
        const resizeObserver = new ResizeObserver(() => {
            if (lenisRef.current) lenisRef.current.resize();
        });
        resizeObserver.observe(document.body);

        function raf(time: number) {
            if (lenisRef.current) lenisRef.current.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            resizeObserver.disconnect();
            lenisRef.current = null;
        };
    }, []);

    useEffect(() => {
        // When pathname changes:
        // 1. Stop the lenis instance to kill momentum
        // 2. Force scroll to top instantly
        // 3. Start it again (optional, dependent on Lenis version, but usually safe)

        if (lenisRef.current) {
            lenisRef.current.stop(); // Stop completely
            window.scrollTo(0, 0); // Native reset
            lenisRef.current.scrollTo(0, { immediate: true, force: true }); // Lenis reset
            lenisRef.current.start(); // Resume
        } else {
            // Fallback if lenis isn't ready
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    return null;
}
