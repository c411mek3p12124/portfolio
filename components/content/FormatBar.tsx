"use client";
import { useContentStore } from "./ContentProvider";
import { useEditorUI } from "./EditorUI";

const FONTS = [
  { label: "Default (Outfit)", value: "" },
  { label: "Outfit", value: "'Outfit', sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Slab", value: "'Rockwell', 'Courier New', serif" },
  { label: "Mono", value: "'Courier New', monospace" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
];

export default function FormatBar() {
  const { editing, getStyle, setStyle, clearStyle } = useContentStore();
  const ui = useEditorUI();

  if (!editing || ui.activeKind !== "text" || !ui.activePath) return null;
  const path = ui.activePath;
  const st = getStyle(path);

  const curSize = st.fontSize ? parseInt(st.fontSize, 10) : 0;
  const bumpSize = (delta: number) => {
    const base = curSize || 16;
    setStyle(path, { fontSize: `${Math.max(8, base + delta)}px` });
  };
  const isBold = (st.fontWeight ?? 0) >= 600;
  const isItalic = st.fontStyle === "italic";
  const isUnderline = st.textDecoration === "underline";

  return (
    <div className="format-bar" onMouseDown={(e) => e.preventDefault() /* keep contentEditable focus */}>
      <select className="fmt-select" value={st.fontFamily ?? ""} onChange={(e) => setStyle(path, { fontFamily: e.target.value })} title="Font">
        {FONTS.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
      </select>

      <span className="fmt-sep" />

      <div className="fmt-stepper">
        <button className="fmt-btn" onClick={() => bumpSize(-2)} title="Smaller">−</button>
        <input
          className="fmt-size"
          value={curSize || ""}
          placeholder="auto"
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            setStyle(path, { fontSize: isNaN(n) ? "" : `${n}px` });
          }}
        />
        <button className="fmt-btn" onClick={() => bumpSize(2)} title="Larger">+</button>
      </div>

      <span className="fmt-sep" />

      <button className={`fmt-btn ${isBold ? "on" : ""}`} onClick={() => setStyle(path, { fontWeight: isBold ? undefined : 700 })} title="Bold"><b>B</b></button>
      <button className={`fmt-btn ${isItalic ? "on" : ""}`} onClick={() => setStyle(path, { fontStyle: isItalic ? "" : "italic" })} title="Italic"><i>I</i></button>
      <button className={`fmt-btn ${isUnderline ? "on" : ""}`} onClick={() => setStyle(path, { textDecoration: isUnderline ? "" : "underline" })} title="Underline"><u>U</u></button>

      <span className="fmt-sep" />

      {(["left", "center", "right", "justify"] as const).map((a) => (
        <button key={a} className={`fmt-btn ${st.textAlign === a ? "on" : ""}`} onClick={() => setStyle(path, { textAlign: a })} title={`Align ${a}`}>
          {a === "left" && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h18M3 12h12M3 18h15" /></svg>}
          {a === "center" && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h18M6 12h12M4 18h16" /></svg>}
          {a === "right" && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h18M9 12h12M6 18h15" /></svg>}
          {a === "justify" && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h18M3 12h18M3 18h18" /></svg>}
        </button>
      ))}

      <span className="fmt-sep" />

      <label className="fmt-color" title="Text color">
        <span style={{ background: st.color || "var(--text)" }} />
        <input type="color" value={st.color || "#888888"} onChange={(e) => setStyle(path, { color: e.target.value })} />
      </label>

      <button className="fmt-btn" onClick={() => clearStyle(path)} title="Clear formatting">⤺</button>
      <button className="fmt-btn" onClick={() => ui.clear()} title="Done">✕</button>
    </div>
  );
}
