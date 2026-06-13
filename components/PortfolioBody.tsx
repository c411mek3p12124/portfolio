"use client";
import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import FullscreenMenu from "@/components/FullscreenMenu";
import SequenceScroll from "@/components/SequenceScroll";
import SectionRenderer from "@/components/SectionRenderer";
import Footer from "@/components/sections/Footer";
import { ToolViewerProvider } from "@/components/ToolViewer";

export default function PortfolioBody({ onBack }: { onBack: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  return (
    <ToolViewerProvider>
    <SmoothScroll>
      <Header
        onMenuToggle={() => setMenuOpen(!menuOpen)}
        isMenuOpen={menuOpen}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn(!soundOn)}
      />
      <FullscreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onBack={onBack} />

      <main>
        {/* Hero sequence */}
        <section id="home">
          <SequenceScroll onProgress={() => {}} onDone={() => {}} />
        </section>

        {/* Data-driven sections + sequences (managed in the operator) */}
        <div className="relative z-10" style={{ background: "var(--bg)" }}>
          <SectionRenderer />
          <Footer />
        </div>
      </main>
    </SmoothScroll>
    </ToolViewerProvider>
  );
}
