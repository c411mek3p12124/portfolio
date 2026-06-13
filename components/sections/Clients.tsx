"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useContentStore } from "@/components/content/ContentProvider";
import { useEditorUI } from "@/components/content/EditorUI";
import { BTN_SIZES } from "@/components/content/EditableButton";
import { EditableText, EditableImage, EditableTags, EditableLink, AddButton, RemoveButton } from "@/components/content/Editable";
import type { VentureItem, ButtonStyle } from "@/lib/content";

export default function Clients() {
  const { get, editing, addItem, removeItem, set } = useContentStore();
  const ui = useEditorUI();
  const cats = (get("clients.categories") ?? ["All"]) as string[];
  const items = (get("clients.items") ?? []) as VentureItem[];
  const [cat, setCat] = useState("All");

  // Shared button style for every category pill, edited via the standard
  // ButtonBar (gear → size / radius / etc.) so the filter buttons behave
  // like all other buttons in the operator.
  const catBtn: ButtonStyle = (get("buttons.clientsCategory") ?? {}) as ButtonStyle;
  const catSizeKey = catBtn.size;
  const catSize = catSizeKey ? BTN_SIZES[catSizeKey] : null;
  const pillStyle: React.CSSProperties = {
    borderRadius: catBtn.radius ?? "999px",
    ...(catSize ? { padding: catSize.padding, fontSize: catSize.fontSize } : {}),
  };

  const filtered = items
    .map((p, idx) => ({ p, idx }))
    .filter(({ p }) => editing || cat === "All" || p.category === cat);

  return (
    <section id="clients" className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6 md:px-20">
        <EditableText path="clients.eyebrow" as="p" className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase mb-4" style={{ color: "rgb(var(--highlight-rgb))" }} />
        <EditableText path="clients.title" as="h2" className="font-outfit font-bold text-[clamp(1.8rem,4vw,3rem)] tracking-tightest mb-3" style={{ color: "var(--text)" }} />
        <EditableText path="clients.intro" as="p" className="font-outfit font-light text-base leading-relaxed mb-8 max-w-xl" style={{ color: "var(--text-secondary)" }} />

        {/* Category buttons — editable in operator */}
        <div className="flex flex-wrap gap-2 mb-10 items-center">
          {editing ? (
            <>
              {cats.map((c, i) => (
                <span key={i} className="glass-pill px-3 py-2 font-outfit text-[13px] font-light inline-flex items-center gap-1.5" style={{ ...pillStyle, color: "var(--text-secondary)" }}>
                  <span contentEditable suppressContentEditableWarning className="editable-text"
                    onBlur={(e) => { const next = [...cats]; next[i] = e.currentTarget.innerText.trim(); set("clients.categories", next.filter(Boolean)); }}>{c}</span>
                  {c !== "All" && <button type="button" className="opacity-50 hover:opacity-100" onClick={() => set("clients.categories", cats.filter((_, j) => j !== i))}>×</button>}
                </span>
              ))}
              <button type="button" className="op-add-btn !py-1.5" onClick={() => set("clients.categories", [...cats, "New"])}>+ category</button>
              <button
                type="button"
                className={`op-add-btn !py-1.5 inline-flex items-center gap-1.5 ${ui.activeKind === "button" && ui.activePath === "clientsCategory" ? "!bg-[rgb(var(--highlight-rgb))] !text-[var(--bg)] !border-transparent" : ""}`}
                title="Edit category buttons (size, radius, …)"
                onClick={() => ui.select("clientsCategory", "button")}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                Button style
              </button>
            </>
          ) : (
            cats.map((c) => <button key={c} onClick={() => setCat(c)} style={pillStyle} className={`glass-pill px-4 py-2 font-outfit text-[13px] font-light ${cat === c ? "active" : ""}`}>{c}</button>)
          )}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map(({ p, idx }) => (
              <motion.div key={idx} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}
                className="glass p-6 flex flex-col relative">
                <RemoveButton onClick={() => removeItem("clients.items", idx)} />

                {(editing || p.image) && (
                  <div className="mb-5">
                    <EditableImage path={`clients.items.${idx}.image`} className="w-full h-44 object-cover rounded-xl" placeholderLabel="Cover / mockup (optional)" alt={p.name} />
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 mb-3">
                  <EditableText path={`clients.items.${idx}.category`} as="span" className="font-outfit text-[10px] font-light tracking-[0.25em] uppercase" style={{ color: "rgb(var(--highlight-rgb))" }} />
                  <EditableText path={`clients.items.${idx}.status`} as="span" className="glass-pill px-2.5 py-1 font-outfit text-[10px] font-light" style={{ color: "var(--text-muted)" }} />
                </div>

                <EditableText path={`clients.items.${idx}.name`} as="h3" className="font-outfit font-bold text-xl tracking-tight mb-1" style={{ color: "var(--text)" }} />
                <EditableText path={`clients.items.${idx}.tagline`} as="p" className="font-outfit font-light text-sm mb-4" style={{ color: "var(--text-secondary)" }} />
                <EditableText path={`clients.items.${idx}.description`} as="p" className="font-outfit font-light text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }} />

                <div className="flex gap-2 mb-4">
                  <span className="font-outfit text-[11px] font-medium tracking-wider uppercase flex-shrink-0" style={{ color: "var(--text-muted)" }}>Role</span>
                  <EditableText path={`clients.items.${idx}.role`} as="span" className="font-outfit text-[13px] font-light" style={{ color: "var(--text-secondary)" }} />
                </div>

                <div className="glass-static p-3 mb-4">
                  <p className="font-outfit text-[10px] font-medium tracking-wider uppercase mb-1" style={{ color: "rgb(var(--highlight-rgb))" }}>↗ Impact</p>
                  <EditableText path={`clients.items.${idx}.impact`} as="p" className="font-outfit font-light text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }} />
                </div>

                <div className="flex flex-wrap gap-2 mb-5"><EditableTags path={`clients.items.${idx}.tech`} /></div>

                <div className="mt-auto"><EditableLink path={`clients.items.${idx}.link`} label="Visit project" /></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-8">
          <AddButton label="Add client project" onClick={() => addItem("clients.items", { name: "New Client Project", category: "Web", tagline: "Short tagline", description: "Description", status: "Delivered", role: "Your role", impact: "The result.", tech: ["Tech"], link: "", image: "" })} />
        </div>
      </div>
    </section>
  );
}
