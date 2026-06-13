"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useContentStore } from "./content/ContentProvider";
import { useTheme } from "./ThemeProvider";

export default function SequenceScroll({ onProgress, onDone }: { onProgress: (n: number) => void; onDone: () => void }) {
  const { get } = useContentStore();
  const { theme } = useTheme();
  const box = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const frames = useRef<string[]>([]); // frame URLs (auto-detected, no count limit)
  const fr = useRef(0);
  const raf = useRef<number|null>(null);
  const [ready, setReady] = useState(false);
  const firstLoad = useRef(true);

  const { scrollYProgress } = useScroll({ target: box, offset: ["start start", "end end"] });
  const hOp = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const hY = useTransform(scrollYProgress, [0, 0.12], [0, -50]);
  const s1Op = useTransform(scrollYProgress, [0.2, 0.28, 0.38, 0.44], [0, 1, 1, 0]);
  const s1Y = useTransform(scrollYProgress, [0.2, 0.28], [30, 0]);
  const s2Op = useTransform(scrollYProgress, [0.48, 0.56, 0.66, 0.72], [0, 1, 1, 0]);
  const s2Y = useTransform(scrollYProgress, [0.48, 0.56], [30, 0]);
  const cOp = useTransform(scrollYProgress, [0.78, 0.88], [0, 1]);
  const cY = useTransform(scrollYProgress, [0.78, 0.88], [40, 0]);

  useEffect(() => {
    let alive = true;
    // NOTE: do NOT blank the canvas here — keep showing the current frames while the
    // new theme's frames load, so switching dark/light is instant (no flash/lag).
    fetch("/sequences.json").then((r) => (r.ok ? r.json() : {})).then((man: any) => {
      if (!alive) return;
      // pick frames for the active theme; fall back to dark if that theme has none
      const list: string[] = (man && (man[theme]?.length ? man[theme] : man.dark)) || [];
      frames.current = list;
      if (!list.length) { onProgress(100); onDone(); return; }
      const arr: HTMLImageElement[] = new Array(list.length); let n = 0; let swapped = false;
      const curIdx = Math.min(list.length - 1, fr.current);
      // Load the currently-visible frame FIRST so the preloader dismisses (and theme swaps)
      // instantly, instead of waiting for it behind every frame ahead of it in the queue.
      const order = [curIdx, ...list.map((_, i) => i).filter((i) => i !== curIdx)];
      order.forEach((i) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          if (!alive) return;
          n++; if (!swapped) onProgress((n / list.length) * 100);
          if (!swapped && i === curIdx) {
            swapped = true; imgs.current = arr; setReady(true); draw(curIdx);
            if (firstLoad.current) { firstLoad.current = false; onProgress(100); onDone(); }
          }
          if (n === list.length) { imgs.current = arr; setReady(true); draw(Math.min(arr.length - 1, fr.current)); }
        };
        img.src = list[i];
        arr[i] = img;
      });
    }).catch(() => { onProgress(100); onDone(); });
    return () => { alive = false; };
  }, [theme]); // eslint-disable-line

  const draw = useCallback((fi: number) => {
    const c=cvs.current,ctx=c?.getContext("2d"),img=imgs.current[fi];
    if(!c||!ctx||!img?.complete) return;
    const d=devicePixelRatio||1,r=c.getBoundingClientRect();
    c.width=r.width*d;c.height=r.height*d;ctx.scale(d,d);ctx.clearRect(0,0,r.width,r.height);
    // "cover", top-anchored — fill the full width/height (no gaps). The frame's top sits
    // exactly at the header line; any overflow is cropped at the bottom (never above header).
    const s=Math.max(r.width/img.naturalWidth,r.height/img.naturalHeight);
    const dw=img.naturalWidth*s,dh=img.naturalHeight*s,ox=(r.width-dw)/2,oy=0;
    ctx.drawImage(img,ox,oy,dw,dh);
  }, []);

  useMotionValueEvent(scrollYProgress,"change",(v)=>{
    if(!ready)return;const N=frames.current.length;if(!N)return;const fi=Math.min(N-1,Math.floor(v*N));
    if(fi!==fr.current){fr.current=fi;if(raf.current)cancelAnimationFrame(raf.current);raf.current=requestAnimationFrame(()=>draw(fi))}
  });

  useEffect(()=>{const h=()=>ready&&draw(fr.current);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[ready,draw]);

  return (
    <div ref={box} className="relative h-[400vh]">
      <div className="seq-sticky">
        <canvas ref={cvs} className="seq-canvas w-full h-full" style={{ background: "var(--canvas-bg)" }} />
        <div className="seq-overlay" />

        <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none" style={{ opacity: hOp, y: hY }}>
          <motion.p className="font-outfit text-[11px] font-light tracking-[0.35em] uppercase mb-5" style={{ color: "rgb(var(--highlight-rgb))" }}
            initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.8,delay:0.4 }}>
            {get("hero.eyebrow")}
          </motion.p>
          <h1 className="font-outfit font-bold text-[clamp(3rem,10vw,8rem)] leading-[0.9] tracking-tightest" style={{ color: "var(--text)" }}>{get("hero.title")}</h1>
          <p className="mt-4 font-outfit font-light text-[clamp(0.875rem,1.8vw,1.1rem)] tracking-wide max-w-md" style={{ color: "var(--text-muted)" }}>
            {get("hero.tagline")}
          </p>
        </motion.div>

        <motion.div className="absolute inset-0 flex items-center pointer-events-none px-6 md:px-20" style={{ opacity: s1Op, y: s1Y }}>
          <div className="max-w-xl">
            <p className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase mb-3" style={{ color: "rgb(var(--highlight-rgb))" }}>{get("hero.approachLabel")}</p>
            <p className="font-outfit font-semibold text-[clamp(1.5rem,4vw,3rem)] leading-[1.15] tracking-tight" style={{ color: "var(--text)" }}>
              {get("hero.approachText")}
            </p>
          </div>
        </motion.div>

        <motion.div className="absolute inset-0 flex items-center justify-end pointer-events-none px-6 md:px-20" style={{ opacity: s2Op, y: s2Y }}>
          <div className="max-w-xl text-right">
            <p className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase mb-3" style={{ color: "rgb(var(--highlight-rgb))" }}>{get("hero.promiseLabel")}</p>
            <p className="font-outfit font-semibold text-[clamp(1.5rem,4vw,3rem)] leading-[1.15] tracking-tight" style={{ color: "var(--text)" }}>
              {get("hero.promiseText")}
            </p>
          </div>
        </motion.div>

        <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-auto" style={{ opacity: cOp, y: cY }}>
          <p className="font-outfit font-light text-sm tracking-wide mb-3 max-w-sm" style={{ color: "var(--text-muted)" }}>{get("hero.ctaLead")}</p>
          <h2 className="font-outfit font-bold text-[clamp(2rem,5vw,3.5rem)] leading-[1] tracking-tightest mb-8" style={{ color: "var(--text)" }}>
            {get("hero.ctaTitle")}
          </h2>
          <a href="#contact" className="btn-primary" style={(() => { const c = get("buttons.heroCta") ?? {}; const sz = c.size === "sm" ? { p: "10px 22px", f: "13px" } : c.size === "lg" ? { p: "18px 46px", f: "16px" } : { p: "14px 36px", f: "14px" }; return { padding: sz.p, fontSize: sz.f, borderRadius: c.radius ?? "999px" }; })()}>{get("hero.ctaButton")}</a>
        </motion.div>
      </div>
    </div>
  );
}
