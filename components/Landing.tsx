"use client";
import { motion } from "motion/react";
import { EditableText } from "./content/Editable";
import { EditableButton } from "./content/EditableButton";
import { useAudio } from "./AudioPlayer";

interface LandingProps {
  onPortfolio: () => void;
  onContact: () => void;
  soundOn?: boolean;
  onToggleSound?: () => void;
}

export default function Landing({ onPortfolio, onContact }: LandingProps) {
  const audio = useAudio();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 atmosphere relative overflow-hidden">
      {/* Music toggle top-right (plays the uploaded track) */}
      {audio.hasTrack && (
        <motion.button
          onClick={audio.toggle}
          className="icon-btn absolute top-6 right-6 md:right-12"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
          title={audio.playing ? "Pause music" : "Play music"}
        >
          {audio.playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          )}
        </motion.button>
      )}

      {/* Center content */}
      <div className="text-center max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <EditableText path="landing.title" as="h1" className="font-outfit font-bold text-[clamp(2rem,5vw,3rem)] tracking-tightest leading-tight mb-1" style={{ color: "var(--text)" }} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <EditableText path="landing.subtitle" as="p" className="font-outfit text-[12px] font-light mb-3" style={{ color: "var(--text-secondary)" }} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.45 }}>
          <EditableText path="landing.eyebrow" as="p" className="font-outfit text-[11px] font-light tracking-[0.3em] uppercase mb-8" style={{ color: "var(--text-muted)" }} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}>
          <EditableText path="landing.intro" as="p" className="font-outfit font-light text-base leading-relaxed mb-12 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }} />
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
        >
          <EditableButton id="landingPrimary" labelPath="landing.primaryCta" variant="primary" onClick={onPortfolio} />
          <EditableButton id="landingSecondary" labelPath="landing.secondaryCta" variant="outline" onClick={onContact} />
        </motion.div>
      </div>

      {/* Bottom credit */}
      <motion.div
        className="absolute bottom-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1 }}
      >
        <EditableText path="landing.credit" as="p" className="font-outfit text-[10px] font-light tracking-widest uppercase" style={{ color: "var(--text-muted)" }} />
      </motion.div>
    </div>
  );
}
