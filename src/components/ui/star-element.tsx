"use client";

import { motion } from "framer-motion";

export default function StarElement({ className }: { className?: string }) {
    return (
        <div
            className={className}
        >
            <svg
                width="295"
                height="324"
                viewBox="0 0 295 324"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <g opacity="0.85">
                    <rect x="127.352" y="31" width="46" height="293" fill="#000000" />
                    <rect
                        x="53.3516"
                        y="24.2646"
                        width="46"
                        height="293"
                        transform="rotate(-31.836 53.3516 24.2646)"
                        fill="#000000"
                    />
                    <rect
                        x="47.3867"
                        y="243.476"
                        width="46"
                        height="293"
                        transform="rotate(-127.103 47.3867 243.476)"
                        fill="#000000"
                    />
                    <rect
                        y="123.872"
                        width="46"
                        height="293"
                        transform="rotate(-74.4549 0 123.872)"
                        fill="#000000"
                    />
                </g>
            </svg>
        </div>
    );
}
