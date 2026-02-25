"use client";

import { motion } from "framer-motion";
import BracketButton from "./ui/bracket-button";

export default function CTASection() {
    return (
        <section
            id="cta"
            className="relative w-full bg-[#0004D9] flex flex-col overflow-hidden py-80 md:py-0"
            style={{
                minHeight: '100vh',
                height: 'auto',
                md: { height: '120vh' }
            } as any}
        >
            {/* Background Wrapper for Absolute Elements on Desktop */}
            <div className="md:absolute md:inset-0 w-full h-full flex flex-col px-6 md:px-0">

                {/* Top Left Corner Accent */}
                <div className="absolute top-[58px] left-8 w-[91px] h-[72px] border-t-2 border-l-2 border-white z-20 hidden md:block" />

                {/* MAIN HEADLINE - Standardized Sizing (85% of Contact CTA optical size) */}
                <div className="relative md:absolute z-10 w-[85%] md:w-full md:max-w-[1190px] md:left-[154px] md:top-[155px] mt-12 md:mt-0">
                    <img
                        src="/svgs/headlines/QuestionCTA.svg"
                        alt="Question CTA Header"
                        className="w-full h-auto object-contain select-none pointer-events-none"
                        style={{ filter: 'brightness(0) invert(1)' }}
                    />
                </div>

                {/* SUBTEXT - Fluid on Mobile, Absolute on Desktop */}
                <div className="relative md:absolute z-10 w-full md:w-[554px] md:left-[245px] md:top-[649px] mt-8 md:mt-0 text-center md:text-left">
                    <div className="text-[#CAD9FB] text-sm md:text-[18px]">
                        <p>
                            I've worked closely with development teams throughout my projects, which allows me to design with real implementation in mind, especially for responsiveness and pixel perfect development.
                        </p>
                    </div>
                </div>

                {/* CONTACT GROUP - Fluid on Mobile, Absolute on Desktop */}
                <div className="relative md:absolute z-10 flex flex-col md:flex-row items-center md:items-center gap-8 md:gap-16 md:left-[245px] md:top-[810px] mt-12 md:mt-0">
                    {/* Avatar Stack */}
                    <div className="flex -space-x-5">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="w-[50px] md:w-[60px] h-[50px] md:h-[60px] rounded-full border-2 border-[#0004D9] overflow-hidden bg-gray-950"
                            >
                                <img
                                    src={`/images/avatars/cta_${Math.min(i, 3)}.png`}
                                    alt={`Partner ${i}`}
                                    className="w-full h-full object-cover grayscale contrast-125"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Get a Quote Button */}
                    <BracketButton color="white">
                        Get a quote
                    </BracketButton>
                </div>

                {/* Bottom Right Corner Accent */}
                <div className="absolute bottom-8 right-8 w-[124px] h-[72px] border-b-2 border-r-2 border-white z-20 hidden md:block" />
            </div>
        </section>
    );
}
