"use client";

import ThemeProvider from "@/components/ThemeProvider";
import ContentProvider from "@/components/content/ContentProvider";
import { EditorUIProvider } from "@/components/content/EditorUI";
import { ThemeApplier } from "@/components/content/StylePanels";
import OperatorGate from "@/components/content/OperatorGate";
import OperatorBody from "@/components/OperatorBody";
import OperatorToolbar from "@/components/content/OperatorToolbar";
import FormatBar from "@/components/content/FormatBar";
import { ButtonBar } from "@/components/content/EditableButton";

export default function OperatorPage() {
  return (
    <ThemeProvider>
      <OperatorGate>
        <ContentProvider editing autoload>
          <EditorUIProvider>
            <ThemeApplier />
            <FormatBar />
            <ButtonBar />
            <div style={{ paddingBottom: "96px" }}>
              <OperatorBody />
            </div>
            <OperatorToolbar />
          </EditorUIProvider>
        </ContentProvider>
      </OperatorGate>
    </ThemeProvider>
  );
}
