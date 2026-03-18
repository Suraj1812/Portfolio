export type NavItem = {
  label: string;
  href: string;
};

export type StoryStep = {
  id: string;
  label: string;
  title: string;
  description: string;
  detail: string;
  highlights: string[];
  accent: string;
};

export type FeaturedProject = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  year: string;
  liveUrl: string;
  repoUrl?: string;
  repoLabel?: string;
  stack: string[];
  features: string[];
  architecture: string;
  impact: string;
  accent: string;
  metrics: string[];
};

export const navItems: NavItem[] = [
  { label: "Story", href: "#about" },
  { label: "Projects", href: "#work" },
  { label: "Clients", href: "#clients" },
  { label: "Lab", href: "#lab" },
  { label: "Stack", href: "#stack" },
  { label: "GitHub", href: "#github" },
  { label: "Contact", href: "#contact" }
];

export const tickerItems = [
  "GSAP ScrollTrigger",
  "Lenis Smooth Scroll",
  "Pinned Storytelling",
  "Horizontal Project Rails",
  "React + TypeScript",
  "Tailwind Systems",
  "Framer Motion",
  "Responsive UI Engineering",
  "Frontend Architecture",
  "Launch-Ready Product Work"
];

export const heroStats = [
  { value: "10+", label: "Client launches" },
  { value: "40+", label: "Personal experiments" },
  { value: "100%", label: "Motion-first interfaces" }
];

export const storySteps: StoryStep[] = [
  {
    id: "intro",
    label: "01 / Scroll Start",
    title: "Open with a sticky hero that feels like a product launch, not a resume.",
    description:
      "The first viewport should carry confidence immediately: strong typography, a living grid, and motion that reacts to scroll instead of waiting for clicks.",
    detail:
      "I like using layered depth, paced reveals, and subtle zoom to make the entry feel cinematic while still keeping the message clear in the first few seconds.",
    highlights: ["Sticky hero pacing", "Layered motion", "Immediate product feel"],
    accent: "from-cyan-400 via-teal-500 to-emerald-500"
  },
  {
    id: "systems",
    label: "02 / Build Systems",
    title: "Use the scroll to reveal frontend systems, not just sections stacked one after another.",
    description:
      "Instead of listing skills plainly, I turn them into a guided story about motion, reusable components, performance, and how interface decisions scale.",
    detail:
      "That is where floating tech elements, reveal blocks, and tighter rhythm help the page feel intentional instead of template-driven.",
    highlights: ["Reusable primitives", "Animated stack cloud", "Responsive polish"],
    accent: "from-amber-300 via-orange-500 to-rose-500"
  },
  {
    id: "delivery",
    label: "03 / Ship Product Work",
    title: "Transition into proof: production launches, client outcomes, and experiments with range.",
    description:
      "The story works best when the visual style leads naturally into real projects, shipped sites, and ideas that show both product discipline and creative range.",
    detail:
      "That is why the portfolio shifts from narrative into a pinned horizontal project rail and then into real client work, GitHub activity, and collaboration.",
    highlights: ["Project transitions", "Client-ready delivery", "Awwwards-style energy"],
    accent: "from-sky-300 via-indigo-500 to-violet-600"
  }
];

export const capabilityCards = [
  {
    title: "Frontend systems",
    description:
      "Reusable UI components, scalable layout patterns, and product-facing interfaces that stay fast as they grow."
  },
  {
    title: "Motion with intent",
    description:
      "Scroll reveals, parallax, tactile hover states, and transitions that support the story instead of distracting from it."
  },
  {
    title: "Client-ready delivery",
    description:
      "Production deployments, marketing sites, dashboards, and full-stack integrations with an eye on responsiveness and polish."
  }
];

