"use client";

import Link from "next/link";
import { Instagram, Youtube, Linkedin, Twitter } from "lucide-react";
import BracketButton from "@/components/ui/bracket-button";

export default function AboutPage() {
    return (
        /* id="less-is-more" triggers dark navbar theme */
        <main className="relative min-h-screen w-full bg-white flex flex-col items-center">
            {/* id="less-is-more" triggers dark navbar theme only for the white content areas */}
            <div className="relative w-full flex flex-col items-center light-bg-nav-trigger">

                {/* 1920px Design Canvas - Centered Coordinate Hub */}
                <div className="relative w-full max-w-[1920px] h-[1080px] bg-white overflow-visible shrink-0">

                    {/* Top Left Corner Accent */}
                    <div className="absolute top-[58px] left-8 w-[91px] h-[72px] border-t-2 border-l-2 border-black z-10" />

                    {/* 
                   THE HEADLINE SVG
                   Standardized optical sizing: 80% multiplier of max 1400px container
                */}
                    <div
                        className="absolute z-10 select-none pointer-events-none"
                        style={{
                            left: '200px',
                            top: '200px'
                        }}
                    >
                        <img
                            src="/svgs/headlines/MohammodMahady.svg"
                            alt="Mohammod Mahady Headline"
                            className="w-[1120px] h-auto block"
                        />
                    </div>

                    {/* PROFILE IMAGE CIRCLE (X: 878, Y: 649) */}
                    <div
                        className="absolute z-10"
                        style={{
                            left: '878px',
                            top: '649px',
                            width: '155px',
                            height: '155px'
                        }}
                    >
                        <div className="w-full h-full rounded-full overflow-hidden grayscale ring-1 ring-black/5 shadow-2xl">
                            <img src="/images/profile.png" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* SUBTEXT (X: 1101, Y: 666, W: 588) */}
                    <div
                        className="absolute z-10 text-left"
                        style={{
                            left: '1101px',
                            top: '666px',
                            width: '588px'
                        }}
                    >
                        <p className="text-black/85 text-[18px]">
                            Lorem ipsum dolor sit amet consectetur. At ultricies nullam fermentum nulla. Tellus nisl purus tincidunt sed nulla sed felis adipiscing. Etiam consequat pulvinar elit mauris. Pulvinar et netus neque adipiscing nisl orci pharetra.
                        </p>
                    </div>

                    {/* CONTACT BUTTON (X: 244, Y: 745) */}
                    <div
                        className="absolute z-10"
                        style={{
                            left: '244px',
                            top: '745px',
                            width: '219px',
                            height: '53px'
                        }}
                    >
                        <BracketButton className="w-full h-full" color="black">
                            Contact
                        </BracketButton>
                    </div>

                    {/* Bottom Right Corner Accent */}
                    <div className="absolute bottom-8 right-8 w-[124px] h-[72px] border-b-2 border-r-2 border-black z-10" />
                </div>
            </div>

            {/* BLACK FOOTER SECTION */}
            <footer className="relative w-full bg-black py-32 px-16 flex flex-col items-center justify-between min-h-[500px]">

                <div className="w-full max-w-[1920px] flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-[58px] h-[58px] rounded-full overflow-hidden grayscale translate-y-6">
                                <img src="/images/profile.png" alt="Thumb" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[180px] font-black tracking-tighter text-white leading-none">
                                .Mahady.
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 text-white/50 text-xs font-bold tracking-[0.3em] uppercase text-right">
                        <Link href="/" className="hover:text-[#D2F925] transition-colors">Projects</Link>
                        <Link href="/about" className="text-white hover:text-[#D2F925] transition-colors">About</Link>
                        <Link href="#contact" className="hover:text-[#D2F925] transition-colors">Contact</Link>
                    </div>
                </div>

                <div className="w-full max-w-[1920px] mt-24 pt-10 border-t border-white/5 flex justify-between items-center text-white/20 text-[9px] tracking-[0.6em] uppercase">
                    <div>© 2026 Mohammod Mahady • Portfolio</div>
                    <div className="flex items-center gap-12 text-white">
                        <span className="opacity-30">Connect</span>
                        <div className="flex gap-6">
                            <Twitter size={18} className="hover:text-[#D2F925] cursor-pointer transition-colors opacity-80" />
                            <Linkedin size={18} className="hover:text-[#D2F925] cursor-pointer transition-colors opacity-80" />
                            <Youtube size={18} className="hover:text-[#D2F925] cursor-pointer transition-colors opacity-80" />
                            <Instagram size={18} className="hover:text-[#D2F925] cursor-pointer transition-colors opacity-80" />
                        </div>
                    </div>
                </div>
            </footer>

        </main>
    );
}
