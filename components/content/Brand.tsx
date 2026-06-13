"use client";
import { useRef } from "react";
import { useContentStore } from "./ContentProvider";
import { useEditorUI } from "./EditorUI";
import type { LogoSlot } from "@/lib/content";

type SlotName = "header" | "landingTop" | "landingCenter" | "opening";

const LOGO_FONTS = [
  { label: "Outfit", value: "" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Slab", value: "'Rockwell', 'Courier New', serif" },
  { label: "Mono", value: "'Courier New', monospace" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
];

function useSlot(name: SlotName): LogoSlot {
  const { get } = useContentStore();
  const s = get(`brand.logos.${name}`) as LogoSlot | undefined;
  if (s) return s;
  return {
    mode: get("brand.logoMode") ?? "image",
    image: get("brand.logo") ?? "",
    text: get("brand.logoText") ?? get("brand.alias") ?? "",
  };
}

function imgStyleOf(s: LogoSlot): React.CSSProperties | undefined {
  return s.imgSize ? { width: `${s.imgSize}px`, height: `${s.imgSize}px`, objectFit: "contain" } : undefined;
}
function textStyleOf(s: LogoSlot): React.CSSProperties {
  return {
    color: "var(--text)",
    fontSize: s.textSize ? `${s.textSize}px` : undefined,
    fontFamily: s.textFont || undefined,
    fontWeight: s.textBold === false ? 400 : 700,
  };
}

/* Compact logo for Header / Landing top-left (display only). */
export function LogoDisplay({ slot, imgClass, textClass }: { slot: SlotName; imgClass?: string; textClass?: string }) {
  const s = useSlot(slot);
  if (s.mode === "none") return null;
  if (s.mode === "text") return <span className={textClass ?? "font-outfit"} style={textStyleOf(s)}>{s.text}</span>;
  return s.image ? <img src={s.image} alt="logo" className={imgClass} style={imgStyleOf(s)} /> : null;
}

/* Editable brand mark for one slot. */
export function BrandMark({ slot, boxed = true }: { slot: SlotName; boxed?: boolean }) {
  const { set, editing } = useContentStore();
  const ui = useEditorUI();
  const s = useSlot(slot);
  const fileRef = useRef<HTMLInputElement>(null);

  const setSlot = (partial: Partial<LogoSlot>) => set(`brand.logos.${slot}`, { ...s, ...partial });
  const selected = ui.activeKind === "logo" && ui.activePath === slot;

  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSlot({ image: reader.result as string, mode: "image" });
    reader.readAsDataURL(file);
    e.target.value = ""; // allow re-uploading the same file
  };

  const Box = ({ children }: { children: React.ReactNode }) =>
    boxed ? <div className="w-20 h-20 rounded-3xl glass-static flex items-center justify-center overflow-hidden relative">{children}</div> : <>{children}</>;

  if (!editing) {
    if (s.mode === "none") return null;
    return (
      <div className={boxed ? "mb-6 flex justify-center" : ""}>
        <Box>
          {s.mode === "text"
            ? <span className="font-outfit font-bold text-2xl" style={textStyleOf(s)}>{s.text}</span>
            : s.image ? <img src={s.image} alt="logo" className="w-14 h-14 object-contain" style={imgStyleOf(s)} /> : null}
        </Box>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <div className="relative" onClick={() => ui.select(slot, "logo")} role="button" title="Click to edit logo">
        <Box>
          {s.mode === "none" && <span className="font-outfit text-[10px]" style={{ color: "var(--text-muted)" }}>No logo</span>}
          {s.mode === "text" && (
            <span contentEditable suppressContentEditableWarning className="editable-text font-outfit font-bold text-2xl text-center px-1"
              style={textStyleOf(s)}
              onClick={(e) => e.stopPropagation()}
              onBlur={(e) => setSlot({ text: e.currentTarget.innerText.trim() })}>{s.text}</span>
          )}
          {s.mode === "image" && (s.image
            ? <img src={s.image} alt="logo" className="w-14 h-14 object-contain" style={imgStyleOf(s)} />
            : <button type="button" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }} className="font-outfit text-[10px]" style={{ color: "var(--text-muted)" }}>Upload</button>)}
        </Box>
        <span className={`eb-gear ${selected ? "on" : ""}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
        </span>
      </div>

      {selected && (
        <>
          <div className="img-tools">
            <span className="img-tool-label">{slot === "header" ? "Header logo" : slot === "landingTop" ? "Top logo" : slot === "opening" ? "Opening logo" : "Logo"}</span>
            {(["image", "text", "none"] as const).map((m) => (
              <button key={m} type="button" className={`img-tool-btn ${s.mode === m ? "on" : ""}`} onClick={() => setSlot({ mode: m })}>
                {m === "image" ? "Image" : m === "text" ? "Text" : "None"}
              </button>
            ))}
          </div>

          {s.mode === "image" && (
            <div className="img-tools">
              <button type="button" className="img-tool-btn" onClick={() => fileRef.current?.click()}>{s.image ? "Replace from device" : "Upload from device"}</button>
              <button type="button" className="img-tool-btn" onClick={() => setSlot({ image: "/logo.png" })}>Default</button>
              {s.image && <button type="button" className="img-tool-btn" onClick={() => setSlot({ image: "" })}>Delete</button>}
              <span className="img-tool-sep" />
              <span className="img-tool-label">Size</span>
              <input type="range" min={20} max={96} value={s.imgSize ?? 56} onChange={(e) => setSlot({ imgSize: +e.target.value })} />
            </div>
          )}

          {s.mode === "text" && (
            <div className="img-tools">
              <span className="img-tool-label">Size</span>
              <input type="range" min={12} max={56} value={s.textSize ?? 24} onChange={(e) => setSlot({ textSize: +e.target.value })} />
              <span className="img-tool-sep" />
              <select className="fmt-select" value={s.textFont ?? ""} onChange={(e) => setSlot({ textFont: e.target.value })}>
                {LOGO_FONTS.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
              </select>
              <button type="button" className={`img-tool-btn ${s.textBold !== false ? "on" : ""}`} onClick={() => setSlot({ textBold: s.textBold === false })}>Bold</button>
            </div>
          )}
        </>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={upload} />
    </div>
  );
}
