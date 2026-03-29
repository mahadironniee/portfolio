"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, MotionValue, useSpring } from "framer-motion";

interface ParticleProps {
  delay: number;
}

function Particle({ delay }: ParticleProps) {
  // Random angle and distance
  const angle = useMemo(() => Math.random() * Math.PI * 2, []);
  const distance = useMemo(() => 80 + Math.random() * 120, []);
  const size = useMemo(() => 1.5 + Math.random() * 2, []);
  const isGrey = useMemo(() => Math.random() > 0.6, []);
  const duration = useMemo(() => 0.6 + Math.random() * 0.5, []);
  
  // Calculate start position relative to center
  const startX = Math.cos(angle) * distance;
  const startY = Math.sin(angle) * distance;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        x: startX,
        y: startY,
        backgroundColor: isGrey ? "#A3A3A3" : "#000000",
      }}
      animate={{
        x: [startX, 0],
        y: [startY, 0],
        opacity: [0, 1, 0],
        scale: [0.3, 1.2, 0.1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeIn",
      }}
    />
  );
}

export function EnergyGathering({ x, y }: { x: MotionValue<number>; y: MotionValue<number> }) {
  const [mounted, setMounted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleInteraction = () => setHasInteracted(true);
    window.addEventListener("mousemove", handleInteraction, { once: true });
    window.addEventListener("pointermove", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });
    
    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("pointermove", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  const smoothX = useSpring(x, { damping: 25, stiffness: 200 });
  const smoothY = useSpring(y, { damping: 25, stiffness: 200 });

  if (!mounted || !hasInteracted) return null;

  const particleCount = 24;

  return (
    <motion.div
      className="fixed pointer-events-none z-[50]"
      style={{
        left: smoothX,
        top: smoothY,
        transform: "translate(-50%, -50%)",
        width: 300,
        height: 300,
      }}
    >
      {Array.from({ length: particleCount }).map((_, i) => (
        <Particle key={i} delay={i * 0.05} />
      ))}
    </motion.div>
  );
}
