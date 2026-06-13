// ═══════════════════════════════════════════════════════════════════════
//  SINGLE SOURCE OF TRUTH for all editable site content.
//  Every section reads from here. The /operator route edits this shape
//  and commits the result back to GitHub (content/site.json).
// ═══════════════════════════════════════════════════════════════════════

export interface LinkItem {
  label: string;
  url: string;
}

// Per-element visual overrides set in the operator (Canva/Word-style).
export interface ElementStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: number;
  fontStyle?: string;       // "italic"
  textDecoration?: string;  // "underline"
  textAlign?: string;       // "left" | "center" | "right"
  color?: string;
  letterSpacing?: string;
  lineHeight?: string;
  width?: string;           // images (e.g. "60%")
  borderRadius?: string;    // images
}

export interface ThemeColors {
  accentDark: string;
  accentLight: string;
  bgDark: string;
  bgLight: string;
}

export interface ButtonStyle {
  size?: "sm" | "md" | "lg";
  radius?: string;
  arrow?: boolean;
  show?: boolean;
  link?: string;   // optional URL (e.g. WhatsApp). When set, the button navigates here.
}

// A timed overlay shown while scrolling through a sequence.
// start/end are 0–100 (% of the way through the sequence ≈ which "second").
export interface SeqOverlay {
  kind: "text" | "image";
  eyebrow?: string;   // small uppercase accent line (hero style)
  text?: string;      // big bold title (hero style)
  subtext?: string;   // light tagline (hero style)
  image?: string;
  start: number;      // 0–100 (% of the sequence ≈ frame position)
  end: number;
  align?: "left" | "center" | "right";
}

export type LayoutBlock =
  | { type: "section"; id: string; visible: boolean }
  | { type: "walk"; folder: string; visible: boolean; title?: string; text?: string; overlays?: SeqOverlay[] };

export interface LogoSlot {
  mode: "image" | "text" | "none";
  image: string;
  text: string;
  imgSize?: number;     // px (image logo)
  textSize?: number;    // px (text logo)
  textFont?: string;    // font-family (text logo)
  textBold?: boolean;   // text logo weight
}

export interface JourneyItem {
  year: string;
  title: string;
  desc: string;
  tag: string;
  link?: string;
  image?: string; // optional photo (data URL or /path). Empty = nothing shown on live.
}

export interface AchievementItem {
  title: string;
  org: string;
  year: string;
  desc: string;
  image: string; // certificate image (data URL or /path). Empty = placeholder.
  link?: string; // optional proof / verification URL
}

export interface CertificationItem {
  name: string;
  field: string; // bidang — area / domain of the certification
  issuer: string;
  year: string;
  image: string; // certificate image (data URL or /path). Empty = placeholder.
  link?: string; // optional verification / credential URL
}

export interface VentureItem {
  name: string;
  category: string;
  tagline: string;
  description: string;
  status: string;
  role: string;
  impact: string;
  tech: string[];
  link: string; // filled by the owner in the operator
  image: string;
}

// Independent (self-initiated) project. A "tool" opens an interactive page
// inside the portfolio; an "info" card just links out.
export interface IndependentItem {
  name: string;
  category: string;
  tagline: string;
  description: string;
  status: string;
  role: string;
  impact: string;
  tech: string[];
  image: string;
  kind: "tool" | "info";
  tool?: string;   // slug → opens /tools/<slug>/index.html in an in-app page
  ready?: boolean; // false = "coming soon" (tool not built yet)
  link: string;    // for info cards (and optional external link on tools)
}

export interface ParticipantItem {
  title: string;
  type: string;    // Organization | Seminar | Participant | Volunteer | …
  org: string;
  date: string;
  desc: string;
  image: string;
  link?: string;
}

