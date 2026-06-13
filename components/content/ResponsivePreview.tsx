"use client";
import { useEffect, useRef, useState } from "react";
import { useContentStore } from "./ContentProvider";

export type Device = "desktop" | "tablet" | "mobile";
const DEVICES: Record<Device, { w: number; h: number; label: string }> = {
  desktop: { w: 1280, h: 800, label: "Desktop" },
  tablet: { w: 820, h: 1180, label: "Tablet" },
  mobile: { w: 390, h: 844, label: "Mobile" },
};

export default function ResponsivePreview({ onClose, initial = "desktop" }: { onClose: () => void; initial?: Device }) {
  const { content } = useContentStore();
  const [device, setDevice] = useState<Device>(initial);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);

  const post = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: "operator:content", content }, "*");
  };

  // When the iframe signals ready, send the current content.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => { if (e.data?.type === "preview:ready") { readyRef.current = true; post(); } };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-send whenever content changes while open.
  useEffect(() => { if (readyRef.current) post(); /* eslint-disable-next-line */ }, [content]);

  const d = DEVICES[device];
  // Scale down if the device is wider than the available viewport.
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const avail = Math.min(window.innerWidth - 48, 1400);
      setScale(d.w > avail ? avail / d.w : 1);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [d.w]);

  return (
    <div className="rp-overlay">
      <div className="rp-bar">
        <span className="font-outfit text-[12px] font-medium" style={{ color: "var(--text)" }}>Responsive preview</span>
        <span className="w-px h-5" style={{ background: "var(--border)" }} />
        {(Object.keys(DEVICES) as Device[]).map((k) => (
          <button key={k} className={`rp-btn ${device === k ? "on" : ""}`} onClick={() => setDevice(k)}>
            {DEVICES[k].label} <span style={{ opacity: 0.6 }}>{DEVICES[k].w}</span>
          </button>
        ))}
        <span className="flex-1" />
        <button className="rp-btn" onClick={post} title="Refresh content">↻</button>
        <button className="rp-btn" onClick={onClose} title="Close">✕ Close</button>
      </div>

      <div className="rp-stage">
        <div className="rp-device" style={{ width: d.w * scale, height: d.h * scale }}>
          <iframe
            ref={iframeRef}
            src="/operator/preview"
            title="preview"
            onLoad={() => { readyRef.current = true; setTimeout(post, 60); }}
            style={{ width: d.w, height: d.h, border: "none", transform: `scale(${scale})`, transformOrigin: "top left" }}
          />
        </div>
      </div>
    </div>
  );
}
