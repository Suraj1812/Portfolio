import type { CSSProperties } from "react";
import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail, Phone } from "lucide-react";

import { CopyEmailButton, LocalTime } from "@/components/contact-extras";
import { siteConfig } from "@/lib/site";
import "./contact-section.css";

const marquee = [
  "AI PRODUCTS",
  "FULL-STACK APPS",
  "LLM INTEGRATION",
  "AUTOMATION",
  "RAG SYSTEMS",
  "INTERACTIVE WEB",
];

const channels = [
  {
    label: "Email",
    value: siteConfig.contact.email,
    href: siteConfig.links.email,
    icon: Mail,
    color: "--yellow",
    copy: true,
  },
  {
    label: "Phone",
    value: siteConfig.contact.phoneDisplay,
    href: siteConfig.links.phone,
    icon: Phone,
    color: "--mint",
  },
  {
    label: "LinkedIn",
    value: "Suraj Singh",
    href: siteConfig.links.linkedin,
    icon: Linkedin,
    color: "--cyan",
    external: true,
  },
  {
    label: "GitHub",
    value: "@Suraj1812",
    href: siteConfig.links.github,
    icon: Github,
    color: "--lime",
    external: true,
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="contact-section portfolio-container" aria-labelledby="contact-title">
      <div className="contact-card">
        <div className="contact-topline" data-aos="fade-up">
          <span className="eyebrow">
            <span className="section-index">05 /</span> LET&apos;S CONNECT
          </span>
          <span className="contact-clock">
            <span className="contact-clock-dot" aria-hidden="true" />
            Faridabad, India · <LocalTime /> IST
          </span>
        </div>

        <div className="contact-main" data-aos="blur-up" data-aos-delay="80">
          <h2 id="contact-title">
            Building something
            <br />
            with AI?{" "}
            <a href={siteConfig.links.email} className="contact-talk">
              <span>
                Let&apos;s talk<span className="accent-text">.</span>
              </span>
              <ArrowUpRight strokeWidth={2.4} aria-hidden="true" />
            </a>
          </h2>
          <a href={siteConfig.links.email} className="contact-badge" aria-label="Send an email">
            <svg viewBox="0 0 200 200" className="contact-badge-ring" aria-hidden="true">
              <defs>
                <path id="contact-badge-circle" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
              </defs>
              <text>
                <textPath href="#contact-badge-circle">
                  SAY HELLO ✳ SAY HELLO ✳ SAY HELLO ✳
                </textPath>
              </text>
            </svg>
            <span className="contact-badge-core" aria-hidden="true">
              <ArrowUpRight size={34} strokeWidth={2.6} />
            </span>
          </a>
        </div>

        <ul className="contact-channels">
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <li
                key={channel.label}
                style={{ "--channel-color": `var(${channel.color})` } as CSSProperties}
                data-aos="fade-up"
                data-aos-delay={120 + index * 70}
              >
                <a
                  href={channel.href}
                  className="contact-channel"
                  {...(channel.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  <span className="contact-channel-icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <span className="contact-channel-text">
                    <span className="contact-channel-label">{channel.label}</span>
                    <span className="contact-channel-value">{channel.value}</span>
                  </span>
                  <ArrowUpRight className="contact-channel-arrow" size={18} aria-hidden="true" />
                  {channel.external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
                {channel.copy && <CopyEmailButton email={siteConfig.contact.email} />}
              </li>
            );
          })}
        </ul>

        <div className="contact-marquee" aria-hidden="true">
          <div className="contact-marquee-track">
            {[...marquee, ...marquee].map((item, index) => (
              <span key={`${item}-${index}`}>
                {item} <b>✳</b>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer portfolio-container" data-aos="fade">
      <a href="#top" className="footer-wordmark" aria-label="Suraj Singh, back to top">
        <span aria-hidden="true">SURAJ</span>
        <span aria-hidden="true">SINGH</span>
      </a>
      <div className="footer-row">
        <span>© {new Date().getFullYear()} Suraj Singh</span>
        <span className="footer-note">AI Developer & Full-Stack Engineer</span>
        <div id="github" className="footer-socials">
          <a href={siteConfig.links.github} target="_blank" rel="noreferrer" aria-label="Suraj on GitHub">
            <Github size={17} />
          </a>
          <a href={siteConfig.links.linkedin} target="_blank" rel="noreferrer" aria-label="Suraj on LinkedIn">
            <Linkedin size={17} />
          </a>
          <a href="#top" aria-label="Back to top">
            <ArrowUp size={17} />
          </a>
        </div>
      </div>
    </footer>
  );
}
