import { AboutSection } from "@/components/about-section";
import { ContactSection, SiteFooter } from "@/components/contact-section";
import { ExperienceSection } from "@/components/experience-section";
import { FloatingNavbar } from "@/components/floating-navbar";
import { HeroSection } from "@/components/hero-section";
import { MetricsTicker } from "@/components/metrics-ticker";
import { ResumeSection } from "@/components/resume-section";
import { SelectedWork } from "@/components/selected-work";
import { monthKey } from "@/lib/experience-duration";
import { portfolioProjects } from "@/lib/portfolio-data";
import { siteConfig } from "@/lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteConfig.url}#person`,
      name: "Suraj Singh",
      url: siteConfig.url,
      jobTitle: "AI Developer & Full-Stack Engineer",
      worksFor: {
        "@type": "Organization",
        name: "WellM",
        legalName: "Wellness Mandala Private Limited",
        url: "https://wellm.co/",
      },
      description: siteConfig.description,
      email: siteConfig.contact.email,
      sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
      knowsAbout: [
        "LLM integration",
        "RAG systems",
        "AI automation",
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Go",
        "PostgreSQL",
      ],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Aggarwal College, Ballabgarh",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}#website`,
      name: siteConfig.shortName,
      url: siteConfig.url,
      description: siteConfig.description,
      inLanguage: "en-IN",
      author: { "@id": `${siteConfig.url}#person` },
    },
    {
      "@type": "ItemList",
      name: "Developer projects",
      itemListElement: portfolioProjects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: project.liveUrl ?? project.sourceUrl,
        name: project.title,
      })),
    },
  ],
};

export default function HomePage() {
  const initialMonth = monthKey(new Date());
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <FloatingNavbar />
      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <HeroSection initialMonth={initialMonth} />
        <MetricsTicker
          items={[
            "AI & AUTOMATION",
            "FULL-STACK ENGINEERING",
            "LLM INTEGRATION",
            "REACT + NEXT.JS",
            "NODE.JS + GO",
            "POSTGRESQL",
            "LINUX CONTAINERS",
            "INTERACTIVE EXPERIENCES",
          ]}
        />
        <SelectedWork />
        <ExperienceSection />
        <AboutSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
