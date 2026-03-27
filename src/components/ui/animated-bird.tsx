"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

const SvgBird = ({ isWingsUp }: { isWingsUp: boolean }) => (
    <svg
        viewBox="0 0 100 100"
        className="w-full h-full text-[#CAD9FB] opacity-80 drop-shadow-md"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {isWingsUp ? (
            <path d="M 15 50 Q 35 20 50 45 Q 65 20 85 50" />
        ) : (
            <path d="M 15 40 Q 35 70 50 45 Q 65 70 85 40" />
        )}
    </svg>
);

export default function AnimatedBird() {
    const [isWingsUp, setIsWingsUp] = useState(false);
    const [direction, setDirection] = useState(1); // 1 = right, -1 = left
    const controls = useAnimation();
    const currentPos = useRef({ x: 0, y: 0 });

    // 1. Wing Flapping Animation Loop
    useEffect(() => {
        let wingsState = false;
        // Fast flap for realistic flying feel
        const flapInterval = setInterval(() => {
            setIsWingsUp(!wingsState);
            wingsState = !wingsState;
        }, 200);

        return () => clearInterval(flapInterval);
    }, []);

    // 2. Flight Path Generation & Movement Loop
    useEffect(() => {
        let isActive = true;

        const flyToRandomPoint = async () => {
            if (!isActive) return;

            // Ensure we have a window to calculate bounds
            if (typeof window === "undefined") return;

            const maxWidth = window.innerWidth;
            // Keep bird in the upper 60% of the screen so it doesn't get lost behind content
            const maxHeight = window.innerHeight * 0.6;

            const nextX = Math.random() * maxWidth;
            const nextY = Math.random() * maxHeight;

            // Calculate distance and duration based on a rough speed
            const dx = nextX - currentPos.current.x;
            const dy = nextY - currentPos.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Speed: roughly 200 pixels per second, randomized a bit
            const duration = Math.max(distance / (150 + Math.random() * 100), 3);

            // Set direction based on X movement
            setDirection(dx > 0 ? 1 : -1);

            // Optional: Add slight rotation based on angle of flight
            // Calculate angle in degrees
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            // We limit rotation so it doesn't look like it's flying completely vertically while the sprite is horizontal
            // If flying right (direction = 1), angle is naturally calculated.
            // If flying left (direction = -1), the sprite is flipped, so the perceived angle is reversed visually.
            let rotationAngle = angle;
            if (dx < 0) {
                // Adjust angle for flipped sprite
                rotationAngle = angle > 0 ? 180 - angle : -180 - angle;
            }
            // Clamp the angle to prevent upside down or weird banking
            const clampedRotation = Math.max(-25, Math.min(25, rotationAngle));


            await controls.start({
                x: nextX,
                y: nextY,
                rotate: clampedRotation,
                transition: {
                    duration: duration,
                    ease: "easeInOut",
                },
            });

            // Update current position tracker
            currentPos.current = { x: nextX, y: nextY };

            // Recursively call for continuous flight after a tiny pause
            if (isActive) {
                setTimeout(flyToRandomPoint, 100);
            }
        };

        // Initialize random starting position
        if (typeof window !== "undefined") {
            currentPos.current = {
                x: Math.random() * window.innerWidth,
                y: Math.random() * (window.innerHeight * 0.4)
            };
            controls.set({ x: currentPos.current.x, y: currentPos.current.y });
        }

        flyToRandomPoint();

        return () => {
            isActive = false;
        };
    }, [controls]);

    return (
        <motion.div
            className="absolute top-0 left-0 z-10 pointer-events-none"
            animate={controls}
            initial={{ x: 0, y: 0, opacity: 0 }}
            // Fade in smoothly when mounted
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
                // Flip sprite if flying left
                scaleX: direction,
                // The transform origin matters when scaling/rotating
                transformOrigin: "center center"
            }}
        >
            <div className="relative w-[40px] h-[40px] md:w-[60px] md:h-[60px]">
                <SvgBird isWingsUp={isWingsUp} />
            </div>
        </motion.div>
    );
}
