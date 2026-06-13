"use client";
import { useEffect, useState, useRef } from "react";
import { useContentStore } from "./ContentProvider";
import { useTheme } from "@/components/ThemeProvider";
import type { LayoutBlock, SeqOverlay } from "@/lib/content";

function hexToRgb(hex: string): string {
  const m = hex.replace("#", "");
  const n = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
  return `${r || 0},${g || 0},${b || 0}`;
}

/* Applies the editable theme colors to CSS variables for the active theme. */
export function ThemeApplier() {
  const { content } = useContentStore();
  const { theme } = useTheme();
  const t = content.theme;

  useEffect(() => {
    if (!t) return;
    const root = document.documentElement;
    const accent = theme === "dark" ? t.accentDark : t.accentLight;
    const bg = theme === "dark" ? t.bgDark : t.bgLight;
    if (accent) {
      root.style.setProperty("--highlight", accent);
      root.style.setProperty("--highlight-rgb", hexToRgb(accent));
    }
    if (bg) {
      root.style.setProperty("--bg", bg);
      root.style.setProperty("--bg-rgb", hexToRgb(bg));
      root.style.setProperty("--canvas-bg", bg);
    }
  }, [t, t?.accentDark, t?.accentLight, t?.bgDark, t?.bgLight, theme]);

  return null;
}

const Row = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <label className="flex items-center justify-between gap-4 py-2">
    <span className="font-outfit text-[13px]" style={{ color: "var(--text-secondary)" }}>{label}</span>
    <span className="flex items-center gap-2">
      <span className="font-outfit text-[12px] font-light tabular-nums" style={{ color: "var(--text-muted)" }}>{value}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent" />
    </span>
  </label>
);

