"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";

interface MotionTrackerProps {
  x: number | string;
  y: number | string;
  width: number | string;
  height: number | string;
  preloaderState: "A" | "LOGO" | "NAV" | "QUOTE" | "QUOTE_SPLIT" | "PROJECTS_CENTER" | "PROJECTS_SPLIT" | "B" | "DONE";
  activeTarget?: number;
  className?: string;
  color?: string;
}

export default function MotionTracker({
  x,
  y,
  width,
  height,
  preloaderState,
  activeTarget = 0,
  className = "",
  color = "#C0C0C0",
}: MotionTrackerProps) {
  const [phase, setPhase] = useState<"scanning" | "locking" | "tracking" | "split">("scanning");

  useEffect(() => {
    if (preloaderState === "B") {
      setPhase("locking");
      const t = setTimeout(() => {
        setPhase("tracking");
      }, 150);
      return () => clearTimeout(t);
    } else if (preloaderState === "PROJECTS_SPLIT" || preloaderState === "QUOTE_SPLIT") {
      setPhase("split");
    } else if (preloaderState === "A" || preloaderState === "LOGO" || preloaderState === "NAV" || preloaderState === "QUOTE" || preloaderState === "PROJECTS_CENTER") {
      setPhase("scanning");
    }
  }, [preloaderState]);


  // Map of target visual centres [x%, y%] inside the bounding box

  // Map of target visual centres [x%, y%] inside the bounding box
  const targetCoordinates = [
    { x: "21%", y: "38%" }, // Block 1 (Left)
    { x: "55%", y: "20%" }, // Block 2 (Middle)
    { x: "80%", y: "24%" }, // Block 3 (Right)
    { x: "50%", y: "50%" }, // Center (idle)
    { x: "50%", y: "50%" }, // Quote Midpoint (centered in current area)
  ];
  
  const currentTarget = targetCoordinates[activeTarget] || targetCoordinates[3];

  return (
    <motion.div
      className={`absolute pointer-events-none z-50 ${className}`}
      style={{ left: x, top: y, width, height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Corner Brackets removed as requested */}

      {/* Dynamic Target Group (Crosshairs and Reticle) */}
      <motion.div
        className="absolute inset-0"
      >
        {/* Game-Map Crosshairs connecting 4 sides securely through the current target */}
        <motion.div
          className="absolute origin-center"
          style={{ width: 1, height: "400vh", backgroundColor: color, x: "-50%", y: "-50%" }}
          animate={{ 
            left: currentTarget.x,
            top: currentTarget.y,
            opacity: phase === "scanning" ? 0.35 : phase === "locking" ? 0.9 : 0.5
          }}
          transition={{ 
            left: { type: "spring", stiffness: 120, damping: 18 },
            top: { type: "spring", stiffness: 120, damping: 18 },
            opacity: { duration: 0.3 }
          }}
        />
        <motion.div
          className="absolute origin-center"
          style={{ height: 1, width: "400vw", backgroundColor: color, x: "-50%", y: "-50%" }}
          animate={{ 
            left: currentTarget.x,
            top: currentTarget.y,
            opacity: phase === "scanning" ? 0.35 : phase === "locking" ? 0.9 : 0.5
          }}
          transition={{ 
            left: { type: "spring", stiffness: 120, damping: 18 },
            top: { type: "spring", stiffness: 120, damping: 18 },
            opacity: { duration: 0.3 }
          }}
        />

        {/* Top Targeting Reticle (split) or Central Targeting Reticle */}
        <motion.div
          className="absolute border rounded-full flex items-center justify-center"
          style={{ 
            width: 32, height: 32, 
            borderColor: color, borderWidth: 1,
            x: "-50%", y: "-50%"
          }}
          animate={{
            left: currentTarget.x,
            top: phase === "split" 
              ? (preloaderState === "QUOTE_SPLIT" ? `calc(${currentTarget.y} - 90px)` : `calc(${currentTarget.y} - 316.2px)`)
              : currentTarget.y,
            scale: phase === "split" ? 1 : [1.4, 1],
            opacity: phase === "split" ? 0.9 : 0,
            rotate: 0
          }}
          transition={{ 
            left: { type: "spring", stiffness: 120, damping: 18 },
            top: { type: "spring", stiffness: 120, damping: 18 },
            scale: { duration: phase === "scanning" ? 1.5 : 0.2, repeat: phase === "scanning" ? Infinity : 0 },
            rotate: { duration: 1.5, repeat: phase === "scanning" ? Infinity : 0 }
          }}
        >
          <div style={{ width: 4, height: 4, backgroundColor: color, borderRadius: "50%" }} />
        </motion.div>

        {/* Bottom Targeting Reticle (only visible when split) */}
        <motion.div
          className="absolute border rounded-full flex items-center justify-center"
          style={{ 
            width: 32, height: 32, 
            borderColor: color, borderWidth: 1,
            x: "-50%", y: "-50%"
          }}
          animate={{
            left: currentTarget.x,
            top: phase === "split" 
              ? (preloaderState === "QUOTE_SPLIT" ? `calc(${currentTarget.y} + 90px)` : `calc(${currentTarget.y} + 316.2px)`)
              : currentTarget.y,
            scale: phase === "split" ? 1 : [1.4, 1],
            opacity: phase === "split" ? 0.9 : 0,
            rotate: 0
          }}
          transition={{ 
            left: { type: "spring", stiffness: 120, damping: 18 },
            top: { type: "spring", stiffness: 120, damping: 18 },
            scale: { duration: 0.2 },
            opacity: { duration: 0.2 }
          }}
        >
          <div style={{ width: 4, height: 4, backgroundColor: color, borderRadius: "50%" }} />
        </motion.div>

        {/* Central Targeting Reticle (Persistent inside the middle card when split) */}
        <motion.div
          className="absolute border rounded-full flex items-center justify-center"
          style={{ 
            width: 32, height: 32, 
            borderColor: color, borderWidth: 1,
            x: "-50%", y: "-50%"
          }}
          animate={{
            left: currentTarget.x,
            top: currentTarget.y,
            scale: phase === "scanning" ? [0.85, 1.15, 0.85] : phase === "split" ? 1 : [1.4, 1],
            opacity: phase === "scanning" ? 0.5 : (preloaderState === "PROJECTS_SPLIT" ? 0.9 : 0),
            rotate: phase === "scanning" ? 90 : 0
          }}
          transition={{ 
            left: { type: "spring", stiffness: 120, damping: 18 },
            top: { type: "spring", stiffness: 120, damping: 18 },
            scale: { duration: 0.2 },
            opacity: { duration: 0.2 }
          }}
        >
          <div style={{ width: 4, height: 4, backgroundColor: color, borderRadius: "50%" }} />
        </motion.div>
      </motion.div>

      {/* TGT Stats removed as requested */}
    </motion.div>
  );
}
