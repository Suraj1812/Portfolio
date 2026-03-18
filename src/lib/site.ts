const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  "http://localhost:3000";

const normalizedSiteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`;

export const siteConfig = {
  name: "Suraj Singh | Frontend Portfolio",
  shortName: "Suraj Portfolio",
  description:
    "Production-ready frontend portfolio for Suraj Singh featuring scroll storytelling, GSAP-powered motion, curated client work, and premium React/Next.js UI engineering.",
  url: normalizedSiteUrl.replace(/\/$/, ""),
  ogImage: "/opengraph-image",
  links: {
    github: "https://github.com/Suraj1812"
  },
  keywords: [
    "Suraj Singh",
    "Frontend Engineer",
    "Full-Stack Engineer",
    "Next.js Portfolio",
    "React Portfolio",
    "GSAP Portfolio",
    "Scroll Storytelling",
    "Frontend Developer India"
  ]
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
