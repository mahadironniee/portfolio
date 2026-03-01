"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import BracketButton from "@/components/ui/bracket-button";
import LessIsMoreSection from "@/components/less-is-more-section";
import ProjectsSection from "@/components/projects-section";
import ServicesSection from "@/components/services-section";
import ContactSection from "@/components/contact-section";
import CTASection from "@/components/cta-section";
import Footer from "@/components/layout/footer";
import AnimatedSideProjects from "@/components/ui/animated-side-projects";

export default function Home() {
  // Intermediate values for clamped coordinates
  const pupilX = useMotionValue(0);
  const pupilY = useMotionValue(0);
  const eyeRef = React.useRef<HTMLDivElement>(null);

  // Apply spring physics to the clamped values for that "strain/drag" effect
  const springConfig = { damping: 25, stiffness: 150, mass: 0.8 };
  const smoothX = useSpring(pupilX, springConfig);
  const smoothY = useSpring(pupilY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Find the absolute center of the eye dot on screen
      if (!eyeRef.current) return;

      const eyeRect = eyeRef.current.getBoundingClientRect();
      // Calculate the visual center of the socket on screen
      const eyeCenterX = eyeRect.left + (eyeRect.width / 2);
      const eyeCenterY = eyeRect.top + (eyeRect.height / 2);

      // Distance from mouse to the eye center
      const distanceX = e.clientX - eyeCenterX;
      const distanceY = e.clientY - eyeCenterY;

      // Calculate the distance to the screen edges from the eye center dynamically based on direction
      // This ensures that hitting ANY edge of the screen gives precisely -1.0 or 1.0, fixing the skewing
      const rangeX = distanceX < 0 ? eyeCenterX : (window.innerWidth - eyeCenterX);
      const rangeY = distanceY < 0 ? eyeCenterY : (window.innerHeight - eyeCenterY);

      let normX = rangeX === 0 ? 0 : distanceX / rangeX;
      let normY = rangeY === 0 ? 0 : distanceY / rangeY;

      // Define physical displacement bounds.
      // Since the black pupil is 39px (the same size as the white socket), moving it too far
      // looks like it "goes out" of the white circle physically. We tighten this bound down mathematically
      // to 5.0px so it gives a 3D parallax effect without physically escaping the letter boundaries.
      const MAX_PUPIL_RADIUS = 5.0;

      const SENSITIVITY = 10;
      let targetDistX = normX * SENSITIVITY;
      let targetDistY = normY * SENSITIVITY;

      // Apply circular clamp to keep the movement strictly radial and rounded
      const mouseDist = Math.sqrt(targetDistX * targetDistX + targetDistY * targetDistY);

      if (mouseDist > MAX_PUPIL_RADIUS) {
        const ratio = MAX_PUPIL_RADIUS / mouseDist;
        targetDistX = targetDistX * ratio;
        targetDistY = targetDistY * ratio;
      }

      pupilX.set(targetDistX);
      pupilY.set(targetDistY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [pupilX, pupilY]);

  return (
    <>
      <div className="relative">
        {/* Hero Section */}
        <motion.main
          id="hero"
          className="fixed inset-0 w-full h-[100dvh] bg-[#0004D9] overflow-hidden flex flex-col items-center z-0 pt-[147px]"
        >
          {/* Top Left Frame Line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute top-[44px] md:top-[59px] left-[40px] z-20 pointer-events-none"
          >
            <Image src="/svgs/top-left-line.svg" alt="Top Left Frame" width={72} height={93} />
          </motion.div>

          {/* Bottom Right Frame Line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute bottom-[40px] right-[40px] z-20 pointer-events-none"
          >
            <Image src="/svgs/right-below-line.svg" alt="Bottom Right Frame" width={122} height={77} />
          </motion.div>

          {/* Fixed-size Typography - Positioned and cropped according to the 'frame' reference */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute left-[-203px] bottom-[-180px] w-[1821px] h-[981px] pointer-events-none z-0"
          >
            <Image
              src="/svgs/hero-heading.svg?v=2"
              alt="Designer Creative Headline"
              fill
              className="object-contain"
              priority
            />

            {/* Static wrapper for exact coordinate reference without transform feedback loops */}
            <div
              ref={eyeRef}
              className="absolute pointer-events-none"
              style={{
                width: 39,
                height: 39,
                left: 988.5 - 19.5, // 969px
                top: 264.545 - 19.5, // 245.045px
              }}
            >
              {/* Interactive Eye Pupil for the 'i' in 'Designer' */}
              <motion.div
                className="absolute"
                style={{
                  width: 39,
                  height: 39,
                  left: 0,
                  top: 0,
                  x: smoothX,
                  y: smoothY,
                }}
              >
                {/* Inner wrapper handles the blinking scale */}
                <motion.div
                  className="w-full h-full bg-black rounded-full"
                  animate={{
                    scaleY: [1, 1, 0.1, 1, 1],
                    scaleX: [1, 1, 1.1, 1, 1], // slight widening on blink for realism
                  }}
                  transition={{
                    duration: 4,               // full cycle
                    ease: "easeInOut",
                    times: [0, 0.95, 0.975, 1, 1], // spend 95% of time fully open
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  style={{ originY: 0.5, originX: 0.5 }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Main Heading Typography Container */}
          <div className="relative w-full max-w-screen-2xl flex flex-col items-start px-[5vw] md:px-[8vw]">
            {/* Description and Action Button - Positioned in the 'sky' area above the text for contrast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              className="absolute top-[8%] md:top-[10%] lg:top-[12%] right-[5%] md:right-[15%] lg:right-[20%] z-30 flex flex-col items-end"
            >
              <div className="flex flex-col items-end max-w-[650px]">
                <p className="text-[#CAD9FB] opacity-85 font-medium text-[15px] md:text-[18px] leading-[160%] tracking-[0.06em] mb-5 mt-15 text-left pl-2 md:pl-5 pr-0 translate-x-[25px] md:translate-x-[75px]">
                  <svg
                    width="16"
                    height="29"
                    viewBox="0 0 16 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block mr-3 align-middle mt-[-4px]"
                  >
                    <rect
                      x="4.9375"
                      width="3"
                      height="28"
                      rx="1"
                      transform="rotate(7.90712 4.9375 0)"
                      fill="#B0B8F2"
                    />
                    <rect
                      x="11.25"
                      y="5"
                      width="3"
                      height="18.5438"
                      rx="0.5"
                      transform="rotate(8.86843 11.25 5)"
                      fill="#B0B8F2"
                    />
                    <rect y="11" width="16" height="3" rx="1" fill="#B0B8F2" />
                    <rect y="16" width="16" height="3" rx="1" fill="#B0B8F2" />
                  </svg>
                  Design decisions are driven by clarity, structure, and intent. Every design begins
                  with understanding the problem, not decorating the solution. The goal is to remove
                  noise, define hierarchy, and let purpose guide form.
                </p>
              </div>

              <motion.a
                href="/contact"
                className="relative inline-flex items-center justify-center w-[151px] h-[49px] text-[12px] uppercase tracking-[0.2em] font-medium text-white group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Custom SVG Background from ButtonStyle.svg */}
                <svg
                  width="151"
                  height="49"
                  viewBox="0 0 151 49"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 w-full h-full"
                >
                  <path d="M1 38V1H111" stroke="white" strokeOpacity="0.5" />
                  <path d="M150 11V48H41" stroke="white" strokeOpacity="0.5" />
                  <path d="M110 1H130H150V11" stroke="white" strokeWidth="2" />
                  <path d="M41 48H0.999999V38" stroke="white" strokeWidth="2" />
                </svg>
                <span className="relative z-10">Get a quote</span>
              </motion.a>
            </motion.div>
          </div>


          {/* Animated Side Projects Circular Carousel */}
          <AnimatedSideProjects />


          {/* Bottom Secondary Typography / Navigation Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-8 md:bottom-6 w-full max-w-[1400px] h-[32px] px-3 translate-x-[60px]"
          >
            <div className="relative w-full h-full">
              <Image
                src="/svgs/hero-sub-heading.svg"
                alt="Purpose Meaning Visual Hierarchy Clarity Execution"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        </motion.main>

        {/* Spacer to push content below the fixed hero */}
        <div className="h-[100dvh]" />

        {/* Scrollable Content Sections */}
        <div className="relative z-10 bg-[#F5F5FA] light-bg-nav-trigger">
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
