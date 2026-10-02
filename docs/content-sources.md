# Portfolio content sources

Professional history, dates, education, and listed AI technologies come from the supplied `Suraj Singh _ Software Engineer.pdf`. The website serves that PDF unchanged at `/resume/Suraj-Singh-Resume.pdf`. Its SHA-256 is `fbb27f78437a1f82af465e04007fb695f9a1429295ddf2be27dd3af381a7f40c`.

The portfolio describes AI development as an engineering focus. The resume's employment history begins in February 2023; it does not assert that every year of that history was spent exclusively on AI.

## Implementation evidence

- **Grounded Notes:** [repository](https://github.com/Suraj1812/grounded-notes-qa-assistant). Markdown chunking and retrieval live in `src/server/retrieval`; Ollama generation and low-match refusal live in `src/server/services`. Retrieval uses TF-IDF and cosine scoring, rather than a neural embedding model or dedicated vector database. The card image comes from the repository's `docs/screenshots/assistant.png`.
- **Local Agent:** [repository](https://github.com/Suraj1812/Local-Agent). Agent planning, management, and execution live in `backend/agents`; knowledge and model integrations live in `backend/services`. Planning is deterministic and document retrieval uses token-hash vectors. The site links to the source because its deployed backend was unavailable during review.
- **AIPedia:** [repository](https://github.com/Suraj1812/AIpedia). `src/ollama-client.js`, `agent-router.js`, `url-learning.js`, and `learned-topic-store.js` support the model, prompt routing, and local knowledge claims. The old Railway demo returned 404, so the site links to the source.
- **Realtime Chat App:** [repository](https://github.com/Suraj1812/ChatApp). Its package manifest supports Node.js, Express, Socket.IO, and SQLite. The old Railway demo returned 404, so the site links to the source.
- **Solar System Explorer:** [repository](https://github.com/Suraj1812/The-Solar-System). Its manifest supports React, Vite, Three.js, GSAP, and Framer Motion.
- **Dattamsha Data Labs:** [repository](https://github.com/Suraj1812/Dattamsha-Data-Labs). Its manifest supports React, TypeScript, Vite, Framer Motion, and Express.
- **Cricket Connect AI and Fashion Pattern Lab:** retained from the original portfolio. The cards describe the visible product website and interface; they do not claim a specific model implementation, technology stack, or commercial result.
- **Linux deployment tooling:** [Sync](https://github.com/Suraj1812/Sync) contains an Alpine-based Dockerfile, shell migration entrypoint, and Nginx API/WebSocket proxy configuration. Local Agent contains an Ollama shell startup script. These support Linux container/deployment experience; the site does not claim broad Linux server administration.

The 2026 labels on newly audited repositories reflect their repository creation year, not independently verified project completion dates. Earlier project dates are retained from the original portfolio. Resume percentages remain in role highlights and are not presented as measurements performed by this portfolio.

## Expanded project gallery

The final catalogue contains 40 distinct entries: 37 linked public-source projects, two client product websites, and the archived AMZE project retained from the original portfolio. The full catalogue uses five pages of exactly eight projects, with four columns on desktop and two columns on mobile. Category filters paginate the matching entries without introducing duplicate projects.

Ten additions were verified through public repository manifests and implementation files:

- **Bolo:** [voice-studio.tsx](https://github.com/Suraj1812/Bolo/blob/main/src/components/voice-studio.tsx) implements browser speech recognition, speech synthesis, language selection, and local transcript storage. Its image is an actual live-site capture.
- **Filer:** [Drive service](https://github.com/Suraj1812/Filer/blob/main/src/lib/drive.ts), API routes, and the Prisma schema support the Drive operations and PostgreSQL claims. The public preview requires Google sign-in.
- **FlyJustice Lite:** [ClaimService](https://github.com/Suraj1812/FlyJustice-Lite/blob/main/Services/ClaimService.cs) and CompensationCalculator implement claim tracking and rule-based estimates.
- **Sync:** [WebRTC hook](https://github.com/Suraj1812/Sync/blob/main/frontend/src/hooks/useWebRTC.ts), the NestJS gateway, and Prisma schema implement video-call flows, messaging, and persistence.
- **VisionPlay:** [YOLO detector](https://github.com/Suraj1812/VisionPlay/blob/main/ai/detection/yolo_detector.py) and the video pipeline support actual object detection, tracking, and overlays.
- **Maidan:** [action implementations](https://github.com/Suraj1812/Maidan/blob/main/src/lib/actions/index.ts) and Supabase files support squads, invitations, challenges, and evidence submission.
- **Navapur:** [game.ts](https://github.com/Suraj1812/Navapur/blob/main/src/core/game.ts), player modules, and simulation code support the 3D city, controls, and residents. Its image is an actual live-site capture.
- **3D Cricket:** [game store](https://github.com/Suraj1812/3D-Cricket/blob/main/src/store/useGameStore.js) and scene components implement batting, scoring, formats, and controls. Its image is an actual live-site capture. This is a distinct repository from Cricket Connect AI.
- **Earthre SLA Monitor:** [CSV upload route](https://github.com/Suraj1812/earthre-sla-monitor/blob/main/app/api/upload/route.ts) and the dashboard route implement ingestion, validation, and SQL aggregation.
- **Ledgent.AI:** [AI service](https://github.com/Suraj1812/Ledgent.AI/blob/main/apps/api/src/modules/ai/ai.service.ts) and the Prisma schema support deterministic matching, exceptions, approvals, and an optional OpenAI copilot.

Nine further additions and their exact implementation evidence are documented in [additional-project-evidence.md](additional-project-evidence.md). The final ten additions are documented in [final-project-evidence.md](final-project-evidence.md):

- **Instagram-style Mobile App:** the current repositories, authentication, and media services use Supabase, despite stale local-only wording in the README.
- **Shot Explorer:** framing controls and canvas previews work independently of the optional Gemini image-generation endpoint; the local fallback does not establish novel-view synthesis.
- **ChadWallet:** token research and buy/sell quote previews are implemented; transaction execution is not implemented.
- **Indian Tourism DB:** FlexSearch indexing, Leaflet map views, and Wikipedia enrichment operate on local place records.
- **GB OrderFlow:** dealer order submission, head-office approval, and deterministic CSV exports have service implementations.
- **Draw Clash:** the `Guess-Where` repository now implements multiplayer drawing and guessing, rather than the older country-guessing description.
- **Fomio:** PostgreSQL models, feeds, social interactions, and authenticated image-upload routes support the social web application.
- **ConversionLens / Shoplytics:** event collection and SQL-backed funnel analytics form one project; both names identify the same repository.
- **SmartClinic:** an Odoo module implements appointment models, website routes, and overlap checks; it requires an Odoo runtime.
- **Nexus Store:** separate storefront/admin applications and a NestJS backend support catalogue and cart workflows. Its verified repository creation year is 2025.

All source links refer to the user's public repositories. Source inspection verifies the described implementation patterns, not production adoption, measured outcomes, or every end-to-end runtime flow. Source-only cards do not imply working hosted demos. Optional AI integrations are described as optional, and repository claims of production readiness are not treated as independent evidence.

## Project logos and artwork

The catalogue maps 26 existing project logos or site icons to local files in `public/project-logos`. Twenty original repository and live-site URLs, their image checks, and their brand-mark evidence are recorded in [project-logo-evidence.md](project-logo-evidence.md). The final six logo sources are recorded in the logo section of [final-project-evidence.md](final-project-evidence.md). Cricket Connect AI's icon comes from its live website; Fashion Pattern Lab's mark is the site's linked custom-logo image.

SVG contents were inspected to exclude generic React, Vite, Next.js, and Vercel starter logos. An HTTP 200 image response establishes asset availability; the source notes preserve the distinction between SVG inspection and raster-logo inspection. A logo or site icon identifies the project and does not verify its functionality.

The custom 3D icons are decorative artwork generated for the portfolio and provide fallbacks where no authentic project logo was confirmed. Their prompts are recorded in [artwork-prompts.md](artwork-prompts.md); real screenshots are labelled separately in the gallery.

## Experience duration

Role dates are stored as year/month values. Completed roles include their final calendar month; current roles show elapsed months through the current month boundary. The total merges employment intervals so simultaneous roles are counted once. February 2023 through October 2026 produces 3 years 8 months, including the internship. The current month uses Asia/Kolkata time, and client-side displays refresh on page load, minute checks, and tab/window focus, so a static deployment does not require a rebuild to update the visible duration.

## Demo availability

Links were checked during implementation. AMZE returned 404 and is retained as an archived entry. AIPedia and ChatApp use source links instead of unavailable demos. Local Agent uses its source link rather than implying that a frontend-only deployment is a functioning full-stack demo. Filer's public preview requires Google sign-in. The final ten additions use source links because their complete deployed workflows were not verified in that audit. HTTP 403 responses and timeouts are not treated as definitive proof that a deployment is dead.
