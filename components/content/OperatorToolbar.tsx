"use client";
import { useEffect, useRef, useState } from "react";
import { useContentStore } from "./ContentProvider";
import { ThemePanel, LayoutPanel, SequencesPanel } from "./StylePanels";
import ResponsivePreview from "./ResponsivePreview";
import FullscreenMenu from "@/components/FullscreenMenu";
import { GitHubSettings, loadSettings, saveSettings, commitContent, commitBinaryFile } from "@/lib/github";
import type { SiteContent } from "@/lib/content";

type Status = { kind: "idle" | "saving" | "ok" | "err"; msg?: string };
type Panel = null | "github" | "theme" | "layout" | "sequences" | "music";

const JUMP = [
  { id: "home", label: "Hero" },
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "recognition", label: "Recognition" },
  { id: "certifications", label: "Certifications" },
  { id: "clients", label: "Real Projects" },
  { id: "independent", label: "Independent" },
  { id: "participant", label: "Activities" },
  { id: "contact", label: "Contact" },
];

export default function OperatorToolbar() {
  const { content, dirty, markSaved, hydrate, editing, setEditing, get, set } = useContentStore();
  const [settings, setSettings] = useState<GitHubSettings | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [rp, setRp] = useState<null | "desktop" | "tablet" | "mobile">(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const importRef = useRef<HTMLInputElement>(null);
  const musicRef = useRef<HTMLInputElement>(null);
  const [musicPreview, setMusicPreview] = useState("");

  useEffect(() => { setSettings(loadSettings()); }, []);
  if (!settings) return null;

  const update = (k: keyof GitHubSettings, v: string) => setSettings({ ...settings, [k]: v });

  const save = async () => {
    if (!settings.owner || !settings.repo || !settings.token) {
      setPanel("github");
      setStatus({ kind: "err", msg: "Add your GitHub token to save (owner & repo are pre-filled)." });
      return;
    }
    setStatus({ kind: "saving" });
    try {
      saveSettings(settings);
      await commitContent(settings, content);
      markSaved();
      setStatus({ kind: "ok", msg: "Saved & committed. Vercel will redeploy shortly." });
    } catch (e: any) {
      setStatus({ kind: "err", msg: e.message || "Failed to save." });
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "site.json";
    a.click();
  };

  const importJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { hydrate(JSON.parse(reader.result as string) as SiteContent); setStatus({ kind: "ok", msg: "Imported." }); }
      catch { setStatus({ kind: "err", msg: "Invalid JSON file." }); }
    };
    reader.readAsText(file);
  };

  const uploadMusic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!settings.owner || !settings.repo || !settings.token) {
      setPanel("github");
      setStatus({ kind: "err", msg: "Add your GitHub token first (to store the audio file)." });
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setStatus({ kind: "err", msg: "Audio too large (max ~12 MB). Use a shorter / compressed mp3." });
      return;
    }
    setStatus({ kind: "saving" });
    try {
      const dataUrl: string = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const base64 = dataUrl.split(",")[1] || "";
      const ext = (file.name.split(".").pop() || "mp3").toLowerCase().replace(/[^a-z0-9]/g, "") || "mp3";
      const repoPath = `public/audio/track.${ext}`;
      await commitBinaryFile(settings, repoPath, base64);
      set("audio.track", `/audio/track.${ext}`);
      setMusicPreview(URL.createObjectURL(file)); // local preview until Vercel redeploys
      setStatus({ kind: "ok", msg: "Music uploaded & committed. Click 'Save to GitHub', then it goes live after redeploy." });
    } catch (err: any) {
      setStatus({ kind: "err", msg: err.message || "Upload failed." });
    }
  };

  const jump = (id: string) => {
    if (editing && id !== "home") setEditing(false); // ensure real sections exist for anchors
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 30);
  };

  const dotColor = dirty ? "#f59e0b" : "#22c55e";

  return (
    <>
      <div className="op-toolbar">
        {/* Edit / Preview */}
        <button className={`op-mode ${editing ? "on" : ""}`} onClick={() => setEditing(true)} title="Edit mode">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg> Edit
        </button>
        <button className={`op-mode ${!editing ? "on" : ""}`} onClick={() => setEditing(false)} title="Preview (see before save)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> Preview
        </button>
        <button className="op-mode" onClick={() => setRp("desktop")} title="Preview on desktop">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="1" /><path d="M8 21h8M12 17v4" /></svg>
        </button>
        <button className="op-mode" onClick={() => setRp("tablet")} title="Preview on tablet">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
        </button>
        <button className="op-mode" onClick={() => setRp("mobile")} title="Preview on mobile">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="6" y="2" width="12" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
        </button>

        <span className="w-px h-5" style={{ background: "var(--border)" }} />

        <span className="dot" style={{ background: dotColor }} title={dirty ? "Unsaved changes" : "All saved"} />

        {/* Jump to section */}
        <select className="op-jump" value="" onChange={(e) => { if (e.target.value) jump(e.target.value); }} title="Jump to section">
          <option value="">Go to…</option>
          {JUMP.map((j) => <option key={j.id} value={j.id}>{j.label}</option>)}
        </select>

        <span className="w-px h-5" style={{ background: "var(--border)" }} />

        <button className="icon-btn !w-9 !h-9" title="Colors & theme" onClick={() => setPanel("theme")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125 0-.926.746-1.688 1.688-1.688H16c3.314 0 6-2.686 6-6 0-4.97-4.5-8.5-10-8.5z" /></svg>
        </button>
        <button className="icon-btn !w-9 !h-9" title="Sections (order / show / hide)" onClick={() => setPanel("layout")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="6" rx="1" /><rect x="3" y="13" width="18" height="3" rx="1" /><rect x="3" y="18" width="18" height="3" rx="1" /></svg>
        </button>
        <button className="icon-btn !w-9 !h-9" title="Sequences (timed overlays)" onClick={() => setPanel("sequences")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
        </button>
        <button className="icon-btn !w-9 !h-9" title="Background music (upload mp3)" onClick={() => setPanel("music")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
        </button>
        <button className="icon-btn !w-9 !h-9" title="Edit hamburger menu" onClick={() => setMenuOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <button className="icon-btn !w-9 !h-9" title="GitHub settings" onClick={() => setPanel("github")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
        </button>
        <button className="icon-btn !w-9 !h-9" title="Export JSON" onClick={exportJson}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
        </button>
        <button className="icon-btn !w-9 !h-9" title="Import JSON" onClick={() => importRef.current?.click()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 8l5-5 5 5M12 3v12" /></svg>
        </button>
        <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={importJson} />
        <input ref={musicRef} type="file" accept="audio/*,.mp3,.m4a,.ogg,.wav" className="hidden" onChange={uploadMusic} />

        <button className="btn-primary !py-2.5 !px-5 !text-[13px]" onClick={save} disabled={status.kind === "saving"}>
          {status.kind === "saving" ? "Saving…" : "Save to GitHub"}
        </button>
      </div>

      {status.kind !== "idle" && status.kind !== "saving" && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-[84px] z-[9998] px-4 py-2 rounded-xl glass-static font-outfit text-[12px]"
          style={{ color: status.kind === "err" ? "#ef4444" : "var(--text-secondary)", maxWidth: "90vw" }}>
          {status.msg}
        </div>
      )}

      {panel === "theme" && <ThemePanel onClose={() => setPanel(null)} />}
      {panel === "layout" && <LayoutPanel onClose={() => setPanel(null)} />}
      {panel === "sequences" && <SequencesPanel onClose={() => setPanel(null)} />}
      {rp && <ResponsivePreview initial={rp} onClose={() => setRp(null)} />}
      <FullscreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onBack={() => setMenuOpen(false)} />

      {panel === "music" && (
        <div className="op-panel" onClick={() => setPanel(null)}>
          <div className="op-panel-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-outfit font-bold text-lg mb-1" style={{ color: "var(--text)" }}>Background Music</h3>
            <p className="font-outfit font-light text-[13px] mb-5" style={{ color: "var(--text-secondary)" }}>
              Upload an mp3 (or m4a/ogg/wav, max ~12 MB). It&apos;s stored in your repo and plays from the speaker icon in the header / opening.
            </p>
            <div className="flex items-center gap-3 mb-4">
              {get("audio.track")
                ? <span className="font-outfit text-[12px]" style={{ color: "rgb(var(--highlight-rgb))" }}>Current: {String(get("audio.track")).split("/").pop()}</span>
                : <span className="font-outfit text-[12px]" style={{ color: "var(--text-muted)" }}>No music yet.</span>}
            </div>
            {(musicPreview || get("audio.track")) && (
              <audio key={musicPreview || String(get("audio.track"))} controls src={musicPreview || get("audio.track")} className="w-full mb-4" />
            )}
            <div className="flex gap-3">
              <button className="btn-primary flex-1 !py-3" onClick={() => musicRef.current?.click()} disabled={status.kind === "saving"}>
                {status.kind === "saving" ? "Uploading…" : (get("audio.track") ? "Replace music" : "Upload mp3")}
              </button>
              {get("audio.track") && <button className="btn-outline !py-3" onClick={() => { set("audio.track", ""); setStatus({ kind: "ok", msg: "Music removed. Click 'Save to GitHub' to apply." }); }}>Remove</button>}
              <button className="btn-outline !py-3" onClick={() => setPanel(null)}>Close</button>
            </div>
            <p className="font-outfit text-[11px] mt-4" style={{ color: "var(--text-muted)" }}>
              After uploading, click <b>Save to GitHub</b>. The track goes live once Vercel finishes redeploying (~1 min). Plays only after a visitor clicks the speaker icon (browser rule).
            </p>
          </div>
        </div>
      )}

      {panel === "github" && (
        <div className="op-panel" onClick={() => setPanel(null)}>
          <div className="op-panel-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-outfit font-bold text-lg mb-1" style={{ color: "var(--text)" }}>GitHub Connection</h3>
            <p className="font-outfit font-light text-[13px] mb-5" style={{ color: "var(--text-secondary)" }}>
              A fine-grained token with <b>Contents: Read &amp; Write</b> on this repo. Stored only in your browser.
            </p>
            <div className="flex flex-col gap-3">
              {([
                ["owner", "GitHub username / org", "your-username"],
                ["repo", "Repository name", "portfolio"],
                ["branch", "Branch", "main"],
                ["path", "Path to content file", "public/content/site.json"],
              ] as const).map(([k, label, ph]) => (
                <label key={k} className="flex flex-col gap-1">
                  <span className="font-outfit text-[11px] font-medium tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>{label}</span>
                  <input className="input-field" value={(settings as any)[k]} placeholder={ph} onChange={(e) => update(k, e.target.value)} />
                </label>
              ))}
              <label className="flex flex-col gap-1">
                <span className="font-outfit text-[11px] font-medium tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>Personal access token</span>
                <input className="input-field" type="password" value={settings.token} placeholder="github_pat_…" onChange={(e) => update("token", e.target.value)} />
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-primary flex-1 !py-3" onClick={() => { saveSettings(settings); setPanel(null); }}>Save settings</button>
              <button className="btn-outline !py-3" onClick={() => setPanel(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
