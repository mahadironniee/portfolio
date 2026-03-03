"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import BracketButton from "@/components/ui/bracket-button";
import ProjectsSection from "@/components/projects-section";
import ServicesSection from "@/components/services-section";
import ContactSection from "@/components/contact-section";
import CTASection from "@/components/cta-section";
import Footer from "@/components/layout/footer";
import AnimatedSideProjects from "@/components/ui/animated-side-projects";
import SecondSection from "@/components/second-section";
import WorksSection from "@/components/works-section";

export default function Home() {
  const pupilX = useMotionValue(0);
  const pupilY = useMotionValue(0);
  const pupilScale = useMotionValue(1);
  const socketX = useMotionValue(0);
  const socketY = useMotionValue(0);
  const socketScaleX = useMotionValue(1);
  const socketScaleY = useMotionValue(1);
  const eyeRef = React.useRef<HTMLDivElement>(null);

  // Smooth, independent physics for the pupil (tightened tracking, life-like ease)
  const springConfig = { damping: 20, stiffness: 250, mass: 0.2 };
  const smoothX = useSpring(pupilX, springConfig);
  const smoothY = useSpring(pupilY, springConfig);

  // Dilation physics - responds slightly slower for biological feel
  const scaleSpringConfig = { damping: 25, stiffness: 150, mass: 0.4 };
  const smoothScale = useSpring(pupilScale, scaleSpringConfig);

  // Socket physics - stiffer, subtle and delayed 
  // It represents the firmer mass of the whole eyeball shifting
  const socketSpringConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const smoothSocketX = useSpring(socketX, socketSpringConfig);
  const smoothSocketY = useSpring(socketY, socketSpringConfig);
  const smoothSocketScaleX = useSpring(socketScaleX, socketSpringConfig);
  const smoothSocketScaleY = useSpring(socketScaleY, socketSpringConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;

      const { left, top, width, height } = eyeRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = Math.atan2(deltaY, deltaX);

      // Max allowed travel distance calculation to stay fully inside the white socket area securely
      const MAX_RADIUS = 7.0;

      // Asymptotic curve mapping: the tracking never arbitrarily hits a "wall". 
      // It smoothly approaches the max radius limits the further away the mouse gets.
      const mappedRadius = (distance / (distance + 400)) * MAX_RADIUS;

      // Dilation logic: the further the mouse is, the larger the pupil gets (up to 1.35x size)
      // When the mouse is directly over/very close to the eye, distance drops and scale approaches 1.0.
      const MAX_SCALE = 1.35;
      const mappedScale = 1.0 + (distance / (distance + 800)) * (MAX_SCALE - 1.0);

      pupilX.set(Math.cos(angle) * mappedRadius);
      pupilY.set(Math.sin(angle) * mappedRadius);
      pupilScale.set(mappedScale);

      // --- Socket Movement Logic ---
      // The socket itself moves but much less (e.g. max 3px shift)
      const MAX_SOCKET_SHIFT = 3.0;
      const mappedSocketShift = (distance / (distance + 400)) * MAX_SOCKET_SHIFT;

      // Squish the socket slightly in the direction of movement.
      // E.g. If looking far right, the width squeezes slightly (0.95) and height bulges (1.05)
      // We calculate a generic "squish factor" based on distance
      const MAX_SQUISH = 0.08; // 8% distortion max
      const squishAmount = (distance / (distance + 600)) * MAX_SQUISH;

      // Calculate how much horizontal vs vertical movement is happening
      const absCos = Math.abs(Math.cos(angle));
      const absSin = Math.abs(Math.sin(angle));

      // Apply the squish. If mostly moving horizontally, squeeze width and bulge height.
      // If mostly moving vertically, squeeze height and bulge width.
      // This creates a very organic "muscular tension" effect.
      const scaleXAmount = 1.0 - (squishAmount * absCos) + (squishAmount * absSin * 0.5);
      const scaleYAmount = 1.0 - (squishAmount * absSin) + (squishAmount * absCos * 0.5);

      socketX.set(Math.cos(angle) * mappedSocketShift);
      socketY.set(Math.sin(angle) * mappedSocketShift);
      socketScaleX.set(scaleXAmount);
      socketScaleY.set(scaleYAmount);
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

            {/* Dynamic wrapper for the whole white socket, driven by its own physics */}
            <motion.div
              ref={eyeRef}
              className="absolute pointer-events-none"
              style={{
                width: 39,
                height: 39,
                // Optically nudged slightly right and down to counteract any layout illusion
                left: 970.5,
                top: 246.5,
                x: smoothSocketX,
                y: smoothSocketY,
                scaleX: smoothSocketScaleX,
                scaleY: smoothSocketScaleY,
              }}
            >
              {/* Interactive Eye Pupil for the 'i' in 'Designer' */}
              <motion.div
                className="absolute"
                style={{
                  width: 24, // The pupil is purposely smaller than 39px so it moves INSIDE the white socket
                  height: 24,
                  left: 7.5, // Centers the 24px pupil precisely inside the 39px area ((39-24) / 2 = 7.5)
                  top: 7.5,
                  x: smoothX,
                  y: smoothY,
                  scale: smoothScale,
                }}
              >
                {/* Inner wrapper handles the continuous blinking via CSS */}
                <div
                  className="w-full h-full bg-black rounded-full animate-blink"
                />
              </motion.div>
            </motion.div>
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

              <BracketButton href="/contact" color="white">
                Get a quote
              </BracketButton>
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
          <SecondSection />
          <WorksSection />
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
