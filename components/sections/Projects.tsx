"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useContentStore } from "@/components/content/ContentProvider";
import { EditableText, EditableImage, EditableTags, EditableLink, AddButton, RemoveButton } from "@/components/content/Editable";
import type { VentureItem } from "@/lib/content";

export default function Projects() {
  const { get, editing, addItem, removeItem } = useContentStore();
  const cats = (get("ventures.categories") ?? ["All"]) as string[];
  const items = (get("ventures.items") ?? []) as VentureItem[];
  const [cat, setCat] = useState("All");

  const filtered = items
    .map((p, idx) => ({ p, idx }))
    .filter(({ p }) => editing || cat === "All" || p.category === cat);

  return (
    <section id="work" className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6 md:px-20">
        <EditableText path="ventures.eyebrow" as="p" className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase mb-4" style={{ color: "rgb(var(--highlight-rgb))" }} />
        <EditableText path="ventures.title" as="h2" className="font-outfit font-bold text-[clamp(1.8rem,4vw,3rem)] tracking-tightest mb-10" style={{ color: "var(--text)" }} />

        {!editing && (
          <div className="flex flex-wrap gap-2 mb-10">
            {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`glass-pill px-4 py-2 font-outfit text-[13px] font-light ${cat === c ? "active" : ""}`}>{c}</button>)}
          </div>
        )}

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map(({ p, idx }) => (
              <motion.div key={idx} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}
                className="glass p-6 flex flex-col relative">
                <RemoveButton onClick={() => removeItem("ventures.items", idx)} />

                {(editing || p.image) && (
                  <div className="mb-5">
                    <EditableImage path={`ventures.items.${idx}.image`} className="w-full h-44 object-cover rounded-xl" placeholderLabel="Cover / mockup (optional)" alt={p.name} />
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 mb-3">
                  <EditableText path={`ventures.items.${idx}.category`} as="span" className="font-outfit text-[10px] font-light tracking-[0.25em] uppercase" style={{ color: "rgb(var(--highlight-rgb))" }} />
                  <EditableText path={`ventures.items.${idx}.status`} as="span" className="glass-pill px-2.5 py-1 font-outfit text-[10px] font-light" style={{ color: "var(--text-muted)" }} />
                </div>

                <EditableText path={`ventures.items.${idx}.name`} as="h3" className="font-outfit font-bold text-xl tracking-tight mb-1" style={{ color: "var(--text)" }} />
                <EditableText path={`ventures.items.${idx}.tagline`} as="p" className="font-outfit font-light text-sm mb-4" style={{ color: "var(--text-secondary)" }} />
                <EditableText path={`ventures.items.${idx}.description`} as="p" className="font-outfit font-light text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }} />

                <div className="flex flex-col gap-1.5 mb-4">
                  <div className="flex gap-2">
                    <span className="font-outfit text-[11px] font-medium tracking-wider uppercase flex-shrink-0" style={{ color: "var(--text-muted)" }}>Role</span>
                    <EditableText path={`ventures.items.${idx}.role`} as="span" className="font-outfit text-[13px] font-light" style={{ color: "var(--text-secondary)" }} />
                  </div>
                </div>

                <div className="glass-static p-3 mb-4">
                  <p className="font-outfit text-[10px] font-medium tracking-wider uppercase mb-1" style={{ color: "rgb(var(--highlight-rgb))" }}>↗ Impact</p>
                  <EditableText path={`ventures.items.${idx}.impact`} as="p" className="font-outfit font-light text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }} />
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  <EditableTags path={`ventures.items.${idx}.tech`} />
                </div>

                <div className="mt-auto">
                  <EditableLink path={`ventures.items.${idx}.link`} label="Visit project" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-8">
          <AddButton label="Add venture / project" onClick={() => addItem("ventures.items", { name: "New Project", category: "Web", tagline: "Short tagline", description: "Description", status: "In progress", role: "Your role", impact: "The impact and results.", tech: ["Tech"], link: "", image: "" })} />
        </div>
      </div>
    </section>
  );
}
