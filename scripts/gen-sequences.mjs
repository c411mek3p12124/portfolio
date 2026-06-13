// Auto-detect sequence frames so there is NO hard limit on frame count.
// Scans public/ for the "sequence" folder and any "walk*" folders, lists the
// image files (natural-sorted), and writes public/sequences.json:
//   { "dark": ["/sequence/dark/001.webp", ...], "light": [...],
//     "sequence": ["/sequence/001.png", ...], "walk-01": ["/walk-01/001.png", ...] }
// The hero sequence is theme-aware: frames live in public/sequence/dark and
// public/sequence/light. A flat public/sequence/*.img still works (legacy "sequence").
// Runs automatically before `dev` and `build` (see package.json).
import { readdirSync, existsSync, writeFileSync } from "fs";
import { join } from "path";

const PUB = join(process.cwd(), "public");
const IMG = /\.(png|jpe?g|webp|avif|gif)$/i;
const nat = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const list = (rel) => {
  const dir = join(PUB, ...rel.split("/"));
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => IMG.test(f)).sort(nat).map((f) => `/${rel}/${f}`);
};

const out = {};

// Theme-aware hero sequence: public/sequence/dark + public/sequence/light → keys "dark"/"light"
// Theme-aware "else" sequence (non-hero): public/sequence/else/dark|light → keys "else-dark"/"else-light"
for (const theme of ["dark", "light"]) {
  const hero = list(`sequence/${theme}`);
  if (hero.length) out[theme] = hero;
  const els = list(`sequence/else/${theme}`);
  if (els.length) out[`else-${theme}`] = els;
}

// Legacy flat sequence (public/sequence/*.img) + any walk* folders
if (existsSync(PUB)) {
  for (const entry of readdirSync(PUB, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    const isSeq = name === "sequence" || /^walk/i.test(name);
    if (!isSeq) continue;
    const files = list(name);
    if (files.length) out[name] = files;
  }
}

writeFileSync(join(PUB, "sequences.json"), JSON.stringify(out));
console.log(
  "[sequences] " + (Object.entries(out).map(([k, v]) => `${k}=${v.length}`).join(", ") || "no sequence folders found")
);
