"use client";
import { motion, AnimatePresence } from "motion/react";
import { useContentStore } from "./content/ContentProvider";
import { LogoDisplay } from "./content/Brand";

export default function Preloader({ progress, isComplete }: { progress: number; isComplete: boolean }) {
  const { get } = useContentStore();
  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div className="preloader" exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}>
          <div className="flex flex-col items-center gap-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-center">
              <div className="mx-auto mb-4 flex items-center justify-center min-h-[64px]">
                <LogoDisplay slot="opening" imgClass="w-16 h-16 object-contain" textClass="font-outfit font-bold text-2xl" />
              </div>
              <p className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase" style={{ color: "var(--text-muted)" }}>{get("landing.loadingText")}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }} className="flex flex-col items-center gap-3">
              <div className="bar-track"><div className="bar-fill" style={{ width: `${progress}%` }} /></div>
              <span className="font-outfit text-[11px] font-light tracking-[0.15em] tabular-nums" style={{ color: "var(--text-muted)" }}>{Math.round(progress)}%</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
