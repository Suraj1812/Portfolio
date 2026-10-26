import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  Download,
  FileText,
  GraduationCap,
} from "lucide-react";

import { siteConfig } from "@/lib/site";
import { experience } from "@/lib/portfolio-data";
import { monthKey } from "@/lib/experience-duration";
import { ExperienceDuration } from "@/components/experience-duration";
import "./resume-showcase.css";

export function ResumeSection() {
  const initialMonth = monthKey(new Date());
  return (
    <section
      id="resume"
      className="rshow-section portfolio-container"
      aria-labelledby="resume-section-title"
    >
      <div className="rshow-layout">
        <div className="rshow-intro" data-aos="fade-right">
          <span className="eyebrow">
            <span className="section-index">04 /</span> THE RESUME
          </span>
          <h2 id="resume-section-title">
            Resume,
            <br />
            <span className="rshow-title-pop">
              ready to read<span className="rshow-title-dot">.</span>
            </span>
          </h2>
          <dl className="rshow-facts">
            <div className="rshow-fact rshow-fact-experience">
              <span className="rshow-fact-icon" aria-hidden="true">
                <Clock3 size={17} />
              </span>
              <dt>Engineering experience</dt>
              <dd>
                <ExperienceDuration total initialMonth={initialMonth} />
              </dd>
            </div>
            <div className="rshow-fact rshow-fact-roles">
              <span className="rshow-fact-icon" aria-hidden="true">
                <BriefcaseBusiness size={17} />
              </span>
              <dt>Professional roles</dt>
              <dd>{String(experience.length).padStart(2, "0")}</dd>
            </div>
          </dl>
          <div className="rshow-education">
            <span className="rshow-grade" aria-hidden="true">
              <small>CGPA</small>
              8.8
            </span>
            <Image
              src="/artwork/learning-book.png"
              alt=""
              width={58}
              height={58}
              sizes="58px"
            />
            <div>
              <div className="rshow-education-label">
                <GraduationCap size={14} aria-hidden="true" /> EDUCATION
              </div>
              <h3>B.Voc in Software Development</h3>
              <p>
                Aggarwal College, Ballabgarh
                <br />
                2022–2025 <span>·</span> CGPA <strong>8.8</strong>
              </p>
            </div>
          </div>
          <div className="rshow-actions">
            <Link href="/resume" className="rshow-action rshow-action-preview">
              Preview resume <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
            <a
              href={siteConfig.links.resume}
              download="Suraj-Singh-Resume.pdf"
              className="rshow-action rshow-action-download"
            >
              Download PDF <Download size={18} aria-hidden="true" />
            </a>
          </div>
          <p className="rshow-file-note">
            <FileText size={13} aria-hidden="true" /> Original PDF · 1 page ·
            261 KB
          </p>
        </div>
        <Link
          href="/resume"
          className="rshow-viewer"
          data-aos="fade-left"
          data-aos-delay="120"
          aria-label="Open Suraj Singh's full-size resume preview"
        >
          <span className="rshow-stamp" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <defs>
                <path id="rshow-stamp-circle" d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
              </defs>
              <text>
                <textPath href="#rshow-stamp-circle">
                  ONE PAGE ✳ NO FLUFF ✳ ONE PAGE ✳ NO FLUFF ✳
                </textPath>
              </text>
            </svg>
            <strong>1</strong>
          </span>
          <div className="rshow-viewer-toolbar">
            <span className="rshow-window-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span>
              <FileText size={16} aria-hidden="true" /> Suraj-Singh-Resume.pdf
            </span>
            <span className="rshow-page-count">1 / 1</span>
          </div>
          <div className="rshow-document-stage">
            <span className="rshow-float rshow-float-1" aria-hidden="true">AI ✳</span>
            <span className="rshow-float rshow-float-2" aria-hidden="true">FULL-STACK</span>
            <span className="rshow-float rshow-float-3" aria-hidden="true">3+ YRS</span>
            <div className="rshow-paper-stack">
              <div className="rshow-document">
                <span className="rshow-scan" aria-hidden="true" />
                <Image
                  src="/resume/resume-preview.png"
                  alt="Suraj Singh's original one-page resume."
                  width={1653}
                  height={2339}
                  sizes="(max-width: 600px) 70vw, 300px"
                />
              </div>
            </div>
            <span className="rshow-document-label">
              EXPERIENCE. SKILLS. EDUCATION.
            </span>
          </div>
          <div className="rshow-viewer-footer">
            <span>Open the full-size preview</span>
            <span className="rshow-viewer-arrow">
              <ArrowUpRight size={19} aria-hidden="true" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
