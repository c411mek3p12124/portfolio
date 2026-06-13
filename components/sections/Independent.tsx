"use client";
import { motion } from "motion/react";
import { useContentStore } from "@/components/content/ContentProvider";
import { EditableText, EditableImage, EditableTags, EditableLink, AddButton, RemoveButton } from "@/components/content/Editable";
import { useToolViewer } from "@/components/ToolViewer";
import type { IndependentItem } from "@/lib/content";

export default function Independent() {
  const { get, editing, addItem, removeItem, set } = useContentStore();
  const items = (get("independent.items") ?? []) as IndependentItem[];
  const { open } = useToolViewer();

  return (
    <section id="independent" className="py-28 md:py-40 atmosphere">
      <div className="max-w-6xl mx-auto px-6 md:px-20">
        <EditableText path="independent.eyebrow" as="p" className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase mb-4" style={{ color: "rgb(var(--highlight-rgb))" }} />
        <EditableText path="independent.title" as="h2" className="font-outfit font-bold text-[clamp(1.8rem,4vw,3rem)] tracking-tightest mb-3" style={{ color: "var(--text)" }} />
        <EditableText path="independent.intro" as="p" className="font-outfit font-light text-base leading-relaxed mb-10 max-w-xl" style={{ color: "var(--text-secondary)" }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((p, idx) => (
            <motion.div key={idx} className="glass p-6 flex flex-col relative" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: (idx % 2) * 0.06 }}>
              <RemoveButton onClick={() => removeItem("independent.items", idx)} />

              {(editing || p.image) && (
                <div className="mb-5">
                  <EditableImage path={`independent.items.${idx}.image`} className="w-full h-44 object-cover rounded-xl" placeholderLabel="Cover (optional)" alt={p.name} />
                </div>
              )}

              <div className="flex items-center justify-between gap-3 mb-3">
                <EditableText path={`independent.items.${idx}.category`} as="span" className="font-outfit text-[10px] font-light tracking-[0.25em] uppercase" style={{ color: "rgb(var(--highlight-rgb))" }} />
                <span className="glass-pill px-2.5 py-1 font-outfit text-[10px] font-medium tracking-wider uppercase" style={{ color: p.kind === "tool" ? "rgb(var(--highlight-rgb))" : "var(--text-muted)" }}>
                  {p.kind === "tool" ? "Interactive tool" : "Project"}
                </span>
              </div>

              <EditableText path={`independent.items.${idx}.name`} as="h3" className="font-outfit font-bold text-xl tracking-tight mb-1" style={{ color: "var(--text)" }} />
              <EditableText path={`independent.items.${idx}.tagline`} as="p" className="font-outfit font-light text-sm mb-4" style={{ color: "var(--text-secondary)" }} />
              <EditableText path={`independent.items.${idx}.description`} as="p" className="font-outfit font-light text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }} />

              <div className="glass-static p-3 mb-4">
                <p className="font-outfit text-[10px] font-medium tracking-wider uppercase mb-1" style={{ color: "rgb(var(--highlight-rgb))" }}>↗ Impact</p>
                <EditableText path={`independent.items.${idx}.impact`} as="p" className="font-outfit font-light text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }} />
              </div>

              <div className="flex flex-wrap gap-2 mb-5"><EditableTags path={`independent.items.${idx}.tech`} /></div>

              {/* Operator controls: kind toggle + tool slug + ready */}
              {editing && (
                <div className="img-tools mb-4">
                  <span className="img-tool-label">Type</span>
                  {(["tool", "info"] as const).map((k) => (
                    <button key={k} type="button" className={`img-tool-btn ${(p.kind ?? "info") === k ? "on" : ""}`} onClick={() => set(`independent.items.${idx}.kind`, k)}>{k === "tool" ? "Tool" : "Info"}</button>
                  ))}
                  {p.kind === "tool" && (
                    <>
                      <span className="img-tool-sep" />
                      <span className="img-tool-label">Slug</span>
                      <EditableText path={`independent.items.${idx}.tool`} as="span" placeholder="tax-calculator" className="font-outfit text-[12px]" style={{ color: "rgb(var(--highlight-rgb))" }} />
                      <button type="button" className={`img-tool-btn ${p.ready !== false ? "on" : ""}`} onClick={() => set(`independent.items.${idx}.ready`, p.ready === false)}>{p.ready !== false ? "Ready" : "Coming soon"}</button>
                    </>
                  )}
                </div>
              )}

              {/* Action */}
              <div className="mt-auto">
                {p.kind === "tool" ? (
                  editing ? (
                    <span className="font-outfit text-[12px] font-light" style={{ color: "var(--text-muted)" }}>Opens in-portfolio when live{p.ready === false ? " (marked coming soon)" : ""}.</span>
                  ) : p.ready === false || !p.tool ? (
                    <span className="btn-outline !py-2.5 !px-5 !text-[13px] self-start opacity-60" style={{ pointerEvents: "none" }}>Coming soon</span>
                  ) : (
                    <button className="btn-primary !py-2.5 !px-5 !text-[13px] self-start" onClick={() => open(p.tool!, p.name)}>
                      Open tool
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                  )
                ) : (
                  <EditableLink path={`independent.items.${idx}.link`} label="Visit / learn more" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8">
          <AddButton label="Add independent project" onClick={() => addItem("independent.items", { name: "New Project", category: "Tool", tagline: "Short tagline", description: "Description", status: "Live", role: "Sole developer", impact: "The impact.", tech: ["Tech"], kind: "info", ready: true, tool: "", link: "", image: "" })} />
        </div>
      </div>
    </section>
  );
}
