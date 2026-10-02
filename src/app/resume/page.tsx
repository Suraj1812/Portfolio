import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download } from "lucide-react";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "View and download Suraj Singh's resume, including experience in AI development and full-stack engineering, technical skills, and education.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <main className="resume-page">
      <header className="resume-toolbar portfolio-container">
        <Link href="/" className="resume-back">
          <ArrowLeft size={17} /> Back to portfolio
        </Link>
        <div className="resume-toolbar-actions">
          <a
            href={siteConfig.links.resume}
            download="Suraj-Singh-Resume.pdf"
            className="button button-primary"
          >
            Download PDF <Download size={17} />
          </a>
          <a
            href={siteConfig.links.resume}
            target="_blank"
            rel="noreferrer"
            className="resume-open-pdf"
          >
            Open PDF <ArrowUpRight size={17} />
            <span className="sr-only"> in a new tab</span>
          </a>
        </div>
      </header>
      <section
        className="resume-page-content portfolio-container"
        aria-labelledby="resume-title"
      >
        <div className="resume-page-heading">
          <span className="eyebrow">RESUME / SURAJ SINGH</span>
          <h1 id="resume-title">
            Experience, on paper<span className="accent-text">.</span>
          </h1>
          <p>
            AI development, full-stack engineering, and the work behind them.
          </p>
        </div>
        <div className="resume-document">
          <Image
            src="/resume/resume-preview.png"
            alt="Suraj Singh's one-page resume with professional experience, technical skills, and education."
            width={1653}
            height={2339}
            sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 72px), 900px"
            priority
          />
        </div>
        <p className="resume-document-note">
          For selectable text and embedded links, open or download the PDF.
        </p>
      </section>
    </main>
  );
}
