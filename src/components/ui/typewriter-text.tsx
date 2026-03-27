"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TypewriterText = ({
  title,
  text,
  isActive,
  isPaused,
  variant = "blue",
  isStatic = false,
  className = ""
}: {
  title: string;
  text: string;
  isActive: boolean;
  isPaused?: boolean;
  variant?: "blue" | "grey" | "light";
  isStatic?: boolean;
  className?: string;
}) => {
  const [displayedText, setDisplayedText] = useState(isStatic ? text : "");
  const [currentText, setCurrentText] = useState(text);

  const iconColor = variant === "light" ? "#0066FF" : (variant === "blue" ? "#B0B8F2" : "#D9D9D9");
  const textColor = variant === "light" ? "text-black" : (variant === "blue" ? "text-[#CAD9FB]" : "text-[#D9D9D9]");
  const cursorColor = variant === "light" ? "bg-black" : (variant === "blue" ? "bg-[#CAD9FB]" : "bg-[#D9D9D9]");

  useEffect(() => {
    // Only reset displayed text if the actual content changes
    if (text && text !== currentText) {
      setDisplayedText(isStatic ? text : "");
      setCurrentText(text);
    }
  }, [text, currentText, isStatic]);

  useEffect(() => {
    if (isStatic) return; // Skip animation if static
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
  }, [text, isActive, displayedText.length, isStatic]);

  return (
    <div className={`flex flex-col mb-5 mt-15 text-left pl-2 md:pl-5 pr-0 translate-x-[25px] md:translate-x-[75px] min-w-[300px] w-full max-w-[648px] ${className}`}>
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
          <rect x="4.9375" width="3" height="28" rx="1" transform="rotate(7.90712 4.9375 0)" fill={iconColor} />
          <rect x="11.25" y="5" width="3" height="18.5438" rx="0.5" transform="rotate(8.86843 11.25 5)" fill={iconColor} />
          <rect y="11" width="16" height="3" rx="1" fill={iconColor} />
          <rect y="16" width="16" height="3" rx="1" fill={iconColor} />
        </svg>

        {/* Title Roll Up Animation */}
        <div className="overflow-hidden flex items-center h-full">
          <AnimatePresence mode="wait">
            {isActive && title ? (
              <motion.h3
                key={title}
                initial={isStatic ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`${variant === 'light' ? 'text-black' : (variant === 'grey' ? 'text-[#D9D9D9]' : 'text-white')} font-bold tracking-wider text-[14px] uppercase mt-1 leading-none`}
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
              initial={isStatic ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`${textColor} opacity-85 font-medium text-[17px] leading-[150%] tracking-[0.04em]`}
            >
              {displayedText}
              {!isStatic && (
                <span className={`inline-block w-[6px] h-[12px] ${cursorColor} ml-[2px] mb-[-1px] animate-blink-fast`} />
              )}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TypewriterText;
