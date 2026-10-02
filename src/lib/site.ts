const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  "http://localhost:3000";

const normalizedSiteUrl = rawSiteUrl.startsWith("http")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const siteConfig = {
  name: "Suraj Singh — AI Developer & Full-Stack Engineer",
  shortName: "Suraj Singh",
  description:
    "Suraj Singh is an AI developer and full-stack engineer with 3+ years of software engineering experience. Explore his work in LLM integration, retrieval, automation, and full-stack applications, and view his resume.",
  url: normalizedSiteUrl.replace(/\/$/, ""),
  ogImage: "/opengraph-image",
  locale: "en_IN",
  region: "IN",
  country: "India",
  category: "technology",
  classification:
    "AI Development, Full-Stack Engineering, LLM Integration, RAG Systems, Web Applications",
  abstract:
    "Selected projects and professional experience in AI development and full-stack engineering by Suraj Singh.",
  links: {
    github: "https://github.com/Suraj1812",
    linkedin: "https://www.linkedin.com/in/suraj-singh-0695ba371/",
    email: "mailto:singhsuraj44500@gmail.com",
    phone: "tel:+919625553534",
    resume: "/resume/Suraj-Singh-Resume.pdf",
  },
  contact: {
    email: "singhsuraj44500@gmail.com",
    phoneDisplay: "+91 9625553534",
    phoneRaw: "+919625553534",
  },
  keywords: [
    "Suraj Singh",
    "AI Developer",
    "Full-Stack Engineer",
    "Full-Stack Developer",
    "LLM Integration",
    "RAG Systems",
    "AI Automation",
    "Web Applications",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "JavaScript Developer",
    "Frontend Developer India",
    "Full Stack Developer India",
    "Developer Portfolio",
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