export interface SiteContent {
  brand: {
    name: string;
    alias: string;
    role: string;
    logo: string;
    logoMode?: "image" | "text" | "none";
    logoText?: string;
    logos?: { header?: LogoSlot; landingTop?: LogoSlot; landingCenter?: LogoSlot };
    email: string;
    location: string;
  };
  landing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    intro: string;
    primaryCta: string;
    secondaryCta: string;
    credit: string;
    loadingText?: string;        // text on the opening / loading screen
    btnRadius?: string;          // e.g. "999px" or "12px"
    btnSize?: "sm" | "md" | "lg";
    btnArrow?: boolean;          // show the → arrow
    primaryShow?: boolean;       // show the primary button
    secondaryShow?: boolean;     // show the secondary button
  };
  hero: {
    eyebrow: string;
    title: string;
    tagline: string;
    approachLabel: string;
    approachText: string;
    promiseLabel: string;
    promiseText: string;
    ctaLead: string;
    ctaTitle: string;
    ctaButton: string;
  };
  // CTA shown near the end of every non-hero sequence.
  sequenceCta: {
    title: string;
    subtitle: string;
    button: string;
  };
  about: {
    eyebrow: string;
    body: string;
    highlightLabel: string;
    highlightText: string;
  };
  journey: {
    eyebrow: string;
    title: string;
    items: JourneyItem[];
  };
  achievements: {
    eyebrow: string;
    title: string;
    intro: string;
    items: AchievementItem[];
  };
  certifications: {
    eyebrow: string;
    title: string;
    intro: string;
    items: CertificationItem[];
  };
  ventures?: {
    eyebrow: string;
    title: string;
    categories: string[];
    items: VentureItem[];
  };
  clients: {
    eyebrow: string;
    title: string;
    intro: string;
    categories: string[];
    items: VentureItem[];
  };
  independent: {
    eyebrow: string;
    title: string;
    intro: string;
    items: IndependentItem[];
  };
  participant: {
    eyebrow: string;
    title: string;
    intro: string;
    items: ParticipantItem[];
  };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    email: string;
    location: string;
    sendLabel?: string;
    accessKey?: string; // Web3Forms access key — the form really sends to that key's email.
    sentLabel?: string;
  };
  footer: {
    tagline: string;
    navLabel?: string;
    connectLabel?: string;
    rights?: string;
    nav?: { label: string; id: string }[];
  };
  social: LinkItem[];

  // Operator visual layer (all optional → backward compatible)
  styles?: Record<string, ElementStyle>;
  theme?: ThemeColors;
  layout?: LayoutBlock[];
  buttons?: Record<string, ButtonStyle>;
}

export const DEFAULT_THEME: ThemeColors = {
  accentDark: "#c8ff00",
  accentLight: "#0071e3",
  bgDark: "#080b0a",
  bgLight: "#f5f5f0",
};

export const DEFAULT_LAYOUT: LayoutBlock[] = [
  { type: "section", id: "about", visible: true },
  { type: "section", id: "journey", visible: true },
  { type: "section", id: "recognition", visible: true },
  { type: "section", id: "certifications", visible: true },
  { type: "section", id: "clients", visible: true },
  { type: "section", id: "independent", visible: true },
  { type: "section", id: "participant", visible: true },
  { type: "section", id: "contact", visible: true },
];

