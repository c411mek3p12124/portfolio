"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useContentStore } from "@/components/content/ContentProvider";
import { EditableText } from "@/components/content/Editable";

function CharReveal({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  let ci = 0;
  return (
    <div ref={ref} className="flex flex-wrap gap-x-[0.28em]">
      {text.split(" ").map((w, wi) => (
        <span key={wi} className="inline-flex">
          {w.split("").map((ch, i) => { const p = ci / text.length; ci++; return <Ch key={`${wi}-${i}`} ch={ch} progress={scrollYProgress} pos={p} />; })}
          <span className="inline-block w-[0.28em]" />
        </span>
      ))}
    </div>
  );
}
function Ch({ ch, progress, pos }: { ch: string; progress: any; pos: number }) {
  const op = useTransform(progress, [pos, pos + 0.04], [0.08, 1]);
  return <motion.span className="font-outfit font-semibold text-[clamp(1.2rem,3vw,2.4rem)] leading-[1.35] tracking-tight" style={{ opacity: op, display: "inline-block", color: "var(--text)" }}>{ch}</motion.span>;
}

export default function About() {
  const { get, editing } = useContentStore();
  const body = get("about.body") as string;

  return (
    <section id="about" className="py-28 md:py-40 atmosphere">
      <div className="max-w-5xl mx-auto px-6 md:px-20">
        <EditableText path="about.eyebrow" as="p" className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase mb-12" style={{ color: "rgb(var(--highlight-rgb))" }} />

        {editing ? (
          <EditableText path="about.body" as="p" className="font-outfit font-semibold text-[clamp(1.2rem,3vw,2.4rem)] leading-[1.35] tracking-tight" style={{ color: "var(--text)" }} />
        ) : (
          <CharReveal text={body} />
        )}

        {/* AI-CMS highlight callout */}
        <motion.div
          className="glass-static mt-16 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "rgb(var(--highlight-rgb))" }} />
            <EditableText path="about.highlightLabel" as="p" className="font-outfit text-[10px] font-medium tracking-[0.25em] uppercase whitespace-nowrap" style={{ color: "rgb(var(--highlight-rgb))" }} />
          </div>
          <EditableText path="about.highlightText" as="p" className="font-outfit font-light text-[15px] md:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }} />
        </motion.div>
      </div>
    </section>
  );
}
