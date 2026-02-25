"use client";

import { useLayoutEffect, useEffect, useState, useRef } from "react";
import BurgerMenu from "@/components/ui/burger-menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Inner component to ensure both layers are perfectly identical in layout
function NavbarInner({
    textColor,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    lockedPathname
}: {
    textColor: string;
    isHovered: boolean;
    setIsHovered: (val: boolean) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    lockedPathname?: string;
}) {
    const rawPathname = usePathname();
    const pathname = lockedPathname || rawPathname;
    const router = useRouter();
    const isAbout = pathname === "/about";
    const isProjectDetail = pathname.startsWith("/projects/") && pathname !== "/projects";
    const isProjects = pathname === "/projects" || isProjectDetail;
    const isSpecialPage = isAbout || isProjects;

    const [isLogoHovered, setIsLogoHovered] = useState(false);

    const navItems = {
        home: { label: "Home", href: "/" },
        about: { label: "About", href: "/about" },
        projects: { label: "Projects", href: "/projects" },
        playground: { label: "Playground", href: "/playground" }
    };

    let node1_Left, node1_Right;

    if (pathname === "/") { // On Home
        node1_Left = navItems.projects;
        node1_Right = navItems.about;
    } else if (pathname === "/about") { // On About
        node1_Left = navItems.projects;
        node1_Right = navItems.home;
    } else if (isProjects) { // On Projects or Project Detail
        node1_Left = navItems.home;
        node1_Right = navItems.about;
    } else { // Fallback
        node1_Left = navItems.projects;
        node1_Right = navItems.about;
    }

    return (
        <div
            className="flex justify-between items-center px-4 md:px-8 pt-6 md:pt-10 pb-4 w-full"
            style={{ color: textColor }}
        >
            {/* Left: Profile Picture - Dynamic 36px -> 40px transition */}
            <div className="pointer-events-auto ml-4 md:ml-32 flex items-center justify-center w-[40px] h-[40px]">
                {isProjectDetail ? (
                    <button
                        onClick={() => router.back()}
                        className="relative w-[36px] h-[36px] rounded-full overflow-hidden block group bg-white/0 transition-all duration-300 ease-out hover:w-[40px] hover:h-[40px] outline-none select-none"
                        onMouseEnter={() => setIsLogoHovered(true)}
                        onMouseLeave={() => setIsLogoHovered(false)}
                        aria-label="Go back"
                    >
                        {/* Reuse the icon rendering logic below */}
                        <div className="w-full h-full relative">
                            <img
                                src="/profile.png"
                                alt="Profile"
                                className="w-full h-full object-cover transition-all duration-400 blur-[3px] opacity-40 scale-110"
                            />
                            <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-100">
                                <motion.div
                                    initial={{ x: 5, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="relative"
                                >
                                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
                                </motion.div>
                            </div>
                        </div>
                    </button>
                ) : (
                    <Link
                        href={isSpecialPage ? "/" : "/about"}
                        className="relative w-[36px] h-[36px] rounded-full overflow-hidden block group bg-white/0 transition-all duration-300 ease-out hover:w-[40px] hover:h-[40px] outline-none select-none"
                        onMouseEnter={() => setIsLogoHovered(true)}
                        onMouseLeave={() => setIsLogoHovered(false)}
                    >
                        <div className="w-full h-full relative">
                            {/* The Image - Smooth blur on hover (Home) or Always Blur (Special Pages) */}
                            <img
                                src="/profile.png"
                                alt="Profile"
                                className={`w-full h-full object-cover transition-all duration-400 
                                    ${isSpecialPage ? 'blur-[3px] opacity-40 scale-110' : 'group-hover:blur-[2px] group-hover:opacity-40 group-hover:scale-110'}`}
                            />

                            {/* Overlay Icon - Dynamic based on page */}
                            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 
                                ${isSpecialPage ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            >
                                {isSpecialPage ? (
                                    <div className="relative w-5 h-5 pointer-events-none">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="overflow-hidden">
                                            {/* Line 1 (\) - Exits Bottom-Right straight */}
                                            <motion.line
                                                x1="6" y1="6" x2="18" y2="18"
                                                animate={isLogoHovered ? {
                                                    x: [0, 24, -24, 0],
                                                    y: [0, 24, -24, 0],
                                                    opacity: [1, 0, 0, 1]
                                                } : { x: 0, y: 0, opacity: 1 }}
                                                transition={{
                                                    duration: isLogoHovered ? 0.6 : 0.3,
                                                    ease: "easeInOut",
                                                    times: [0, 0.4, 0.6, 1]
                                                }}
                                            />
                                            {/* Line 2 (/) - Exits Top-Right straight */}
                                            <motion.line
                                                x1="18" y1="6" x2="6" y2="18"
                                                animate={isLogoHovered ? {
                                                    x: [0, 24, -24, 0],
                                                    y: [0, -24, 24, 0],
                                                    opacity: [1, 0, 0, 1]
                                                } : { x: 0, y: 0, opacity: 1 }}
                                                transition={{
                                                    duration: isLogoHovered ? 0.6 : 0.3,
                                                    ease: "easeInOut",
                                                    delay: isLogoHovered ? 0.12 : 0,
                                                    times: [0, 0.4, 0.6, 1]
                                                }}
                                            />
                                        </svg>
                                    </div>
                                ) : (
                                    <ArrowUpRight size={18} className="translate-y-1 -translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                                )}
                            </div>
                        </div>
                    </Link>
                )}
            </div>

            {/* Center: Dynamic Nav Tree & Progress */}
            <div className="flex flex-col items-center gap-1 pointer-events-auto relative">
                <div className="flex items-center gap-4">
                    {/* The Nav Tree Controller */}
                    <div
                        className="relative flex items-center justify-center group/tree px-2 py-2"
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        {/* THE TREE (Hover Reveal) */}
                        <AnimatePresence mode="wait">
                            {isHovered && (
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none whitespace-nowrap z-[110]"
                                    initial="initial"
                                    animate="animate"
                                    exit="initial"
                                >
                                    {/* Left Side: Contact - Horizontal Branch */}
                                    <motion.div
                                        className="absolute right-full top-1/2 -translate-y-1/2 flex items-center pointer-events-auto pr-2"
                                        variants={{
                                            initial: { x: 10, opacity: 0 },
                                            animate: { x: 0, opacity: 1 }
                                        }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                        <Link
                                            href="#contact"
                                            className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity"
                                            style={{ color: textColor }}
                                        >
                                            Contact
                                        </Link>
                                        <div className="w-[8px]" />
                                        <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: textColor }} />
                                        <div className="w-[8px]" />
                                        <div className="w-[12px] h-[1px] opacity-30" style={{ backgroundColor: textColor }} />
                                    </motion.div>

                                    {/* Vertical Branch (Projects, Home, About & Playground) */}
                                    <motion.div
                                        className="absolute top-[80%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto"
                                        variants={{
                                            initial: { y: -10, opacity: 0 },
                                            animate: { y: 0, opacity: 1 }
                                        }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                        {/* Line Segment 1 (UP to text) */}
                                        <div
                                            className="h-[16px] w-[1px] opacity-20"
                                            style={{ backgroundColor: textColor }}
                                        />

                                        <div className="h-[8px]" />

                                        {/* Node 1: Left Link | Dot | Right Link Branch */}
                                        <div className="relative flex items-center justify-center w-[6px] h-[6px]">
                                            {/* Left Link */}
                                            <Link
                                                href={node1_Left.href}
                                                className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity absolute right-[12px] whitespace-nowrap z-20 pointer-events-auto"
                                                style={{ color: textColor }}
                                            >
                                                {node1_Left.label}
                                            </Link>

                                            {/* Center Dot */}
                                            <div className="w-full h-full rounded-full" style={{ backgroundColor: textColor }} />

                                            {/* Right Link Branch */}
                                            <div className="absolute left-[14px] flex items-center pointer-events-auto z-20">
                                                <div className="w-[12px] h-[1px] opacity-30" style={{ backgroundColor: textColor }} />
                                                <div className="w-[8px]" />
                                                <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: textColor }} />
                                                <div className="w-[8px]" />
                                                <Link
                                                    href={node1_Right.href}
                                                    className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity whitespace-nowrap"
                                                    style={{ color: textColor }}
                                                >
                                                    {node1_Right.label}
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="h-[8px]" />

                                        {/* Line Segment 2 (Mid to Bottom) */}
                                        <div
                                            className="h-[16px] w-[1px] opacity-20"
                                            style={{ backgroundColor: textColor }}
                                        />

                                        <div className="h-[8px]" />

                                        {/* Node 2: Dot | Right Link (Playground) */}
                                        <div className="relative flex items-center justify-center w-[6px] h-[6px]">
                                            <div className="w-full h-full rounded-full" style={{ backgroundColor: textColor }} />
                                            <Link
                                                href="/playground"
                                                className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity absolute left-[12px] whitespace-nowrap z-20 pointer-events-auto"
                                                style={{ color: textColor }}
                                            >
                                                Playground
                                            </Link>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Main Link (Current Page Title) */}
                        <Link
                            href={pathname}
                            className="text-sm font-medium tracking-wide cursor-pointer transition-opacity group-hover/tree:opacity-60 outline-none select-none relative z-0"
                            style={{
                                fontFamily: 'var(--font-inter)',
                                color: textColor
                            }}
                        >
                            {isAbout ? "About" : isProjects ? "Projects" : "Home"}
                        </Link>
                    </div>

                    {/* Scroll Progress Bar */}
                    <div
                        className="w-[100px] md:w-[200px] h-[4px] relative rounded-[2px] overflow-hidden"
                        style={{ backgroundColor: `${textColor}1a` }} // Inherit with 10% opacity
                    >
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{ backgroundColor: textColor }}
                        />
                        <div
                            className="h-full bg-[#D2F925] relative z-10 w-[var(--scroll-w)]"
                        />
                    </div>
                </div>
            </div>

            {/* Right: Burger Menu - Mirroring left margin */}
            <div className="pointer-events-auto mr-4 md:mr-32 flex items-center">
                <div className="cursor-pointer" style={{ color: textColor }}>
                    <BurgerMenu />
                </div>
            </div>
        </div>
    );
}

export default function Navbar({ lockedPathname }: { lockedPathname?: string }) {
    const rawPathname = usePathname();
    const pathname = lockedPathname || rawPathname;
    const [scrollProgress, setScrollProgress] = useState(0);

    // Initial state based on route to prevent flash on white pages
    // isDarkPage means "Navigation text should be dark because the page is light"
    const isAbout = pathname === "/about";
    const isProjectDetail = pathname.startsWith("/projects/") && pathname !== "/projects";
    const isDarkPage = isAbout || isProjectDetail;

    const [clipPath, setClipPath] = useState(isDarkPage ? "inset(0px 0px 0% 0px)" : "inset(0px 0px 100% 0px)");
    const [baseMask, setBaseMask] = useState(isDarkPage ? "linear-gradient(to bottom, transparent 0px, transparent 600px)" : "none");

    const [isHovered, setIsHovered] = useState(false);
    const navHeight = 600;
    const containerRef = useRef<HTMLDivElement>(null);
    const [isTransitioning, setIsTransitioning] = useState(true);

    useLayoutEffect(() => {
        // Clear transitioning state after page transition duration (2.2s + delay + buffer)
        const transitionTimer = setTimeout(() => {
            setIsTransitioning(false);
        }, 2800);

        const update = () => {
            const scrollTop = window.scrollY;
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight - winHeight;

            // 1. Sync scroll progress
            const progress = docHeight > 0 ? scrollTop / docHeight : 0;
            const clampedProgress = Math.min(Math.max(progress, 0), 1);
            setScrollProgress(clampedProgress);

            // 2. Transition Lock: Skip heavy clipping while the page is sliding
            if (isTransitioning) {
                setClipPath(isDarkPage ? "inset(0px 0px 0% 0px)" : "inset(0px 0px 100% 0px)");
                setBaseMask(isDarkPage ? "linear-gradient(to bottom, transparent 0px, transparent 600px)" : "none");
                return;
            }

            // 3. Scoped clipping logic for the Overlay (Dark Text)
            // Priority Check: Are we over a "Force Dark" (White Text) area?
            const darkTriggers = document.querySelectorAll(".dark-bg-nav-trigger");
            let forceDark = false;
            for (const trigger of Array.from(darkTriggers)) {
                const rect = trigger.getBoundingClientRect();
                // If the trigger covers the entire Navbar height
                if (rect.top <= 0 && rect.bottom >= navHeight) {
                    forceDark = true;
                    break;
                }
            }

            if (forceDark) {
                setClipPath("inset(0px 0px 100% 0px)");
                setBaseMask("none");
            } else {
                const lightSections = document.querySelectorAll(".light-bg-nav-trigger");
                let found = false;

                for (const section of Array.from(lightSections)) {
                    const rect = section.getBoundingClientRect();

                    if (rect.top < navHeight && rect.bottom > 0) {
                        const topInset = Math.max(0, rect.top);
                        const bottomInset = Math.max(0, navHeight - rect.bottom);
                        setClipPath(`inset(${topInset}px 0px ${bottomInset}px 0px)`);
                        setBaseMask(`linear-gradient(to bottom, white 0px, white ${topInset}px, transparent ${topInset}px, transparent ${navHeight - bottomInset}px, white ${navHeight - bottomInset}px)`);
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    setClipPath(isDarkPage ? "inset(0px 0px 0% 0px)" : "inset(0px 0px 100% 0px)");
                    setBaseMask(isDarkPage ? "linear-gradient(to bottom, transparent 0px, transparent 600px)" : "none");
                }
            }
        };

        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);

        // Small delay to let the entering page DOM settle before the first rect calculation
        const initTimeout = setTimeout(update, 0);

        let rafId: number;
        const tick = () => {
            update();
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
            clearTimeout(initTimeout);
            clearTimeout(transitionTimer);
            cancelAnimationFrame(rafId);
        };
    }, [pathname, isTransitioning]);

    // Hover stability logic
    const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
    const handleMouseEnter = () => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setIsHovered(false);
        }, 300); // 300ms grace period
        setHoverTimeout(timeout);
    };

    return (
        <div ref={containerRef}>
            <div
                className="fixed top-0 left-0 right-0 z-[100] pointer-events-none"
                style={{
                    height: `${navHeight}px`,
                    // @ts-ignore
                    "--scroll-w": `${8 + (scrollProgress * ((typeof window !== 'undefined' && window.innerWidth < 768 ? 100 : 200) - 8))}px`
                }}
            >
                {/* Layer 1: Base (White Text) - Masked to avoid blending with dark overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        maskImage: baseMask,
                        WebkitMaskImage: baseMask
                    }}
                >
                    <NavbarInner
                        textColor="white"
                        isHovered={isHovered}
                        setIsHovered={setIsHovered}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        lockedPathname={lockedPathname}
                    />
                </div>

                {/* Layer 2: Overlay (Dark Text), Masked to Section */}
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: clipPath }}
                >
                    <NavbarInner
                        textColor="#000121"
                        isHovered={isHovered}
                        setIsHovered={setIsHovered}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        lockedPathname={lockedPathname}
                    />
                </div>
            </div>
        </div>
    );
}
