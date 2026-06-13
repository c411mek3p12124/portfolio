"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { useContentStore } from "./content/ContentProvider";
import { EditableButton } from "./content/EditableButton";
import type { SeqOverlay } from "@/lib/content";

interface WalkSequenceProps {
  folder: string;
  totalFrames?: number;
  height?: string;
  title?: string;
  text?: string;
  overlays?: SeqOverlay[];
}

// Opacity for a timed overlay given current progress p (0..1). start/end are 0..100.
function fade(p: number, start: number, end: number): number {
  const s = start / 100, e = end / 100, w = 0.05;
  if (p < s - w || p > e + w) return 0;
  if (p < s) return Math.max(0, (p - (s - w)) / w);
  if (p > e) return Math.max(0, 1 - (p - e) / w);
  return 1;
}

export default function WalkSequence({ folder, totalFrames = 240, height = "300vh", title, text, overlays }: WalkSequenceProps) {
  const { theme } = useTheme();
  const { get } = useContentStore();
  const box = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const frames = useRef<string[]>([]); // auto-detected frame URLs (no count limit)
  const fr = useRef(0);
  const raf = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [prog, setProg] = useState(0);
  const [inView, setInView] = useState(false);

  // Start loading ~1.5 screens before the section reaches the viewport, so the video is
  // already painted as it approaches (instead of competing with the hero on first paint).
  useEffect(() => {
    const el = box.current; if (!el) return;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setInView(true); io.disconnect(); } }, { rootMargin: "150% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Legacy single title/text → one overlay.
  const list: SeqOverlay[] = overlays && overlays.length
    ? overlays
    : (title || text) ? [{ kind: "text", text: title, subtext: text, start: 18, end: 82, align: "center" }] : [];

  const { scrollYProgress } = useScroll({ target: box, offset: ["start start", "end end"] });

  useEffect(() => {
    if (!inView) return; // only load once the section is approaching
    let alive = true;
    // NOTE: do NOT blank the canvas here — keep showing the current frames while the
    // new theme's frames load, so switching dark/light is instant (no flash/lag).
    fetch("/sequences.json").then((r) => (r.ok ? r.json() : {})).then((man: any) => {
      if (!alive) return;
      // theme-aware: prefer `${folder}-${theme}`, fall back to dark variant, then legacy flat folder
      const flist: string[] = (man && (man[`${folder}-${theme}`] || man[`${folder}-dark`] || man[folder])) || [];
      frames.current = flist;
      if (!flist.length) return;
      const arr: HTMLImageElement[] = new Array(flist.length);
      let n = 0; let swapped = false;
      const curIdx = Math.min(flist.length - 1, fr.current);
      // Load the currently-visible frame FIRST (so the poster / theme-switch swaps instantly),
      // then the rest — otherwise the visible frame waits behind everything ahead of it.
      const order = [curIdx, ...flist.map((_, i) => i).filter((i) => i !== curIdx)];
      order.forEach((i) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          if (!alive) return;
          n++;
          if (!swapped && i === curIdx) { swapped = true; imgs.current = arr; setReady(true); draw(curIdx); }
          if (n === flist.length) { imgs.current = arr; setReady(true); draw(Math.min(arr.length - 1, fr.current)); }
        };
        img.src = flist[i];
        arr[i] = img;
      });
    }).catch(() => {});
    return () => { alive = false; };
  }, [folder, theme, inView]);

  const draw = useCallback((fi: number) => {
    const c = cvs.current, ctx = c?.getContext("2d"), img = imgs.current[fi];
    if (!c || !ctx || !img?.complete) return;
    const d = devicePixelRatio || 1, r = c.getBoundingClientRect();
    c.width = r.width * d; c.height = r.height * d;
    ctx.scale(d, d); ctx.clearRect(0, 0, r.width, r.height);
    // "cover", top-anchored — fill the full width/height (no gaps). The frame's top sits
    // exactly at the header line; any overflow is cropped at the bottom (never above header).
    const s = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s, ox = (r.width - dw) / 2, oy = 0;
    ctx.drawImage(img, ox, oy, dw, dh);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setProg(v); // drives both the timed overlays and the end-of-sequence CTA
    if (!ready) return;
    const N = frames.current.length; if (!N) return;
    // Hold frame 0 during the lead-in and the last frame during the lead-out, so the
    // video is already visible as the section approaches and only *scrubs* once centered.
    const HOLD = 0.1;
    const p = Math.max(0, Math.min(1, (v - HOLD) / (1 - 2 * HOLD)));
    const fi = Math.min(N - 1, Math.floor(p * N));
    if (fi !== fr.current) { fr.current = fi; if (raf.current) cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(() => draw(fi)); }
  });

  useEffect(() => { const h = () => ready && draw(fr.current); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, [ready, draw]);

  const alignClass = (a?: string) => a === "left" ? "items-start text-left" : a === "right" ? "items-end text-right" : "items-center text-center";

  return (
    <div ref={box} className="relative" style={{ height }}>
      <div className="seq-sticky">
        <canvas ref={cvs} className="seq-canvas w-full h-full" style={{ background: "transparent" }} />
        <div className="seq-overlay" />
        {list.map((o, i) => {
          const op = fade(prog, o.start, o.end);
          if (op <= 0) return null;
          return (
            <div key={i} className={`absolute inset-0 flex flex-col justify-center px-8 md:px-20 pointer-events-none ${alignClass(o.align)}`} style={{ opacity: op }}>
              {o.kind === "image"
                ? (o.image ? <img src={o.image} alt="" className="max-w-[60%] max-h-[60vh] rounded-2xl object-contain" /> : null)
                : (
                  <div className="max-w-3xl">
                    {o.eyebrow && <p className="font-outfit text-[11px] font-light tracking-[0.35em] uppercase mb-4" style={{ color: "rgb(var(--highlight-rgb))" }}>{o.eyebrow}</p>}
                    {o.text && <h2 className="font-outfit font-bold text-[clamp(2rem,7vw,5rem)] leading-[0.95] tracking-tightest" style={{ color: "var(--text)" }}>{o.text}</h2>}
                    {o.subtext && <p className="mt-4 font-outfit font-light text-[clamp(0.9rem,1.8vw,1.15rem)] tracking-wide" style={{ color: "var(--text-muted)" }}>{o.subtext}</p>}
                  </div>
                )}
            </div>
          );
        })}

        {/* CTA near the end of the sequence (same idea as the hero's closing CTA). */}
        {(() => {
          const op = fade(prog, 82, 100);
          if (op <= 0) return null;
          const cta = get("sequenceCta") ?? {};
          return (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-auto" style={{ opacity: op }}>
              {cta.title && <p className="font-outfit font-light text-sm tracking-wide mb-3 max-w-sm" style={{ color: "var(--text-muted)" }}>{cta.title}</p>}
              {cta.subtitle && <h2 className="font-outfit font-bold text-[clamp(2rem,5vw,3.5rem)] leading-[1] tracking-tightest mb-8" style={{ color: "var(--text)" }}>{cta.subtitle}</h2>}
              <EditableButton id="sequenceCta" labelPath="sequenceCta.button" variant="primary" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })} />
            </div>
          );
        })()}
      </div>
    </div>
  );
}
