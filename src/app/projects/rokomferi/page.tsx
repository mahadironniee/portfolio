"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Linkedin, Youtube, Instagram, Mail } from "lucide-react";
import { useEffect } from "react";

export default function RokomferiPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white text-black overflow-x-hidden font-inter">
            {/* id="less-is-more" triggers dark navbar theme only for the white content areas */}
            <div id="less-is-more">
                <main className="relative pt-[190px]">
                    {/* 1. INTRO SECTION */}
                    <div className="flex justify-center mb-[110px]">
                        <div style={{ width: '1496px' }}>
                            <div className="relative" style={{ width: '870px' }}>
                                <img
                                    src="/svgs/headlines/RokomferiHeadline.svg"
                                    alt="Rokomferi" className="w-full h-auto object-contain"
                                    style={{ filter: 'brightness(0)' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. LARGE HERO IMAGE BLOCK */}
                    <div className="flex justify-center mb-[200px]">
                        <div className="relative" style={{ width: '1556px', height: '459px' }}>
                            <div className="absolute inset-0 bg-[#1A1A1A] shadow-2xl flex items-center justify-center overflow-hidden">
                                <span className="text-white/5 text-[20vw] font-bold uppercase select-none tracking-tighter">
                                    Rokomferi
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 3. SECTION 1: Text Left / Image Right */}
                    <div className="flex justify-center mb-[80px]">
                        <div className="flex flex-row items-start gap-[35px]">
                            <div style={{ width: '384px', height: '412px' }}>
                                <h3 className="text-[22px] font-black mb-10 leading-tight">Lorem ipsum dolor sit amet consectetur.</h3>
                                <p className="text-[16px] leading-[1.8] text-black/70 font-medium">
                                    I&apos;ve worked closely with development teams throughout my projects, which allows me to design with real implementation in mind, especially for animations and responsiveness. I&apos;ve worked closely with development teams throughout my projects, which allows me to design with real implementation in mind, especially for animations and responsiveness.
                                </p>
                            </div>
                            <div className="bg-[#E5E5E5] border-4 border-white shadow-2xl" style={{ width: '1077px', height: '460px' }} />
                        </div>
                    </div>

                    {/* 4. SECTION 2: Full Width Centered Text */}
                    <div className="flex justify-center mb-[80px]">
                        <div style={{ width: '1496px', height: '180px' }}>
                            <h3 className="text-[22px] font-black mb-10">Lorem ipsum dolor sit amet consectetur.</h3>
                            <p className="text-[16px] leading-[1.8] text-black/70 font-medium">
                                I&apos;ve worked closely with development teams throughout my projects, which allows me to design with real implementation in mind, especially for animations and responsiveness. I&apos;ve worked closely with development teams throughout my projects, which allows me to design with real implementation in mind, especially for animations and responsiveness.
                            </p>
                        </div>
                    </div>

                    {/* 5. SECTION 3: Image Left / Text Right */}
                    <div className="flex justify-center mb-[80px]">
                        <div className="flex flex-row items-start gap-[35px]">
                            <div className="bg-[#E5E5E5] border-4 border-white shadow-2xl" style={{ width: '1077px', height: '460px' }} />
                            <div style={{ width: '384px', height: '412px' }}>
                                <h3 className="text-[22px] font-black mb-10 leading-tight">Lorem ipsum dolor sit amet consectetur.</h3>
                                <p className="text-[16px] leading-[1.8] text-black/70 font-medium">
                                    I&apos;ve worked closely with development teams throughout my projects, which allows me to design with real implementation in mind, especially for animations and responsiveness. I&apos;ve worked closely with development teams throughout my projects, which allows me to design with real implementation in mind, especially for animations and responsiveness.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 6. SECTION 4: Full Width Centered Text */}
                    <div className="flex justify-center mb-[300px]">
                        <div style={{ width: '1496px', height: '180px' }}>
                            <h3 className="text-[22px] font-black mb-10">Lorem ipsum dolor sit amet consectetur.</h3>
                            <p className="text-[16px] leading-[1.8] text-black/70 font-medium">
                                I&apos;ve worked closely with development teams throughout my projects, which allows me to design with real implementation in mind, especially for animations and responsiveness. I&apos;ve worked closely with development teams throughout my projects, which allows me to design with real implementation in mind, especially for animations and responsiveness.
                            </p>
                        </div>
                    </div>
                </main>
            </div>

            {/* 7. CUSTOM FOOTER SECTION - Outside id="less-is-more" */}
            <footer className="bg-black text-white pt-60 pb-20 px-[8%] relative">
                <div className="flex flex-col md:flex-row justify-between items-end gap-20 overflow-hidden">
                    <motion.h2
                        initial={{ y: 100, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-[20vw] font-bold leading-[0.75] tracking-tighter opacity-100"
                    >
                        .Mahady.
                    </motion.h2>

                    <div className="flex flex-col gap-6 text-right mb-8">
                        <Link href="/projects" className="text-[12px] font-bold uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">Projects</Link>
                        <Link href="/about" className="text-[12px] font-bold uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">About</Link>
                        <Link href="/contact" className="text-[12px] font-bold uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">Contact</Link>
                    </div>
                </div>

                <div className="mt-40 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex gap-12 items-center">
                        <a href="#" className="p-2 opacity-30 hover:opacity-100 transition-opacity"><Linkedin size={20} /></a>
                        <a href="#" className="p-2 opacity-30 hover:opacity-100 transition-opacity"><Youtube size={22} /></a>
                        <a href="#" className="p-2 opacity-30 hover:opacity-100 transition-opacity"><Instagram size={20} /></a>
                        <a href="#" className="p-2 opacity-30 hover:opacity-100 transition-opacity"><Mail size={20} /></a>
                    </div>

                    <div className="text-[12px] uppercase tracking-[0.2em] font-bold opacity-30">
                        © 2026 Mahady. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
