"use client";

import { motion } from "framer-motion";
import BracketButton from "./ui/bracket-button";

export default function ContactSection() {
    return (
        <section className="relative w-full bg-white py-32 px-8 md:pl-[154px] md:pr-8 flex flex-col overflow-hidden border-t border-black/5 light-bg-nav-trigger">
            <div className="w-full max-w-[1400px] flex flex-col gap-24 relative">

                {/* SVG Headline: LET'S SHIP YOUR NEXT WEBSITE. with script "Contact" */}
                {/* Standardized Optical Sizing: Baseline (100% multiplier, max-width 1400px) */}
                <div className="w-full select-none pointer-events-none">
                    <img
                        src="/svgs/headlines/Contact CTAh.svg"
                        alt="Contact Headline"
                        className="w-full h-auto object-contain"
                    />
                </div>

                {/* Contact Form */}
                <form className="w-full flex flex-col gap-12" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 w-full">
                        {/* Name Field */}
                        <div className="flex flex-col gap-4 group">
                            <label className="text-black font-mono text-[10px] uppercase tracking-[0.2em] opacity-80 group-focus-within:opacity-100 transition-opacity">
                                Name*
                            </label>
                            <input
                                type="text"
                                placeholder=""
                                required
                                className="w-full bg-transparent border-b border-black/20 focus:border-black outline-none py-3 text-lg md:text-xl font-medium transition-colors"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="flex flex-col gap-4 group">
                            <label className="text-black font-mono text-[10px] uppercase tracking-[0.2em] opacity-80 group-focus-within:opacity-100 transition-opacity">
                                Email*
                            </label>
                            <input
                                type="email"
                                placeholder=""
                                required
                                className="w-full bg-transparent border-b border-black/20 focus:border-black outline-none py-3 text-lg md:text-xl font-medium transition-colors"
                            />
                        </div>
                    </div>

                    {/* Description Field */}
                    <div className="flex flex-col gap-4 group w-full">
                        <label className="text-black font-mono text-[10px] uppercase tracking-[0.2em] opacity-80 group-focus-within:opacity-100 transition-opacity">
                            Description
                        </label>
                        <textarea
                            rows={1}
                            placeholder=""
                            className="w-full bg-transparent border-b border-black/20 focus:border-black outline-none py-3 text-lg md:text-xl font-medium transition-colors resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end mt-8">
                        <BracketButton type="submit" color="black">
                            Send message
                        </BracketButton>
                    </div>
                </form>
            </div>
        </section>
    );
}
