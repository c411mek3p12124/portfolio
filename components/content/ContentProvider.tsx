"use client";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { SiteContent, DEFAULT_CONTENT, DEFAULT_THEME, DEFAULT_LAYOUT, ElementStyle } from "@/lib/content";
import { getPath, setPath } from "@/lib/path";

interface ContentCtx {
  content: SiteContent;
  editing: boolean;
  setEditing: (v: boolean) => void;
  dirty: boolean;
  get: (path: string) => any;
  set: (path: string, value: any) => void;
  addItem: (path: string, item: any) => void;
  removeItem: (path: string, index: number) => void;
  replaceAll: (next: SiteContent) => void;
  hydrate: (next: SiteContent) => void;
  markSaved: () => void;
  // per-element visual styles (keyed by literal dotted path)
  getStyle: (path: string) => ElementStyle;
  setStyle: (path: string, partial: ElementStyle) => void;
  clearStyle: (path: string) => void;
}

const Ctx = createContext<ContentCtx | null>(null);

export function useContentStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContentStore must be used inside <ContentProvider>");
  return ctx;
}

function isPlainObject(v: any): boolean {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}
// Deep-merge `over` onto `base`: nested objects merge recursively, while
// arrays and primitives are replaced. Keeps new default fields when the
// loaded JSON predates them.
function deepMerge<T>(base: T, over: any): T {
  if (over === undefined || over === null) return base;
  if (!isPlainObject(base) || !isPlainObject(over)) return over as T;
  const out: any = { ...base };
  for (const k of Object.keys(over)) out[k] = deepMerge((base as any)[k], over[k]);
  return out;
}

// Ensure the operator visual layer always exists after load/import.
function withDefaults(c: SiteContent): SiteContent {
  return {
    ...c,
    styles: c.styles ?? {},
    theme: c.theme ?? DEFAULT_THEME,
    layout: c.layout && c.layout.length ? c.layout : DEFAULT_LAYOUT,
  };
}

export default function ContentProvider({
  children,
  initial,
  editing: editingProp = false,
  autoload = true,
  source = "/content/site.json",
}: {
  children: ReactNode;
  initial?: SiteContent;
  editing?: boolean;
  autoload?: boolean;
  source?: string;
}) {
  const [content, setContent] = useState<SiteContent>(withDefaults(initial ?? DEFAULT_CONTENT));
  const [dirty, setDirty] = useState(false);
  const [editing, setEditing] = useState(editingProp);

  // Load the published content (committed by the operator) at runtime.
  useEffect(() => {
    if (!autoload) return;
    let alive = true;
    fetch(`${source}?t=${Date.now()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (alive && data) setContent((prev) => withDefaults(deepMerge(prev, data))); })
      .catch(() => {});
    return () => { alive = false; };
  }, [autoload, source]);

  const get = useCallback((path: string) => getPath(content, path), [content]);

  const set = useCallback((path: string, value: any) => {
    setContent((prev) => setPath(prev, path, value));
    setDirty(true);
  }, []);

  const addItem = useCallback((path: string, item: any) => {
    setContent((prev) => {
      const arr = getPath(prev, path) as any[];
      return setPath(prev, path, [...arr, item]);
    });
    setDirty(true);
  }, []);

  const removeItem = useCallback((path: string, index: number) => {
    setContent((prev) => {
      const arr = getPath(prev, path) as any[];
      return setPath(prev, path, arr.filter((_, i) => i !== index));
    });
    setDirty(true);
  }, []);

  const replaceAll = useCallback((next: SiteContent) => {
    setContent(withDefaults(next));
    setDirty(true);
  }, []);

  const hydrate = useCallback((next: SiteContent) => {
    setContent(withDefaults(next));
    setDirty(false);
  }, []);

  const markSaved = useCallback(() => setDirty(false), []);

  // ── per-element styles (stored under content.styles[path] as a literal key) ──
  const getStyle = useCallback((path: string): ElementStyle => content.styles?.[path] ?? {}, [content]);

  const setStyle = useCallback((path: string, partial: ElementStyle) => {
    setContent((prev) => {
      const prevStyle = prev.styles?.[path] ?? {};
      const merged = { ...prevStyle, ...partial };
      // drop keys explicitly set to undefined/"" so they revert to base
      Object.keys(merged).forEach((k) => {
        const v = (merged as any)[k];
        if (v === undefined || v === null || v === "") delete (merged as any)[k];
      });
      return { ...prev, styles: { ...(prev.styles ?? {}), [path]: merged } };
    });
    setDirty(true);
  }, []);

  const clearStyle = useCallback((path: string) => {
    setContent((prev) => {
      const next = { ...(prev.styles ?? {}) };
      delete next[path];
      return { ...prev, styles: next };
    });
    setDirty(true);
  }, []);

  return (
    <Ctx.Provider value={{ content, editing, setEditing, dirty, get, set, addItem, removeItem, replaceAll, hydrate, markSaved, getStyle, setStyle, clearStyle }}>
      {children}
    </Ctx.Provider>
  );
}
