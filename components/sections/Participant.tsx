"use client";
import { motion } from "motion/react";
import { useContentStore } from "@/components/content/ContentProvider";
import { EditableText, EditableImage, EditableLink, AddButton, RemoveButton } from "@/components/content/Editable";
import type { ParticipantItem } from "@/lib/content";

export default function Participant() {
  const { get, addItem, removeItem } = useContentStore();
  const items = (get("participant.items") ?? []) as ParticipantItem[];

  return (
    <section id="participant" className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6 md:px-20">
        <EditableText path="participant.eyebrow" as="p" className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase mb-4" style={{ color: "rgb(var(--highlight-rgb))" }} />
        <EditableText path="participant.title" as="h2" className="font-outfit font-bold text-[clamp(1.8rem,4vw,3rem)] tracking-tightest mb-3" style={{ color: "var(--text)" }} />
        <EditableText path="participant.intro" as="p" className="font-outfit font-light text-base leading-relaxed mb-14 max-w-xl" style={{ color: "var(--text-secondary)" }} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((a, i) => (
            <motion.div key={i} className="glass p-5 flex flex-col relative" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}>
              <RemoveButton onClick={() => removeItem("participant.items", i)} />

              <div className="mb-4">
                <EditableImage path={`participant.items.${i}.image`} className="w-full h-36 object-cover rounded-xl" placeholderLabel="Photo (optional)" alt={a.title} />
              </div>

              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <EditableText path={`participant.items.${i}.type`} as="span" className="glass-pill px-2.5 py-1 font-outfit text-[10px] font-medium tracking-wider uppercase" style={{ color: "rgb(var(--highlight-rgb))" }} />
                <EditableText path={`participant.items.${i}.date`} as="span" className="font-outfit text-[11px] font-light" style={{ color: "var(--text-muted)" }} />
              </div>
              <EditableText path={`participant.items.${i}.title`} as="h3" className="font-outfit font-semibold text-[15px] tracking-tight mb-1 leading-snug" style={{ color: "var(--text)" }} />
              <EditableText path={`participant.items.${i}.org`} as="p" className="font-outfit text-[12px] font-light mb-2" style={{ color: "var(--text-secondary)" }} />
              <EditableText path={`participant.items.${i}.desc`} as="p" className="font-outfit font-light text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }} />
              <EditableLink path={`participant.items.${i}.link`} label="Link" />
            </motion.div>
          ))}
        </div>

        <div className="mt-8">
          <AddButton label="Add activity" onClick={() => addItem("participant.items", { title: "Activity / event name", type: "Seminar", org: "Organizer", date: "2026", desc: "Short description.", image: "", link: "" })} />
        </div>
      </div>
    </section>
  );
}
