"use client";
import { motion } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { useContentStore } from "./content/ContentProvider";
import { LogoDisplay } from "./content/Brand";

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  soundOn: boolean;
  onToggleSound: () => void;
}

export default function Header({ onMenuToggle, isMenuOpen, soundOn, onToggleSound }: HeaderProps) {
  const { theme, toggle } = useTheme();
  const { get } = useContentStore();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-10"
      style={{ height: "var(--header-h)", background: "var(--bg)", borderBottom: "1px solid var(--border)" }}
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Logo */}
      <a href="#" className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl glass-static flex items-center justify-center overflow-hidden">
          <LogoDisplay slot="header" imgClass="w-9 h-9 object-contain" textClass="font-outfit font-bold text-xs" />
        </div>
        <span className="hidden md:block font-outfit font-semibold text-sm tracking-tight" style={{ color: "var(--text)" }}>{get("brand.alias")}</span>
      </a>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button onClick={toggle} className="icon-btn" title={theme === "dark" ? "Light mode" : "Dark mode"}>
          {theme === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>

        {/* Sound toggle */}
        <button onClick={onToggleSound} className="icon-btn" title={soundOn ? "Mute" : "Unmute"}>
          {soundOn ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          )}
        </button>

        {/* Menu */}
        <button onClick={onMenuToggle} className="icon-btn" aria-label="Menu">
          <div className="flex flex-col gap-[5px]">
            <motion.span className="block w-[18px] h-[1.5px] origin-center" style={{ background: "var(--text)" }}
              animate={isMenuOpen ? { rotate: 45, y: 3.25 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} />
            <motion.span className="block w-[18px] h-[1.5px] origin-center" style={{ background: "var(--text)" }}
              animate={isMenuOpen ? { rotate: -45, y: -3.25 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} />
          </div>
        </button>
      </div>
    </motion.header>
  );
}
