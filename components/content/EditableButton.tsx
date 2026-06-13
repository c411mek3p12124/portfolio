"use client";
import React from "react";
import { useContentStore } from "./ContentProvider";
import { useEditorUI } from "./EditorUI";
import { EditableText } from "./Editable";
import type { ButtonStyle } from "@/lib/content";

export const BTN_SIZES: Record<string, { padding: string; fontSize: string; svg: number }> = {
  sm: { padding: "10px 22px", fontSize: "13px", svg: 13 },
  md: { padding: "14px 36px", fontSize: "14px", svg: 14 },
  lg: { padding: "18px 46px", fontSize: "16px", svg: 16 },
};

function Arrow({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}

/* Reusable styled, editable button. Style is edited in a contextual
   bar that only appears when its gear is clicked (operator only). */
export function EditableButton({
  id,
  labelPath,
  onClick,
  variant = "primary",
  defaultArrow = true,
}: {
  id: string;
  labelPath: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
  defaultArrow?: boolean;
}) {
  const { get, editing } = useContentStore();
  const ui = useEditorUI();
  const bs: ButtonStyle = get(`buttons.${id}`) ?? {};
  const size = bs.size ?? "md";
  const radius = bs.radius ?? "999px";
  const arrow = bs.arrow ?? defaultArrow;
  const show = bs.show !== false;
  const s = BTN_SIZES[size] ?? BTN_SIZES.md;

  if (!editing && !show) return null;

  const style: React.CSSProperties = { padding: s.padding, fontSize: s.fontSize, borderRadius: radius, opacity: !show && editing ? 0.4 : 1 };

  // If a custom link is set in the operator, navigate there (e.g. WhatsApp); otherwise
  // fall back to the built-in onClick. Anchors (#id) scroll the page; URLs open a new tab.
  const go = () => {
    const link = bs.link?.trim();
    if (!link) { onClick?.(); return; }
    if (link.startsWith("#")) { document.querySelector(link)?.scrollIntoView({ behavior: "smooth" }); }
    else { window.open(link, "_blank", "noopener,noreferrer"); }
  };

  return (
    <span className="eb-wrap">
      <button className={variant === "primary" ? "btn-primary" : "btn-outline"} style={style} onClick={editing ? undefined : go}>
        <EditableText path={labelPath} as="span" />
        {arrow && <Arrow size={s.svg} />}
      </button>
      {editing && (
        <button type="button" className={`eb-gear ${ui.activePath === id ? "on" : ""}`} title="Edit button" onClick={() => ui.select(id, "button")}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
        </button>
      )}
    </span>
  );
}

/* Contextual bar — appears only when a button's gear is selected. */
export function ButtonBar() {
  const { editing, get, set } = useContentStore();
  const ui = useEditorUI();
  if (!editing || ui.activeKind !== "button" || !ui.activePath) return null;

  const id = ui.activePath;
  const bs: ButtonStyle = get(`buttons.${id}`) ?? {};
  const size = bs.size ?? "md";
  const radius = bs.radius ?? "999px";
  const arrow = bs.arrow ?? true;
  const show = bs.show !== false;
  const radiusNum = parseInt(radius, 10) || 0;

  return (
    <div className="format-bar">
      <span className="img-tool-label">Button</span>
      {(["sm", "md", "lg"] as const).map((m) => (
        <button key={m} className={`fmt-btn ${size === m ? "on" : ""}`} onClick={() => set(`buttons.${id}.size`, m)}>{m.toUpperCase()}</button>
      ))}
      <span className="fmt-sep" />
      <span className="img-tool-label">Radius</span>
      <input type="range" min={0} max={40} value={radiusNum > 40 ? 40 : radiusNum} onChange={(e) => set(`buttons.${id}.radius`, `${e.target.value}px`)} />
      <input
        type="number"
        min={0}
        max={999}
        value={radius === "999px" ? "" : radiusNum}
        placeholder="999"
        title="Radius in px"
        style={{ width: 52, textAlign: "center" }}
        className="fmt-num"
        onChange={(e) => {
          const v = e.target.value.replace(/[^\d]/g, "");
          set(`buttons.${id}.radius`, v === "" ? "0px" : `${Math.min(999, parseInt(v, 10))}px`);
        }}
      />
      <span className="img-tool-label" style={{ opacity: 0.6 }}>px</span>
      <button className={`fmt-btn ${radius === "999px" ? "on" : ""}`} onClick={() => set(`buttons.${id}.radius`, "999px")}>Pill</button>
      <span className="fmt-sep" />
      <span className="img-tool-label">Link</span>
      <input
        type="text"
        value={bs.link ?? ""}
        placeholder="https://wa.me/62… or #contact"
        title="Custom link — WhatsApp, email, anchor (#id)…"
        style={{ width: 200 }}
        className="fmt-num"
        onChange={(e) => set(`buttons.${id}.link`, e.target.value)}
      />
      {/* Arrow/Show don't apply to filter pills (e.g. Real Projects categories) */}
      {id !== "clientsCategory" && (
        <>
          <span className="fmt-sep" />
          <button className={`fmt-btn ${arrow ? "on" : ""}`} onClick={() => set(`buttons.${id}.arrow`, !arrow)}>Arrow</button>
          <button className={`fmt-btn ${show ? "on" : ""}`} onClick={() => set(`buttons.${id}.show`, !show)}>Show</button>
        </>
      )}
      <span className="fmt-sep" />
      <button className="fmt-btn" onClick={() => ui.clear()} title="Done">✕</button>
    </div>
  );
}
