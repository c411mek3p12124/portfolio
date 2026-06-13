"use client";
import type { CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useContentStore } from "./content/ContentProvider";
import { SocialIcon } from "./content/SocialIcon";
import { EditableText, EditableLink, AddButton, RemoveButton } from "./content/Editable";

export default function FullscreenMenu({ isOpen, onClose, onBack }: { isOpen: boolean; onClose: () => void; onBack: () => void }) {
  const { get, editing, addItem, removeItem, getStyle } = useContentStore();
  const nav = (get("footer.nav") ?? []) as { label: string; id: string }[];
  const social = (get("social") ?? []) as { label: string; url: string }[];
  const email = get("brand.email");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[90] flex items-center" style={{ background: "var(--overlay)" }}
          initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}>
          <div className="w-full px-8 md:px-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-16 max-h-screen overflow-y-auto py-16">
            <nav className="flex flex-col gap-2">
              {nav.map((l, i) => (
                <motion.div key={i} className="flex items-baseline" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}>
                  <span className="font-light text-sm mr-3" style={{ color: "var(--text-muted)" }}>0{i + 1}</span>
                  {editing
                    ? <EditableText path={`footer.nav.${i}.label`} as="span" className="menu-link" />
                    : <a href={`#${l.id}`} className="menu-link" style={getStyle(`footer.nav.${i}.label`) as CSSProperties} onClick={onClose}>{l.label}</a>}
                </motion.div>
              ))}
              {!editing && (
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
                  <button className="menu-link text-left" onClick={() => { onClose(); onBack(); }}>
                    <span className="font-light text-sm mr-3 align-top" style={{ color: "var(--text-muted)" }}>←</span>Back to Home
                  </button>
                </motion.div>
              )}
            </nav>
            <motion.div className="flex flex-col gap-5 w-full md:w-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
              <EditableText path="footer.connectLabel" as="p" className="font-outfit text-[10px] font-light tracking-[0.3em] uppercase" style={{ color: "var(--text-muted)" }} />
              {editing ? (
                <div className="flex flex-col gap-3">
                  {social.map((s, i) => (
                    <div key={i} className="glass-static p-3 relative" style={{ minWidth: 240 }}>
                      <RemoveButton onClick={() => removeItem("social", i)} />
                      <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                        <SocialIcon label={s.label} />
                        <EditableText path={`social.${i}.label`} as="span" className="font-outfit text-sm font-medium" style={{ color: "var(--text)" }} />
                      </div>
                      <EditableLink path={`social.${i}.url`} label="URL" />
                    </div>
                  ))}
                  <AddButton label="Add social link" onClick={() => addItem("social", { label: "New", url: "" })} />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {social.filter((s) => s.url).map((s) => <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="font-outfit text-sm font-light hover:translate-x-1 transition-transform inline-flex items-center gap-2.5" style={{ color: "var(--text-secondary)" }}><SocialIcon label={s.label} />{s.label}</a>)}
                </div>
              )}
              {editing
                ? <EditableText path="brand.email" as="span" className="font-outfit text-sm font-light mt-3" style={{ color: "rgb(var(--highlight-rgb))" }} />
                : <a href={`mailto:${email}`} className="font-outfit text-sm font-light mt-3" style={{ color: "rgb(var(--highlight-rgb))" }}>{email}</a>}
            </motion.div>
          </div>

          {editing && (
            <button onClick={onClose} className="icon-btn absolute top-6 right-6" title="Close menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
