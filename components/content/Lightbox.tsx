"use client";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

const Ctx = createContext<{ open: (src: string) => void }>({ open: () => {} });
export function useLightbox() { return useContext(Ctx); }

/* Full-screen image popup. Any operator-input image opens here on click.
   Rendered through a portal on <body> so it always sits above the header
   and every other stacking context. */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [src, setSrc] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const open = useCallback((s: string) => { if (s) setSrc(s); }, []);
  const close = useCallback(() => setSrc(null), []);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, close]);

  const overlay = (
    <AnimatePresence>
      {src && (
        <motion.div className="lightbox-overlay" onClick={close}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <motion.img src={src} alt="" className="lightbox-img" onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }} />
          <button className="lightbox-close" onClick={close} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {mounted ? createPortal(overlay, document.body) : null}
    </Ctx.Provider>
  );
}
