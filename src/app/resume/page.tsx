import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  Download,
  FileText,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";

import { ExperienceDuration } from "@/components/experience-duration";
import { monthKey } from "@/lib/experience-duration";
import { experience, skillGroups } from "@/lib/portfolio-data";
import { siteConfig } from "@/lib/site";
import "./resume-page.css";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "View and download Suraj Singh's resume, including experience in AI development and full-stack engineering, technical skills, and education.",
  alternates: { canonical: "/resume" },
};

const roleColors = ["--cyan", "--mint", "--lime", "--orange", "--yellow", "--blue"];

export default function ResumePage() {
  const initialMonth = monthKey(new Date());

  return (
    <main className="rp">
      <header className="rp-toolbar-wrap">
        <div className="rp-toolbar">
          <Link href="/" className="rp-back">
            <span className="rp-back-icon" aria-hidden="true">
              <ArrowLeft size={18} />
            </span>
            <span className="rp-back-label">Back to portfolio</span>
          </Link>
          <span className="rp-file" aria-hidden="true">
            <FileText size={15} /> Suraj-Singh-Resume.pdf
            <span className="rp-file-meta">1 page · 261 KB</span>
          </span>
          <div className="rp-toolbar-actions">
            <a
              href={siteConfig.links.resume}
              target="_blank"
              rel="noreferrer"
              className="rp-btn rp-btn-ghost"
            >
              <span>Open PDF</span> <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only"> in a new tab</span>
            </a>
            <a
              href={siteConfig.links.resume}
              download="Suraj-Singh-Resume.pdf"
              className="rp-btn rp-btn-primary"
            >
              <span>Download</span> <Download size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <section className="rp-hero portfolio-container" aria-labelledby="resume-title">
        <div className="rp-hero-copy" data-aos="blur-up">
          <span className="rp-eyebrow">
            <span aria-hidden="true">✳</span> THE RESUME / SURAJ SINGH
          </span>
          <h1 id="resume-title">
            Experience,
            <br />
            <span className="rp-title-pop">
              on paper<span className="rp-title-dot">.</span>
            </span>
          </h1>
          <p>AI development, full-stack engineering, and the work behind them.</p>
          <ul className="rp-facts" aria-label="Quick facts">
            <li style={{ "--fact": "var(--yellow)" } as CSSProperties}>
              <Clock3 size={15} aria-hidden="true" />
              <ExperienceDuration total initialMonth={initialMonth} /> experience
            </li>
            <li style={{ "--fact": "var(--mint)" } as CSSProperties}>
              <BriefcaseBusiness size={15} aria-hidden="true" />
              {experience.length} roles
            </li>
            <li style={{ "--fact": "var(--cyan)" } as CSSProperties}>
              <GraduationCap size={15} aria-hidden="true" />
              B.Voc · CGPA 8.8
            </li>
            <li style={{ "--fact": "var(--orange)" } as CSSProperties}>
              <MapPin size={15} aria-hidden="true" />
              Faridabad, India
            </li>
          </ul>
        </div>
        <div className="rp-stamp" aria-hidden="true">
          <svg viewBox="0 0 160 160">
            <defs>
              <path id="rp-stamp-circle" d="M80,80 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0" />
            </defs>
            <text>
              <textPath href="#rp-stamp-circle">
                ONE PAGE ✳ NO FLUFF ✳ ONE PAGE ✳ NO FLUFF ✳
              </textPath>
            </text>
          </svg>
          <span>
            <FileText size={28} strokeWidth={2.4} />
          </span>
        </div>
      </section>

      <section className="rp-body portfolio-container" aria-label="Resume document">
        <div className="rp-paper-col" data-aos="zoom-in" data-aos-delay="120">
          <div className="rp-paper-stack">
            <div className="rp-paper">
              <Image
                src="/resume/resume-preview.png"
                alt="Suraj Singh's one-page resume with professional experience, technical skills, and education."
                width={1653}
                height={2339}
                sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 72px), 780px"
                priority
              />
            </div>
          </div>
          <p className="rp-note">
            <FileText size={14} aria-hidden="true" /> For selectable text and working links,
            open or download the PDF.
          </p>
        </div>

        <aside className="rp-side" aria-label="Resume at a glance">
          <div className="rp-card" data-aos="fade-left" data-aos-delay="160">
            <h2 className="rp-card-title">
              <BriefcaseBusiness size={16} aria-hidden="true" /> Career at a glance
            </h2>
            <ol className="rp-roles">
              {experience.map((job, index) => (
                <li
                  key={job.company}
                  style={{ "--role": `var(${roleColors[index % roleColors.length]})` } as CSSProperties}
                >
                  <span className="rp-role-dot" aria-hidden="true" />
                  <div>
                    <strong>{job.role}</strong>
                    <span>
                      {job.company} · {job.type}
                    </span>
                    <small>{job.period}</small>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rp-card rp-card-skills" data-aos="fade-left" data-aos-delay="220">
            <h2 className="rp-card-title">
              <span aria-hidden="true">✳</span> Core stack
            </h2>
            {skillGroups.map((group) => (
              <div key={group.title} className="rp-skill-group">
                <span>{group.title}</span>
                <div>
                  {group.skills.slice(0, 4).map((skill) => (
                    <em key={skill}>{skill}</em>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rp-card rp-card-contact" data-aos="fade-left" data-aos-delay="280">
            <h2 className="rp-card-title">Say hello</h2>
            <a href={siteConfig.links.email}>
              <Mail size={17} aria-hidden="true" /> {siteConfig.contact.email}
            </a>
            <a href={siteConfig.links.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={17} aria-hidden="true" /> LinkedIn
              <ArrowUpRight size={15} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </aside>
      </section>

      <section className="rp-cta portfolio-container" data-aos="fade-up">
        <div>
          <strong>Like what you read?</strong>
          <span>Let&apos;s build something useful together.</span>
        </div>
        <div className="rp-cta-actions">
          <a href={siteConfig.links.email} className="rp-btn rp-btn-primary">
            <span>Email me</span> <Mail size={16} aria-hidden="true" />
          </a>
          <Link href="/#work" className="rp-btn rp-btn-light">
            <span>See projects</span> <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