export function ThemePanel({ onClose }: { onClose: () => void }) {
  const { content, set } = useContentStore();
  const { theme, toggle } = useTheme();
  const t = content.theme!;

  return (
    <div className="op-panel" onClick={onClose}>
      <div className="op-panel-card" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-outfit font-bold text-lg" style={{ color: "var(--text)" }}>Colors &amp; Theme</h3>
          <button className="glass-pill px-3 py-1 font-outfit text-[12px]" onClick={toggle} style={{ color: "var(--text-secondary)" }}>
            Editing: {theme === "dark" ? "Dark" : "Light"} — switch
          </button>
        </div>
        <p className="font-outfit font-light text-[13px] mb-5" style={{ color: "var(--text-secondary)" }}>
          Changes apply live. The dark and light themes have separate colors — switch with the button above to set each.
        </p>
        <div className="flex flex-col divide-y" style={{ borderColor: "var(--border)" }}>
          <Row label="Accent (Dark mode)" value={t.accentDark} onChange={(v) => set("theme.accentDark", v)} />
          <Row label="Background (Dark mode)" value={t.bgDark} onChange={(v) => set("theme.bgDark", v)} />
          <Row label="Accent (Light mode)" value={t.accentLight} onChange={(v) => set("theme.accentLight", v)} />
          <Row label="Background (Light mode)" value={t.bgLight} onChange={(v) => set("theme.bgLight", v)} />
        </div>
        <button className="btn-primary w-full mt-6 !py-3" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

const SECTION_LABELS: Record<string, string> = {
  about: "About", journey: "Journey", recognition: "Recognition",
  certifications: "Certifications", work: "Work / Ventures", contact: "Contact",
};
const ALL_SECTIONS = Object.keys(SECTION_LABELS);
const ALL_WALKS = ["else"];

function blockLabel(b: LayoutBlock) {
  return b.type === "section" ? (SECTION_LABELS[b.id] ?? b.id) : `Sequence · ${b.folder}`;
}

export function LayoutPanel({ onClose }: { onClose: () => void }) {
  const { content, set } = useContentStore();
  const layout = content.layout ?? [];
  const [drag, setDrag] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  const update = (next: LayoutBlock[]) => set("layout", next);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= layout.length) return;
    const next = [...layout];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  };
  const drop = (target: number) => {
    if (drag === null || drag === target) { setDrag(null); setOver(null); return; }
    const next = [...layout];
    const [moved] = next.splice(drag, 1);
    next.splice(target, 0, moved);
    update(next);
    setDrag(null); setOver(null);
  };
  const toggle = (i: number) => {
    const next = layout.map((b, k) => (k === i ? { ...b, visible: !b.visible } : b));
    update(next);
  };
  const remove = (i: number) => update(layout.filter((_, k) => k !== i));
  const addSection = (id: string) => update([...layout, { type: "section", id, visible: true }]);
  const addWalk = (folder: string) => update([...layout, { type: "walk", folder, visible: true }]);

  const usedSections = new Set(layout.filter((b) => b.type === "section").map((b: any) => b.id));
  const missingSections = ALL_SECTIONS.filter((s) => !usedSections.has(s));

  return (
    <div className="op-panel" onClick={onClose}>
      <div className="op-panel-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <h3 className="font-outfit font-bold text-lg mb-1" style={{ color: "var(--text)" }}>Sections &amp; Sequences</h3>
        <p className="font-outfit font-light text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>
          Drag <span style={{ color: "var(--text)" }}>⠿</span> to reorder (or use ▲▼). Hide or remove blocks. The hero stays on top and the footer at the bottom.
        </p>

        <div className="flex flex-col gap-2 max-h-[46vh] overflow-y-auto pr-1">
          {layout.map((b, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => setDrag(i)}
              onDragOver={(e) => { e.preventDefault(); setOver(i); }}
              onDragEnd={() => { setDrag(null); setOver(null); }}
              onDrop={() => drop(i)}
              className="flex items-center gap-2 p-2.5 rounded-xl"
              style={{
                background: "var(--input-bg)",
                opacity: b.visible ? (drag === i ? 0.4 : 1) : 0.5,
                outline: over === i && drag !== null && drag !== i ? "2px solid rgb(var(--highlight-rgb))" : "none",
                cursor: "grab",
              }}
            >
              <span className="lp-grip" title="Drag to reorder">⠿</span>
              <span className="flex flex-col">
                <button className="lp-mini" onClick={() => move(i, -1)} disabled={i === 0}>▲</button>
                <button className="lp-mini" onClick={() => move(i, 1)} disabled={i === layout.length - 1}>▼</button>
              </span>
              <span className="font-outfit text-[13px] flex-1" style={{ color: "var(--text)" }}>
                {blockLabel(b)}
                {b.type === "walk" && <span className="font-light" style={{ color: "var(--text-muted)" }}> (animation)</span>}
              </span>
              <button className="lp-tag" onClick={() => toggle(i)} title={b.visible ? "Hide" : "Show"}>{b.visible ? "Visible" : "Hidden"}</button>
              <button className="lp-tag !text-red-400" onClick={() => remove(i)} title="Remove">Remove</button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {missingSections.map((s) => (
            <button key={s} className="op-add-btn !py-1.5" onClick={() => addSection(s)}>+ {SECTION_LABELS[s]}</button>
          ))}
          {ALL_WALKS.map((w) => (
            <button key={w} className="op-add-btn !py-1.5" onClick={() => addWalk(w)}>+ {w}</button>
          ))}
        </div>

        <button className="btn-primary w-full mt-6 !py-3" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

/* ── Sequences: timed overlays (text / image) over each animation ── */
function overlaysOf(b: LayoutBlock): SeqOverlay[] {
  if (b.type !== "walk") return [];
  if (b.overlays && b.overlays.length) return b.overlays;
  if (b.title || b.text) return [{ kind: "text", text: b.title, subtext: b.text, start: 18, end: 82, align: "center" }];
  return [];
}

const SEQ_FRAMES = 211; // frames per walk sequence
const toFrame = (pct: number) => Math.max(1, Math.min(SEQ_FRAMES, Math.round((pct / 100) * SEQ_FRAMES)));
const toPct = (frame: number) => Math.max(0, Math.min(100, (frame / SEQ_FRAMES) * 100));

function OverlayRow({ o, onChange, onRemove }: { o: SeqOverlay; onChange: (p: Partial<SeqOverlay>) => void; onRemove: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => onChange({ image: r.result as string }); r.readAsDataURL(f);
  };
  return (
    <div className="p-3 rounded-xl relative" style={{ background: "var(--input-bg)" }}>
      <button className="op-remove-btn" onClick={onRemove}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {(["text", "image"] as const).map((k) => (
          <button key={k} className={`img-tool-btn ${o.kind === k ? "on" : ""}`} onClick={() => onChange({ kind: k })}>{k}</button>
        ))}
        <span className="img-tool-sep" />
        {(["left", "center", "right"] as const).map((a) => (
          <button key={a} className={`img-tool-btn ${(o.align ?? "center") === a ? "on" : ""}`} onClick={() => onChange({ align: a })}>{a[0].toUpperCase()}</button>
        ))}
      </div>

      {o.kind === "text" ? (
        <div className="flex flex-col gap-2">
          <input className="input-field" placeholder="Eyebrow — small accent line (optional)" value={o.eyebrow ?? ""} onChange={(e) => onChange({ eyebrow: e.target.value })} />
          <input className="input-field" placeholder="Title — big heading (hero style)" value={o.text ?? ""} onChange={(e) => onChange({ text: e.target.value })} />
          <input className="input-field" placeholder="Subtext (optional)" value={o.subtext ?? ""} onChange={(e) => onChange({ subtext: e.target.value })} />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {o.image ? <img src={o.image} alt="" className="w-16 h-16 object-cover rounded-lg" /> : <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ background: "var(--surface)", color: "var(--text-muted)" }}>—</div>}
          <button className="img-tool-btn" onClick={() => fileRef.current?.click()}>{o.image ? "Replace" : "Upload"} image</button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={upload} />
        </div>
      )}

      <div className="flex items-center gap-3 mt-3 flex-wrap">
        <span className="img-tool-label">Appears at frame</span>
        <input type="number" min={1} max={SEQ_FRAMES} className="input-field !w-20 !py-1.5 text-center" value={toFrame(o.start)} onChange={(e) => onChange({ start: toPct(+e.target.value) })} />
        <span className="img-tool-label">until</span>
        <input type="number" min={1} max={SEQ_FRAMES} className="input-field !w-20 !py-1.5 text-center" value={toFrame(o.end)} onChange={(e) => onChange({ end: toPct(+e.target.value) })} />
        <span className="font-outfit text-[11px]" style={{ color: "var(--text-muted)" }}>of {SEQ_FRAMES} frames</span>
      </div>
    </div>
  );
}

export function SequencesPanel({ onClose }: { onClose: () => void }) {
  const { content, set } = useContentStore();
  const layout = content.layout ?? [];
  const walks = layout.map((b, i) => ({ b, i })).filter((x) => x.b.type === "walk");

  const setOverlays = (bi: number, arr: SeqOverlay[]) => set(`layout.${bi}.overlays`, arr);
  const update = (bi: number, oi: number, partial: Partial<SeqOverlay>) => {
    const arr = overlaysOf(layout[bi]).map((o, k) => (k === oi ? { ...o, ...partial } : o));
    setOverlays(bi, arr);
  };
  const add = (bi: number, kind: "text" | "image") => {
    const base: SeqOverlay = kind === "text"
      ? { kind: "text", text: "Heading", subtext: "", start: 20, end: 60, align: "center" }
      : { kind: "image", image: "", start: 20, end: 60, align: "center" };
    setOverlays(bi, [...overlaysOf(layout[bi]), base]);
  };
  const remove = (bi: number, oi: number) => setOverlays(bi, overlaysOf(layout[bi]).filter((_, k) => k !== oi));

  return (
    <div className="op-panel" onClick={onClose}>
      <div className="op-panel-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <h3 className="font-outfit font-bold text-lg mb-1" style={{ color: "var(--text)" }}>Sequences</h3>
        <p className="font-outfit font-light text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>
          The animation length is fixed (it drives the motion). Add timed <b>text</b> or <b>image</b> overlays and choose when they appear — as a % of the scroll through that sequence. Move a sequence between sections in the <b>Sections</b> panel.
        </p>

        {walks.length === 0 && <p className="font-outfit text-[13px]" style={{ color: "var(--text-muted)" }}>No sequences in the layout yet — add one from the Sections panel.</p>}

        <div className="flex flex-col gap-5 max-h-[58vh] overflow-y-auto pr-1">
          {walks.map(({ b, i }) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--highlight-rgb))" strokeWidth="1.6"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                <span className="font-outfit font-semibold text-[13px]" style={{ color: "var(--text)" }}>{(b as any).folder}</span>
              </div>
              <div className="flex flex-col gap-3">
                {overlaysOf(b).map((o, oi) => (
                  <OverlayRow key={oi} o={o} onChange={(p) => update(i, oi, p)} onRemove={() => remove(i, oi)} />
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <button className="op-add-btn !py-1.5" onClick={() => add(i, "text")}>+ Text overlay</button>
                <button className="op-add-btn !py-1.5" onClick={() => add(i, "image")}>+ Image overlay</button>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-primary w-full mt-6 !py-3" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}
