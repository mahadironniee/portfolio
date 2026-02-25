"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useContext, useRef } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Navbar from "@/components/layout/navbar";

// This component "freezes" the route context for the exiting page
// so it doesn't instantly update to the new content before the animation finishes.
function FrozenRoute({ children }: { children: React.ReactNode }) {
    const context = useContext(LayoutRouterContext);
    const frozen = useRef(context).current;

    return (
        <LayoutRouterContext.Provider value={frozen}>
            {children}
        </LayoutRouterContext.Provider>
    );
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="bg-black min-h-screen w-full relative">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={pathname}
                    initial={{ y: "100%", zIndex: 20 }}
                    animate={{ y: 0, zIndex: 20 }}
                    exit={{
                        scale: 0.94, // Fixed shrink point
                        zIndex: 10,
                        opacity: 1, // NO vanishing
                        transition: {
                            delay: 0.45, // Starts at 20% mark
                            duration: 1.8, // Long enough to stay visible
                            ease: [0.4, 0, 0, 1] // "Catch momentum" easing
                        }
                    }}
                    transition={{
                        duration: 2.2,
                        ease: [0.4, 0, 0, 1] // Prevents mid-transition lag
                    }}
                    className="w-full min-h-screen shadow-2xl relative"
                    style={{ transformOrigin: "50% 50vh" }}
                >
                    <FrozenRoute>
                        <Navbar lockedPathname={pathname} />
                        {children}
                    </FrozenRoute>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
