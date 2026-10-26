import Image from "next/image";
import { ArrowUpRight, BriefcaseBusiness, GraduationCap, MapPin } from "lucide-react";

import { SkillsSection } from "@/components/skills-section";
import { siteConfig } from "@/lib/site";
import "./about-section.css";

const facts = [
  { icon: MapPin, label: "Faridabad, India", color: "--cyan" },
  { icon: BriefcaseBusiness, label: "AI Full Stack Engineer @ WellM", color: "--mint" },
  { icon: GraduationCap, label: "B.Voc, Software Development", color: "--orange" },
];

export function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="portfolio-container">
        <div className="about-overview">
          <div className="about-intro" data-aos="blur-up">
            <span className="eyebrow">
              <span className="section-index">03 /</span> THE DEVELOPER BEHIND THE
              WORK
            </span>
            <h2>
              From the interface
              <br />
              to the system <span className="about-outline">behind it</span>
              <span className="accent-text">.</span>
            </h2>
            <ul className="about-facts" aria-label="Quick facts">
              {facts.map(({ icon: Icon, label, color }) => (
                <li key={label} style={{ ["--fact-color" as string]: `var(${color})` }}>
                  <span aria-hidden="true">
                    <Icon size={15} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="about-note-wrap" data-aos="fade-left" data-aos-delay="120">
            <div className="about-badge" aria-hidden="true">
              <svg viewBox="0 0 200 200" className="about-badge-ring">
                <defs>
                  <path id="about-badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                </defs>
                <text>
                  <textPath href="#about-badge-circle">
                    AI DEVELOPER ✳ FULL-STACK ENGINEER ✳ BUILDER ✳
                  </textPath>
                </text>
              </svg>
              <Image
                src="/suraj-logo.png"
                alt=""
                width={96}
                height={96}
                sizes="96px"
                className="about-badge-face"
              />
            </div>

            <article className="about-narrative">
              <div className="about-note-bar" aria-hidden="true">
                <span className="about-note-dots">
                  <span />
                  <span />
                  <span />
                </span>
                about-me.md
              </div>
              <div className="about-note-body">
                <p>
                  I&apos;m <mark>Suraj Singh</mark>, a software engineer based in
                  Faridabad, India. My experience spans full-stack client delivery,
                  React interfaces, Go backend services, and AI-based automation. I
                  currently work at WellM as an{" "}
                  <mark className="about-mark-alt">AI Full Stack Engineer</mark>,
                  building mobile, web, and AI features for wellness products.
                </p>
                <p>
                  I work across the application: shaping the UI, connecting
                  services, designing database flows, and integrating language
                  models where they support a{" "}
                  <mark className="about-mark-blue">useful product experience</mark>.
                </p>
                <a
                  href={siteConfig.links.linkedin}
                  className="about-cta"
                  target="_blank"
                  rel="noreferrer"
                >
                  Connect on LinkedIn <ArrowUpRight size={17} aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </article>
          </div>
        </div>
        <SkillsSection />
      </div>
    </section>
  );
}
