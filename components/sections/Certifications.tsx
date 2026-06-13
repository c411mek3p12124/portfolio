"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useContentStore } from "@/components/content/ContentProvider";
import { EditableText, EditableImage, EditableLink, AddButton, RemoveButton } from "@/components/content/Editable";
import type { CertificationItem } from "@/lib/content";

export default function Certifications() {
  const { get, editing, addItem, removeItem } = useContentStore();
  const items = (get("certifications.items") ?? []) as CertificationItem[];
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section id="certifications" className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6 md:px-20">
        <EditableText path="certifications.eyebrow" as="p" className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase mb-4" style={{ color: "rgb(var(--highlight-rgb))" }} />
        <EditableText path="certifications.title" as="h2" className="font-outfit font-bold text-[clamp(1.8rem,4vw,3rem)] tracking-tightest mb-3" style={{ color: "var(--text)" }} />
        <EditableText path="certifications.intro" as="p" className="font-outfit font-light text-base leading-relaxed mb-14 max-w-xl" style={{ color: "var(--text-secondary)" }} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((c, i) => (
            <motion.div key={i} className="glass p-5 flex flex-col relative" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.06 }}>
              <RemoveButton onClick={() => removeItem("certifications.items", i)} />

              {/* Certificate thumbnail */}
              <div
                className="mb-4 cursor-pointer"
                onClick={() => { if (!editing && c.image) setLightbox(c.image); }}
              >
                <EditableImage
                  path={`certifications.items.${i}.image`}
                  className="w-full h-40 object-cover rounded-xl"
                  placeholderLabel="Certificate image"
                  alt={c.name}
                />
              </div>

              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <EditableText path={`certifications.items.${i}.field`} as="span" className="glass-pill px-2.5 py-1 font-outfit text-[10px] font-medium tracking-wider uppercase" style={{ color: "rgb(var(--highlight-rgb))" }} />
                <EditableText path={`certifications.items.${i}.year`} as="span" className="font-outfit text-[11px] font-light" style={{ color: "var(--text-muted)" }} />
              </div>
              <EditableText path={`certifications.items.${i}.name`} as="h3" className="font-outfit font-semibold text-[15px] tracking-tight mb-1 leading-snug" style={{ color: "var(--text)" }} />
              <EditableText path={`certifications.items.${i}.issuer`} as="p" className="font-outfit font-light text-sm" style={{ color: "var(--text-secondary)" }} />

              {!editing && c.image && (
                <button onClick={() => setLightbox(c.image)} className="font-outfit text-[11px] font-medium mt-3 inline-flex items-center gap-1 self-start" style={{ color: "rgb(var(--highlight-rgb))" }}>
                  View certificate
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10" /></svg>
                </button>
              )}
              {!editing && c.link && (
                <a href={c.link} target="_blank" rel="noreferrer" className="font-outfit text-[11px] font-medium mt-2 inline-flex items-center gap-1 self-start" style={{ color: "rgb(var(--highlight-rgb))" }}>
                  Verify credential
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10" /></svg>
                </a>
              )}
              <EditableLink path={`certifications.items.${i}.link`} label="Credential" />
            </motion.div>
          ))}
        </div>

        <div className="mt-8">
          <AddButton label="Add certification" onClick={() => addItem("certifications.items", { name: "Certification name", field: "Field / area", issuer: "Issuing organization", year: "2026", image: "" })} />
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}>
            <motion.img src={lightbox} alt="Certificate" className="max-w-full max-h-[88vh] rounded-xl object-contain" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} />
            <button className="absolute top-6 right-6 icon-btn" onClick={() => setLightbox(null)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
