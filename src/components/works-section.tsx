"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

// SVG Paths from GeomatricShape.svg for animation
const svgPaths = [
    "M809.936 1098.48H486.326L631.951 1373.55H971.741L809.936 1098.48Z",
    "M1797.07 1098.48H1473.46L1619.08 1373.55H1958.87L1797.07 1098.48Z",
    "M2784.19 1098.48H2460.58L2606.21 1373.55H2946L2784.19 1098.48Z",
    "M3771.32 1098.48H3447.71L3593.34 1373.55H3933.13L3771.32 1098.48Z",
    "M3301.01 275.164H2977.4L3123.02 550.233H3462.81L3301.01 275.164Z",
    "M2313.88 275.164H1990.27L2135.89 550.233H2475.68L2313.88 275.164Z",
    "M1326.75 275.164H1003.14L1148.77 550.233H1488.56L1326.75 275.164Z",
    "M339.624 275.164H16.0137L161.638 550.233H501.429L339.624 275.164Z",
    "M1283.42 1923.9H959.811L1105.44 2198.97H1445.23L1283.42 1923.9Z",
    "M2270.55 1923.9H1946.94L2092.56 2198.97H2432.35L2270.55 1923.9Z",
    "M3257.68 1923.9H2934.07L3079.69 2198.97H3419.48L3257.68 1923.9Z",
    "M4244.81 1923.9H3921.2L4066.82 2198.97H4406.61L4244.81 1923.9Z",
    "M4273.34 825.801H3949.73L4095.35 1100.87H4435.15L4273.34 825.801Z",
    "M1296.1 1373.27H972.492L1118.12 1648.33H1457.91L1296.1 1373.27Z",
    "M2283.23 1373.27H1959.62L2105.25 1648.33H2445.04L2283.23 1373.27Z",
    "M3270.36 1373.27H2946.75L3092.37 1648.33H3432.17L3270.36 1373.27Z",
    "M4257.49 1373.27H3933.88L4079.5 1648.33H4419.29L4257.49 1373.27Z",
    "M3787.17 549.953H3463.56L3609.19 825.022H3948.98L3787.17 549.953Z",
    "M2800.05 549.953H2476.44L2622.06 825.022H2961.85L2800.05 549.953Z",
    "M1812.92 549.953H1489.31L1634.93 825.022H1974.72L1812.92 549.953Z",
    "M825.79 549.953H502.18L647.804 825.022H987.595L825.79 549.953Z",
    "M1769.59 2198.69H1445.98L1591.6 2473.76H1931.39L1769.59 2198.69Z",
    "M2756.71 2198.69H2433.1L2578.73 2473.76H2918.52L2756.71 2198.69Z",
    "M3743.84 2198.69H3420.23L3565.86 2473.76H3905.65L3743.84 2198.69Z",
    "M4730.97 2198.69H4407.36L4552.98 2473.76H4892.77L4730.97 2198.69Z",
    "M4759.51 1100.59H4435.9L4581.52 1375.66H4921.31L4759.51 1100.59Z",
    "M795.141 1648.05H471.531L617.156 1923.12H956.946L795.141 1648.05Z",
    "M1782.27 1648.05H1458.66L1604.28 1923.12H1944.07L1782.27 1648.05Z",
    "M2769.4 1648.05H2445.79L2591.41 1923.12H2931.2L2769.4 1648.05Z",
    "M3756.52 1648.05H3432.91L3578.54 1923.12H3918.33L3756.52 1648.05Z",
    "M3286.21 824.746H2962.6L3108.23 1099.81H3448.02L3286.21 824.746Z",
    "M2299.08 824.746H1975.47L2121.1 1099.81H2460.89L2299.08 824.746Z",
    "M1311.96 824.746H988.346L1133.97 1099.81H1473.76L1311.96 824.746Z",
    "M324.829 824.746H1.21875L146.843 1099.81H486.634L324.829 824.746Z",
    "M1268.62 2473.48H945.014L1090.64 2748.55H1430.43L1268.62 2473.48Z",
    "M2255.75 2473.48H1932.14L2077.77 2748.55H2417.56L2255.75 2473.48Z",
    "M3242.88 2473.48H2919.27L3064.89 2748.55H3404.68L3242.88 2473.48Z",
    "M4230.01 2473.48H3906.4L4052.02 2748.55H4391.81L4230.01 2473.48Z",
    "M4258.54 1375.38H3934.93L4080.56 1650.45H4420.35L4258.54 1375.38Z",
    "M810.447 1098.6L986.947 824.867L1134.06 1100.67L972.679 1373.39L810.447 1098.6Z",
    "M1797.57 1098.6L1974.07 824.867L2121.18 1100.67L1959.81 1373.39L1797.57 1098.6Z",
    "M2784.7 1098.6L2961.2 824.867L3108.31 1100.67L2946.93 1373.39L2784.7 1098.6Z",
    "M3771.83 1098.6L3948.33 824.867L4095.44 1100.67L3934.06 1373.39L3771.83 1098.6Z",
    "M3301.52 275.291L3478.02 1.55859L3625.13 277.357L3463.75 550.081L3301.52 275.291Z",
    "M2314.39 275.291L2490.89 1.55859L2638 277.357L2476.62 550.081L2314.39 275.291Z",
    "M1327.26 275.291L1503.76 1.55859L1650.87 277.357L1489.49 550.081L1327.26 275.291Z",
    "M340.135 275.291L516.634 1.55859L663.745 277.357L502.366 550.081L340.135 275.291Z",
    "M1283.93 1924.03L1460.43 1650.29L1607.54 1926.09L1446.16 2198.81L1283.93 1924.03Z",
    "M2271.06 1924.03L2447.56 1650.29L2594.67 1926.09L2433.29 2198.81L2271.06 1924.03Z",
    "M3258.19 1924.03L3434.69 1650.29L3581.8 1926.09L3420.42 2198.81L3258.19 1924.03Z",
    "M4245.31 1924.03L4421.81 1650.29L4568.92 1926.09L4407.55 2198.81L4245.31 1924.03Z",
    "M4273.85 825.924L4450.35 552.191L4597.46 827.99L4436.08 1100.71L4273.85 825.924Z",
    "M1296.61 1373.39L1473.11 1099.66L1620.22 1375.45L1458.84 1648.18L1296.61 1373.39Z",
    "M2283.74 1373.39L2460.24 1099.66L2607.35 1375.45L2445.97 1648.18L2283.74 1373.39Z",
    "M3270.87 1373.39L3447.37 1099.66L3594.48 1375.45L3433.1 1648.18L3270.87 1373.39Z",
    "M4258 1373.39L4434.5 1099.66L4581.61 1375.45L4420.23 1648.18L4258 1373.39Z",
    "M3787.68 550.08L3964.18 276.348L4111.29 552.146L3949.92 824.87L3787.68 550.08Z",
    "M2800.56 550.08L2977.06 276.348L3124.17 552.146L2962.79 824.87L2800.56 550.08Z",
    "M1813.43 550.08L1989.93 276.348L2137.04 552.146L1975.66 824.87L1813.43 550.08Z",
    "M826.301 550.08L1002.8 276.348L1149.91 552.146L988.532 824.87L826.301 550.08Z",
    "M1770.1 2198.81L1946.6 1925.08L2093.71 2200.88L1932.33 2473.6L1770.1 2198.81Z",
    "M2757.22 2198.81L2933.72 1925.08L3080.83 2200.88L2919.46 2473.6L2757.22 2198.81Z",
    "M3744.35 2198.81L3920.85 1925.08L4067.96 2200.88L3906.58 2473.6L3744.35 2198.81Z",
    "M4731.48 2198.81L4907.98 1925.08L5055.09 2200.88L4893.71 2473.6L4731.48 2198.81Z",
    "M4760.02 1100.71L4936.51 826.98L5083.63 1102.78L4922.25 1375.5L4760.02 1100.71Z",
    "M795.65 1648.18L972.15 1374.45L1119.26 1650.24L957.882 1922.97L795.65 1648.18Z",
    "M1782.78 1648.18L1959.28 1374.45L2106.39 1650.24L1945.01 1922.97L1782.78 1648.18Z",
    "M2769.91 1648.18L2946.41 1374.45L3093.52 1650.24L2932.14 1922.97L2769.91 1648.18Z",
    "M3757.04 1648.18L3933.53 1374.45L4080.65 1650.24L3919.27 1922.97L3757.04 1648.18Z",
    "M3286.72 824.869L3463.22 551.137L3610.33 826.935L3448.95 1099.66L3286.72 824.869Z",
    "M2299.59 824.869L2476.09 551.137L2623.2 826.935L2461.83 1099.66L2299.59 824.869Z",
    "M1312.47 824.869L1488.97 551.137L1636.08 826.935L1474.7 1099.66L1312.47 824.869Z",
    "M325.338 824.869L501.837 551.137L648.948 826.935L487.569 1099.66L325.338 824.869Z",
    "M1269.13 2473.6L1445.63 2199.87L1592.74 2475.67L1431.37 2748.39L1269.13 2473.6Z",
    "M2256.26 2473.6L2432.76 2199.87L2579.87 2475.67L2418.49 2748.39L2256.26 2473.6Z",
    "M3243.39 2473.6L3419.89 2199.87L3567 2475.67L3405.62 2748.39L3243.39 2473.6Z",
    "M4230.52 2473.6L4407.02 2199.87L4554.13 2475.67L4392.75 2748.39L4230.52 2473.6Z",
    "M4259.05 1375.5L4435.55 1101.77L4582.66 1377.57L4421.29 1650.29L4259.05 1375.5Z",
    "M809.594 1098.88H485.984L647.789 823.812H987.58L809.594 1098.88Z",
    "M1796.72 1098.88H1473.11L1634.92 823.812H1974.71L1796.72 1098.88Z",
    "M2783.85 1098.88H2460.24L2622.05 823.812H2961.84L2783.85 1098.88Z",
    "M3770.98 1098.88H3447.37L3609.17 823.812H3948.96L3770.98 1098.88Z",
    "M3300.67 275.569H2977.06L3138.86 0.5H3478.65L3300.67 275.569Z",
    "M2313.54 275.569H1989.93L2151.73 0.5H2491.52L2313.54 275.569Z",
    "M1326.41 275.569H1002.8L1164.6 0.5H1504.39L1326.41 275.569Z",
    "M339.282 275.569H15.6719L177.477 0.5H517.267L339.282 275.569Z",
    "M1283.08 1924.31H959.467L1121.27 1649.24H1461.06L1283.08 1924.31Z",
    "M2270.21 1924.31H1946.6L2108.4 1649.24H2448.19L2270.21 1924.31Z",
    "M3257.33 1924.31H2933.72L3095.53 1649.24H3435.32L3257.33 1924.31Z",
    "M4244.46 1924.31H3920.85L4082.66 1649.24H4422.45L4244.46 1924.31Z",
    "M4273 826.205H3949.39L4111.19 551.137H4450.98L4273 826.205Z",
    "M1295.76 1373.67H972.15L1133.96 1098.6H1473.75L1295.76 1373.67Z",
    "M2282.89 1373.67H1959.28L2121.08 1098.6H2460.87L2282.89 1373.67Z",
    "M3270.02 1373.67H2946.41L3108.21 1098.6H3448L3270.02 1373.67Z",
    "M4257.15 1373.67H3933.54L4095.34 1098.6H4435.13L4257.15 1373.67Z",
    "M3786.83 550.358H3463.22L3625.03 275.289H3964.82L3786.83 550.358Z",
    "M2799.7 550.358H2476.09L2637.9 275.289H2977.69L2799.7 550.358Z",
    "M1812.57 550.358H1488.96L1650.77 275.289H1990.56L1812.57 550.358Z",
    "M825.448 550.358H501.838L663.643 275.289H1003.43L825.448 550.358Z",
    "M1769.24 2199.1H1445.63L1607.44 1924.03H1947.23L1769.24 2199.1Z",
    "M2756.37 2199.1H2432.76L2594.57 1924.03H2934.36L2756.37 2199.1Z",
    "M3743.5 2199.1H3419.89L3581.7 1924.03H3921.49L3743.5 2199.1Z",
    "M4730.63 2199.1H4407.02L4568.82 1924.03H4908.61L4730.63 2199.1Z",
    "M4759.16 1100.99H4435.55L4597.36 825.926H4937.15L4759.16 1100.99Z",
    "M794.798 1648.46H471.188L632.993 1373.39H972.783L794.798 1648.46Z",
    "M1781.93 1648.46H1458.32L1620.12 1373.39H1959.91L1781.93 1648.46Z",
    "M2769.05 1648.46H2445.44L2607.25 1373.39H2947.04L2769.05 1648.46Z",
    "M3756.18 1648.46H3432.57L3594.38 1373.39H3934.17L3756.18 1648.46Z",
    "M3285.87 825.147H2962.26L3124.06 550.078H3463.86L3285.87 825.147Z",
    "M2298.74 825.147H1975.13L2136.94 550.078H2476.73L2298.74 825.147Z",
    "M1311.61 825.147H988.004L1149.81 550.078H1489.6L1311.61 825.147Z",
    "M324.485 825.147H0.875L162.68 550.078H502.471L324.485 825.147Z",
    "M1268.28 2473.88H944.672L1106.48 2198.82H1446.27L1268.28 2473.88Z",
    "M2255.41 2473.88H1931.8L2093.6 2198.82H2433.39L2255.41 2473.88Z",
    "M3242.54 2473.88H2918.93L3080.73 2198.82H3420.52L3242.54 2473.88Z",
    "M4229.66 2473.88H3906.05L4067.86 2198.82H4407.65L4229.66 2473.88Z",
    "M4258.2 1375.78H3934.59L4096.4 1100.71H4436.19L4258.2 1375.78Z",
];

