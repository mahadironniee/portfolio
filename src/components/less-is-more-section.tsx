"use client";

import { motion } from "framer-motion";
import BracketButton from "@/components/ui/bracket-button";

export default function LessIsMoreSection() {
    return (
        <section className="relative w-full min-h-[50vh] bg-[#F5F5FA] flex flex-col items-center justify-center py-32 px-8 overflow-hidden light-bg-nav-trigger">

            <div className="w-full max-w-[1849px] relative px-4 md:px-0">
                {/* Main Prose Block - Figma Exact Specs: 48px Inter Regular, 121% Line Height */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                    className="text-[#000121] font-normal"
                    style={{
                        fontFamily: 'var(--font-inter), sans-serif',
                        fontSize: 'clamp(30px, 2.5vw, 48px)',
                        lineHeight: '1.21',
                        letterSpacing: '0'
                    }}
                >
                    <p>
                        I&apos;m a designer and developer building interactive web experiences with studio-level polish.
                        I bring design, code, and motion into one workflow—so the details stay consistent from the
                        first layout to the final interaction. The approach is simple, but never plain: clean structure,
                        intentional contrast, and fluid animation used with restraint.
                    </p>
                </motion.div>

                {/* About Link - Right Aligned as per Design */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex justify-end mt-12"
                >
                    <BracketButton href="/about" color="black">
                        More about me
                    </BracketButton>
                </motion.div>
            </div>

        </section>
    );
}
