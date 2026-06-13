import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "I Made Pradnya Budi Pratama (Keppra) — Digital Business Architect & AI Integrator",
  description:
    "Award-winning founder and developer building ventures and AI-powered systems — from circular-economy startups to free tools for micro-businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body className="grain">{children}</body>
    </html>
  );
}
