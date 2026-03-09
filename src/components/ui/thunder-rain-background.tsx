"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Raindrop {
    x: number;
    y: number;
    length: number;
    velocity: number;
}

interface CloudPuff {
    xOffset: number;
    yOffset: number;
    radius: number;
    opacity: number;
    phase: number; // For internal morphing
}

interface Cloud {
    x: number;
    y: number;
    speed: number;
    depth: number;
    puffs: CloudPuff[];
    lightningEnergy: number;
    lightningTimer: number;
}

export default function ThunderRainBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [lightning, setLightning] = useState(false);
    const lightningRef = useRef(false);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let raindrops: Raindrop[] = [];
        let clouds: Cloud[] = [];
        const rainCount = 180;
        const totalCloudCount = 8;

        const initScene = () => {
            raindrops = [];
            for (let i = 0; i < rainCount; i++) {
                raindrops.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    length: Math.random() * 20 + 20,
                    velocity: Math.random() * 15 + 10,
                });
            }

            clouds = [];
            for (let i = 0; i < totalCloudCount; i++) {
                const depth = i % 3;
                const puffs: CloudPuff[] = [];
                const scale = depth === 0 ? 0.6 : depth === 1 ? 1.0 : 1.6;
                const cloudWidth = (Math.random() * 250 + 150) * scale;
                const puffCount = 30 + Math.floor(Math.random() * 20);

                for (let j = 0; j < puffCount; j++) {
                    const angle = Math.random() * Math.PI * 2;
                    const r = Math.random() * (cloudWidth * 0.45);
                    puffs.push({
                        xOffset: Math.cos(angle) * r,
                        yOffset: Math.sin(angle) * r * 0.4,
                        radius: (Math.random() * 40 + 20) * scale,
                        opacity: (Math.random() * 0.03 + 0.01) * (depth === 0 ? 0.5 : 1),
                        phase: Math.random() * Math.PI * 2,
                    });
                }

                clouds.push({
                    x: Math.random() * canvas.width,
                    y: (Math.random() * canvas.height * 0.5) + (depth * 60),
                    speed: (Math.random() * 0.08 + 0.03) * (depth + 1),
                    depth,
                    puffs,
                    lightningEnergy: 0,
                    lightningTimer: Math.random() * 800 + 400,
                });
            }
            clouds.sort((a, b) => a.depth - b.depth);
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initScene();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        handleResize();

        const drawCloud = (cloud: Cloud, wind: number) => {
            ctx.save();
            const parallaxX = (mouseRef.current.x - (canvas.width / 2)) * (cloud.depth * 0.02);
            ctx.translate(cloud.x + parallaxX, cloud.y);

            if (cloud.lightningTimer > 0) {
                cloud.lightningTimer--;
            } else {
                cloud.lightningEnergy = 1.0;
                cloud.lightningTimer = Math.random() * 1200 + 800;
            }

            if (cloud.lightningEnergy > 0) {
                cloud.lightningEnergy *= 0.9;
                if (cloud.lightningEnergy < 0.01) cloud.lightningEnergy = 0;
            }

            const energy = cloud.lightningEnergy;
            const isFlash = lightningRef.current;

            cloud.puffs.forEach(puff => {
                const px = puff.xOffset;
                const py = puff.yOffset;
                const grad = ctx.createRadialGradient(px, py, 0, px, py, puff.radius);
                const baseOpacity = isFlash ? puff.opacity * 3 : puff.opacity * (1 + energy * 2);
                const r = 180 + energy * 75;
                const g = 190 + energy * 65;
                const b = 255;

                grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${baseOpacity})`);
                grad.addColorStop(0.6, `rgba(${r - 20}, ${g - 20}, ${b}, ${baseOpacity * 0.3})`);
                grad.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(px, py, puff.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.restore();

            cloud.x += cloud.speed + (wind * 0.25 * (cloud.depth + 1));
            const margin = 800;
            if (cloud.x > canvas.width + margin) cloud.x = -margin;
            if (cloud.x < -margin) cloud.x = canvas.width + margin;
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerX = canvas.width / 2;
            const wind = (mouseRef.current.x - centerX) / (canvas.width / 2) * 8;
            const rainSlant = wind * 1.5;

            clouds.forEach(cloud => drawCloud(cloud, wind));

            ctx.strokeStyle = "rgba(176, 184, 242, 0.4)";
            ctx.lineWidth = 1;

            raindrops.forEach((drop) => {
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x + rainSlant, drop.y + drop.length);
                ctx.stroke();

                drop.y += drop.velocity;
                drop.x += wind;

                if (drop.y > canvas.height) {
                    drop.y = -drop.length;
                    drop.x = Math.random() * canvas.width;
                }
                if (drop.x > canvas.width) drop.x = 0;
                if (drop.x < 0) drop.x = canvas.width;
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        const thunderStrike = () => {
            const delay = Math.random() * 10000 + 5000;
            setTimeout(() => {
                setLightning(true);
                lightningRef.current = true;
                setTimeout(() => {
                    setLightning(false);
                    lightningRef.current = false;
                    thunderStrike();
                }, 100);
            }, delay);
        };
        thunderStrike();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0004D9]">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            <AnimatePresence>
                {lightning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white z-10"
                        transition={{ duration: 0.05 }}
                    />
                )}
            </AnimatePresence>

            <div
                className="absolute inset-0 z-20 opacity-[0.08]"
                style={{
                    background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)",
                }}
            />

            <svg className="absolute w-full h-full opacity-[0.03] z-30 mix-blend-overlay">
                <filter id="noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
        </div>
    );
}
