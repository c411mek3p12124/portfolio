"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { useContentStore } from "@/components/content/ContentProvider";
import { EditableText } from "@/components/content/Editable";
import { EditableButton } from "@/components/content/EditableButton";

export default function Contact() {
  const { get, editing } = useContentStore();
  const email = get("brand.email");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const send = () => {
    const subject = encodeURIComponent(form.subject || `Hello from ${form.name || "your site"}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-28 md:py-40 atmosphere">
      <div className="max-w-3xl mx-auto px-6 md:px-20">
        <EditableText path="contact.eyebrow" as="p" className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase mb-4" style={{ color: "rgb(var(--highlight-rgb))" }} />
        <EditableText path="contact.title" as="h2" className="font-outfit font-bold text-[clamp(2rem,5vw,3.5rem)] tracking-tightest mb-4" style={{ color: "var(--text)" }} />
        <EditableText path="contact.intro" as="p" className="font-outfit font-light text-base mb-10 max-w-md" style={{ color: "var(--text-secondary)" }} />

        <motion.div className="glass p-8 flex flex-col gap-5" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Name" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input type="email" placeholder="Email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <input type="text" placeholder="Subject" className="input-field" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <textarea placeholder="Tell me about your idea or project..." className="input-field min-h-[120px] resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <div className="self-start"><EditableButton id="contactSend" labelPath="contact.sendLabel" variant="primary" onClick={send} /></div>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-6 items-center">
          {editing
            ? <span className="flex items-center gap-2"><span className="font-outfit text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Email</span><EditableText path="brand.email" as="span" placeholder="you@email.com" className="font-outfit text-sm font-light" style={{ color: "rgb(var(--highlight-rgb))" }} /></span>
            : <a href={`mailto:${email}`} className="font-outfit text-sm font-light" style={{ color: "rgb(var(--highlight-rgb))" }}>{email}</a>}
          <EditableText path="contact.location" as="span" className="font-outfit text-sm font-light" style={{ color: "var(--text-muted)" }} />
        </div>
      </div>
    </section>
  );
}
