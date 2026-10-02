import {
  ArrowDown,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import { ClientWork } from "@/components/client-work";
import { ExperienceSection } from "@/components/experience-section";
import { FloatingNavbar } from "@/components/floating-navbar";
import { HeroSection } from "@/components/hero-section";
import { CreativeLab } from "@/components/creative-lab";
import { MetricsTicker } from "@/components/metrics-ticker";
import { ResumeSection } from "@/components/resume-section";
import { SelectedWork } from "@/components/selected-work";
import { SkillsSection } from "@/components/skills-section";
import { uiExperiments } from "@/lib/data";
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
        <ClientWork />
        <CreativeLab items={uiExperiments} />
        <ExperienceSection />
        <section id="about" className="about-section">
          <div className="portfolio-container">
            <div className="about-overview">
              <div>
                <span className="eyebrow">
                  <span className="section-index">03 /</span> THE DEVELOPER
                  BEHIND THE WORK
                </span>
                <h2>
                  From the interface
                  <br />
                  to the system behind it<span className="accent-text">.</span>
                </h2>
              </div>
              <div className="about-narrative">
                <p>
                  I&apos;m Suraj Singh, a software engineer based in Faridabad,
                  India. My experience spans full-stack client delivery, React
                  interfaces, Go backend services, and AI-based automation.
                </p>
                <p>
                  I work across the application: shaping the UI, connecting
                  services, designing database flows, and integrating language
                  models where they support a useful product experience.
                </p>
                <a
                  href={siteConfig.links.linkedin}
                  className="text-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  Connect on LinkedIn <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
            <SkillsSection />
          </div>
        </section>
        <ResumeSection />
        <section id="contact" className="contact-section portfolio-container">
          <div className="contact-topline">
            <span className="eyebrow">
              <span className="section-index">05 /</span> LET&apos;S CONNECT
            </span>
          </div>
          <div className="contact-main">
            <h2>
              Building something
              <br />
              with AI?{" "}
              <a href={siteConfig.links.email}>
                Let&apos;s talk<span className="accent-text">.</span>
                <ArrowUpRight strokeWidth={1.2} />
              </a>
            </h2>
            <p>
              AI development. Full-stack engineering.
              <br />A role or a project worth building.
            </p>
          </div>
          <div className="contact-links">
            <a href={siteConfig.links.email}>
              <Mail size={18} />
              {siteConfig.contact.email}
              <ArrowUpRight size={16} />
            </a>
            <a href={siteConfig.links.phone}>
              <Phone size={17} />
              {siteConfig.contact.phoneDisplay}
              <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
      </main>
      <footer className="site-footer portfolio-container">
        <span>© {new Date().getFullYear()} Suraj Singh</span>
        <span className="footer-note">AI Developer & Full-Stack Engineer</span>
        <div id="github" className="footer-socials">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Suraj on GitHub"
          >
            <Github size={17} />
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="Suraj on LinkedIn"
          >
            <Linkedin size={17} />
          </a>
          <a href="#top" aria-label="Back to top">
            <ArrowDown className="back-to-top" size={17} />
          </a>
        </div>
      </footer>
    </>
  );
}
