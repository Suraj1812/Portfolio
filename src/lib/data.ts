export type NavItem = {
  label: string;
  href: string;
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
  imageUrl?: string;
  imageAlt?: string;
};

export const navItems: NavItem[] = [
  { label: "Projects", href: "#work" },
  { label: "Clients", href: "#clients" },
  { label: "Lab", href: "#lab" },
  { label: "Stack", href: "#stack" },
  { label: "GitHub", href: "#github" },
  { label: "Contact", href: "#contact" }
];

export const tickerItems = [
  "Full-Stack Software Engineer",
  "AI-Powered Applications",
  "Scalable Web Systems",
  "Neobrutalist UI Systems",
  "GSAP ScrollTrigger",
  "Next.js 16 + React 19",
  "TypeScript Architecture",
  "Production Client Delivery",
  "Responsive Product Engineering",
  "Bold Interaction Design"
];

export const heroStats = [
  { value: "20+", label: "Production projects" },
  { value: "50+", label: "Personal builds" },
  { value: "AI + Web", label: "Delivery focus" }
];

export const featuredProjects: FeaturedProject[] = [
  {
    slug: "amze",
    title: "AMZE",
    tagline:
      "A technology storefront for electronics, gaming, and computer components.",
    description:
      "A Spanish electronics catalogue with category browsing, product collections, and delivery and support information alongside the buying journey.",
    category: "E-commerce Experience",
    year: "2026",
    liveUrl: "https://amze.es/en/store",
    stack: ["E-commerce", "Product Discovery", "Responsive UI", "Trust Signals"],
    features: [
      "Category-led browsing across tech, gaming, mobility, and home",
      "Product carousels that surface new, popular, and category-specific inventory",
      "Commerce reassurance through delivery tracking, returns, secure payment, and expert support"
    ],
    architecture:
      "Search, category navigation, and product rails organize the catalogue into clear browsing paths.",
    impact:
      "Product discovery sits alongside delivery, returns, payment, and support information.",
    accent: "bg-[var(--yellow)]",
    metrics: ["Tech commerce", "Fast discovery", "Trust at checkout"],
    imageUrl: "/amze-store-banner.png",
    imageAlt: "AMZE technology and electronics storefront banner"
  },
  {
    slug: "cricket-connect-ai",
    title: "Cricket Connect AI",
    tagline:
      "Cricket intelligence for fans and professional analysts.",
    description:
      "The platform presents two products: CC Pro for professional match analysis and CC AI for fans, with insight spanning match preparation, live decisions, and review.",
    category: "AI Sports Intelligence",
    year: "2026",
    liveUrl: "https://cricketconnect.ai/",
    stack: ["AI Product UX", "Sports Analytics", "Data Storytelling", "Responsive Web"],
    features: [
      "Pattern-based analysis across players, teams, matches, tournaments, and seasons",
      "Context-aware insight that considers venue, pitch, matchups, game phase, and pressure",
      "Probabilistic forecasting designed to explain likelihood rather than make promises"
    ],
    architecture:
      "Two product paths introduce a shared intelligence layer to professional and fan audiences.",
    impact:
      "Pattern analysis, tactical insight, forecasting, and match context frame the product's capabilities.",
    accent: "bg-[var(--cyan)]",
    metrics: ["AI-native product", "Explainable insight", "Live match context"],
    imageUrl: "/cricket-connect.png",
    imageAlt: "Cricket Connect AI brand mark"
  },
  {
    slug: "fashion-pattern-lab",
    title: "Fashion Pattern Lab",
    tagline:
      "Pattern-making courses, digital patterns, and custom services in one place.",
    description:
      "A specialist education and commerce platform with one-on-one pattern-making courses, a pattern store, custom pattern services, and student projects.",
    category: "Education + Digital Commerce",
    year: "2026",
    liveUrl: "https://fashionpatternlab.com/",
    stack: ["Course Discovery", "Digital Patterns", "Pattern Education", "Custom Services"],
    features: [
      "Clear separation between courses, pattern store, custom pattern work, and student projects",
      "Education-led content that connects fit, proportion, construction, and garment outcomes",
      "A focused path for students, designers, brands, and people looking for ready-to-use digital patterns"
    ],
    architecture:
      "Separate navigation routes connect courses, the pattern store, custom services, and student work.",
    impact:
      "Learners can explore courses and practical pattern services through one focused storefront.",
    accent: "bg-[var(--pink)]",
    metrics: ["Fashion education", "Custom patterns", "Digital learning"],
    imageUrl: "/fashion-pattern-lab.jpg",
    imageAlt: "Fashion Pattern Lab women’s wear pattern-making course poster"
  },
  {
    slug: "solar-system",
    title: "Solar System Explorer",
    tagline: "An immersive educational experience shaped around interaction, story, and motion systems.",
    description:
      "A motion-rich storytelling interface that turns planetary data into a playful educational journey with layered depth and smooth pacing.",
    category: "Interactive Experience",
    year: "2025",
    liveUrl: "https://the-solar-system-six.vercel.app/",
    repoUrl: "https://github.com/Suraj1812/The-Solar-System",
    repoLabel: "View source",
    stack: ["React", "Vite", "Three.js", "GSAP", "Framer Motion"],
    features: [
      "Cinematic section reveals",
      "Immersive visual storytelling",
      "Responsive interactions across devices"
    ],
    architecture:
      "A component-first experience with layered scenes, motion-driven transitions, and responsive fallbacks for smaller screens.",
    impact:
      "Shows how I approach visually ambitious UI while keeping the browsing flow clear and performant.",
    accent: "bg-[var(--cyan)]",
    metrics: ["Story-driven UI", "3D-inspired feel", "Performance-aware"]
  },
  {
    slug: "chatapp",
    title: "Realtime Chat App",
    tagline: "A full-stack messaging product with realtime flows and product-style interaction states.",
    description:
      "A full-stack chat experience focused on responsive messaging flows, presence, and a modern interface that feels immediate.",
    category: "Full-Stack Product",
    year: "2025",
    liveUrl: "https://chatapp-production-1674.up.railway.app/",
    repoUrl: "https://github.com/Suraj1812/ChatApp",
    repoLabel: "View source",
    stack: ["Node.js", "Express", "Socket.IO", "SQLite", "JavaScript"],
    features: [
      "Fast conversation flows",
      "Product-style layout system",
      "Interaction states that feel alive"
    ],
    architecture:
      "Frontend views are organized around reusable messaging patterns and stateful UI pieces to keep the experience consistent.",
    impact:
      "Highlights my ability to build product UI beyond static landing pages and connect it to live behaviors.",
    accent: "bg-[var(--orange)]",
    metrics: ["Realtime feel", "Full-stack flow", "Product UI"]
  },
  {
    slug: "aipedia",
    title: "AIPedia",
    tagline: "An AI-focused product surface designed to keep complex information usable and fast to scan.",
    description:
      "A knowledge-driven interface that balances content density with clarity, using clean hierarchy and guided interaction patterns.",
    category: "AI Product",
    year: "2025",
    liveUrl: "https://aipedia-production.up.railway.app/",
    repoUrl: "https://github.com/Suraj1812/AIpedia",
    repoLabel: "View source",
    stack: ["Node.js", "JavaScript", "Ollama"],
    features: [
      "Information-first layout",
      "Clear content hierarchy",
      "Polished call-to-action moments"
    ],
    architecture:
      "Built around reusable content modules and focused spacing rules so a complex information surface stays easy to scan.",
    impact:
      "Demonstrates how I shape AI products into interfaces that feel practical, friendly, and premium.",
    accent: "bg-[var(--pink)]",
    metrics: ["AI UX", "Readable density", "Clear navigation"]
  },
  {
    slug: "dattamsha",
    title: "Dattamsha Data Labs",
    tagline: "A polished business-facing website with strong product framing and conversion-minded structure.",
    description:
      "A marketing and services experience built to present data-led value clearly, with strong section pacing and refined visual hierarchy.",
    category: "Business Website",
    year: "2025",
    liveUrl: "https://dattamsha-data-labs.vercel.app/",
    repoUrl: "https://github.com/Suraj1812/Dattamsha-Data-Labs",
    repoLabel: "View source",
    stack: ["React", "Vite", "TypeScript", "Framer Motion", "Express"],
    features: [
      "Premium SaaS-style sections",
      "Conversion-minded visual flow",
      "Reusable marketing UI patterns"
    ],
    architecture:
      "Structured with reusable landing-page building blocks that support fast future iteration without losing consistency.",
    impact:
      "Shows how I translate product positioning into an interface that feels mature and ready for customers.",
    accent: "bg-[var(--yellow)]",
    metrics: ["SaaS tone", "Conversion clarity", "Reusable system"]
  },
  {
    slug: "wildverse",
    title: "Wildverse",
    tagline: "A bold visual concept with editorial pacing, immersive cards, and stronger visual identity.",
    description:
      "An experiment in expressive layout, visual storytelling, and motion-led browsing built to feel memorable rather than generic.",
    category: "Creative Experiment",
    year: "2025",
    liveUrl: "https://wildverse-theta.vercel.app/",
    repoUrl: "https://github.com/Suraj1812/wildverse",
    repoLabel: "View source",
    stack: ["Next.js", "React", "TypeScript", "Framer Motion", "GSAP"],
    features: [
      "Expressive art direction",
      "Animated card choreography",
      "Layout pacing built for discovery"
    ],
    architecture:
      "The design system leans on modular cards and controlled motion sequences so the visual style stays coherent across breakpoints.",
    impact:
      "A strong example of experimentation that still respects navigation, readability, and performance.",
    accent: "bg-[var(--lime)]",
    metrics: ["Editorial layout", "Creative motion", "Memorable feel"]
  },
  {
    slug: "brutal-design",
    title: "Brutal Design",
    tagline: "A sharp UI experiment built to feel unapologetically distinctive and structurally clear.",
    description:
      "A design-led interface exploring heavier typography, strong contrast, and deliberate interaction cues without losing usability.",
    category: "UI Experiment",
    year: "2025",
    liveUrl: "https://brutal-design.vercel.app/",
    repoUrl: "https://github.com/Suraj1812/BrutalDesign",
    repoLabel: "View source",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Motion"],
    features: [
      "Bold typographic hierarchy",
      "Hover states with character",
      "Distinctive card and section treatment"
    ],
    architecture:
      "Visual identity is carried by reusable blocks, allowing the experiment to stay expressive without becoming inconsistent.",
    impact:
      "Shows range in visual direction and a willingness to build interfaces that feel intentional instead of template-driven.",
    accent: "bg-[var(--blue)]",
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
    name: "SecureThread",
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
];

export const uiExperiments = [
  {
    title: "Solar storytelling",
    description: "A bold experiment in layered storytelling, immersive pacing, and interactive scene-building.",
    link: "https://the-solar-system-six.vercel.app/"
  },
  {
    title: "Wildverse energy",
    description: "A louder visual direction with expressive composition, vivid cards, and a more editorial rhythm.",
    link: "https://wildverse-theta.vercel.app/"
  },
  {
    title: "Brutal layouts",
    description: "An experiment in hard contrast, oversized type, and a neobrutalist system that still feels usable.",
    link: "https://brutal-design.vercel.app/"
  },
  {
    title: "Fashion-forward UI",
    description: "A styling exercise around product framing, premium rhythm, and a more editorial commerce presentation.",
    link: "https://black-meds-premium-fashion-collecti.vercel.app/"
  }
];

export const skills = [
  { label: "React + Next.js", level: 95, detail: "App Router architecture, reusable UI systems, and scalable frontend delivery" },
  { label: "TypeScript", level: 88, detail: "Typed design systems, safer refactors, and maintainable product code" },
  { label: "AI Product UX", level: 84, detail: "Clear interfaces for AI-assisted flows, content density, and prompt-backed products" },
  { label: "Motion Systems", level: 91, detail: "GSAP, Framer Motion, scroll choreography, and intentional interaction design" },
  { label: "Tailwind CSS", level: 94, detail: "Fast token-driven styling with a strong eye for consistent visual systems" },
  { label: "Full-Stack Delivery", level: 86, detail: "Connecting UI to APIs, auth, business logic, and production-ready integrations" }
];

export const techCloud = [
  "Next.js",
  "React",
  "React Native",
  "TypeScript",
  "Angular",
  "HTML",
  "CSS",
  "JavaScript",
  "Tailwind",
  "Redux",
  "Framer Motion",
  "GSAP",
  "Lenis",
  "Node.js",
  "Go",
  "NestJS",
  "Django",
  "FastAPI",
  ".NET Core",
  "REST APIs",
  "API Integrations",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Docker",
  "Firebase",
  "Git",
  "OpenAI APIs",
  "LLM Integration",
  "Prompt Engineering",
  "RAG Systems",
  "Vector Databases",
  "LangChain",
  "AI Chatbots",
  "Automation Workflows",
  "Embeddings",
  "AI Agents",
  "Responsive UI",
  "Vercel",
  "Three.js",
  "UI Systems",
  "Scalable Apps"
];
