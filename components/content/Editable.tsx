"use client";
import React, { useRef } from "react";
import { useContentStore } from "./ContentProvider";
import { useEditorUI } from "./EditorUI";
import { useLightbox } from "./Lightbox";

/* ─────────────────────────────────────────────────────────────
   EditableText — contentEditable in operator mode. Saves on blur.
   Per-element visual styles (font/size/weight/color/align…) from the
   store are merged in both view and edit modes, so Preview matches.
   ───────────────────────────────────────────────────────────── */
export function EditableText({
  path,
  as = "span",
  className,
  style,
  placeholder,
}: {
  path: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}) {
  const { get, set, editing, getStyle } = useContentStore();
  const ui = useEditorUI();
  const value: string = get(path) ?? "";
  const merged: React.CSSProperties = { ...style, ...(getStyle(path) as React.CSSProperties) };

  if (!editing) {
    return React.createElement(as as any, { className, style: merged }, value);
  }

  const active = ui.activePath === path;
  return React.createElement(as as any, {
    className: `${className ?? ""} editable-text${active ? " editable-active" : ""}`,
    style: merged,
    contentEditable: true,
    suppressContentEditableWarning: true,
    "data-empty": value ? undefined : "true",
    "data-placeholder": placeholder ?? "Click to edit",
    onFocus: () => ui.select(path, "text"),
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      const next = e.currentTarget.innerText.trim();
      if (next !== value) set(path, next);
    },
    children: value,
  });
}

/* ─────────────────────────────────────────────────────────────
   EditableImage — click to select; popover to Replace / resize.
   ───────────────────────────────────────────────────────────── */
const WIDTHS = [
  { label: "S", w: "40%" },
  { label: "M", w: "60%" },
  { label: "L", w: "80%" },
  { label: "Full", w: "100%" },
];

export function EditableImage({
  path,
  className,
  alt,
  placeholderLabel = "Add image",
}: {
  path: string;
  className?: string;
  alt?: string;
  placeholderLabel?: string;
}) {
  const { get, set, editing, getStyle, setStyle } = useContentStore();
  const ui = useEditorUI();
  const lightbox = useLightbox();
  const value: string = get(path) ?? "";
  const st = getStyle(path) as React.CSSProperties;
  const fileRef = useRef<HTMLInputElement>(null);

  const pick = () => fileRef.current?.click();
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set(path, reader.result as string);
    reader.readAsDataURL(file);
  };

  // When the operator sets a size (S/M/L), it must WIN over the section's hard-coded
  // classes (e.g. `w-full h-44 object-cover`): show the image at that width, natural
  // height, uncropped. With no operator size, keep the section's default look.
  const imgStyle: React.CSSProperties = st.width
    ? { width: st.width, height: "auto", objectFit: "contain", borderRadius: st.borderRadius }
    : { borderRadius: st.borderRadius };

  if (!editing) {
    if (!value) return null;
    // Click to view the full photo in a popup (lightbox).
    return <img src={value} alt={alt ?? ""} className={className} style={{ ...imgStyle, cursor: "zoom-in" }} onClick={() => lightbox.open(value)} />;
  }

  const active = ui.activePath === path;

  return (
    <div className="editable-image-wrap" style={{ display: "block" }}>
      <div onClick={() => ui.select(path, "image")} role="button" title="Select image">
        {value ? (
          <img src={value} alt={alt ?? ""} className={className} style={imgStyle} />
        ) : (
          <div className={`editable-image-empty ${className ?? ""}`} onClick={pick}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
            <span>{placeholderLabel}</span>
          </div>
        )}
        {value && (
          <span className="editable-image-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
          </span>
        )}
      </div>

      {active && value && (
        <div className="img-tools" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="img-tool-btn" onClick={pick}>Replace</button>
          <span className="img-tool-sep" />
          <span className="img-tool-label">Size</span>
          {WIDTHS.map((x) => (
            <button key={x.label} type="button" className={`img-tool-btn ${st.width === x.w ? "on" : ""}`} onClick={() => setStyle(path, { width: x.w })}>{x.label}</button>
          ))}
          <span className="img-tool-sep" />
          <span className="img-tool-label">Round</span>
          <input type="range" min={0} max={40} value={parseInt(String(st.borderRadius || "16"), 10)} onChange={(e) => setStyle(path, { borderRadius: `${e.target.value}px` })} />
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   EditableLink — paste a URL in operator; renders a button on the
   live site (hidden when empty). Use for any "link to the real thing".
   ───────────────────────────────────────────────────────────── */
export function EditableLink({
  path,
  label = "Visit",
  className,
}: {
  path: string;
  label?: string;
  className?: string;
}) {
  const { get, set, editing } = useContentStore();
  const url: string = get(path) ?? "";

  if (editing) {
    return (
      <div className="op-link-edit">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--highlight-rgb))" strokeWidth="1.8"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
        <span className="font-outfit text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label} link</span>
        <span
          contentEditable
          suppressContentEditableWarning
          className="editable-text flex-1 font-outfit text-[12px]"
          data-empty={url ? undefined : "true"}
          data-placeholder="https://… paste URL"
          style={{ color: "rgb(var(--highlight-rgb))" }}
          onBlur={(e) => { const v = e.currentTarget.innerText.trim(); if (v !== url) set(path, v); }}
        >{url}</span>
      </div>
    );
  }

  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noreferrer" className={className ?? "btn-outline !py-2.5 !px-5 !text-[13px] self-start"}>
      {label}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10" /></svg>
    </a>
  );
}

/* Array item controls (operator only) */
export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  const { editing } = useContentStore();
  if (!editing) return null;
  return (
    <button onClick={onClick} className="op-add-btn" type="button">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
      {label}
    </button>
  );
}

export function RemoveButton({ onClick }: { onClick: () => void }) {
  const { editing } = useContentStore();
  if (!editing) return null;
  return (
    <button onClick={onClick} className="op-remove-btn" type="button" title="Remove">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
    </button>
  );
}

/* Editable list of short string tags (e.g. tech stack). */
export function EditableTags({ path }: { path: string }) {
  const { get, set, editing } = useContentStore();
  const tags: string[] = get(path) ?? [];

  if (!editing) {
    return (
      <>
        {tags.map((t, i) => (
          <span key={i} className="glass-pill px-3 py-1.5 font-outfit text-[12px] font-light" style={{ color: "var(--text-secondary)" }}>{t}</span>
        ))}
      </>
    );
  }

  return (
    <>
      {tags.map((t, i) => (
        <span key={i} className="glass-pill px-3 py-1.5 font-outfit text-[12px] font-light inline-flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
          <span
            contentEditable
            suppressContentEditableWarning
            className="editable-text"
            onBlur={(e) => {
              const next = [...tags];
              next[i] = e.currentTarget.innerText.trim();
              set(path, next.filter(Boolean));
            }}
          >{t}</span>
          <button type="button" className="opacity-50 hover:opacity-100" onClick={() => set(path, tags.filter((_, j) => j !== i))}>×</button>
        </span>
      ))}
      <button type="button" className="op-add-btn !py-1.5" onClick={() => set(path, [...tags, "New"])}>+ tag</button>
    </>
  );
}