interface TransitionBlockProps {
    path: string;
    index: number;
    total: number;
    randomOrder: number[];
    progress: any;
}

function TransitionBlock({ path, index, total, randomOrder, progress }: TransitionBlockProps) {
    const order = randomOrder.indexOf(index);
    // Align with projectsX stop point at 0.82
    const start = 0.82 + (order / total) * 0.16;
    const end = Math.min(start + 0.01, 0.98);

    const fillOpacity = useTransform(progress, [0.8, start, end], [0, 0, 1], { clamp: true });

    return (
        <motion.path
            d={path}
            stroke="#0004D9"
            strokeWidth={1.5}
            strokeLinejoin="round"
            style={{
                fill: "#0004D9",
                fillOpacity: fillOpacity,
                strokeOpacity: fillOpacity
            }}
        />
    );
}

export default function WorksSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map vertical scroll (0 to 1) to horizontal translation
    // We scroll the 5085px wide SVG across the viewport
    // Starting at 0% with justify-center keeps it perfectly centered at start
    const backgroundX = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"], { clamp: true });

    // Project cards horizontal movement - Starts on the RIGHT side with a minimal gap
    // Synchronize to stop exactly at the center when transition starts (0.82)
    // -267vw is the final calibrated target for perfect project card centering
    const projectsX = useTransform(
        scrollYProgress,
        [0, 0.82, 1],
        ["65vw", "-267vw", "-267vw"],
        { clamp: true }
    );

    // Header horizontal movement - Moves ULTRA-FAST to clear the path
    const headerX = useTransform(scrollYProgress, [0, 1], ["0vw", "-500vw"], { clamp: true });

    // Subtle vertical parallax remains
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"], { clamp: true });

    // Opacity and scale for the content - Starts visible
    const contentOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0], { clamp: true });
    // Stable scale to start with
    const headingScale = useTransform(scrollYProgress, [0, 0.2], [1, 1]);

    // Generate random sequence indices for the blocks
    const randomOrder = useRef(Array.from({ length: svgPaths.length }, (_, i) => i).sort(() => Math.random() - 0.5));

    // Section exit upwards - Final transition
    const sectionExitY = useTransform(scrollYProgress, [0.98, 1], ["0%", "-100%"], { clamp: true });

    return (
        <section
            ref={containerRef}
            className="relative w-full h-[400vh] bg-white light-bg-nav-trigger"
        >
            <motion.div
                style={{ y: sectionExitY }}
                className="sticky top-0 w-full h-[100dvh] overflow-hidden"
            >
                {/* Background Geometric Pattern - STAYS UNDER (z-0) */}
                <motion.div
                    className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.3]"
                    style={{
                        x: backgroundX,
                        y: backgroundY,
                    }}
                >
                    <div className="relative w-[5085px] h-[2750px] flex-shrink-0">
                        <svg
                            width="5085"
                            height="2750"
                            viewBox="0 0 5085 2750"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full"
                        >
                            {svgPaths.map((path, index) => (
                                <path
                                    key={index}
                                    d={path}
                                    stroke="#EBEBEB"
                                />
                            ))}
                        </svg>
                    </div>
                </motion.div>

                {/* Transition Overlay - FILLS ON TOP (z-40) */}
                <motion.div
                    className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center"
                    style={{
                        x: backgroundX,
                        y: backgroundY,
                    }}
                >
                    <div className="relative w-[5085px] h-[2750px] flex-shrink-0">
                        <svg
                            width="5085"
                            height="2750"
                            viewBox="0 0 5085 2750"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full"
                        >
                            {svgPaths.map((path, index) => (
                                <TransitionBlock
                                    key={index}
                                    path={path}
                                    index={index}
                                    total={svgPaths.length}
                                    randomOrder={randomOrder.current}
                                    progress={scrollYProgress}
                                />
                            ))}
                        </svg>
                    </div>
                </motion.div>

                {/* Content Wrapper - Absolute positioning for precise corner anchoring */}
                <div className="relative z-10 w-full h-full">

                    {/* Horizontally Scrolling Projects Row - Vertically Centered */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center overflow-visible">
                        <motion.div
                            style={{ x: projectsX, opacity: contentOpacity }}
                            className="flex gap-[40vw] md:gap-[50vw] w-max cursor-grab active:cursor-grabbing items-center"
                        >
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className="w-[65vw] md:w-[450px] lg:w-[500px] shrink-0"
                                >
                                    <div className="aspect-[3/4] bg-[#0004D9] rounded-none flex flex-col group overflow-hidden relative shadow-2xl transition-all duration-700 ease-out">
                                        {/* Top Image Section */}
                                        <div className="h-[60%] w-full bg-black/10 overflow-hidden relative border-b border-black/[0.1]">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 opacity-70" />
                                            <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
                                                <Image
                                                    src={`https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=1000&auto=format&fit=crop`}
                                                    alt={`Project ${item}`}
                                                    fill
                                                    className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                                                />
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between relative z-20">
                                            <h3 className="text-white font-black text-[clamp(2rem,5vw,3.5rem)] leading-[0.8] tracking-tight uppercase">
                                                EDOM<br />LIVES
                                            </h3>

                                            <div className="flex items-center gap-4 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] pt-6 border-t border-white/20">
                                                <span>Teaser</span>
                                                <span className="opacity-30">|</span>
                                                <span>00.46</span>
                                                <span className="opacity-30">|</span>
                                                <span>YouTube</span>
                                            </div>
                                        </div>

                                        {/* Subtle Overlay Pattern */}
                                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* SVG Works Heading - Anchored to Bottom Left corner */}
                    <motion.div
                        style={{ x: headerX, opacity: contentOpacity, scale: headingScale }}
                        className="absolute bottom-0 left-[-10vw] z-20 pointer-events-none"
                    >
                        <div className="relative w-[1150px] h-[350px] md:h-[450px] lg:h-[600px]">
                            <Image
                                src="/svgs/Works.svg"
                                alt="Works Heading"
                                fill
                                className="object-contain object-bottom"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