export const featuredProjects: FeaturedProject[] = [
  {
    slug: "solar-system",
    title: "Solar System Explorer",
    tagline: "An immersive space experience built around cinematic movement.",
    description:
      "A motion-rich storytelling interface that turns planetary data into a playful educational journey with layered depth and smooth pacing.",
    category: "Interactive Experience",
    year: "2025",
    liveUrl: "https://the-solar-system-six.vercel.app/",
    repoUrl: "https://github.com/Suraj1812",
    repoLabel: "GitHub profile",
    stack: ["Next.js", "React", "Tailwind", "Framer Motion", "Three.js"],
    features: [
      "Cinematic section reveals",
      "Immersive visual storytelling",
      "Responsive interactions across devices"
    ],
    architecture:
      "A component-first experience with layered scenes, motion-driven transitions, and responsive fallbacks for smaller screens.",
    impact:
      "Shows how I approach visually ambitious UI while keeping the browsing flow clear and performant.",
    accent: "from-sky-300 via-cyan-500 to-blue-700",
    metrics: ["Story-driven UI", "3D-inspired feel", "Performance-aware"]
  },
  {
    slug: "chatapp",
    title: "Realtime Chat App",
    tagline: "A clean communication product with live interaction patterns.",
    description:
      "A full-stack chat experience focused on responsive messaging flows, presence, and a modern interface that feels immediate.",
    category: "Full-Stack Product",
    year: "2025",
    liveUrl: "https://chatapp-production-1674.up.railway.app/",
    repoUrl: "https://github.com/Suraj1812",
    repoLabel: "GitHub profile",
    stack: ["React", "JavaScript", "Node", "Realtime Events", "Responsive UI"],
    features: [
      "Fast conversation flows",
      "Product-style layout system",
      "Interaction states that feel alive"
    ],
    architecture:
      "Frontend views are organized around reusable messaging patterns and stateful UI pieces to keep the experience consistent.",
    impact:
      "Highlights my ability to build product UI beyond static landing pages and connect it to live behaviors.",
    accent: "from-emerald-300 via-teal-500 to-cyan-700",
    metrics: ["Realtime feel", "Full-stack flow", "Product UI"]
  },
  {
    slug: "aipedia",
    title: "AIPedia",
    tagline: "An AI-focused product surface designed to feel sharp and understandable.",
    description:
      "A knowledge-driven interface that balances content density with clarity, using clean hierarchy and guided interaction patterns.",
    category: "AI Product",
    year: "2025",
    liveUrl: "https://aipedia-production.up.railway.app/",
    repoUrl: "https://github.com/Suraj1812",
    repoLabel: "GitHub profile",
    stack: ["React", "Tailwind", "JavaScript", "API Integration", "UI Systems"],
    features: [
      "Information-first layout",
      "Clear content hierarchy",
      "Polished call-to-action moments"
    ],
    architecture:
      "Built around reusable content modules and focused spacing rules so a complex information surface stays easy to scan.",
    impact:
      "Demonstrates how I shape AI products into interfaces that feel practical, friendly, and premium.",
    accent: "from-amber-200 via-orange-400 to-rose-600",
    metrics: ["AI UX", "Readable density", "Clear navigation"]
  },
  {
    slug: "dattamsha",
    title: "Dattamsha Data Labs",
    tagline: "A polished business-facing website with confident product framing.",
    description:
      "A marketing and services experience built to present data-led value clearly, with strong section pacing and refined visual hierarchy.",
    category: "Business Website",
    year: "2025",
    liveUrl: "https://dattamsha-data-labs.vercel.app/",
    repoUrl: "https://github.com/Suraj1812",
    repoLabel: "GitHub profile",
    stack: ["Next.js", "Tailwind", "Framer Motion", "Responsive Design"],
    features: [
      "Premium SaaS-style sections",
      "Conversion-minded visual flow",
      "Reusable marketing UI patterns"
    ],
    architecture:
      "Structured with reusable landing-page building blocks that support fast future iteration without losing consistency.",
    impact:
      "Shows how I translate product positioning into an interface that feels mature and ready for customers.",
    accent: "from-lime-200 via-emerald-400 to-teal-700",
    metrics: ["SaaS tone", "Conversion clarity", "Reusable system"]
  },
  {
    slug: "wildverse",
    title: "Wildverse",
    tagline: "A bold visual concept with editorial rhythm and immersive cards.",
    description:
      "An experiment in expressive layout, visual storytelling, and motion-led browsing built to feel memorable rather than generic.",
    category: "Creative Experiment",
    year: "2025",
    liveUrl: "https://wildverse-theta.vercel.app/",
    repoUrl: "https://github.com/Suraj1812",
    repoLabel: "GitHub profile",
    stack: ["React", "Framer Motion", "Tailwind", "Visual Design"],
    features: [
      "Expressive art direction",
      "Animated card choreography",
      "Layout pacing built for discovery"
    ],
    architecture:
      "The design system leans on modular cards and controlled motion sequences so the visual style stays coherent across breakpoints.",
    impact:
      "A strong example of experimentation that still respects navigation, readability, and performance.",
    accent: "from-fuchsia-300 via-rose-500 to-orange-500",
    metrics: ["Editorial layout", "Creative motion", "Memorable feel"]
  },
  {
    slug: "brutal-design",
    title: "Brutal Design",
    tagline: "A sharp UI experiment built to feel unapologetically distinctive.",
    description:
      "A design-led interface exploring heavier typography, strong contrast, and deliberate interaction cues without losing usability.",
    category: "UI Experiment",
    year: "2025",
    liveUrl: "https://brutal-design.vercel.app/",
    repoUrl: "https://github.com/Suraj1812",
    repoLabel: "GitHub profile",
    stack: ["React", "Tailwind", "Motion", "Layout Design"],
    features: [
      "Bold typographic hierarchy",
      "Hover states with character",
      "Distinctive card and section treatment"
    ],
    architecture:
      "Visual identity is carried by reusable blocks, allowing the experiment to stay expressive without becoming inconsistent.",
    impact:
      "Shows range in visual direction and a willingness to build interfaces that feel intentional instead of template-driven.",
    accent: "from-stone-200 via-zinc-500 to-slate-900",
    metrics: ["Bold visuals", "Experimental UI", "Strong hierarchy"]
  }
];

