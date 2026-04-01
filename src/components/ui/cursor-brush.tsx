"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, MotionValue } from "framer-motion";

const TRAIL_COUNT = 8;

function TrailNode({ x, y, index, isVisible }: { x: MotionValue<number>, y: MotionValue<number>, index: number, isVisible: boolean }) {
  const stiffness = 250 - index * 20;
  const damping = 30 + index * 2;
  const mass = 0.4 + index * 0.1;

  const springX = useSpring(x, { stiffness, damping, mass });
  const springY = useSpring(y, { stiffness, damping, mass });

  return (
    <motion.div
      className="absolute bg-black rounded-full"
      animate={{
        opacity: isVisible ? (1 - (index / TRAIL_COUNT) * 0.85) : 0,
        scale: isVisible ? 1 : 0
      }}
      transition={{
        duration: 0.2,
        opacity: { duration: 0.15 }
      }}
      style={{
        left: springX,
        top: springY,
        x: "-50%",
        y: "-50%",
        width: Math.max(2, 8 - index * 0.7),
        height: Math.max(2, 8 - index * 0.7),
      }}
    />
  );
}

export function CursorBrush({ externalX, externalY }: { externalX?: MotionValue<number>; externalY?: MotionValue<number> }) {
  const internalX = useMotionValue(0);
  const internalY = useMotionValue(0);
  
  const x = externalX || internalX;
  const y = externalY || internalY;

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Small optimization: only update internal if not passing external
      if (!externalX) internalX.set(e.clientX);
      if (!externalY) internalY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isClickable = 
        target.closest('button') || 
        target.closest('a') || 
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsVisible(!isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [x, y, externalX, externalY, internalX, internalY]);

  return (
    <div className="hidden md:block fixed inset-0 z-[9999] pointer-events-none">
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <TrailNode key={i} index={i} x={x} y={y} isVisible={isVisible} />
      ))}
    </div>
  );
}
