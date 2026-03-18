const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  "http://localhost:3000";

const normalizedSiteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`;

export const siteConfig = {
  name: "Full-Stack Software Engineer | AI-Powered Applications | Building Scalable Web & AI Systems",
  shortName: "Suraj Singh",
  description:
    "Production-ready neobrutalist portfolio for Suraj Singh, a full-stack software engineer building scalable web platforms, AI-powered applications, and bold user interfaces.",
  url: normalizedSiteUrl.replace(/\/$/, ""),
  ogImage: "/opengraph-image",
  links: {
    github: "https://github.com/Suraj1812",
    linkedin: "https://www.linkedin.com/in/suraj-singh-0695ba371/",
    email: "mailto:singhsuraj44500@gmail.com",
    phone: "tel:+919625553534"
  },
  contact: {
    email: "singhsuraj44500@gmail.com",
    phoneDisplay: "+91 9625553534",
    phoneRaw: "+919625553534"
  },
  keywords: [
    "Suraj Singh",
    "Full-Stack Engineer",
    "Software Engineer",
    "AI-Powered Applications",
    "Scalable Web Systems",
    "Next.js Portfolio",
    "React Portfolio",
    "TypeScript Portfolio",
    "Neobrutalism Portfolio",
    "Frontend Developer India",
    "AI Engineer Portfolio"
  ]
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
