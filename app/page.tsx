"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ThemeProvider from "@/components/ThemeProvider";
import ContentProvider from "@/components/content/ContentProvider";
import { LightboxProvider } from "@/components/content/Lightbox";
import { AudioProvider } from "@/components/AudioPlayer";
import { ThemeApplier } from "@/components/content/StylePanels";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Landing from "@/components/Landing";
import Header from "@/components/Header";
import FullscreenMenu from "@/components/FullscreenMenu";
import SequenceScroll from "@/components/SequenceScroll";
import PortfolioBody from "@/components/PortfolioBody";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

type View = "loading" | "landing" | "portfolio" | "contact";

export default function Home() {
  const [view, setView] = useState<View>("loading");
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  const handleLoadDone = () => setView("landing");

  return (
    <ThemeProvider>
      <ContentProvider>
        <LightboxProvider>
        <AudioProvider>
        <ThemeApplier />
        {/* ── 01. Preloader ── */}
        <Preloader progress={progress} isComplete={view !== "loading"} />

        <AnimatePresence mode="wait">
          {/* ── 02. Landing/Splash ── */}
          {view === "landing" && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
              <Landing
                onPortfolio={() => setView("portfolio")}
                onContact={() => setView("contact")}
                soundOn={soundOn}
                onToggleSound={() => setSoundOn(!soundOn)}
              />
            </motion.div>
          )}

          {/* ── Portfolio ── */}
          {view === "portfolio" && (
            <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
              <PortfolioBody onBack={() => setView("landing")} />
            </motion.div>
          )}

          {/* ── Contact Only ── */}
          {view === "contact" && (
            <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
              <SmoothScroll>
                <Header
                  onMenuToggle={() => setMenuOpen(!menuOpen)}
                  isMenuOpen={menuOpen}
                  soundOn={soundOn}
                  onToggleSound={() => setSoundOn(!soundOn)}
                />
                <FullscreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onBack={() => { setMenuOpen(false); setView("landing"); }} />
                <main className="pt-20" style={{ background: "var(--bg)" }}>
                  <Contact />
                  <Footer />
                </main>
              </SmoothScroll>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden: preload hero images on mount */}
        {view === "loading" && (
          <div className="hidden">
            <SequenceScroll onProgress={setProgress} onDone={handleLoadDone} />
          </div>
        )}
        </AudioProvider>
        </LightboxProvider>
      </ContentProvider>
    </ThemeProvider>
  );
}
