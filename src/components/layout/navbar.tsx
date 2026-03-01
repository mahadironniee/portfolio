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
    lockedPathname,
    isLogoHovered,
    setIsLogoHovered
}: {
    textColor: string;
    isHovered: boolean;
    setIsHovered: (val: boolean) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    lockedPathname?: string;
    isLogoHovered: boolean;
    setIsLogoHovered: (val: boolean) => void;
}) {
    const rawPathname = usePathname();
    const pathname = lockedPathname || rawPathname;
    const router = useRouter();
    const isAbout = pathname === "/about";
    const isProjectDetail = pathname.startsWith("/projects/") && pathname !== "/projects";
    const isProjects = pathname === "/projects" || isProjectDetail;
    const isSpecialPage = isAbout || isProjects;

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
            <div className={`pointer-events-auto ml-4 md:ml-32 flex items-center justify-center w-[40px] h-[40px]`}>
                {isProjectDetail ? (
                    <button
                        onClick={() => router.back()}
                        className={`relative rounded-full overflow-hidden block bg-white/0 transition-all duration-300 ease-out outline-none select-none ${isLogoHovered ? 'w-[40px] h-[40px]' : 'w-[36px] h-[36px]'}`}
                        onMouseEnter={() => setIsLogoHovered(true)}
                        onMouseLeave={() => setIsLogoHovered(false)}
                        aria-label="Go back"
                    >
                        {/* Reuse the icon rendering logic below */}
                        <div className="w-full h-full relative">
                            <img
                                src="/images/profile.png"
                                alt="Profile"
                                className="w-full h-full object-cover transition-all duration-400 blur-[3px] opacity-40 scale-110"
                            />
                            <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-100">
                                <motion.div
                                    initial={{ x: 5, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="relative"
                                >
                                    <ArrowLeft size={20} className={`transition-transform duration-300 ${isLogoHovered ? '-translate-x-1' : 'translate-x-0'}`} />
                                </motion.div>
                            </div>
                        </div>
                    </button>
                ) : (
                    <Link
                        href={isSpecialPage ? "/" : "/about"}
                        className={`relative rounded-full overflow-hidden block bg-white/0 transition-all duration-300 ease-out outline-none select-none ${isLogoHovered ? 'w-[40px] h-[40px]' : 'w-[36px] h-[36px]'}`}
                        onMouseEnter={() => setIsLogoHovered(true)}
                        onMouseLeave={() => setIsLogoHovered(false)}
                    >
                        <div className="w-full h-full relative">
                            {/* The Image - Smooth blur on hover (Home) or Always Blur (Special Pages) */}
                            <img
                                src="/images/profile.png"
                                alt="Profile"
                                className={`w-full h-full object-cover transition-all duration-400 
                                    ${isSpecialPage ? 'blur-[3px] opacity-40 scale-110' : (isLogoHovered ? 'blur-[2px] opacity-40 scale-110' : '')}`}
                            />

                            {/* Overlay Icon - Dynamic based on page */}
                            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 
                                ${isSpecialPage ? 'opacity-100' : (isLogoHovered ? 'opacity-100' : 'opacity-0')}`}
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
                                    <ArrowUpRight size={18} className={`transition-transform duration-300 ease-out ${isLogoHovered ? 'translate-y-0 translate-x-0' : 'translate-y-1 -translate-x-1'}`} />
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
                                            style={{ color: textColor, fontFamily: 'var(--font-post-no-bills)' }}
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
                                                style={{ color: textColor, fontFamily: 'var(--font-post-no-bills)' }}
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
                                                    style={{ color: textColor, fontFamily: 'var(--font-post-no-bills)' }}
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
                                                style={{ color: textColor, fontFamily: 'var(--font-post-no-bills)' }}
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
                            className="cursor-pointer transition-opacity group-hover/tree:opacity-60 outline-none select-none relative z-0 flex items-center"
                            style={{ color: textColor }}
                        >
                            {isAbout || isProjects ? (
                                <span style={{ fontFamily: 'var(--font-post-no-bills)', fontWeight: 600, fontSize: 22, color: textColor }}>
                                    {isAbout ? "About" : "Projects"}
                                </span>
                            ) : (
                                <svg width="42" height="14" viewBox="0 0 42 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: textColor }}>
                                    <path transform="scale(0.85)" d="M0 15.1465V0.107422H1.86914V6.66016H3.80273V8.48633H1.86914V15.1465H0ZM4.87695 8.48633V6.66016H6.78906V0.107422H8.67969V15.1465H6.78906V8.48633H4.87695ZM11.697 10.957V3.88867C11.697 3.12956 12.0192 2.35612 12.6637 1.56836C13.5231 0.537109 14.6117 0.0143229 15.9294 0V1.86914C15.0557 1.86914 14.3753 2.31315 13.8884 3.20117C13.6878 3.58789 13.5876 3.93164 13.5876 4.23242V10.957C13.5876 11.8594 14.0316 12.5612 14.9196 13.0625C15.292 13.2773 15.6214 13.3848 15.9079 13.3848V15.2539C15.0915 15.2539 14.2751 14.9603 13.4587 14.373C12.2985 13.5137 11.7113 12.375 11.697 10.957ZM17.0895 15.2539V13.3848C17.5908 13.3848 18.0993 13.1628 18.6149 12.7188C19.1592 12.2318 19.4385 11.6445 19.4528 10.957V4.23242C19.4528 3.67383 19.2236 3.13672 18.7653 2.62109C18.2927 2.13411 17.7341 1.88346 17.0895 1.86914V0C18.5361 0 19.6963 0.623047 20.57 1.86914C21.0713 2.58529 21.322 3.25846 21.322 3.88867V10.957C21.322 12.5469 20.613 13.7643 19.195 14.6094C18.4502 15.0391 17.7484 15.2539 17.0895 15.2539ZM24.3822 15.1465V4.4043H24.5755L26.2513 8.48633V15.1465H24.3822ZM24.3822 1.28906V0.107422H25.9076L30.849 12.0742L34.3724 4.10352H34.5873V8.27148L31.558 15.1465H30.14L24.3822 1.28906ZM35.6615 15.1465V0.107422H37.5306V15.1465H35.6615ZM40.6338 15.1465V0.107422H48.4541V1.95508H42.503V6.72461H46.4346V8.59375H42.503V13.2988H48.4541V15.1465H40.6338Z" fill="currentColor" />
                                </svg>
                            )}
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
    const [isLogoHovered, setIsLogoHovered] = useState(false);
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
                        isLogoHovered={isLogoHovered}
                        setIsLogoHovered={setIsLogoHovered}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        lockedPathname={lockedPathname}
                    />
                </div>

                {/* Layer 2: Overlay (Dark Text), Masked to Section */}
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                        clipPath: clipPath,
                        // If the clipPath is 100% hidden, completely disable pointer events so it doesn't block the visible layer
                        pointerEvents: clipPath.includes("100%") ? "none" : "auto"
                    }}
                >
                    <NavbarInner
                        textColor="#000121"
                        isHovered={isHovered}
                        setIsHovered={setIsHovered}
                        isLogoHovered={isLogoHovered}
                        setIsLogoHovered={setIsLogoHovered}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        lockedPathname={lockedPathname}
                    />
                </div>
            </div>
        </div>
    );
}
