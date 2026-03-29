"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AboutHero() {
    return (
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden pt-20 px-4">
            <div className="container mx-auto">
                <div className="flex flex-col items-center text-center">
                    {/* Background "ABOUT" Text - Distorted/Outlined */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 0.1, y: 0 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                    >
                        <span 
                            className="text-[30vw] md:text-[25vw] leading-none text-white font-bold"
                            style={{ 
                                fontFamily: 'var(--font-post-no-bills)',
                                WebkitTextStroke: '2px rgba(255,255,255,0.5)',
                                color: 'transparent'
                            }}
                        >
                            ABOUT
                        </span>
                    </motion.div>

                    {/* Main Title Container */}
                    <div className="relative z-10 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <h1 
                                className="text-6xl md:text-9xl font-bold tracking-tighter"
                                style={{ fontFamily: 'var(--font-post-no-bills)' }}
                            >
                                THE VISIONARY
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="flex flex-col md:flex-row items-center justify-center gap-4 text-[#76CA00] font-mono text-sm tracking-widest uppercase"
                        >
                            <span className="px-4 py-1 border border-[#76CA00]/30 rounded-full bg-[#76CA00]/5 backdrop-blur-sm">
                                DESIGNER By Instinct
                            </span>
                            <span className="hidden md:block opacity-30">—</span>
                            <span className="px-4 py-1 border border-[#76CA00]/30 rounded-full bg-[#76CA00]/5 backdrop-blur-sm">
                                DEVELOPER By Design
                            </span>
                        </motion.div>
                    </div>

                    {/* Decorative Lines */}
                    <div className="absolute left-1/2 bottom-0 w-[1px] h-[100px] bg-gradient-to-b from-transparent to-[#76CA00]/40 -translate-x-1/2" />
                </div>
            </div>
            
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#76CA00]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#76CA00]/5 rounded-full blur-[150px] pointer-events-none" />
        </section>
    );
}
