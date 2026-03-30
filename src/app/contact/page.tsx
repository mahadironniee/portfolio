"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CursorBrush } from "@/components/ui/cursor-brush";
import BracketButton from "@/components/ui/bracket-button";
import { ArrowRight, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message transmitted successfully.");
  };

  return (
    <div className="relative min-h-screen bg-white text-black pt-[180px] pb-20 px-4 md:px-8 selection:bg-[#0066FF] selection:text-white light-bg-nav-trigger">
      <CursorBrush />
      
      {/* Background Grid/Wireframe Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-black" />
        <div className="absolute top-0 left-2/4 w-[1px] h-full bg-black" />
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-black" />
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-black" />
        <div className="absolute top-2/4 left-0 w-full h-[1px] bg-black" />
        <div className="absolute top-3/4 left-0 w-full h-[1px] bg-black" />
      </div>

      <main className="max-w-7xl mx-auto relative z-10 lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left Side: Headline & Info */}
        <div className="lg:col-span-5 mb-16 lg:mb-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[12px] font-bold tracking-[0.4em] uppercase opacity-40 mb-6 block">
              Channel Open
            </span>
            <h1 
              className="text-[80px] md:text-[120px] lg:text-[140px] leading-[0.85] font-[800] uppercase tracking-[-0.02em] mb-12"
              style={{ fontFamily: 'var(--font-post-no-bills)' }}
            >
              TRANSMIT<br />DATA
            </h1>
            
            <div className="space-y-8 max-w-sm">
              <p className="text-[18px] leading-relaxed opacity-60">
                Connection established. Send your inquiries, projects, or conceptual ideas through the interface.
              </p>
              
              <div className="space-y-4 pt-4 border-t border-black/10">
                <div className="flex justify-between items-center group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                   <span className="text-[12px] font-bold uppercase tracking-[0.2em]">LinkedIn</span>
                   <ArrowRight size={16} />
                </div>
                <div className="flex justify-between items-center group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                   <span className="text-[12px] font-bold uppercase tracking-[0.2em]">Behance</span>
                   <ArrowRight size={16} />
                </div>
                <div className="flex justify-between items-center group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                   <span className="text-[12px] font-bold uppercase tracking-[0.2em]">Instagram</span>
                   <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:col-start-7 lg:col-span-6">
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
            {/* Name Field */}
            <div className="relative group">
              <label 
                className={`text-[10px] uppercase tracking-[0.3em] font-bold mb-3 block transition-all duration-300 ${isFocused === 'name' ? 'text-[#0066FF]' : 'opacity-40'}`}
              >
                01 IDENTIFIER (Name)
              </label>
              <input 
                type="text"
                required
                className="w-full bg-transparent border-b-2 border-black/10 py-4 text-[24px] outline-none focus:border-[#0066FF] transition-colors"
                onFocus={() => setIsFocused('name')}
                onBlur={() => setIsFocused(null)}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <AnimatePresence>
                {isFocused === 'name' && (
                  <motion.div 
                    layoutId="focus-bar"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0066FF] z-10"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Email Field */}
            <div className="relative group">
              <label 
                className={`text-[10px] uppercase tracking-[0.3em] font-bold mb-3 block transition-all duration-300 ${isFocused === 'email' ? 'text-[#0066FF]' : 'opacity-40'}`}
              >
                02 RETURN_ADDRESS (Email)
              </label>
              <input 
                type="email"
                required
                className="w-full bg-transparent border-b-2 border-black/10 py-4 text-[24px] outline-none focus:border-[#0066FF] transition-colors"
                onFocus={() => setIsFocused('email')}
                onBlur={() => setIsFocused(null)}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Message Field */}
            <div className="relative group">
              <label 
                className={`text-[10px] uppercase tracking-[0.3em] font-bold mb-3 block transition-all duration-300 ${isFocused === 'message' ? 'text-[#0066FF]' : 'opacity-40'}`}
              >
                03 PAYLOAD (Message)
              </label>
              <textarea 
                rows={4}
                required
                className="w-full bg-transparent border-b-2 border-black/10 py-4 text-[24px] outline-none focus:border-[#0066FF] transition-colors resize-none"
                onFocus={() => setIsFocused('message')}
                onBlur={() => setIsFocused(null)}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <BracketButton
                type="submit"
                color="white"
                initialBgColor="#000000"
                borderColor="#FFFFFF"
                hoverBgColor="#FFFFFF"
                className="w-full"
              >
                Transmit Message
              </BracketButton>
            </div>
          </motion.form>
          
          {/* Bottom Technical Specs */}
          <div className="mt-20 flex justify-between items-end opacity-20 text-[10px] font-mono">
            <div>
              LAT_LON: 23.8103° N, 90.4125° E<br />
              SYS_TIME: {new Date().toLocaleTimeString()}
            </div>
            <div className="text-right">
              VER: 2.0.4-conceptual<br />
              ENCRYPT: AES-256-GCM
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
