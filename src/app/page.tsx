"use client";

import { motion } from "framer-motion";
import DesignLogo from "@/components/ui/design-logo";
import StarElement from "@/components/ui/star-element";
import ClaritySticker from "@/components/ui/clarity-sticker";
import LessIsMoreSection from "@/components/less-is-more-section";
import ProjectsSection from "@/components/projects-section";
import ServicesSection from "@/components/services-section";
import ContactSection from "@/components/contact-section";
import CTASection from "@/components/cta-section";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <div className="relative">
        {/* Sticky Hero Section */}
        <motion.main
          id="hero"
          className="relative h-screen w-full max-w-[100vw] bg-[#0004D9] overflow-hidden flex flex-col items-center justify-center p-4 z-0"
        >
          {/* Top Left Corner Accent */}
          <motion.div
            initial={{ height: 0, width: 0, opacity: 0 }}
            animate={{ height: 72, width: 91, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="absolute top-[58px] left-8 border-t-2 border-l-2 border-white hidden md:block"
          />

          {/* Main Content Container */}
          <div
            className="relative w-full flex items-center px-6 md:pl-[6vw] md:pr-[14vw]"
          >
            {/* Large Design Text & Decor Elements Wrapper */}
            <div className="relative z-10 w-full">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 1,
                  ease: [0.215, 0.61, 0.355, 1],
                  delay: 0
                }}
              >
                <DesignLogo className="w-full h-auto text-white scale-85 origin-center" />
              </motion.div>

              {/* Floating Star */}
              <motion.div
                className="absolute top-[-5%] right-[2%] w-[20%] md:w-[20%] z-20 pointer-events-none mix-blend-multiply"
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                  opacity: 1,
                  y: [0, -15, 0],
                  rotateZ: [0, 5, 0]
                }}
                transition={{
                  scale: { duration: 0.8, ease: "backOut", delay: 0.3 },
                  rotate: { duration: 0.8, ease: "backOut", delay: 0.3 },
                  opacity: { duration: 0.5, delay: 0.3 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotateZ: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <StarElement />
              </motion.div>

              {/* 'with Clarity' Sticker - Mobile Safe Positioning */}
              <motion.div
                className="absolute bottom-[-25%] md:bottom-[3%] right-[8%] md:right-[-5%] z-30 w-full max-w-[140px] md:max-w-[350px]"
                initial={{ x: 20, opacity: 0, rotate: 5 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  rotate: 0,
                  y: [0, 10, 0]
                }}
                transition={{
                  x: { duration: 0.8, ease: "easeOut", delay: 0.5 },
                  opacity: { duration: 0.5, delay: 0.5 },
                  rotate: { duration: 0.8, ease: "easeOut", delay: 0.5 },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }
                }}
              >
                <ClaritySticker className="w-full h-auto" />
              </motion.div>
            </div>
          </div>

          <motion.div
            className="absolute bottom-16 md:bottom-20 left-8 md:left-32 max-w-xl text-[#CAD9FB] text-[14px] md:text-[18px]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <p>
              Design decisions are driven by clarity, structure, and intent. Every design begins with
              understanding the problem, not decorating the solution. The goal is to remove noise,
              define hierarchy, and let purpose guide form.
            </p>
          </motion.div>

          <motion.div
            className="absolute bottom-8 right-8 flex flex-col items-end gap-2 hidden md:flex"
            initial={{ height: 0, width: 0, opacity: 0 }}
            animate={{ height: 72, width: 124, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
          >
            <div className="w-full h-full border-b-2 border-r-2 border-white mb-2" />
          </motion.div>
        </motion.main>

        {/* Following Sections Scroll Over the Hero */}
        <div className="relative z-10 bg-[#F5F5FA]">
          <LessIsMoreSection />
          <ProjectsSection />
          <ServicesSection />
          <CTASection />
          <ContactSection />
          <Footer />
        </div>
      </div>
    </>
  );
}
