'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import TypewriterText from '@/components/ui/typewriter-text';
import BracketButton from '@/components/ui/bracket-button';

/* ─── Types ────────────────────────────────────────────────────────────── */
type PreloaderState =
  | 'A' | 'LOGO' | 'NAV' | 'QUOTE'
  | 'PROJECTS_CENTER' | 'PROJECTS_SPLIT'
  | 'B' | 'DONE';

interface Props {
  preloaderState: PreloaderState;
  isQuoteWireframe: boolean;
  isProjectsDimmed: boolean;
}

/* ─── Constants ─────────────────────────────────────────────────────────── */
const WF_FILTER  = 'brightness(0) invert(0.85)';
const SPRING_NAV = { type: 'spring', stiffness: 100, damping: 20 } as const;

// Crosshair target positions as "% from top-left of the preloader container"
const RETICLE: Record<PreloaderState, { x: string; y: string }> = {
  A:               { x: '50%', y: '42%' },
  LOGO:            { x: '22%', y: '9%'  },
  NAV:             { x: '62%', y: '9%'  },
  QUOTE:           { x: '83%', y: '62%' },
  PROJECTS_CENTER: { x: '50%', y: '38%' },
  PROJECTS_SPLIT:  { x: '50%', y: '38%' },
  B:               { x: '50%', y: '50%' },
  DONE:            { x: '50%', y: '50%' },
};

// The 3 fixed card slots shown in the preloader (left / center / right)
// No images — solid grey rectangles like the desktop wireframe version
const PRELOAD_CARDS = [
  { label: 'left',   x: -153, scale: 0.45, opacity: 0.78 },
  { label: 'center', x:    0, scale: 0.75, opacity: 1.00 },
  { label: 'right',  x:  153, scale: 0.45, opacity: 0.78 },
] as const;

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function MobilePreloader({
  preloaderState,
  isQuoteWireframe,
  isProjectsDimmed,
}: Props) {
  const isShatter = preloaderState === 'B';
  const isSplit   = preloaderState === 'PROJECTS_SPLIT';
  const { x: rx, y: ry } = RETICLE[preloaderState];

  return (
    /* Covers the desktop preloader elements that sit below z-[300] in
       the same stacking context (the outer fixed preloader div). */
    <motion.div
      className="absolute inset-0 z-[350] bg-white overflow-hidden flex flex-col"
      animate={{ opacity: isShatter ? 0 : 1 }}
      transition={{ duration: 0.4, ease: 'easeIn' }}
    >

      {/* ── Dot grid ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
      </div>




      <div className="relative shrink-0 overflow-hidden" style={{ height: 310, paddingTop: 110 }}>
        {PRELOAD_CARDS.map(({ label, x, scale, opacity }) => {
          const isCenter = label === 'center';
          const dimmed   = isProjectsDimmed && !isCenter;
          const tx = `translateX(${x}px) scale(${scale})`;
          return (
            <div
              key={label}
              className="absolute"
              style={{
                width: 230, height: 172,
                left: '50%', top: '50%',
                marginLeft: -115, marginTop: -86,
                zIndex: isCenter ? 20 : 10,
                transform: tx,
                transformOrigin: 'center center',
                opacity: dimmed ? 0.28 : opacity,
              }}
            >
              <div className="absolute inset-0" style={{ backgroundColor: '#D9D9D9' }} />
              <div className="absolute inset-0" style={{ border: '1px solid #B8B8B8' }} />
            </div>
          );
        })}
      </div>

      <div className="px-4 flex flex-col gap-1 relative z-30 mt-2 shrink-0">
        <div className="w-full origin-top-left" style={{ height: 120, transform: 'scale(0.85)', width: '117%' }}>
          <TypewriterText
            title="conceptual design"
            text="A bold fusion of wireframe raw concepts and high-fidelity motion interactive design."
            isActive={true}
            isStatic={true}
            variant="grey"
            className="!text-[#D9D9D9]"
          />
        </div>
        <div className="flex justify-end items-center mt-1 origin-right" style={{ transform: 'scale(0.85)' }}>
          <BracketButton isStatic={true} color="black" isWireframe={isQuoteWireframe} className="preloader-active">
            {isQuoteWireframe ? 'BUTTOn' : 'Get a quote'}
          </BracketButton>
        </div>
      </div>

      <div className="mt-auto relative shrink-0">
        {/* "designer" SVG */}
        <div className="relative w-full overflow-hidden" style={{ height: 'clamp(300px,82vw,550px)', zIndex: 5 }}>
          <div className="absolute pointer-events-none"
            style={{ left: '-12vw', bottom: '-10vw', width: '125%', height: '110%' }}>
            <Image
              src="/svgs/Mobile Hero Headline.svg"
              alt="designer"
              fill
              className="object-contain object-left-bottom"
              style={{ filter: WF_FILTER }}
              priority
            />
          </div>
        </div>
        {/* Sub-labels bar */}
        <div className="absolute bottom-4 left-0 w-full px-4" style={{ zIndex: 30 }}>
          <div className="relative w-full h-[20px]">
            <Image src="/svgs/hero-sub-heading.svg" alt="" fill
              className="object-contain object-left" style={{ filter: WF_FILTER }} />
          </div>
        </div>
      </div>


      {/* ── HUD / Crosshair / Reticle overlay ──────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-[400] overflow-hidden">

        {/* Vertical line */}
        <motion.div
          className="absolute top-0 bottom-0"
          style={{ width: 1, backgroundColor: '#C0C0C0', opacity: 0.38 }}
          animate={{ left: rx }}
          transition={SPRING_NAV}
        />
        {/* Horizontal line */}
        <motion.div
          className="absolute left-0 right-0"
          style={{ height: 1, backgroundColor: '#C0C0C0', opacity: 0.38 }}
          animate={{ top: ry }}
          transition={SPRING_NAV}
        />

        {/* Main reticle */}
        <motion.div
          className="absolute flex items-center justify-center"
          style={{ width: 28, height: 28, border: '1px solid #C0C0C0', borderRadius: '50%', marginLeft: -14, marginTop: -14 }}
          animate={{
            left:    rx,
            top:     ry,
            scale:   isShatter ? [1.5, 0] : 1,
            opacity: isShatter ? 0 : 0.85,
          }}
          transition={SPRING_NAV}
        >
          <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#C0C0C0' }} />
        </motion.div>

        {/* Split reticle — left card (visible only during PROJECTS_SPLIT) */}
        <motion.div
          className="absolute flex items-center justify-center"
          style={{ width: 22, height: 22, border: '1px solid #C0C0C0', borderRadius: '50%', marginLeft: -11, marginTop: -11 }}
          animate={{ left: '28%', top: ry, opacity: isSplit ? 0.85 : 0, scale: isSplit ? 1 : 0.2 }}
          transition={SPRING_NAV}
        >
          <div style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: '#C0C0C0' }} />
        </motion.div>

        {/* Split reticle — right card */}
        <motion.div
          className="absolute flex items-center justify-center"
          style={{ width: 22, height: 22, border: '1px solid #C0C0C0', borderRadius: '50%', marginLeft: -11, marginTop: -11 }}
          animate={{ left: '72%', top: ry, opacity: isSplit ? 0.85 : 0, scale: isSplit ? 1 : 0.2 }}
          transition={SPRING_NAV}
        >
          <div style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: '#C0C0C0' }} />
        </motion.div>
      </div>
    </motion.div>
  );
}
