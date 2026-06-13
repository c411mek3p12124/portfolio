"use client";
import { motion } from "motion/react";
import { useContentStore } from "@/components/content/ContentProvider";
import { EditableText, EditableLink, EditableImage, AddButton, RemoveButton } from "@/components/content/Editable";
import type { JourneyItem } from "@/lib/content";

export default function Career() {
  const { get, editing, addItem, removeItem } = useContentStore();
  const items = (get("journey.items") ?? []) as JourneyItem[];

  return (
    <section id="journey" className="py-28 md:py-40">
      <div className="max-w-5xl mx-auto px-6 md:px-20">
        <EditableText path="journey.eyebrow" as="p" className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase mb-4" style={{ color: "rgb(var(--highlight-rgb))" }} />
        <EditableText path="journey.title" as="h2" className="font-outfit font-bold text-[clamp(1.8rem,4vw,3rem)] tracking-tightest mb-14" style={{ color: "var(--text)" }} />

        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px" style={{ background: "linear-gradient(180deg, rgb(var(--highlight-rgb)), transparent)" }} />
          <div className="flex flex-col gap-8">
            {items.map((item, i) => (
              <motion.div key={i} className="flex gap-6 items-start" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <div className="w-10 h-10 rounded-full glass-static flex items-center justify-center flex-shrink-0 z-10">
                  <EditableText path={`journey.items.${i}.year`} as="span" className="font-outfit text-[10px] font-bold" style={{ color: "rgb(var(--highlight-rgb))" }} />
                </div>
                <div className="glass p-5 flex-1 relative">
                  <RemoveButton onClick={() => removeItem("journey.items", i)} />
                  <div className="flex items-center gap-2 mb-2">
                    <EditableText path={`journey.items.${i}.tag`} as="span" className="glass-pill px-2 py-0.5 font-outfit text-[9px] font-medium tracking-wider uppercase" style={{ color: "rgb(var(--highlight-rgb))" }} />
                  </div>
                  <EditableText path={`journey.items.${i}.title`} as="h3" className="font-outfit font-semibold text-base tracking-tight mb-1" style={{ color: "var(--text)" }} />
                  <EditableText path={`journey.items.${i}.desc`} as="p" className="font-outfit font-light text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }} />
                  <EditableImage path={`journey.items.${i}.image`} className="mt-3 rounded-lg w-full max-w-[280px]" placeholderLabel="Add photo" alt="" />
                  {!editing && item.link && (
                    <a href={item.link} target="_blank" rel="noreferrer" className="font-outfit text-[11px] font-medium mt-2 inline-flex items-center gap-1" style={{ color: "rgb(var(--highlight-rgb))" }}>
                      Learn more
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10" /></svg>
                    </a>
                  )}
                  <EditableLink path={`journey.items.${i}.link`} label="More" />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 ml-16">
            <AddButton label="Add milestone" onClick={() => addItem("journey.items", { year: "2026", title: "New milestone", desc: "Description", tag: "Milestone" })} />
          </div>
        </div>
      </div>
    </section>
  );
}
