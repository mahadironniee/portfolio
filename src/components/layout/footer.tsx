"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-black py-20 px-8 flex flex-col items-center justify-center border-t border-white/10">
            <div className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-12">

                {/* Left: Brand / Copyright */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-white text-2xl font-bold tracking-tighter uppercase italic">
                        Mahadly.
                    </h2>
                    <p className="text-white/40 text-sm max-w-[300px]">
                        Design with Clarity & Intent. Building experiences that bridge function and aesthetics.
                    </p>
                    <span className="text-white/20 text-xs mt-8">
                        © {new Date().getFullYear()} Mahadly. All rights reserved.
                    </span>
                </div>

                {/* Right: Navigation Links */}
                <nav className="flex flex-wrap gap-x-12 gap-y-6">
                    <div className="flex flex-col gap-4">
                        <span className="text-white/20 text-[10px] uppercase tracking-widest font-bold">Menu</span>
                        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">Home</Link>
                        <Link href="/about" className="text-white/60 hover:text-white transition-colors text-sm">About</Link>
                        <Link href="/projects" className="text-white/60 hover:text-white transition-colors text-sm">Projects</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span className="text-white/20 text-[10px] uppercase tracking-widest font-bold">Social</span>
                        <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Twitter</a>
                        <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">LinkedIn</a>
                        <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Instagram</a>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span className="text-white/20 text-[10px] uppercase tracking-widest font-bold">Legal</span>
                        <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Privacy Policy</a>
                        <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Terms of Service</a>
                    </div>
                </nav>
            </div>

            {/* Bottom Graphic Accent */}
            <div className="mt-20 w-full max-w-7xl flex justify-center opacity-10 overflow-hidden px-4">
                <span className="text-[12px] md:text-[12vw] font-black tracking-tighter uppercase leading-none select-none text-white whitespace-normal text-center">
                    MAHADLY PORTFOLIO — 2026
                </span>
            </div>
        </footer>
    );
}
