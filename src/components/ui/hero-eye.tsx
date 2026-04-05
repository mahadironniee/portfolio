"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

interface HeroEyeProps {
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
    size?: number;
    isPreloader?: boolean;
    isInteractive?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export default function HeroEye({
    mouseX,
    mouseY,
    size = 39,
    isPreloader = false,
    isInteractive = false,
    className = "",
    style = {},
}: HeroEyeProps) {
    const eyeRef = useRef<HTMLDivElement>(null);

    // Internal Motion Values for smooth animation
    const pupilX = useMotionValue(0);
    const pupilY = useMotionValue(0);
    const pupilScale = useMotionValue(1);
    const socketX = useMotionValue(0);
    const socketY = useMotionValue(0);
    const socketScaleX = useMotionValue(1);
    const socketScaleY = useMotionValue(1);
    const eyeHoverMotion = useMotionValue(0);

    // Physics configuration
    const springConfig = { damping: 20, stiffness: 250, mass: 0.2 };
    const socketSpringConfig = { damping: 25, stiffness: 180, mass: 0.6 };
    const scaleSpringConfig = { damping: 25, stiffness: 150, mass: 0.4 };

    const smoothX = useSpring(pupilX, springConfig);
    const smoothY = useSpring(pupilY, springConfig);
    const smoothScale = useSpring(pupilScale, scaleSpringConfig);
    const smoothEyeHover = useSpring(eyeHoverMotion, { stiffness: 800, damping: 35 });
    
    const smoothSocketX = useSpring(socketX, socketSpringConfig);
    const smoothSocketY = useSpring(socketY, socketSpringConfig);
    const smoothSocketScaleX = useSpring(socketScaleX, socketSpringConfig);
    const smoothSocketScaleY = useSpring(socketScaleY, socketSpringConfig);

    // Dilation / Squish Transforms
    const finalPupilScaleX = useTransform(
        [smoothScale, smoothEyeHover] as MotionValue<number>[],
        ([scale, hover]: number[]) => scale * (1 - hover) + 1.4 * hover
    );
    const finalPupilScaleY = useTransform(
        [smoothScale, smoothEyeHover] as MotionValue<number>[],
        ([scale, hover]: number[]) => scale * (1 - hover) + 0.15 * hover
    );

    useEffect(() => {
        let frameId: number;

        const updateEye = () => {
            if (!eyeRef.current) return;
            
            // Get current eye center in viewport coordinates
            const { left, top, width, height } = eyeRef.current.getBoundingClientRect();
            
            // Important: We need to subtract current translation to get the "rest" center,
            // otherwise we create a feedback loop where the eye moves away from the mouse.
            const currentX = smoothSocketX.get();
            const currentY = smoothSocketY.get();
            
            const centerX = left + width / 2 - currentX;
            const centerY = top + height / 2 - currentY;
            
            const targetX = mouseX.get();
            const targetY = mouseY.get();
            
            const deltaX = targetX - centerX;
            const deltaY = targetY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angle = Math.atan2(deltaY, deltaX);

            // Pupil movement logic
            const MAX_RADIUS = 7.0 * (size / 39); // Scale radius with eye size
            const mappedRadius = (distance / (distance + 400)) * MAX_RADIUS;
            
            // Pupil scaling logic
            const MAX_PUPIL_SCALE = 1.35;
            const mappedScale = 1.0 + (distance / (distance + 800)) * (MAX_PUPIL_SCALE - 1.0);

            pupilX.set(Math.cos(angle) * mappedRadius);
            pupilY.set(Math.sin(angle) * mappedRadius);
            pupilScale.set(mappedScale);

            // Socket shifting logic (subtle movement of the whole eye)
            const MAX_SOCKET_SHIFT = 5.0 * (size / 39);
            const mappedSocketShift = (distance / (distance + 350)) * MAX_SOCKET_SHIFT;
            
            // Socket squish logic (squish towards mouse)
            const MAX_SQUISH = 0.15;
            const squishAmount = (distance / (distance + 500)) * MAX_SQUISH;
            const absCos = Math.abs(Math.cos(angle));
            const absSin = Math.abs(Math.sin(angle));
            
            const scaleXAmount = 1.0 - (squishAmount * absCos) + (squishAmount * absSin * 0.4);
            const scaleYAmount = 1.0 - (squishAmount * absSin) + (squishAmount * absCos * 0.4);

            socketX.set(Math.cos(angle) * mappedSocketShift);
            socketY.set(Math.sin(angle) * mappedSocketShift);
            socketScaleX.set(scaleXAmount);
            socketScaleY.set(scaleYAmount);

            frameId = requestAnimationFrame(updateEye);
        };

        frameId = requestAnimationFrame(updateEye);
        return () => cancelAnimationFrame(frameId);
    }, [mouseX, mouseY, size, smoothSocketX, smoothSocketY]); // Depend on mouse values to start loop

    return (
        <motion.div
            ref={eyeRef}
            className={`rounded-full border border-black/10 overflow-hidden ${isPreloader ? "bg-[#D9D9D9]" : "bg-[#E5E5E5] shadow-[0_4px_30px_rgba(0,0,0,0.18),inset_0_2px_10px_rgba(0,0,0,0.05)]"} ${isInteractive ? "cursor-pointer pointer-events-auto" : "pointer-events-none"} ${className}`}
            onMouseEnter={() => isInteractive && eyeHoverMotion.set(1)}
            onMouseLeave={() => isInteractive && eyeHoverMotion.set(0)}
            style={{
                ...style,
                width: size,
                height: size,
                x: smoothSocketX,
                y: smoothSocketY,
                scaleX: smoothSocketScaleX,
                scaleY: smoothSocketScaleY,
            }}
        >
            <motion.div
                style={{
                    width: (24 / 39) * size,
                    height: (24 / 39) * size,
                    left: (7.5 / 39) * size,
                    top: (7.5 / 39) * size,
                    x: smoothX,
                    y: smoothY,
                    scaleX: finalPupilScaleX,
                    scaleY: finalPupilScaleY,
                }}
                className="absolute"
            >
                <div className={`w-full h-full rounded-full ${isPreloader ? "bg-[#A3A3A3]" : "bg-black animate-blink"}`} />
            </motion.div>
        </motion.div>
    );
}
