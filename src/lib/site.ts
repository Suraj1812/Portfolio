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
    "Suraj Singh is a full-stack software engineer building AI-powered applications, scalable web systems, modern React and Next.js products, and production-ready digital experiences with strong frontend architecture.",
  url: normalizedSiteUrl.replace(/\/$/, ""),
  ogImage: "/opengraph-image",
  locale: "en_IN",
  region: "IN",
  country: "India",
  category: "technology",
  classification:
    "AI-Powered Applications, Full-Stack Software Engineering, Scalable Web Systems, Next.js Portfolio, React Portfolio",
  abstract:
    "AI-focused full-stack software engineer portfolio featuring AI applications, scalable web systems, frontend architecture, and modern product development.",
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
    "Full-Stack Software Engineer",
    "Software Engineer",
    "AI Engineer",
    "AI Developer",
    "AI Software Engineer Portfolio",
    "AI-Powered Applications",
    "Artificial Intelligence Applications",
    "AI Web Developer",
    "Scalable Web Systems",
    "Scalable AI Systems",
    "Next.js Portfolio",
    "Next.js Developer",
    "React Portfolio",
    "React Developer",
    "TypeScript Portfolio",
    "JavaScript Developer",
    "Neobrutalism Portfolio",
    "Frontend Developer India",
    "Full Stack Developer India",
    "AI Engineer Portfolio",
    "AI Product Engineer",
    "Portfolio Website Developer"
  ]
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
