"use client";
import { useContentStore } from "@/components/content/ContentProvider";
import WalkSequence from "@/components/WalkSequence";
import { EditableText } from "@/components/content/Editable";
import { EditableButton } from "@/components/content/EditableButton";
import About from "@/components/sections/About";
import Career from "@/components/sections/Career";
import Achievements from "@/components/sections/Achievements";
import Certifications from "@/components/sections/Certifications";
import Clients from "@/components/sections/Clients";
import Independent from "@/components/sections/Independent";
import Participant from "@/components/sections/Participant";
import Contact from "@/components/sections/Contact";

const SECTIONS: Record<string, React.ComponentType> = {
  about: About,
  journey: Career,
  recognition: Achievements,
  certifications: Certifications,
  clients: Clients,
  independent: Independent,
  participant: Participant,
  contact: Contact,
};

const Divider = () => (
  <div className="max-w-6xl mx-auto px-6 md:px-20"><div className="divider" /></div>
);

export default function SectionRenderer() {
  const { content, editing } = useContentStore();
  const layout = content.layout ?? [];

  let lastWasSection = false;
  return (
    <>
      {layout.map((b, i) => {
        if (!b.visible) return null;

        if (b.type === "walk") {
          lastWasSection = false;
          const overlayCount = b.overlays?.length ?? ((b.title || b.text) ? 1 : 0);
          // In edit mode: slim placeholder. Overlays are managed in the Sequences panel.
          if (editing) {
            return (
              <div key={`walk-${i}`} className="max-w-6xl mx-auto my-10 px-6 md:px-20">
                <div className="glass-static p-5 flex items-center gap-3" style={{ borderStyle: "dashed" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--highlight-rgb))" strokeWidth="1.6"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  <span className="font-outfit text-[13px]" style={{ color: "var(--text-secondary)" }}>
                    Sequence · <b style={{ color: "var(--text)" }}>{b.folder}</b> · <span style={{ color: "rgb(var(--highlight-rgb))" }}>{overlayCount} overlay{overlayCount === 1 ? "" : "s"}</span>
                    <span style={{ color: "var(--text-muted)" }}> — open the <b>Sequences</b> panel (▶ icon) to add timed text/images. Shows in Preview &amp; live.</span>
                  </span>
                </div>
                {/* End-of-sequence CTA (shows over every non-hero sequence on the live site). */}
                <div className="glass-static p-5 mt-3">
                  <p className="font-outfit text-[10px] font-light tracking-[0.3em] uppercase mb-3" style={{ color: "var(--text-muted)" }}>Sequence CTA (end of every sequence)</p>
                  <EditableText path="sequenceCta.title" as="p" className="font-outfit font-light text-sm mb-1" style={{ color: "var(--text-muted)" }} />
                  <EditableText path="sequenceCta.subtitle" as="h2" className="font-outfit font-bold text-2xl tracking-tight mb-4" style={{ color: "var(--text)" }} />
                  <EditableButton id="sequenceCta" labelPath="sequenceCta.button" variant="primary" />
                  <p className="font-outfit text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>Click the ⚙ on the button to set its <b>Link</b> (e.g. WhatsApp).</p>
                </div>
              </div>
            );
          }
          return <WalkSequence key={`walk-${i}`} folder={b.folder} totalFrames={211} title={b.title} text={b.text} overlays={b.overlays} />;
        }

        const Cmp = SECTIONS[b.id];
        if (!Cmp) return null;
        const divider = lastWasSection ? <Divider /> : null;
        lastWasSection = true;
        return (
          <div key={`sec-${b.id}-${i}`}>
            {divider}
            <Cmp />
          </div>
        );
      })}
    </>
  );
}
