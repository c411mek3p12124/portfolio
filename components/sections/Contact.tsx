"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { useContentStore } from "@/components/content/ContentProvider";
import { EditableText } from "@/components/content/Editable";
import { EditableButton } from "@/components/content/EditableButton";

export default function Contact() {
  const { get, editing } = useContentStore();
  const email = get("brand.email");
  const accessKey: string = (get("contact.accessKey") ?? "").trim();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const set = (k: keyof typeof form, v: string) => { setForm({ ...form, [k]: v }); if (status !== "idle") setStatus("idle"); };

  const send = async () => {
    if (editing) return;
    // No Web3Forms key yet → fall back to the visitor's mail client.
    if (!accessKey) {
      const subject = encodeURIComponent(form.subject || `Hello from ${form.name || "your site"}`);
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      return;
    }
    if (!form.message.trim()) { setStatus("error"); setErrMsg("Please write a message first."); return; }
    setStatus("sending"); setErrMsg("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: form.subject || `New message from ${form.name || "your website"}`,
          from_name: form.name || "Website Contact",
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrMsg(data.message || `Failed to send (${res.status}).`);
      }
    } catch (e: any) {
      setStatus("error");
      setErrMsg(e?.message || "Network error — please try again.");
    }
  };

  const sending = status === "sending";

  return (
    <section id="contact" className="py-28 md:py-40 atmosphere">
      <div className="max-w-3xl mx-auto px-6 md:px-20">
        <EditableText path="contact.eyebrow" as="p" className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase mb-4" style={{ color: "rgb(var(--highlight-rgb))" }} />
        <EditableText path="contact.title" as="h2" className="font-outfit font-bold text-[clamp(2rem,5vw,3.5rem)] tracking-tightest mb-4" style={{ color: "var(--text)" }} />
        <EditableText path="contact.intro" as="p" className="font-outfit font-light text-base mb-10 max-w-md" style={{ color: "var(--text-secondary)" }} />

        <motion.div className="glass p-8 flex flex-col gap-5" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Name" className="input-field" value={form.name} onChange={(e) => set("name", e.target.value)} />
            <input type="email" placeholder="Email" className="input-field" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <input type="text" placeholder="Subject" className="input-field" value={form.subject} onChange={(e) => set("subject", e.target.value)} />
          <textarea placeholder="Tell me about your idea or project..." className="input-field min-h-[120px] resize-none" value={form.message} onChange={(e) => set("message", e.target.value)} />

          <div className="flex items-center gap-4 flex-wrap">
            <div className="self-start" style={{ opacity: sending ? 0.6 : 1, pointerEvents: sending ? "none" : "auto" }}>
              <EditableButton id="contactSend" labelPath="contact.sendLabel" variant="primary" onClick={send} />
            </div>
            {status === "sending" && <span className="font-outfit text-sm font-light" style={{ color: "var(--text-muted)" }}>Sending…</span>}
            {status === "sent" && <span className="font-outfit text-sm font-medium" style={{ color: "rgb(var(--highlight-rgb))" }}>{get("contact.sentLabel") || "Message sent — thank you!"}</span>}
            {status === "error" && <span className="font-outfit text-sm font-light" style={{ color: "#ef4444" }}>{errMsg}</span>}
          </div>

          {/* Operator: where messages are actually delivered (Web3Forms). */}
          {editing && (
            <div className="op-link-edit" style={{ flexDirection: "column", alignItems: "stretch", gap: 6 }}>
              <span className="font-outfit text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Web3Forms Access Key — messages are emailed to this key&apos;s address</span>
              <EditableText path="contact.accessKey" as="span" placeholder="paste your access key from web3forms.com" className="font-outfit text-[12px]" style={{ color: "rgb(var(--highlight-rgb))" }} />
              <span className="font-outfit text-[11px]" style={{ color: "var(--text-muted)" }}>
                Get a free key at web3forms.com using the email you want to receive messages at. To change the destination email later, create a new key for that email and paste it here.
              </span>
            </div>
          )}
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
