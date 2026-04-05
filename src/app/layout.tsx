import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "@fontsource/kaushan-script"; // Keeping just in case
import "@fontsource/smooch";
import "./globals.css";

import SmoothScroll from "@/components/ui/smooth-scroll";
import ScrollToTop from "@/components/scroll-to-top";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

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
        {/* Preloader state script */}
        <script dangerouslySetInnerHTML={{
          __html: `
          (function() {
            try {
              if ((window.location.pathname === '/' || window.location.pathname === '') && !window.__PRELOADER_DONE__) {
                document.documentElement.setAttribute('data-preloading', 'true');
                document.documentElement.setAttribute('data-navbar-wireframe', 'true');
                document.documentElement.setAttribute('data-logo-wireframe', 'true');
              }
            } catch (e) {}
          })();
        ` }} />
        {/* ── Zoom Lock ─────────────────────────────────────────────────────────
          Blocks every zoom path available to the user:

          1. Ctrl + Scroll      → wheel event with passive:false + preventDefault
          2. Ctrl + + / - / 0  → keydown preventDefault
          3. Address-bar zoom   → watch devicePixelRatio via matchMedia; when it
                                  drifts from baseline, apply an inverse zoom on
                                  <body> (not <html>) so fixed/absolute layouts
                                  are unaffected by html-level sizing changes.
        ──────────────────────────────────────────────────────────────────────── */}
        <script dangerouslySetInnerHTML={{
          __html: `
          (function() {
            /*
             * How browser-zoom detection works:
             *   window.screen.width  = screen width in CSS px  → NOT affected by browser zoom
             *   window.innerWidth    = viewport width in CSS px → shrinks as zoom increases
             *   Their ratio = the actual browser zoom multiplier, independent of OS DPI scaling.
             *
             * Example: user is at 125% browser zoom on a 1920px screen
             *   screen.width  = 1920
             *   innerWidth    = 1536  (1920 / 1.25)
             *   ratio         = 1.25  → we apply body { zoom: 0.8 } to snap back to 100%
             */
            function getBrowserZoom() {
              var sw = window.screen.width;
              var vw = window.innerWidth;
              if (!sw || !vw || vw <= 0) return 1;
              var z = sw / vw;
              // Clamp: ignore extreme values that indicate a non-fullscreen window
              if (z < 0.25 || z > 5) return 1;
              return z;
            }

            function applyZoomCorrection() {
              var zoom = getBrowserZoom();
              if (Math.abs(zoom - 1) < 0.04) {
                // Already at ~100% — remove any override
                document.body && document.body.style.removeProperty('zoom');
              } else {
                // Counter-zoom: 125% browser zoom → body zoom 0.8 → net = 100%
                document.body && (document.body.style.zoom = String(1 / zoom));
              }
            }

            /* ① Snap to 100% immediately on page load */
            applyZoomCorrection();

            /* ② Block Ctrl + Scroll wheel zoom */
            window.addEventListener('wheel', function(e) {
              if (e.ctrlKey) { e.preventDefault(); }
            }, { passive: false });

            /* ③ Block keyboard zoom: Ctrl + Plus / Minus / Zero */
            window.addEventListener('keydown', function(e) {
              if (e.ctrlKey && (
                e.key === '+' || e.key === '=' || e.key === '-' ||
                e.key === '_' || e.key === '0' ||
                e.keyCode === 187 || e.keyCode === 189 || e.keyCode === 48
              )) { e.preventDefault(); }
            });

            /* ④ Re-apply correction if zoom somehow changes (address bar, etc.) */
            window.addEventListener('resize', applyZoomCorrection);

            /* ⑤ matchMedia on DPR catches zoom changes that don't fire resize */
            function watchDpr(dpr) {
              var mq = window.matchMedia('(resolution: ' + dpr + 'dppx)');
              mq.addEventListener('change', function() {
                applyZoomCorrection();
                watchDpr(window.devicePixelRatio);
              }, { once: true });
            }
            watchDpr(window.devicePixelRatio);
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

        {children}
        <Footer />
      </body>
    </html>
  );
}
