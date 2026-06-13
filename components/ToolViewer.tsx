"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ToolViewerCtx {
  open: (slug: string, title: string) => void;
}
const Ctx = createContext<ToolViewerCtx>({ open: () => {} });
export const useToolViewer = () => useContext(Ctx);

/** Opens an independent tool as a full-page view INSIDE the portfolio
    (an <iframe> of the tool's static HTML) with a Back button — no new tab. */
export function ToolViewerProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<{ slug: string; title: string } | null>(null);

  return (
    <Ctx.Provider value={{ open: (slug, title) => setActive({ slug, title }) }}>
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            className="tool-viewer"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="tool-viewer-bar">
              <button className="tool-back" onClick={() => setActive(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back to portfolio
              </button>
              <span className="tool-viewer-title">{active.title}</span>
              <a className="tool-newtab" href={`/tools/${active.slug}/index.html`} target="_blank" rel="noreferrer" title="Open in new tab">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10" /></svg>
              </a>
            </div>
            <iframe key={active.slug} src={`/tools/${active.slug}/index.html`} title={active.title} className="tool-frame" />
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
