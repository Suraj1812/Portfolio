"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
} from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Braces,
  Check,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Database,
  ExternalLink,
  Github,
  Layers3,
  Network,
  Orbit,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { portfolioProjects, type PortfolioProject } from "@/lib/portfolio-data";
import "./project-gallery.css";

const filters = [
  { id: "all", label: "All projects" },
  { id: "ai", label: "AI & automation" },
  { id: "fullstack", label: "Full-stack" },
  { id: "interface", label: "Interfaces" },
] as const;

type ProjectWithArchive = PortfolioProject & {
  archiveNote?: string;
  icon?: string;
  logo?: string;
};
const projectColors = ["lime", "pink", "cyan", "yellow", "blue", "orange"];
const projectsPerPage = 8;
const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function ProjectVisual({
  project,
  index,
  detail = false,
}: {
  project: ProjectWithArchive;
  index: number;
  detail?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const visualRef = useRef<HTMLDivElement>(null);
  const inView = useInView(visualRef, { margin: "160px" });
  const animateVisuals = !reduceMotion && inView;
  const icons =
    project.category === "ai"
      ? [Braces, Bot, Cpu]
      : project.category === "fullstack"
        ? [Braces, Network, Database]
        : [Layers3, Orbit, Cpu];
  const solar = project.id === "solar-system";
  const artwork = project.id === "amze";
  const projectIcon =
    project.icon ??
    (project.category === "ai"
      ? "/artwork/ai-robot.png"
      : project.category === "fullstack"
        ? "/artwork/backend-database.png"
        : "/artwork/browser-ui.png");

  return (
    <div
      ref={visualRef}
      className={`rich-project-visual rich-project-color-${projectColors[index % projectColors.length]} ${detail ? "rich-project-visual-detail" : ""}`}
    >
      <div className="rich-project-visual-top">
        <span>
          {artwork
            ? "PROJECT BRAND ARTWORK"
            : project.image
              ? "THE REAL INTERFACE"
              : detail
                ? "HOW IT COMES TOGETHER"
                : "PROJECT ILLUSTRATION"}
        </span>
        <span>{project.year}</span>
      </div>
      <div className="rich-project-visual-grid" aria-hidden="true" />
      {project.image ? (
        <motion.div
          className={artwork ? "rich-project-artwork" : "rich-project-browser"}
          whileHover={reduceMotion ? undefined : { rotate: 0, y: -4 }}
          style={{ rotate: index % 2 === 0 ? -2 : 2 }}
        >
          {!artwork && (
            <div className="rich-project-browser-bar">
              <span className="rich-project-browser-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>
                {project.liveUrl
                  ? new URL(project.liveUrl).hostname.replace("www.", "")
                  : project.title.toLowerCase().replaceAll(" ", "-")}
              </span>
              <ExternalLink size={12} aria-hidden="true" />
            </div>
          )}
          <div className="rich-project-screen">
            <Image
              src={project.image}
              alt={
                artwork
                  ? `${project.title} technology storefront brand artwork`
                  : `${project.title} application interface`
              }
              fill
              sizes={
                detail
                  ? "(max-width: 780px) 90vw, 560px"
                  : "(max-width: 700px) 90vw, (max-width: 1099px) 45vw, 370px"
              }
            />
          </div>
          {artwork && (
            <span className="rich-project-artwork-caption">
              Archived storefront · Brand artwork
            </span>
          )}
        </motion.div>
      ) : !detail ? (
        <motion.div
          className="rich-project-illustration"
          aria-hidden="true"
          animate={
            animateVisuals
              ? { y: [0, -5, 0], rotate: [-3, 3, -3] }
              : { y: 0, rotate: 0 }
          }
          transition={
            animateVisuals
              ? {
                  duration: 7 + (index % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : { duration: 0 }
          }
        >
          <Image src={projectIcon} alt="" fill sizes="150px" />
        </motion.div>
      ) : solar ? (
        <div className="rich-project-solar">
          <div
            className="rich-project-orbit rich-project-orbit-one"
            aria-hidden="true"
          />
          <div
            className="rich-project-orbit rich-project-orbit-two"
            aria-hidden="true"
          />
          <div
            className="rich-project-orbit rich-project-orbit-three"
            aria-hidden="true"
          />
          <motion.div
            className="rich-project-sun"
            aria-hidden="true"
            animate={animateVisuals ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="rich-project-planet rich-project-planet-one"
            aria-hidden="true"
            animate={animateVisuals ? { y: [0, -10, 0] } : { y: 0 }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="rich-project-planet rich-project-planet-two"
            aria-hidden="true"
            animate={animateVisuals ? { y: [0, 8, 0] } : { y: 0 }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="rich-project-solar-caption">
            <Orbit size={16} /> React × Three.js × Motion
          </span>
        </div>
      ) : (
        <div className="rich-project-system">
          <div className="rich-project-system-shadow" aria-hidden="true" />
          {project.diagram.map((step, stepIndex) => {
            const Icon = icons[stepIndex % icons.length];
            return (
              <div className="rich-project-system-step" key={step}>
                <motion.div
                  className="rich-project-system-node"
                  animate={animateVisuals ? { y: [0, -3, 0] } : { y: 0 }}
                  transition={{
                    duration: 5,
                    delay: stepIndex * 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="rich-project-system-icon">
                    <Icon size={20} strokeWidth={2.3} />
                  </span>
                  <span>{step}</span>
                  <span className="rich-project-system-number">
                    0{stepIndex + 1}
                  </span>
                </motion.div>
                {stepIndex < project.diagram.length - 1 && (
                  <ArrowDown
                    className="rich-project-system-arrow"
                    size={17}
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
      {(project.image || detail) && (
        <motion.div
          className="rich-project-floating-shape"
          aria-hidden="true"
          animate={
            animateVisuals
              ? { y: [0, -8, 0], rotate: [12, 20, 12] }
              : { y: 0, rotate: 12 }
          }
          transition={
            animateVisuals
              ? {
                  duration: 7 + (index % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : { duration: 0 }
          }
        >
          <Image src={projectIcon} alt="" fill sizes="60px" />
        </motion.div>
      )}
      {!detail && (
        <span className="rich-project-visual-open" aria-hidden="true">
          <ArrowUpRight size={24} />
        </span>
      )}
    </div>
  );
}

function ProjectLinks({ project }: { project: ProjectWithArchive }) {
  return (
    <>
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          aria-label={`Live site for ${project.title}, opens in a new tab`}
          target="_blank"
          rel="noreferrer"
          className="rich-project-action rich-project-action-live"
        >
          <span className="rich-project-action-label">Live site</span>
          <ArrowUpRight size={17} aria-hidden="true" />
          <span className="sr-only">
            {" "}
            for {project.title}, opens in a new tab
          </span>
        </a>
      )}
      {project.sourceUrl && (
        <a
          href={project.sourceUrl}
          aria-label={`Source code for ${project.title}, opens in a new tab`}
          target="_blank"
          rel="noreferrer"
          className="rich-project-action rich-project-action-source"
        >
          <Github size={16} aria-hidden="true" />
          <span className="rich-project-action-label">Source</span>
          <span className="sr-only">
            {" "}
            code for {project.title}, opens in a new tab
          </span>
        </a>
      )}
    </>
  );
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: ProjectWithArchive;
  index: number;
  onOpen: (project: ProjectWithArchive) => void;
}) {
  const reduceMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 170, damping: 23 });
  const springY = useSpring(rotateY, { stiffness: 170, damping: 23 });

  function tilt(event: PointerEvent<HTMLElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    rotateX.set((0.5 - (event.clientY - bounds.top) / bounds.height) * 5);
    rotateY.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 5);
  }

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.article
      className="rich-project-card"
      style={{ rotateX: springX, rotateY: springY }}
      onPointerMove={tilt}
      onPointerLeave={resetTilt}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
    >
      <button
        type="button"
        className="rich-project-preview-button"
        onClick={() => onOpen(project)}
        aria-label={`Explore ${project.title}: overview and implementation details`}
        aria-haspopup="dialog"
      >
        <ProjectVisual project={project} index={index} />
      </button>
      <div className="rich-project-content">
        <div className="rich-project-category">
          <span>{project.categoryLabel}</span>
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <h3>
          <button
            type="button"
            onClick={() => onOpen(project)}
            aria-haspopup="dialog"
          >
            {project.logo && (
              <Image
                className={`rich-project-logo${project.logoDark ? " rich-project-logo-dark" : ""}`}
                src={project.logo}
                alt=""
                width={24}
                height={24}
              />
            )}
            {project.title}
          </button>
        </h3>
        <p className="rich-project-description">{project.description}</p>
        <div
          className="rich-project-tags"
          aria-label={`${project.title} technologies`}
        >
          {project.stack.slice(0, 2).map((tool) => (
            <span key={tool} title={tool}>
              {tool}
            </span>
          ))}
          {project.stack.length > 2 && (
            <span
              className="rich-project-more-tags"
              title={project.stack.slice(2).join(", ")}
              aria-label={`Also uses ${project.stack.slice(2).join(", ")}`}
            >
              +{project.stack.length - 2}
            </span>
          )}
        </div>
        <div className="rich-project-card-footer">
          <div className="rich-project-external-links">
            <ProjectLinks project={project} />
          </div>
          <button
            type="button"
            className="rich-project-detail-link"
            onClick={() => onOpen(project)}
            aria-haspopup="dialog"
          >
            Details <ArrowRight size={17} aria-hidden="true" />
            <span className="sr-only"> for {project.title}</span>
          </button>
        </div>
        {(project.demoNote || project.archiveNote) && (
          <p className="rich-project-note">
            {project.demoNote || project.archiveNote}
          </p>
        )}
      </div>
    </motion.article>
  );
}

function ProjectDialog({
  project,
  onClose,
}: {
  project: ProjectWithArchive | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (project && !element.open) element.showModal();
    if (!project && element.open) element.close();
    if (!project) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [project]);

  const index = project
    ? portfolioProjects.findIndex((item) => item.id === project.id)
    : 0;

  return (
    <dialog
      ref={dialog}
      className="rich-project-dialog"
      aria-labelledby="rich-project-dialog-title"
      aria-describedby="rich-project-dialog-description"
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      data-lenis-prevent
    >
      {project && (
        <motion.div
          className="rich-project-dialog-shell"
          initial={reduceMotion ? false : { y: 25, scale: 0.98 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="rich-project-dialog-topbar">
            <span>
              <span aria-hidden="true">✳</span> PROJECT EXPLORER /{" "}
              {String(index + 1).padStart(2, "0")}
            </span>
            <button
              type="button"
              className="rich-project-dialog-close"
              onClick={onClose}
              autoFocus
              aria-label="Close project details"
            >
              <X size={24} />
            </button>
          </div>
          <div className="rich-project-dialog-body">
            <div className="rich-project-dialog-overview">
              <span className="rich-project-dialog-category">
                {project.categoryLabel}
              </span>
              <h2 id="rich-project-dialog-title">{project.title}</h2>
              <p id="rich-project-dialog-description">{project.description}</p>
              <div className="rich-project-tags">
                {project.stack.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
              <div className="rich-project-dialog-links">
                <ProjectLinks project={project} />
              </div>
              {(project.demoNote || project.archiveNote) && (
                <p className="rich-project-note">
                  {project.demoNote || project.archiveNote}
                </p>
              )}
            </div>
            <ProjectVisual project={project} index={index} detail />
            <div className="rich-project-implementation">
              <h3>
                <Braces size={22} aria-hidden="true" /> Inside the build
              </h3>
              <ul>
                {project.features.map((feature) => (
                  <li key={feature}>
                    <span>
                      <Check size={17} aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rich-project-architecture">
              <h3>
                <Network size={22} aria-hidden="true" /> The building blocks
              </h3>
              <ol>
                {project.diagram.map((step, stepIndex) => (
                  <li key={step}>
                    <span>{String(stepIndex + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="rich-project-dialog-bottom">
            <span>
              {project.year} /{" "}
              {project.sourceUrl
                ? "Explore the implementation on GitHub."
                : project.liveUrl
                  ? "Explore the live website."
                  : "Archived project overview."}
            </span>
            <button type="button" onClick={onClose}>
              Back to all projects <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </dialog>
  );
}

export function SelectedWork() {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    clientSnapshot,
    serverSnapshot,
  );
  const [category, setCategory] =
    useState<(typeof filters)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ProjectWithArchive | null>(null);
  const searchField = useRef<HTMLInputElement>(null);
  const projectGrid = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const motionEnabled = hydrated && !reduceMotion;
  const searchTerms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matchingProjects = portfolioProjects.filter((project) => {
    const searchableText = [
      project.title,
      project.description,
      project.categoryLabel,
      ...project.stack,
      ...project.features,
      ...project.diagram,
    ]
      .join(" ")
      .toLowerCase();
    return searchTerms.every((term) => searchableText.includes(term));
  });
  const projects = matchingProjects.filter(
    (project) => category === "all" || project.category === category,
  );
  const totalPages = Math.max(1, Math.ceil(projects.length / projectsPerPage));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * projectsPerPage;
  const visibleProjects = projects.slice(
    pageStart,
    pageStart + projectsPerPage,
  );

  function changePage(nextPage: number) {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
    projectGrid.current?.scrollIntoView({
      block: "start",
      behavior: reduceMotion ? "instant" : "smooth",
    });
    projectGrid.current?.focus({ preventScroll: true });
  }

  return (
    <section
      id="work"
      className="rich-project-section px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="work-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="rich-project-heading-row">
          <div className="rich-project-heading">
            <span className="rich-project-eyebrow">
              <Sparkles size={16} aria-hidden="true" />{" "}
              {portfolioProjects.length} PROJECTS. REAL CODE. REAL CURIOSITY.
            </span>
            <h2 id="work-title">
              Projects with substance.
              <br />
              <span>And personality.</span>
            </h2>
            <p>
              AI assistants, full-stack systems, client websites, and
              interactive experiments. Different ideas. The same hands-on
              approach to building.
            </p>
          </div>
          <div className="rich-project-heading-stamp" aria-hidden="true">
            <Braces size={34} strokeWidth={2.5} />
            <span>
              CODE.
              <br />
              SYSTEMS.
              <br />
              EXPERIMENTS.
            </span>
          </div>
        </div>
        <div className="rich-project-toolbar">
          <div className="rich-project-search">
            <Search size={19} aria-hidden="true" />
            <label htmlFor="project-search" className="sr-only">
              Search projects, technologies, or implementation details
            </label>
            <input
              ref={searchField}
              id="project-search"
              type="search"
              name="project-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search projects or technologies..."
              autoComplete="off"
              aria-controls="project-results"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear project search"
                onClick={() => {
                  setQuery("");
                  setPage(1);
                  searchField.current?.focus();
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
          <p
            className="rich-project-count"
            aria-live="polite"
            aria-atomic="true"
          >
            8 projects per page <ArrowDown size={16} aria-hidden="true" />
          </p>
        </div>
        <div className="rich-project-filter-row">
          <div
            className="rich-project-filters"
            role="group"
            aria-label="Filter projects"
          >
            {filters.map((filter) => {
              const count = matchingProjects.filter(
                (project) =>
                  filter.id === "all" || project.category === filter.id,
              ).length;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={category === filter.id}
                  onClick={() => {
                    setCategory(filter.id);
                    setPage(1);
                  }}
                >
                  {filter.label}
                  <span>{String(count).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>
        </div>
        <motion.div
          id="project-results"
          ref={projectGrid}
          tabIndex={-1}
          aria-label="Project results"
          className="rich-project-grid"
          layout={motionEnabled}
        >
          {visibleProjects.map((project) => (
            <motion.div
              className="rich-project-card-frame"
              key={project.id}
              layout={motionEnabled}
              initial={false}
              animate={{ y: 0, opacity: 1 }}
              whileInView={motionEnabled ? { y: [15, 0] } : undefined}
              viewport={{ once: true, margin: "80px" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <ProjectCard
                project={project}
                index={portfolioProjects.findIndex(
                  (item) => item.id === project.id,
                )}
                onOpen={setSelected}
              />
            </motion.div>
          ))}
        </motion.div>
        <div className="rich-project-pagination-row">
          <p
            className="rich-project-range"
            aria-live="polite"
            aria-atomic="true"
          >
            {projects.length
              ? `Showing ${pageStart + 1}–${Math.min(pageStart + projectsPerPage, projects.length)} of ${projects.length} projects`
              : "Showing 0 of 0 projects"}
          </p>
          {projects.length > 0 && (
            <nav
              className="rich-project-pagination"
              aria-label="Project pagination"
            >
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
                aria-label="Previous project page"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    aria-label={`Project page ${pageNumber}`}
                    aria-current={
                      currentPage === pageNumber ? "page" : undefined
                    }
                    onClick={() => changePage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ),
              )}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => changePage(currentPage + 1)}
                aria-label="Next project page"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </nav>
          )}
        </div>
        {projects.length === 0 && (
          <div className="rich-project-empty">
            <Search size={28} aria-hidden="true" />
            <h3>No projects match this search.</h3>
            <p>Try a project name, a technology, or another category.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setPage(1);
                searchField.current?.focus();
              }}
            >
              Show all projects <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        )}
        <a
          className="rich-project-github"
          href="https://github.com/Suraj1812"
          target="_blank"
          rel="noreferrer"
        >
          <span>
            <Github size={24} aria-hidden="true" /> More experiments. More
            source code.
          </span>
          <span>
            Explore my GitHub <ArrowUpRight size={22} aria-hidden="true" />
          </span>
        </a>
      </div>
      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
