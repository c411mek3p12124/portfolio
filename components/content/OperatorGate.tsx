"use client";
import { useEffect, useState, ReactNode } from "react";
import { motion } from "motion/react";
import { OPERATOR_HASH, sha256 } from "@/lib/operatorAuth";

const SS_KEY = "operator.unlocked";

export default function OperatorGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SS_KEY) === "1");
    setReady(true);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const ok = (await sha256(pw)) === OPERATOR_HASH;
    setBusy(false);
    if (ok) {
      sessionStorage.setItem(SS_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setPw("");
    }
  };

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 atmosphere">
      <motion.form
        onSubmit={submit}
        className="glass-static w-full max-w-sm p-8 flex flex-col gap-5 text-center"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="w-14 h-14 mx-auto rounded-2xl glass-static flex items-center justify-center" style={{ color: "rgb(var(--highlight-rgb))" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        </div>
        <div>
          <h1 className="font-outfit font-bold text-xl tracking-tight" style={{ color: "var(--text)" }}>Operator Access</h1>
          <p className="font-outfit font-light text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>Enter the password to edit your site.</p>
        </div>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="input-field text-center"
        />
        {error && <p className="font-outfit text-[12px]" style={{ color: "#ef4444" }}>Wrong password. Try again.</p>}
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? "Checking…" : "Unlock"}
        </button>
        <a href="/" className="font-outfit text-[12px] font-light" style={{ color: "var(--text-muted)" }}>← Back to site</a>
      </motion.form>
    </div>
  );
}
