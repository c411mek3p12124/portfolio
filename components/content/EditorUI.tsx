"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Kind = "text" | "image" | "button" | "logo" | null;

interface EditorUICtx {
  activePath: string | null;
  activeKind: Kind;
  select: (path: string, kind: Exclude<Kind, null>) => void;
  clear: () => void;
}

const noop: EditorUICtx = { activePath: null, activeKind: null, select: () => {}, clear: () => {} };
const Ctx = createContext<EditorUICtx>(noop);

export function useEditorUI() {
  return useContext(Ctx);
}

export function EditorUIProvider({ children }: { children: ReactNode }) {
  const [activePath, setActivePath] = useState<string | null>(null);
  const [activeKind, setActiveKind] = useState<Kind>(null);

  const select = useCallback((path: string, kind: Exclude<Kind, null>) => {
    setActivePath(path);
    setActiveKind(kind);
  }, []);

  const clear = useCallback(() => { setActivePath(null); setActiveKind(null); }, []);

  return <Ctx.Provider value={{ activePath, activeKind, select, clear }}>{children}</Ctx.Provider>;
}
