"use client";
import Landing from "@/components/Landing";
import SequenceScroll from "@/components/SequenceScroll";
import SectionRenderer from "@/components/SectionRenderer";
import Footer from "@/components/sections/Footer";
import { EditableText } from "@/components/content/Editable";
import { EditableButton } from "@/components/content/EditableButton";
import { BrandMark } from "@/components/content/Brand";
import { useContentStore } from "@/components/content/ContentProvider";
import { ToolViewerProvider } from "@/components/ToolViewer";

const Divider = () => (
  <div className="max-w-6xl mx-auto px-6 md:px-20"><div className="divider" /></div>
);

/* Static, fully-editable version of the scroll-canvas hero overlays. */
function HeroEditable() {
  return (
    <section id="home" className="py-24 md:py-32 atmosphere">
      <div className="max-w-5xl mx-auto px-6 md:px-20 text-center">
        <div className="glass-pill inline-flex items-center gap-2 px-3 py-1.5 mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--highlight-rgb))" strokeWidth="1.6"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          <span className="font-outfit text-[11px]" style={{ color: "var(--text-secondary)" }}>Hero background = image sequence (shows in Preview &amp; live). Edit the overlay text below.</span>
        </div>
        <EditableText path="hero.eyebrow" as="p" className="font-outfit text-[11px] font-light tracking-[0.35em] uppercase mb-5" style={{ color: "rgb(var(--highlight-rgb))" }} />
        <EditableText path="hero.title" as="h1" className="font-outfit font-bold text-[clamp(3rem,9vw,6rem)] leading-[0.95] tracking-tightest" style={{ color: "var(--text)" }} />
        <EditableText path="hero.tagline" as="p" className="mt-4 font-outfit font-light text-[clamp(0.9rem,1.8vw,1.1rem)] tracking-wide max-w-md mx-auto" style={{ color: "var(--text-muted)" }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-16 text-left">
          <div className="glass-static p-6">
            <EditableText path="hero.approachLabel" as="p" className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase mb-3" style={{ color: "rgb(var(--highlight-rgb))" }} />
            <EditableText path="hero.approachText" as="p" className="font-outfit font-semibold text-[clamp(1.1rem,2.5vw,1.6rem)] leading-snug tracking-tight" style={{ color: "var(--text)" }} />
          </div>
          <div className="glass-static p-6">
            <EditableText path="hero.promiseLabel" as="p" className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase mb-3" style={{ color: "rgb(var(--highlight-rgb))" }} />
            <EditableText path="hero.promiseText" as="p" className="font-outfit font-semibold text-[clamp(1.1rem,2.5vw,1.6rem)] leading-snug tracking-tight" style={{ color: "var(--text)" }} />
          </div>
        </div>

        <div className="glass-static p-8 mt-5">
          <EditableText path="hero.ctaLead" as="p" className="font-outfit font-light text-sm mb-2" style={{ color: "var(--text-muted)" }} />
          <EditableText path="hero.ctaTitle" as="h2" className="font-outfit font-bold text-[clamp(1.5rem,4vw,2.6rem)] tracking-tightest mb-5" style={{ color: "var(--text)" }} />
          <EditableButton id="heroCta" labelPath="hero.ctaButton" variant="primary" defaultArrow={false} />
        </div>
      </div>
    </section>
  );
}

export default function OperatorBody() {
  const { editing } = useContentStore();
  return (
    <ToolViewerProvider>
    <main style={{ background: "var(--bg)" }}>
      {/* Opening / loading screen editor */}
      {editing && (
        <div className="max-w-6xl mx-auto px-6 md:px-20 pt-10">
          <p className="font-outfit text-[10px] font-medium tracking-[0.25em] uppercase mb-3" style={{ color: "var(--text-muted)" }}>Opening / loading screen</p>
          <div className="glass-static p-8 flex flex-col items-center gap-4 text-center">
            <BrandMark slot="opening" />
            <EditableText path="landing.loadingText" as="p" placeholder="Loading tagline" className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase" style={{ color: "var(--text-muted)" }} />
            <div className="bar-track"><div className="bar-fill" style={{ width: "60%" }} /></div>
            <p className="font-outfit text-[11px] font-light" style={{ color: "var(--text-muted)" }}>Click the logo to edit it (upload from device, text, or none).</p>
          </div>
        </div>
      )}

      {/* Independent logo editors (Header + Landing top-left). Center logo is edited on the splash below. */}
      {editing && (
        <div className="max-w-6xl mx-auto px-6 md:px-20 pt-10 flex flex-wrap gap-10 items-start">
          <div>
            <p className="font-outfit text-[10px] font-medium tracking-[0.25em] uppercase mb-3" style={{ color: "var(--text-muted)" }}>Header logo</p>
            <BrandMark slot="header" />
          </div>
          <div>
            <p className="font-outfit text-[10px] font-medium tracking-[0.25em] uppercase mb-3" style={{ color: "var(--text-muted)" }}>Landing top-left logo</p>
            <BrandMark slot="landingTop" />
          </div>
        </div>
      )}

      {/* Splash (editable) */}
      <Landing onPortfolio={() => {}} onContact={() => {}} soundOn={false} onToggleSound={() => {}} />
      <Divider />

      {/* Hero: editable text block while editing, real image sequence in Preview */}
      {editing ? (
        <>
          <HeroEditable />
          <Divider />
        </>
      ) : (
        <section id="home">
          <SequenceScroll onProgress={() => {}} onDone={() => {}} />
        </section>
      )}

      {/* Sections + sequences, driven by the same layout as the live site */}
      <SectionRenderer />
      <Footer />
    </main>
    </ToolViewerProvider>
  );
}
