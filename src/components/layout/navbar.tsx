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
    setIsLogoHovered,
    isWireframe,
    isLogoWireframe,
    isPreloading,
}: {
    textColor: string;
    isHovered: boolean;
    setIsHovered: (val: boolean) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    lockedPathname?: string;
    isLogoHovered: boolean;
    setIsLogoHovered: (val: boolean) => void;
    isWireframe?: boolean;
    isLogoWireframe?: boolean;
    isPreloading?: boolean;
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
            {/* Left: Logo + Navigation Links */}
            <div className={`flex items-center ${isPreloading ? "pointer-events-none" : "pointer-events-auto"} ml-4 md:ml-32`}>
                {/* Logo: Wireframe placeholder or real SVG */}
                <div className="flex items-center justify-center h-[32px] relative" style={{ minWidth: 88 }}>
                    <AnimatePresence mode="wait">
                        {isLogoWireframe ? (
                            <motion.div
                                key="logo-wireframe"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center justify-center h-full w-full"
                            >
                                <span
                                    className="text-[28px] font-[800] tracking-[0.25em] uppercase"
                                    style={{ color: '#D9D9D9', fontFamily: 'var(--font-post-no-bills)' }}
                                >
                                    LOGO
                                </span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="logo-live"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isProjectDetail ? (
                                    <button
                                        onClick={() => router.back()}
                                        className="relative block bg-white/0 transition-all duration-300 ease-out outline-none select-none hover:opacity-70"
                                        aria-label="Go back"
                                        onMouseEnter={() => setIsLogoHovered(true)}
                                        onMouseLeave={() => setIsLogoHovered(false)}
                                    >
                                        <svg width="88" height="32" viewBox="0 0 88 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-colors preloader-active" style={{ color: textColor }}>
                                            <path d="M81 19H82.5575L85.2175 26.5226L83.415 32H81.9275L83.6425 26.5048L81 19ZM84.8675 23.1259L86.46 19H88L85.6725 25.2066H85.515L84.8675 23.1259Z" fill="currentColor" />
                                            <path d="M74 27.2786V22.7369C74.0107 22.075 74.2735 21.462 74.7882 20.8982C75.2922 20.3465 75.882 20.0707 76.5576 20.0707H77.8284V21.5601H76.5737C76.134 21.5601 75.7748 21.7869 75.496 22.2405C75.378 22.4488 75.319 22.645 75.319 22.8289V27.2419C75.319 27.6341 75.5121 27.9712 75.8981 28.2532C76.1233 28.4248 76.3539 28.5106 76.5898 28.5106H77.8284V30H76.6059C75.6515 30 74.9115 29.5281 74.3861 28.5842C74.1287 28.1183 74 27.6832 74 27.2786ZM78.6005 30L78.6166 17H80V30H78.6005Z" fill="currentColor" />
                                            <path d="M66 27.6937V26.8081C66 26.0086 66.296 25.4244 66.8881 25.0554C67.0738 24.9569 67.7877 24.7232 69.0299 24.3542C70.4113 23.9483 71.102 23.5916 71.102 23.2841V22.9336C71.102 22.6384 71.0323 22.3678 70.893 22.1218C70.626 21.6544 70.2197 21.4207 69.6741 21.4207V20C70.4751 20 71.1426 20.2706 71.6766 20.8118C72.2454 21.4022 72.5299 22.091 72.5299 22.8782V27.9336C72.5415 28.3149 72.6982 28.5178 73 28.5424V30C72.4196 30 71.9494 29.7847 71.5896 29.3542C71.1252 29.7724 70.4867 29.9877 69.6741 30V28.5609C69.7786 28.5609 69.8889 28.5547 70.005 28.5424C70.7363 28.4194 71.102 27.9582 71.102 27.1587V25.0369C70.8002 25.2091 70.2197 25.4059 69.3607 25.6273C68.2579 25.9102 67.6368 26.1193 67.4975 26.2546C67.3698 26.3776 67.3002 26.5744 67.2886 26.845V27.3432C67.3002 28.1304 67.8109 28.5363 68.8209 28.5609V30C68.1012 30 67.4743 29.8032 66.9403 29.4096C66.3134 28.9422 66 28.3702 66 27.6937ZM66.1219 22.5092C66.1219 21.9188 66.3425 21.3899 66.7836 20.9225C67.3524 20.3075 68.0373 20 68.8383 20V21.4391C68.6177 21.4391 68.4088 21.4883 68.2114 21.5867C67.6774 21.8573 67.4104 22.337 67.4104 23.0258L66.1219 22.5092Z" fill="currentColor" />
                                            <path d="M58 30V17H59.4476V20.8322C59.8997 20.4288 60.4555 20.221 61.1152 20.2087V21.6389C60.5654 21.6389 60.1012 21.8834 59.7225 22.3724C59.5515 22.6046 59.466 22.8185 59.466 23.0141V30H58ZM61.9764 21.6389V20.2087C63.1126 20.2087 63.9677 20.6182 64.5419 21.4372C64.8473 21.8773 65 22.3479 65 22.8491V30H63.534V23.0141C63.534 22.5496 63.3264 22.1768 62.911 21.8956C62.6422 21.7245 62.3307 21.6389 61.9764 21.6389Z" fill="currentColor" />
                                            <path d="M50 27.6937V26.8081C50 26.0086 50.296 25.4244 50.8881 25.0554C51.0738 24.9569 51.7877 24.7232 53.0299 24.3542C54.4113 23.9483 55.102 23.5916 55.102 23.2841V22.9336C55.102 22.6384 55.0323 22.3678 54.893 22.1218C54.626 21.6544 54.2197 21.4207 53.6741 21.4207V20C54.4751 20 55.1426 20.2706 55.6766 20.8118C56.2454 21.4022 56.5299 22.091 56.5299 22.8782V27.9336C56.5415 28.3149 56.6982 28.5178 57 28.5424V30C56.4196 30 55.9494 29.7847 55.5896 29.3542C55.1252 29.7724 54.4867 29.9877 53.6741 30V28.5609C53.7786 28.5609 53.8889 28.5547 54.005 28.5424C54.7363 28.4194 55.102 27.9582 55.102 27.1587V25.0369C54.8002 25.2091 54.2197 25.4059 53.3607 25.6273C52.2579 25.9102 51.6368 26.1193 51.4975 26.2546C51.3698 26.3776 51.3002 26.5744 51.2886 26.845V27.3432C51.3002 28.1304 51.8109 28.5363 52.8209 28.5609V30C52.1012 30 51.4743 29.8032 50.9403 29.4096C50.3134 28.9422 50 28.3702 50 27.6937ZM50.1219 22.5092C50.1219 21.9188 50.3425 21.3899 50.7836 20.9225C51.3524 20.3075 52.0373 20 52.8383 20V21.4391C52.6177 21.4391 52.4088 21.4883 52.2114 21.5867C51.6774 21.8573 51.4104 22.337 51.4104 23.0258L50.1219 22.5092Z" fill="currentColor" />
                                            <path d="M37 30V22.7256C37 22.0381 37.2573 21.4242 37.7718 20.884C38.3476 20.2947 39.0766 20 39.9587 20V21.5101C39.2971 21.5101 38.8622 21.7986 38.6539 22.3757C38.5926 22.5599 38.562 22.744 38.562 22.9282V30H37ZM40.7856 21.5101V20C41.7167 20.0246 42.4518 20.3499 42.9908 20.9761C43.6034 20.3499 44.3384 20.0246 45.196 20V21.5101C44.5345 21.5101 44.0934 21.7986 43.8729 22.3757C43.8116 22.5476 43.781 22.7317 43.781 22.9282V30H42.219V22.9282C42.219 22.302 41.9556 21.8723 41.4288 21.639C41.2328 21.5531 41.0184 21.5101 40.7856 21.5101ZM46.023 21.5101V20C47.1868 20 48.0505 20.4788 48.6141 21.4365C48.8714 21.8785 49 22.3082 49 22.7256V30H47.438V22.9282C47.438 22.2529 47.1562 21.8109 46.5927 21.6022C46.4211 21.5408 46.2312 21.5101 46.023 21.5101Z" fill="currentColor" />
                                            <path d="M30 28.0357C30 27.1786 30.381 26.5714 31.1429 26.2143C31.4286 26.0714 31.7143 26 32 26C32.8333 26 33.4405 26.3929 33.8214 27.1786C33.9405 27.4643 34 27.75 34 28.0357C34 28.8452 33.631 29.4286 32.8929 29.7857C32.5833 29.9286 32.2857 30 32 30C31.1667 30 30.5714 29.631 30.2143 28.8929C30.0714 28.6071 30 28.3214 30 28.0357Z" fill="currentColor" />
                                            <path d="M0 30V8.57143H0.397059L3.83824 16.7143V30H0ZM0 2.35714V0H3.13235L13.2794 23.8714L20.5147 7.97143H20.9559V16.2857L14.7353 30H11.8235L0 2.35714ZM23.1618 30V0H27V30H23.1618Z" fill="currentColor" />
                                        </svg>
                                    </button>
                                ) : (
                                    <Link
                                        href={isSpecialPage ? "/" : "/about"}
                                        className="relative block bg-white/0 transition-all duration-300 ease-out outline-none select-none hover:opacity-70"
                                        onMouseEnter={() => setIsLogoHovered(true)}
                                        onMouseLeave={() => setIsLogoHovered(false)}
                                    >
                                        <svg width="88" height="32" viewBox="0 0 88 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-colors preloader-active" style={{ color: textColor }}>
                                            <path d="M81 19H82.5575L85.2175 26.5226L83.415 32H81.9275L83.6425 26.5048L81 19ZM84.8675 23.1259L86.46 19H88L85.6725 25.2066H85.515L84.8675 23.1259Z" fill="currentColor" />
                                            <path d="M74 27.2786V22.7369C74.0107 22.075 74.2735 21.462 74.7882 20.8982C75.2922 20.3465 75.882 20.0707 76.5576 20.0707H77.8284V21.5601H76.5737C76.134 21.5601 75.7748 21.7869 75.496 22.2405C75.378 22.4488 75.319 22.645 75.319 22.8289V27.2419C75.319 27.6341 75.5121 27.9712 75.8981 28.2532C76.1233 28.4248 76.3539 28.5106 76.5898 28.5106H77.8284V30H76.6059C75.6515 30 74.9115 29.5281 74.3861 28.5842C74.1287 28.1183 74 27.6832 74 27.2786ZM78.6005 30L78.6166 17H80V30H78.6005Z" fill="currentColor" />
                                            <path d="M66 27.6937V26.8081C66 26.0086 66.296 25.4244 66.8881 25.0554C67.0738 24.9569 67.7877 24.7232 69.0299 24.3542C70.4113 23.9483 71.102 23.5916 71.102 23.2841V22.9336C71.102 22.6384 71.0323 22.3678 70.893 22.1218C70.626 21.6544 70.2197 21.4207 69.6741 21.4207V20C70.4751 20 71.1426 20.2706 71.6766 20.8118C72.2454 21.4022 72.5299 22.091 72.5299 22.8782V27.9336C72.5415 28.3149 72.6982 28.5178 73 28.5424V30C72.4196 30 71.9494 29.7847 71.5896 29.3542C71.1252 29.7724 70.4867 29.9877 69.6741 30V28.5609C69.7786 28.5609 69.8889 28.5547 70.005 28.5424C70.7363 28.4194 71.102 27.9582 71.102 27.1587V25.0369C70.8002 25.2091 70.2197 25.4059 69.3607 25.6273C68.2579 25.9102 67.6368 26.1193 67.4975 26.2546C67.3698 26.3776 67.3002 26.5744 67.2886 26.845V27.3432C67.3002 28.1304 67.8109 28.5363 68.8209 28.5609V30C68.1012 30 67.4743 29.8032 66.9403 29.4096C66.3134 28.9422 66 28.3702 66 27.6937ZM66.1219 22.5092C66.1219 21.9188 66.3425 21.3899 66.7836 20.9225C67.3524 20.3075 68.0373 20 68.8383 20V21.4391C68.6177 21.4391 68.4088 21.4883 68.2114 21.5867C67.6774 21.8573 67.4104 22.337 67.4104 23.0258L66.1219 22.5092Z" fill="currentColor" />
                                            <path d="M58 30V17H59.4476V20.8322C59.8997 20.4288 60.4555 20.221 61.1152 20.2087V21.6389C60.5654 21.6389 60.1012 21.8834 59.7225 22.3724C59.5515 22.6046 59.466 22.8185 59.466 23.0141V30H58ZM61.9764 21.6389V20.2087C63.1126 20.2087 63.9677 20.6182 64.5419 21.4372C64.8473 21.8773 65 22.3479 65 22.8491V30H63.534V23.0141C63.534 22.5496 63.3264 22.1768 62.911 21.8956C62.6422 21.7245 62.3307 21.6389 61.9764 21.6389Z" fill="currentColor" />
                                            <path d="M50 27.6937V26.8081C50 26.0086 50.296 25.4244 50.8881 25.0554C51.0738 24.9569 51.7877 24.7232 53.0299 24.3542C54.4113 23.9483 55.102 23.5916 55.102 23.2841V22.9336C55.102 22.6384 55.0323 22.3678 54.893 22.1218C54.626 21.6544 54.2197 21.4207 53.6741 21.4207V20C54.4751 20 55.1426 20.2706 55.6766 20.8118C56.2454 21.4022 56.5299 22.091 56.5299 22.8782V27.9336C56.5415 28.3149 56.6982 28.5178 57 28.5424V30C56.4196 30 55.9494 29.7847 55.5896 29.3542C55.1252 29.7724 54.4867 29.9877 53.6741 30V28.5609C53.7786 28.5609 53.8889 28.5547 54.005 28.5424C54.7363 28.4194 55.102 27.9582 55.102 27.1587V25.0369C54.8002 25.2091 54.2197 25.4059 53.3607 25.6273C52.2579 25.9102 51.6368 26.1193 51.4975 26.2546C51.3698 26.3776 51.3002 26.5744 51.2886 26.845V27.3432C51.3002 28.1304 51.8109 28.5363 52.8209 28.5609V30C52.1012 30 51.4743 29.8032 50.9403 29.4096C50.3134 28.9422 50 28.3702 50 27.6937ZM50.1219 22.5092C50.1219 21.9188 50.3425 21.3899 50.7836 20.9225C51.3524 20.3075 52.0373 20 52.8383 20V21.4391C52.6177 21.4391 52.4088 21.4883 52.2114 21.5867C51.6774 21.8573 51.4104 22.337 51.4104 23.0258L50.1219 22.5092Z" fill="currentColor" />
                                            <path d="M37 30V22.7256C37 22.0381 37.2573 21.4242 37.7718 20.884C38.3476 20.2947 39.0766 20 39.9587 20V21.5101C39.2971 21.5101 38.8622 21.7986 38.6539 22.3757C38.5926 22.5599 38.562 22.744 38.562 22.9282V30H37ZM40.7856 21.5101V20C41.7167 20.0246 42.4518 20.3499 42.9908 20.9761C43.6034 20.3499 44.3384 20.0246 45.196 20V21.5101C44.5345 21.5101 44.0934 21.7986 43.8729 22.3757C43.8116 22.5476 43.781 22.7317 43.781 22.9282V30H42.219V22.9282C42.219 22.302 41.9556 21.8723 41.4288 21.639C41.2328 21.5531 41.0184 21.5101 40.7856 21.5101ZM46.023 21.5101V20C47.1868 20 48.0505 20.4788 48.6141 21.4365C48.8714 21.8785 49 22.3082 49 22.7256V30H47.438V22.9282C47.438 22.2529 47.1562 21.8109 46.5927 21.6022C46.4211 21.5408 46.2312 21.5101 46.023 21.5101Z" fill="currentColor" />
                                            <path d="M30 28.0357C30 27.1786 30.381 26.5714 31.1429 26.2143C31.4286 26.0714 31.7143 26 32 26C32.8333 26 33.4405 26.3929 33.8214 27.1786C33.9405 27.4643 34 27.75 34 28.0357C34 28.8452 33.631 29.4286 32.8929 29.7857C32.5833 29.9286 32.2857 30 32 30C31.1667 30 30.5714 29.631 30.2143 28.8929C30.0714 28.6071 30 28.3214 30 28.0357Z" fill="currentColor" />
                                            <path d="M0 30V8.57143H0.397059L3.83824 16.7143V30H0ZM0 2.35714V0H3.13235L13.2794 23.8714L20.5147 7.97143H20.9559V16.2857L14.7353 30H11.8235L0 2.35714ZM23.1618 30V0H27V30H23.1618Z" fill="currentColor" />
                                        </svg>
                                    </Link>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation Links removed per user request */}
            </div>

            {/* Center: Dynamic Nav Tree & Progress */}
            <div className={`flex flex-col items-center gap-1 ${isPreloading ? "pointer-events-none" : "pointer-events-auto"} relative`}>
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
                                        className={`absolute right-full top-1/2 -translate-y-1/2 flex items-center ${isPreloading ? "pointer-events-none" : "pointer-events-auto"} pr-2`}
                                        variants={{
                                            initial: { x: 10, opacity: 0 },
                                            animate: { x: 0, opacity: 1 }
                                        }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                        <Link
                                            href="#contact"
                                            className="text-[14px] font-bold tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity"
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
                                                className={`text-[14px] font-bold tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity absolute right-[12px] whitespace-nowrap z-20 ${isPreloading ? "pointer-events-none" : "pointer-events-auto"}`}
                                                style={{ color: textColor, fontFamily: 'var(--font-post-no-bills)' }}
                                            >
                                                {node1_Left.label}
                                            </Link>

                                            {/* Center Dot */}
                                            <div className="w-full h-full rounded-full" style={{ backgroundColor: textColor }} />

                                            {/* Right Link Branch */}
                                            <div className={`absolute left-[14px] flex items-center ${isPreloading ? "pointer-events-none" : "pointer-events-auto"} z-20`}>
                                                <div className="w-[12px] h-[1px] opacity-30" style={{ backgroundColor: textColor }} />
                                                <div className="w-[8px]" />
                                                <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: textColor }} />
                                                <div className="w-[8px]" />
                                                <Link
                                                    href={node1_Right.href}
                                                    className="text-[14px] font-bold tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity whitespace-nowrap"

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
                                                className={`text-[14px] font-bold tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity absolute left-[12px] whitespace-nowrap z-20 ${isPreloading ? "pointer-events-none" : "pointer-events-auto"}`}
                                                style={{ color: textColor, fontFamily: 'var(--font-post-no-bills)' }}
                                            >
                                                Playground
                                            </Link>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Main Link (Home Button) */}
                        <Link
                            href="/"
                            onClick={(e) => {
                                if (pathname === "/") {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }
                            }}
                            className="cursor-pointer transition-opacity group-hover/tree:opacity-60 outline-none select-none relative z-0 flex items-center"
                            style={{ color: textColor }}
                        >
                            {isWireframe ? (
                                <span className="preloader-active" style={{ fontFamily: 'var(--font-post-no-bills)', fontWeight: 400, fontSize: 18, color: textColor, letterSpacing: '0.1em' }}>
                                    NAVBAR
                                </span>
                            ) : isAbout || isProjects ? (
                                <span style={{ fontFamily: 'var(--font-post-no-bills)', fontWeight: 600, fontSize: 22, color: textColor }}>
                                    {isAbout ? "About" : "Projects"}
                                </span>
                            ) : (
                                <svg width="48.45" height="15.25" viewBox="0 0 49 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="preloader-active" style={{ color: textColor }}>
                                    <path d="M0 15.1465V0.107422H1.86914V6.66016H3.80273V8.48633H1.86914V15.1465H0ZM4.87695 8.48633V6.66016H6.78906V0.107422H8.67969V15.1465H6.78906V8.48633H4.87695ZM11.697 10.957V3.88867C11.697 3.12956 12.0192 2.35612 12.6637 1.56836C13.5231 0.537109 14.6117 0.0143229 15.9294 0V1.86914C15.0557 1.86914 14.3753 2.31315 13.8884 3.20117C13.6878 3.58789 13.5876 3.93164 13.5876 4.23242V10.957C13.5876 11.8594 14.0316 12.5612 14.9196 13.0625C15.292 13.2773 15.6214 13.3848 15.9079 13.3848V15.2539C15.0915 15.2539 14.2751 14.9603 13.4587 14.373C12.2985 13.5137 11.7113 12.375 11.697 10.957ZM17.0895 15.2539V13.3848C17.5908 13.3848 18.0993 13.1628 18.6149 12.7188C19.1592 12.2318 19.4385 11.6445 19.4528 10.957V4.23242C19.4528 3.67383 19.2236 3.13672 18.7653 2.62109C18.2927 2.13411 17.7341 1.88346 17.0895 1.86914V0C18.5361 0 19.6963 0.623047 20.57 1.86914C21.0713 2.58529 21.322 3.25846 21.322 3.88867V10.957C21.322 12.5469 20.613 13.7643 19.195 14.6094C18.4502 15.0391 17.7484 15.2539 17.0895 15.2539ZM24.3822 15.1465V4.4043H24.5755L26.2513 8.48633V15.1465H24.3822ZM24.3822 1.28906V0.107422H25.9076L30.849 12.0742L34.3724 4.10352H34.5873V8.27148L31.558 15.1465H30.14L24.3822 1.28906ZM35.6615 15.1465V0.107422H37.5306V15.1465H35.6615ZM40.6338 15.1465V0.107422H48.4541V1.95508H42.503V6.72461H46.4346V8.59375H42.503V13.2988H48.4541V15.1465H40.6338Z" fill="currentColor" />
                                </svg>
                            )}
                        </Link>
                    </div>

                    {/* Scroll Progress Bar / Wireframe Placeholder */}
                    {isWireframe ? (
                        <div className="w-[100px] md:w-[200px] h-[32px] border flex items-center justify-center opacity-40 px-3" style={{ borderColor: textColor }}>
                             <span style={{ fontFamily: 'var(--font-post-no-bills)', fontWeight: 600, fontSize: 12, color: textColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Scrollbar
                            </span>
                        </div>
                    ) : (
                        <div className="w-[100px] md:w-[200px] h-[4px] relative rounded-full overflow-hidden">
                            {/* Track Layer */}
                            <div className={`absolute inset-0 rounded-full ${isPreloading ? "bg-black/10" : "bg-black"}`} />
                            {/* Progress Layer */}
                            <div
                                className={`h-full ${isPreloading ? "bg-[#B0B0B0]" : "bg-[#0066FF]"} relative z-10 w-[var(--scroll-w)] rounded-full`}
                                style={{ borderRadius: "999px" }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Burger Menu */}
            <div className={`${isPreloading ? "pointer-events-none" : "pointer-events-auto"} mr-4 md:mr-32 flex items-center`}>
                <div className="cursor-pointer preloader-active" style={{ color: textColor }}>
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
    const isAbout = pathname === "/about";
    const isProjectDetail = pathname.startsWith("/projects/") && pathname !== "/projects";
    const isHome = pathname === "/";
    
    // Check if preloader is active
    const [isPreloading, setIsPreloading] = useState(isHome);
    // Handle Navbar wireframe state
    const [isWireframe, setIsWireframe] = useState(isHome);
    // Handle Logo wireframe state (separate from navbar)
    const [isLogoWireframe, setIsLogoWireframe] = useState(isHome);

    useEffect(() => {
        const check = () => {
            if (typeof document === 'undefined') return;
            setIsPreloading(document.documentElement.getAttribute('data-preloading') === 'true');
            setIsWireframe(document.documentElement.getAttribute('data-navbar-wireframe') === 'true');
            setIsLogoWireframe(document.documentElement.getAttribute('data-logo-wireframe') === 'true');
        };
        check();
        const observer = new MutationObserver(check);
        observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['data-preloading', 'data-navbar-wireframe', 'data-logo-wireframe'] 
        });
        return () => observer.disconnect();
    }, []);

    const isDarkPage = isAbout || isProjectDetail;

    const [clipPath, setClipPath] = useState(isDarkPage ? "inset(0px 0px 0% 0px)" : "inset(0px 0px 100% 0px)");
    const [baseMask, setBaseMask] = useState(isDarkPage ? "linear-gradient(to bottom, transparent 0px, transparent 600px)" : "none");

    // Sync state when preloading changes to avoid layout flicker
    useEffect(() => {
        setClipPath(isDarkPage ? "inset(0px 0px 0% 0px)" : "inset(0px 0px 100% 0px)");
        setBaseMask(isDarkPage ? "linear-gradient(to bottom, transparent 0px, transparent 600px)" : "none");
    }, [isDarkPage]);

    const [isHovered, setIsHovered] = useState(false);
    const [isLogoHovered, setIsLogoHovered] = useState(false);
    const navHeight = isHovered ? 600 : 120;
    const containerRef = useRef<HTMLDivElement>(null);
    const [isTransitioning, setIsTransitioning] = useState(true);

    useEffect(() => {
        const update = () => {
            const scrollTop = window.scrollY;
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight - winHeight;

            // 1. Sync scroll progress
            const progress = docHeight > 0 ? scrollTop / docHeight : 0;
            const clampedProgress = Math.min(Math.max(progress, 0), 1);
            setScrollProgress(clampedProgress);

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
                    const style = window.getComputedStyle(section);
                    if (parseFloat(style.opacity) < 0.1) continue;

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
            cancelAnimationFrame(rafId);
        };
    }, [pathname]);

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
        <nav ref={containerRef}>
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
                        isWireframe={isWireframe}
                        isLogoWireframe={isLogoWireframe}
                        isPreloading={isPreloading}
                    />
                </div>

                {/* Layer 2: Overlay (Dark Text), Masked to Section */}
                <div
                    className="absolute inset-0 overflow-hidden text-black"
                    style={{
                        clipPath: clipPath,
                        // If the clipPath is 100% hidden, completely disable pointer events so it doesn't block the visible layer
                        pointerEvents: "none"
                    }}
                >
                    <NavbarInner
                        textColor={isWireframe ? "#D9D9D9" : "#000000"}
                        isHovered={isHovered}
                        setIsHovered={setIsHovered}
                        isLogoHovered={isLogoHovered}
                        setIsLogoHovered={setIsLogoHovered}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        lockedPathname={lockedPathname}
                        isWireframe={isWireframe}
                        isLogoWireframe={isLogoWireframe}
                        isPreloading={isPreloading}
                    />
                </div>
            </div>
        </nav>
    );
}
