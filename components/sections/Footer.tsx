"use client";
import { useContentStore } from "@/components/content/ContentProvider";
import { EditableText, EditableLink, AddButton, RemoveButton } from "@/components/content/Editable";
import { SocialIcon } from "@/components/content/SocialIcon";

export default function Footer() {
  const { get, editing, addItem, removeItem } = useContentStore();
  const email = get("brand.email");
  const social = (get("social") ?? []) as { label: string; url: string }[];
  const nav = (get("footer.nav") ?? []) as { label: string; id: string }[];

  return (
    <footer className="pt-16 pb-10 px-6 md:px-20" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">
          <div>
            <EditableText path="brand.name" as="p" className="font-outfit font-semibold text-base mb-3" style={{ color: "var(--text)" }} />
            <EditableText path="footer.tagline" as="p" className="font-outfit font-light text-sm leading-relaxed max-w-xs" style={{ color: "var(--text-secondary)" }} />
          </div>
          <div>
            <EditableText path="footer.navLabel" as="p" className="font-outfit text-[10px] font-light tracking-[0.3em] uppercase mb-4" style={{ color: "var(--text-muted)" }} />
            <div className="grid grid-cols-2 gap-2">
              {nav.map((n, i) => (
                editing
                  ? <EditableText key={i} path={`footer.nav.${i}.label`} as="span" className="font-outfit text-sm font-light" style={{ color: "var(--text-secondary)" }} />
                  : <a key={i} href={`#${n.id}`} className="font-outfit text-sm font-light hover:translate-x-1 transition-transform" style={{ color: "var(--text-secondary)" }}>{n.label}</a>
              ))}
            </div>
          </div>
          <div>
            <EditableText path="footer.connectLabel" as="p" className="font-outfit text-[10px] font-light tracking-[0.3em] uppercase mb-4" style={{ color: "var(--text-muted)" }} />
            {editing ? (
              <div className="flex flex-col gap-3 mb-4">
                {social.map((s, i) => (
                  <div key={i} className="glass-static p-3 relative">
                    <RemoveButton onClick={() => removeItem("social", i)} />
                    <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                      <SocialIcon label={s.label} />
                      <EditableText path={`social.${i}.label`} as="span" className="font-outfit text-sm font-medium" style={{ color: "var(--text)" }} />
                    </div>
                    <EditableLink path={`social.${i}.url`} label="URL" />
                  </div>
                ))}
                <AddButton label="Add social link" onClick={() => addItem("social", { label: "New", url: "" })} />
              </div>
            ) : (
              <div className="flex flex-col gap-2 mb-4">{social.filter((s) => s.url).map((s) => <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="font-outfit text-sm font-light hover:translate-x-1 transition-transform inline-flex items-center gap-2.5" style={{ color: "var(--text-secondary)" }}><SocialIcon label={s.label} />{s.label}</a>)}</div>
            )}
            {editing
              ? <EditableText path="brand.email" as="span" placeholder="you@email.com" className="font-outfit text-sm font-light" style={{ color: "rgb(var(--highlight-rgb))" }} />
              : <a href={`mailto:${email}`} className="font-outfit text-sm font-light" style={{ color: "rgb(var(--highlight-rgb))" }}>{email}</a>}
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="font-outfit text-[11px] font-light tracking-wider flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} <EditableText path="brand.name" as="span" /> · <EditableText path="footer.rights" as="span" />
          </p>
          <EditableText path="brand.location" as="p" className="font-outfit text-[11px] font-light tracking-wider" style={{ color: "var(--text-muted)" }} />
        </div>
      </div>
    </footer>
  );
}
