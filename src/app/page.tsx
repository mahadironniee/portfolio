"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import BracketButton from "@/components/ui/bracket-button";
import ServicesSection from "@/components/services-section";
import ContactSection from "@/components/contact-section";
import CTASection from "@/components/cta-section";
import Footer from "@/components/layout/footer";
import AnimatedSideProjects from "@/components/ui/animated-side-projects";
import BlackHoleSideProjects, { PROJECTS } from "@/components/ui/blackhole-side-projects";
import SecondSection from "@/components/second-section";
import WorksSection from "@/components/works-section";

const TypewriterText = ({
  title,
  text,
  isActive,
  isPaused
}: {
  title: string;
  text: string;
  isActive: boolean;
  isPaused?: boolean;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    // Only reset displayed text if the actual content changes
    if (text && text !== currentText) {
      setDisplayedText("");
      setCurrentText(text);
    }
  }, [text, currentText]);

  useEffect(() => {
    if (!isActive || !text || displayedText === text) return;

    let textI = displayedText.length;
    let textInterval: NodeJS.Timeout;

    const startDelay = setTimeout(() => {
      textInterval = setInterval(() => {
        setDisplayedText(text.slice(0, textI + 1));
        textI++;
        if (textI >= text.length) clearInterval(textInterval);
      }, 15);
    }, textI === 0 ? 600 : 0); // Halved delay (600ms) for faster response

    return () => {
      clearTimeout(startDelay);
      if (textInterval) clearInterval(textInterval);
    };
  }, [text, isActive, displayedText.length]);

  return (
    <div className="flex flex-col mb-5 mt-15 text-left pl-2 md:pl-5 pr-0 translate-x-[25px] md:translate-x-[75px] min-w-[300px] w-full max-w-[648px]">
      <div className="flex items-center mb-2 h-[29px]">
        {/* Static Hash Icon */}
        <svg
          width="16"
          height="29"
          viewBox="0 0 16 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="inline-block mr-3 shrink-0"
        >
          <rect x="4.9375" width="3" height="28" rx="1" transform="rotate(7.90712 4.9375 0)" fill="#B0B8F2" />
          <rect x="11.25" y="5" width="3" height="18.5438" rx="0.5" transform="rotate(8.86843 11.25 5)" fill="#B0B8F2" />
          <rect y="11" width="16" height="3" rx="1" fill="#B0B8F2" />
          <rect y="16" width="16" height="3" rx="1" fill="#B0B8F2" />
        </svg>

        {/* Title Roll Up Animation */}
        <div className="overflow-hidden flex items-center h-full">
          <AnimatePresence mode="wait">
            {isActive && title ? (
              <motion.h3
                key={title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="text-white font-bold tracking-wider text-[14px] uppercase mt-1 leading-none"
              >
                {title}
              </motion.h3>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Description Typing */}
      <div className="min-h-[60px] pl-[28px]">
        <style>{`
          @keyframes blink-fast {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .animate-blink-fast {
            animation: blink-fast 0.8s step-end infinite;
          }
        `}</style>
        <AnimatePresence>
          {isActive && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[#CAD9FB] opacity-85 font-medium text-[17px] leading-[150%] tracking-[0.04em]"
            >
              {displayedText}
              <span className="inline-block w-[6px] h-[12px] bg-[#CAD9FB] ml-[2px] mb-[-1px] animate-blink-fast" />
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function Home() {
  const [activeProjectIdx, setActiveProjectIdx] = useState(-1);
  const [isProjectHovered, setIsProjectHovered] = useState(false);
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
  }, [pupilX, pupilY, pupilScale, socketX, socketY, socketScaleX, socketScaleY]);

  return (
    <>
      <div className="relative">
        {/* Hero Section - Sticky reveal effect */}
        <motion.main
          id="hero"
          className="sticky top-0 w-full h-[100dvh] bg-[#0004D9] overflow-hidden flex flex-col items-center z-0 pt-[147px]"
        >

          {/* Top Left Frame Line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute top-[44px] md:top-[59px] left-[40px] z-20 pointer-events-none"
          >
            <Image src="/svgs/top-left-line.svg" alt="Top Left Frame" width={72} height={180} />
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
            className="absolute left-[-103px] bottom-[-180px] w-[1821px] h-[981px] pointer-events-none z-0"
          >
            <Image
              src="/svgs/hero-heading.svg?v=6"
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
                // Repositioned to the 'i' dot in new Hero Heading.3.svg (dot center: 656, 437)
                left: 633,
                top: 415,
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

          {/* Main Content Container */}
          <div className="relative w-full max-w-screen-2xl flex flex-col items-start px-[5vw] md:px-[8vw]">

            {/* Animated Side Projects Circular Carousel - Hidden as per request */}
            {/* <AnimatedSideProjects /> */}

          </div>

          {/* Description and Action Button - Positioned above the 'Designer' text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="absolute z-30 flex flex-col items-end gap-2"
            style={{ left: "19%", top: "calc(40% - 132px)", width: "648px" }}
          >
            {/* Text container stays fixed height so it doesn't push the button while typing */}
            <div className="w-full h-[220px]">
              <TypewriterText
                title={activeProjectIdx !== -1 ? PROJECTS[activeProjectIdx].alt : ""}
                text={activeProjectIdx !== -1 ? PROJECTS[activeProjectIdx].desc : ""}
                isActive={activeProjectIdx !== -1}
                isPaused={isProjectHovered}
              />
            </div>

            <BracketButton href="/contact" color="white">
              Get a quote
            </BracketButton>
          </motion.div>

          {/* Black Hole Side Projects Component */}
          <BlackHoleSideProjects
            onActiveChange={setActiveProjectIdx}
            onHoverChange={setIsProjectHovered}
          />

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

        {/* Removed spacer to allow for natural scrolling of the hero */}

        {/* Scrollable Content Sections - Background removed to allow sticky hero reveal through masks */}
        <div className="relative z-10 light-bg-nav-trigger">
          <SecondSection />
          <WorksSection />
          <ServicesSection />
          {/* <CTASection /> */}
          <ContactSection />
          <Footer />
        </div>
      </div>
    </>
  );
}
