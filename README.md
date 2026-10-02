# Suraj Singh Portfolio

A personal portfolio for Suraj Singh, AI Developer & Full-Stack Engineer. Bright yellow, pink, cyan, and lime panels, chunky black borders, thick shadows, and a grid background carry the original neobrutalist identity. Professional experience, AI skills, and education are drawn from his supplied resume.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion, GSAP, and Lenis
- Three.js for the interactive 3D hero
- Local bundled fonts
- App Router metadata routes

## Portfolio

- A bold name-led hero with scroll parallax, magnetic buttons, and a pointer-responsive 3D orbit
- A 40-project catalogue with category filters, live/source links, and accessible project detail dialogs
- Eight projects per page: five full catalogue pages, four columns on desktop, and two columns on mobile
- Colorful client cards, a professional experience timeline, technical skill groups, and contact links
- Automatic experience durations in years and months, including current roles; total experience counts overlapping roles once
- Resume panel and `/resume` preview with the original PDF available to open or download
- Responsive layout and accessible navigation
- Open Graph image, Twitter image, sitemap, robots, and manifest
- Reduced-motion support and a static fallback when WebGL is unavailable
- Original generated 3D artwork in `public/artwork`, including compact icons for AI, interfaces, backend systems, and infrastructure

## Project sources and visuals

The catalogue contains 37 linked public-source projects, two client product websites, and the archived AMZE project retained from the original portfolio. Repository manifests and implementation files support the descriptions; a source link does not imply a working hosted demo or verified production use. Some projects require local models, accounts, or configured services.

The final ten additions and their implementation boundaries are documented in [docs/final-project-evidence.md](docs/final-project-evidence.md). Earlier additions are documented in [docs/additional-project-evidence.md](docs/additional-project-evidence.md), and the content and resume provenance are recorded in [docs/content-sources.md](docs/content-sources.md).

Project cards use 26 existing project logos and site icons stored in `public/project-logos`. Their original repository or live-site URLs and verification notes are recorded in [docs/project-logo-evidence.md](docs/project-logo-evidence.md) and the logo section of [docs/final-project-evidence.md](docs/final-project-evidence.md). Screenshots come from actual project interfaces; cards without a confirmed logo use decorative artwork.

## Artwork

The generated illustrations are decorative assets, not official technology logos. Their source prompts are recorded in [docs/artwork-prompts.md](docs/artwork-prompts.md).

## Resume

The supplied one-page resume is preserved at `public/resume/Suraj-Singh-Resume.pdf`. Its preview image is rendered from that PDF at 200 DPI; the website does not rewrite the resume.

## Environment

Create a `.env.local` file from `.env.example` and set:

```bash
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

If this variable is not set, the app falls back to Vercel environment URLs and then `http://localhost:3000` in local development.

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```