export const DEFAULT_CONTENT: SiteContent = {
  brand: {
    name: "I Made Pradnya Budi Pratama",
    alias: "Keppra",
    role: "Digital Business Architect & AI Integrator",
    logo: "/logo.png",
    logoMode: "image",
    logoText: "Keppra",
    email: "callmekeprra@gmail.com",
    location: "Bali, Indonesia",
  },

  landing: {
    eyebrow: "Digital Business Architect & AI Integrator",
    title: "Keppra",
    subtitle: "I Made Pradnya Budi Pratama",
    intro:
      "I turn local problems into scalable digital ventures — from circular-economy startups to AI-powered platforms and zero-cost tools for micro-businesses. Strategy, design, and code, end to end.",
    primaryCta: "View Work",
    secondaryCta: "Get in Touch",
    credit: "Scroll to explore — or choose above",
    loadingText: "Digital Business Architect",
    btnRadius: "999px",
    btnSize: "md",
    btnArrow: true,
  },

  hero: {
    eyebrow: "Digital Business Architect",
    title: "Keppra",
    tagline: "Building intelligent digital systems that drive growth.",
    approachLabel: "My Approach",
    approachText: "Strategy meets execution. Local problems meet scalable products.",
    promiseLabel: "My Focus",
    promiseText: "AI-powered systems. Built with you, not just for you.",
    ctaLead: "Have an idea worth building?",
    ctaTitle: "Let's build the system together.",
    ctaButton: "Start a Conversation →",
  },

  sequenceCta: {
    title: "Have an idea worth building?",
    subtitle: "Let's build the system together.",
    button: "Start a Conversation",
  },

  about: {
    eyebrow: "01 — About",
    body:
      "I'm I Made Pradnya Budi Pratama — known as Keppra — a digital business architect who builds ventures at the intersection of sustainability, education, and commerce. I lead teams from idea to award-winning business models, and I ship live products solo, from tax tools to free storefronts for micro-businesses.",
    highlightLabel: "What I'm building now",
    highlightText:
      "I'm deeply interested in AI-powered CMS — content systems where AI and people build together. Let's build your system with me.",
  },

  journey: {
    eyebrow: "02 — Journey",
    title: "The Path So Far",
    items: [
      { year: "2023", title: "SELUS — First Venture", desc: "Led a circular-economy team turning coconut water waste into vegan leather. Won 2nd place at the Business Model Canvas Competition.", tag: "Venture" },
      { year: "2024", title: "National P2MW Grant", desc: "Secured a national P2MW 2024 grant (~Rp 15M) for SELUS, and took 2nd place at Ideasi Bisnis 2024, INSTIKI.", tag: "Milestone" },
      { year: "2025", title: "Sigma Academy", desc: "Designed an AI career-matching education platform; won 3rd place at Ideasi Bisnis 2025, INSTIKI.", tag: "Award" },
      { year: "2026", title: "Shipping Real Products", desc: "Building PT Lano Imaji Nusantara's content-commerce platform (launching July 2026) and running two live MVPs.", tag: "Work" },
    ],
  },

  achievements: {
    eyebrow: "03 — Recognition",
    title: "Awards & Grants",
    intro: "Competitions won and grants secured — with proof. Click a card to view the certificate.",
    items: [
      { title: "Business Model Canvas Competition — 2nd Place", org: "INSTIKI", year: "2023", desc: "For SELUS, a sustainable vegan-leather venture.", image: "" },
      { title: "Ideasi Bisnis 2024 — 2nd Place", org: "INSTIKI", year: "2024", desc: "Business innovation competition, SELUS.", image: "" },
      { title: "P2MW 2024 — National Grant", org: "Ministry / P2MW", year: "2024", desc: "~Rp 15M to fund product innovation and tooling for SELUS.", image: "" },
      { title: "Ideasi Bisnis 2025 — 3rd Place", org: "INSTIKI", year: "2025", desc: "For Sigma Academy, an AI-powered education platform.", image: "" },
    ],
  },

  certifications: {
    eyebrow: "04 — Certifications",
    title: "Certifications",
    intro: "Professional certifications across the fields I work in. Click a card to view the certificate.",
    items: [
      { name: "Certification name", field: "Field / area (bidang)", issuer: "Issuing organization", year: "2024", image: "" },
      { name: "Certification name", field: "Field / area (bidang)", issuer: "Issuing organization", year: "2024", image: "" },
      { name: "Certification name", field: "Field / area (bidang)", issuer: "Issuing organization", year: "2025", image: "" },
    ],
  },

  clients: {
    eyebrow: "05 — Real Projects",
    title: "Real Projects",
    intro: "Real things I've built and led — client work and my own award-winning ventures.",
    categories: ["All", "Web", "Business", "EdTech", "Content-Commerce"],
    items: [
      {
        name: "SELUS",
        category: "Business",
        tagline: "Sustainable vegan leather from coconut water waste",
        description:
          "A real circular-economy venture built with a team: turning acidic coconut water waste — a pollutant from food vendors in Lebih village, Gianyar, Bali — into vegan leather for fashion, replacing animal-derived materials.",
        status: "Real team venture · 3× champion",
        role: "Team Leader — ideation, business model, go-to-market",
        impact:
          "Won 3 competitions: Business Model Canvas (BMC), Ideasi Bisnis, and a national P2MW grant (~Rp 15M). Reduces organic waterway pollution while offering a cruelty-free leather alternative.",
        tech: ["Business Model", "Circular Economy", "E-commerce", "Team Leadership"],
        link: "",
        image: "",
      },
      {
        name: "Sigma Academy",
        category: "EdTech",
        tagline: "AI-powered career-matching education platform",
        description:
          "A real project at the idea/business-plan stage: an education platform that uses AI to match students to professional fields suited to their background, interests, and aptitudes.",
        status: "Concept · competition champion",
        role: "Team Leader — ideation & business model",
        impact:
          "Won an award in a business-design-strategy competition (Ideasi Bisnis). Tackles underemployment in Indonesia by pairing AI recommendation with labor-market data.",
        tech: ["AI Recommendation", "EdTech", "Business Strategy"],
        link: "",
        image: "",
      },
      {
        name: "PT Lano Imaji Nusantara",
        category: "Content-Commerce",
        tagline: "Content-commerce web platform for a Bali art gallery",
        description:
          "A two-site platform for a contemporary art gallery in Ubud: an e-commerce store for artwork and merchandise, paired with a paid news/content site that drives engagement and a new revenue stream.",
        status: "Client project · launching July 2026",
        role: "Web Developer — full design & development",
        impact:
          "Introduces a content-commerce flywheel: editorial content (Lano News) acquires customers for Lano Commerce, diversifying revenue and reducing dependence on physical foot traffic.",
        tech: ["React", "Supabase", "Midtrans"],
        link: "",
        image: "",
      },
      {
        name: "Portfolio for Elsa",
        category: "Web",
        tagline: "A personal portfolio website built for a client",
        description: "Designed and developed a personal portfolio website for Elsa — a clean, responsive site to present her profile and work, with an in-browser editor (operator).",
        status: "Client project",
        role: "Web Developer — design & development",
        impact: "Delivered a polished, mobile-friendly personal brand presence the client can edit herself.",
        tech: ["Next.js", "Responsive", "Operator CMS"],
        link: "",
        image: "",
      },
    ],
  },

  independent: {
    eyebrow: "06 — Independent Projects",
    title: "Self-Initiated Tools & Ventures",
    intro: "Things I build on my own. Tools open right here — try them without leaving the page.",
    items: [
      {
        name: "Indonesian Tax Suite",
        category: "Tool",
        tagline: "PPh Final 0.5%, PPh 21 & side-by-side comparison",
        description:
          "A full tax calculator suite for Indonesian SMEs & employees: PPh Final 0.5% (PP 20/2026), PPh 21 (TER), and a comparison tool — with eligibility checks, thresholds, shareable links, and built-in explanations.",
        status: "Live tool",
        role: "Sole designer & developer",
        impact:
          "Turns complex, changing tax rules into a clear, real-time calculator — handling the Rp 500M tax-free threshold and the Rp 4.8B ceiling with educational guidance.",
        tech: ["Next.js", "Client-side", "Mobile-first", "PP 20/2026"],
        kind: "tool",
        tool: "tax-calculator",
        ready: true,
        link: "",
        image: "",
      },
      {
        name: "Cash Flow Oracle",
        category: "Tool",
        tagline: "See when your money runs out — or doubles — before it happens",
        description:
          "Predicts your cash position 12 months ahead from historical income/expense, with a real-time \"what-if\" simulator (revenue, costs, late payments, capital injection). For Indonesian SMEs & freelancers.",
        status: "Live",
        role: "Sole designer & developer",
        impact:
          "Turns raw monthly numbers into a forward-looking runway, burn-rate, trend, and scenario simulator — so owners can see the future before it arrives.",
        tech: ["Vanilla JS", "SVG charts", "Forecasting", "AI parsing (optional)"],
        kind: "tool",
        tool: "cash-flow-oracle",
        ready: true,
        link: "",
        image: "",
      },
      {
        name: "Profit Leak Detector",
        category: "Tool",
        tagline: "Find the money quietly leaking from your business — before it's all gone",
        description:
          "Analyzes your business finances and surfaces 5 hidden types of profit leak, each with a specific rupiah amount and a fix.",
        status: "Live",
        role: "Sole designer & developer",
        impact:
          "Makes invisible losses visible — pricing, waste, unpaid invoices, idle cost, leakage — with concrete numbers an owner can act on.",
        tech: ["Vanilla JS", "Diagnostics", "AI parsing (optional)"],
        kind: "tool",
        tool: "profit-leak-detector",
        ready: true,
        link: "",
        image: "",
      },
      {
        name: "Business War Room",
        category: "Tool",
        tagline: "Three futures. One decision. See them all before you act.",
        description:
          "Simulates up to 3 business decisions in parallel — each a full 12-month financial model — then compares them side by side to guide a big strategic call.",
        status: "Live",
        role: "Sole designer & developer",
        impact:
          "Replaces gut-feel big decisions with side-by-side simulated outcomes, so owners choose with evidence, not hope.",
        tech: ["Vanilla JS", "Scenario modeling", "AI parsing (optional)"],
        kind: "tool",
        tool: "business-war-room",
        ready: true,
        link: "",
        image: "",
      },
    ],
  },

  participant: {
    eyebrow: "07 — Activities",
    title: "Organizations & Participation",
    intro: "Organizations, seminars, competitions, and events I've taken part in.",
    items: [
      { title: "Activity / event name", type: "Organization", org: "Organizer / institution", date: "2025", desc: "Short description of your role or what you did.", image: "", link: "" },
      { title: "Activity / event name", type: "Seminar", org: "Organizer / institution", date: "2024", desc: "Short description.", image: "", link: "" },
    ],
  },

  contact: {
    eyebrow: "06 — Contact",
    title: "Have an idea worth building?",
    intro: "Whether it's a venture, a platform, or an AI-powered system — let's talk.",
    email: "callmekeprra@gmail.com",
    location: "Based in Bali, Indonesia",
    sendLabel: "Send Message",
    sentLabel: "Message sent — thank you!",
    accessKey: "",
  },

  footer: {
    tagline: "Digital Business Architect & AI Integrator. Building ventures and AI-powered systems.",
    navLabel: "Navigation",
    connectLabel: "Connect",
    rights: "All rights reserved.",
    nav: [
      { label: "Home", id: "home" },
      { label: "About", id: "about" },
      { label: "Journey", id: "journey" },
      { label: "Recognition", id: "recognition" },
      { label: "Certifications", id: "certifications" },
      { label: "Real Projects", id: "clients" },
      { label: "Independent", id: "independent" },
      { label: "Activities", id: "participant" },
      { label: "Contact", id: "contact" },
    ],
  },

  social: [
    { label: "GitHub", url: "" },
    { label: "LinkedIn", url: "" },
    { label: "Instagram", url: "" },
    { label: "Email", url: "mailto:callmekeprra@gmail.com" },
  ],

  styles: {},
  theme: DEFAULT_THEME,
  layout: DEFAULT_LAYOUT,
};
