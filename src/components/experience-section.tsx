import Image from "next/image";
import { ArrowUpRight, BriefcaseBusiness, Check, ChevronDown, Clock3, Code2 } from "lucide-react";
import { experience } from "@/lib/portfolio-data";
import { monthKey } from "@/lib/experience-duration";
import { ExperienceAsOf, ExperienceDuration } from "@/components/experience-duration";
import "./experience-timeline.css";

const employerLogos: Record<string, { src: string; className: string }> = {
  Evtaar: { src: "/client-logos/evtaar.webp", className: "experience-chapter-logo-dark" },
  "People Maketh": { src: "/client-logos/peoplemaketh.svg", className: "experience-chapter-logo-light" },
};

const roleOutcomes: Record<string, { value: string; label: string }[]> = {
  "NEXUS SP Solutions": [
    { value: "1K+", label: "monthly platform users" },
    { value: "≈35%", label: "lower API response time" },
  ],
  Evtaar: [{ value: "30%", label: "lower frontend load time" }],
};

export function ExperienceSection() {
  const initialMonth = monthKey(new Date());

  return (
    <section id="experience" className="experience-chapters px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="experience-title">
      <div className="mx-auto max-w-6xl">
        <div className="experience-chapters-intro">
          <div>
            <span className="experience-chapters-eyebrow"><BriefcaseBusiness size={15} aria-hidden="true" /> 02 / PROFESSIONAL EXPERIENCE</span>
            <h2 id="experience-title">Built through <span>real work.</span></h2>
            <p>Client delivery, product engineering, backend systems, and AI automation. A timeline of the teams and problems behind the skills.</p>
            <a className="experience-chapters-resume" href="/resume">Read the full resume <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
          <div className="experience-chapters-total">
            <span className="experience-chapters-total-label"><Clock3 size={16} aria-hidden="true" /> TOTAL EXPERIENCE</span>
            <ExperienceDuration total initialMonth={initialMonth} className="experience-chapters-total-duration" />
            <p>Professional experience, including internship</p>
            <ExperienceAsOf initialMonth={initialMonth} />
          </div>
        </div>

        <ol className="experience-chapters-timeline" aria-label="Professional experience, most recent first">
          {experience.map((job, index) => {
            const logo = employerLogos[job.company];
            const outcomes = roleOutcomes[job.company];
            const current = !job.end;
            return (
              <li className={`experience-chapter experience-chapter-${index % 4}`} key={job.company}>
                <div className="experience-chapter-date">
                  <span className="experience-chapter-period">{job.period}</span>
                  <span className="experience-chapter-tenure"><Clock3 size={13} aria-hidden="true" /><ExperienceDuration start={job.start} end={job.end} initialMonth={initialMonth} /></span>
                  <span className="experience-chapter-type">{job.type}</span>
                </div>
                <span className="experience-chapter-marker" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <article className="experience-chapter-card" aria-labelledby={`experience-role-${index}`}>
                  <div className="experience-chapter-header">
                    <div className="experience-chapter-role">
                      <div className="experience-chapter-company">{job.company}{current && <span className="experience-chapter-current"><span aria-hidden="true" /> CURRENT ROLE</span>}</div>
                      <h3 id={`experience-role-${index}`}>{job.role}</h3>
                    </div>
                    {logo ? <div className={`experience-chapter-logo ${logo.className}`}><Image src={logo.src} alt="" width={130} height={48} /></div> : <div className="experience-chapter-role-icon" aria-hidden="true"><Code2 size={25} strokeWidth={2} /></div>}
                  </div>
                  <p className="experience-chapter-summary">{job.summary}</p>
                  {outcomes && <div className="experience-chapter-outcomes" aria-label={`Outcomes at ${job.company}`}>{outcomes.map((outcome) => <div key={outcome.value}><strong>{outcome.value}</strong><span>{outcome.label}</span></div>)}</div>}
                  <div className="experience-chapter-tools" aria-label={`${job.company} technologies and responsibilities`}>{job.stack.map((tool) => <span key={tool}>{tool}</span>)}</div>
                  <details className="experience-chapter-details">
                    <summary>Role highlights <ChevronDown size={17} aria-hidden="true" /></summary>
                    <ul>{job.details.map((detail) => <li key={detail}><Check size={15} aria-hidden="true" /><span>{detail}</span></li>)}</ul>
                  </details>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
