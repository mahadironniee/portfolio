import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "@fontsource/kaushan-script"; // Keeping just in case
import "@fontsource/smooch";
import "./globals.css";

import SmoothScroll from "@/components/ui/smooth-scroll";
import ScrollToTop from "@/components/scroll-to-top";
import PageTransition from "@/components/layout/page-transition";
import Navbar from "@/components/layout/navbar";

const dmSans = DM_Sans({ subsets: ["latin"] });
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Design with Clarity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Stick+No+Bills:wght@400;600&display=swap" rel="stylesheet" />
        <style>{`:root { --font-post-no-bills: 'Stick No Bills', sans-serif; }`}</style>
        {/* Blocking script to prevent hydration flicker on Home page preloader */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              if (window.location.pathname === '/' || window.location.pathname === '') {
                document.documentElement.setAttribute('data-preloading', 'true');
                document.documentElement.setAttribute('data-navbar-wireframe', 'true');
                document.documentElement.setAttribute('data-logo-wireframe', 'true');
              }
            } catch (e) {}
          })();
        ` }} />
      </head>
      <body
        className={`antialiased font-sans bg-black text-white ${dmSans.className} ${inter.variable}`}
      >
        <ScrollToTop />
        <SmoothScroll />
        {/* Global Hue Blend Overlay */}
        <div className="fixed inset-0 z-50 pointer-events-none bg-[#76CA00] opacity-[0.16] mix-blend-hue" />

        <Navbar />

        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