export const clientProjects = [
  {
    name: "PeopleMaketh",
    url: "https://peoplemaketh.com/",
    focus: "Brand and company web experience",
    summary: "Production-facing site work built for credibility, storytelling, and a smooth user journey.",
    stack: ["React", "Responsive UI", "Brand Systems"]
  },
  {
    name: "Securethread",
    url: "https://www.securethread.io/",
    focus: "Security product presentation",
    summary: "A product site where trust, clarity, and strong hierarchy matter just as much as speed.",
    stack: ["Next.js", "SaaS UI", "Motion"]
  },
  {
    name: "EaseMyCRM",
    url: "https://easemycrm.com/",
    focus: "SaaS positioning and lead capture",
    summary: "A customer-facing product surface designed to explain value fast and guide visitors toward action.",
    stack: ["React", "Landing Pages", "Conversion UI"]
  },
  {
    name: "Evtaar",
    url: "https://staging.evtaar.com/",
    focus: "Staging product work",
    summary: "Frontend implementation work shaped around product readiness, responsive behavior, and consistent UI patterns.",
    stack: ["Frontend Systems", "Responsive QA", "Product UI"]
  },
  {
    name: "EkkoMD",
    url: "https://www.ekkomd.com/",
    focus: "Healthcare-oriented digital product",
    summary: "A cleaner, confidence-building interface where content clarity and structure are critical.",
    stack: ["Clean Hierarchy", "Content UX", "Production Site"]
  },
  {
    name: "Humigy",
    url: "https://humigy.com/",
    focus: "Company website and product framing",
    summary: "A modern marketing experience with attention to pacing, components, and conversion-focused sections.",
    stack: ["Marketing UI", "React", "Launch Support"]
  },
  {
    name: "The Nexus Store",
    url: "https://www.thenexustore.com",
    focus: "E-commerce storefront",
    summary: "A retail-facing experience focused on product browsing, presentation, and responsive commerce flows.",
    stack: ["Commerce UI", "Responsive Flow", "Product Grids"]
  }
];

export const uiExperiments = [
  {
    title: "Solar storytelling",
    description: "Layered motion, cinematic reveals, and interface depth inspired by spatial exploration.",
    link: "https://the-solar-system-six.vercel.app/"
  },
  {
    title: "Wildverse energy",
    description: "A more expressive design direction with richer card movement and editorial pacing.",
    link: "https://wildverse-theta.vercel.app/"
  },
  {
    title: "Brutal layouts",
    description: "An experiment in strong contrast, oversized typography, and deliberate interaction edges.",
    link: "https://brutal-design.vercel.app/"
  },
  {
    title: "Fashion-forward UI",
    description: "A cleaner premium look exploring product framing, styling, and luxury-inspired visual rhythm.",
    link: "https://black-meds-premium-fashion-collecti.vercel.app/"
  }
];

export const skills = [
  { label: "React", level: 95, detail: "Component architecture and scalable UI patterns" },
  { label: "Next.js", level: 92, detail: "App Router builds, landing pages, and production-ready structure" },
  { label: "TypeScript", level: 86, detail: "Typed frontend systems and safer reusable components" },
  { label: "Motion Design", level: 91, detail: "Framer Motion, GSAP, scroll choreography, and micro-interactions" },
  { label: "Tailwind CSS", level: 94, detail: "Fast design systems with consistent spacing and token-driven styling" },
  { label: "Full-Stack Integration", level: 84, detail: "Connecting UI to APIs, auth flows, and backend-driven products" }
];

export const techCloud = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind",
  "Framer Motion",
  "GSAP",
  "Lenis",
  "Node.js",
  "REST APIs",
  "Shadcn UI",
  "Responsive UI",
  "Vercel",
  "Three.js",
  "Spline",
  "JavaScript"
];
