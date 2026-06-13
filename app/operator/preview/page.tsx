"use client";

import { useEffect } from "react";
import ThemeProvider from "@/components/ThemeProvider";
import ContentProvider, { useContentStore } from "@/components/content/ContentProvider";
import { ThemeApplier } from "@/components/content/StylePanels";
import PortfolioBody from "@/components/PortfolioBody";

/* Receives the operator's (possibly unsaved) content via postMessage and
   renders the real live layout, so the parent can frame it at device widths. */
function PreviewBridge() {
  const { hydrate } = useContentStore();
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === "operator:content" && e.data.content) hydrate(e.data.content);
    };
    window.addEventListener("message", onMsg);
    // tell the parent we're ready to receive content
    window.parent?.postMessage({ type: "preview:ready" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, [hydrate]);
  return null;
}

export default function OperatorPreview() {
  return (
    <ThemeProvider>
      <ContentProvider editing={false} autoload={false}>
        <ThemeApplier />
        <PreviewBridge />
        <PortfolioBody onBack={() => {}} />
      </ContentProvider>
    </ThemeProvider>
  );
}
