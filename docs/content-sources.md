# Portfolio content sources

Professional history, dates, education, and listed AI technologies come from the supplied `Suraj Singh _ Software Engineer.pdf`. The website serves that PDF unchanged at `/resume/Suraj-Singh-Resume.pdf`. Its SHA-256 is `fbb27f78437a1f82af465e04007fb695f9a1429295ddf2be27dd3af381a7f40c`.

The portfolio describes AI development as an engineering focus. The resume's employment history begins in February 2023; it does not assert that every year of that history was spent exclusively on AI.

## October 2026 employment update

- **Fashion Pattern Lab:** the owner confirmed freelance website development from August through October 2026. The experience timeline and project card now reflect that work. The [official website](https://fashionpatternlab.com/) was checked on October 15, 2026 for course discovery, the pattern store, custom pattern services, student projects, and student login. The existing actual homepage screenshot is reused in the timeline, alongside the official logo already stored in `public/project-logos/fashion-pattern-lab.png`. Website content supports the product description; no unverified implementation stack or business results are added.
- **WellM:** the owner's signed offer letter, dated October 7, 2026, confirms AI Full Stack Engineer in Product & Technology at Wellness Mandala Private Limited, full-time, Gurugram (Hybrid), joining October 12, 2026. The owner confirms this is the current role. Engineering responsibilities are summarized from Annexure B: mobile/web applications, on-device AI and approved-content assistants, code review, automated/device testing, releases, live-product support, and documentation. Responsibilities are presented as role scope, with no completed outcomes implied. The letter's generic marketing-role paragraph is not used for the engineering description.
- **Branding:** [WellM's official site](https://wellm.co/) links its logo at `https://wellm.co/images/logo.png`. The original transparent 538 × 201 PNG is stored locally at `public/client-logos/wellm.png`. The Fashion Pattern Lab logo was reconfirmed from the official homepage's custom-logo image.

The signed offer letter, signature, compensation, and other private employment terms are not copied into the public site. The original downloadable resume remains unchanged; the website timeline contains the later employment updates.

## Company websites and Maps links

On October 15, 2026 the owner requested authentic logos in place of separate company-name text in the experience headers, plus company website and Google Maps links. Every role now has a locally stored official logo with accessible company naming, an official website link, and a Maps link. Contained image wrappers preserve the complete branding, including lettering that is part of an original logo.

| Company | Location evidence | Maps precision |
| --- | --- | --- |
| WellM | The publisher's [Google Play listing](https://play.google.com/store/apps/details?id=com.asha.happy_minds) gives A-184, DLF The Pinnacle, DLF Phase 5, Gurugram, Haryana 122009; it matches the supplied letter. | Full-address search; no business Place ID was verified. |
| Fashion Pattern Lab | The official [contact page](https://fashionpatternlab.com/contact/) lists its studio in Delhi, India, and online sessions worldwide. | City-level search; no street address was published. |
| NEXUS SP Solutions | The official [company LinkedIn](https://es.linkedin.com/company/nexus-sp-solutions) identifies `www.nexusspsolutions.com` and Paseo de las Palmeras, 3, Local B, 51001 Ceuta, Spain. The indexed [official contact-page footer](https://nexusspsolutions.com/contactus) agrees. | Full-address search; the official website had a DNS failure during direct verification. |
| Evtaar | The [official company profile](https://www.linkedin.com/company/evtaar) identifies `www.evtaar.com`, Dubai HQ, and Hyderabad. The [live staging website](https://staging.evtaar.com/) links directly to the Dubai city map. | Official city-level map; no street address was verified. |
| People Maketh | The [official website](https://peoplemaketh.com/) publishes 69, 4th Cross, Lingarajapuram, Bengaluru, Karnataka 560084 and [its Google Maps listing](https://maps.app.goo.gl/35LjgVHof28ST4Ey5). The site's cookie-policy content expands the street to VST Road, Shamanna Layout, Kanakadasa Layout. | Official business-listing link. |
| Encrobytes | The [official company profile](https://in.linkedin.com/company/encrobytes) gives &Work Coworking, Plot 5B, Sector 15A, near Neelam Chowk Ajronda Metro and Crown Plaza, Faridabad, Haryana 121007. Its official website supplies the logo. | Full-address search; no business Place ID was verified. |

The owner accepted using the locations available from public sources for Fashion Pattern Lab and Evtaar. Their links are explicitly labelled "City map" rather than implying a street-level pin. These are current company contact locations, not claims about the owner's physical workplace during remote or freelance roles. Website links preserve the companies' official public domains even where their current availability could not be confirmed.

## Implementation evidence

- **Grounded Notes:** [repository](https://github.com/Suraj1812/grounded-notes-qa-assistant). Markdown chunking and retrieval live in `src/server/retrieval`; Ollama generation and low-match refusal live in `src/server/services`. Retrieval uses TF-IDF and cosine scoring, rather than a neural embedding model or dedicated vector database. The card image comes from the repository's `docs/screenshots/assistant.png`.
- **Local Agent:** [repository](https://github.com/Suraj1812/Local-Agent). Agent planning, management, and execution live in `backend/agents`; knowledge and model integrations live in `backend/services`. Planning is deterministic and document retrieval uses token-hash vectors. The site links to the source because its deployed backend was unavailable during review.
- **AIPedia:** [repository](https://github.com/Suraj1812/AIpedia). `src/ollama-client.js`, `agent-router.js`, `url-learning.js`, and `learned-topic-store.js` support the model, prompt routing, and local knowledge claims. The old Railway demo returned 404, so the site links to the source.
- **Realtime Chat App:** [repository](https://github.com/Suraj1812/ChatApp). Its package manifest supports Node.js, Express, Socket.IO, and SQLite. The old Railway demo returned 404, so the site links to the source.
- **Solar System Explorer:** [repository](https://github.com/Suraj1812/The-Solar-System). Its manifest supports React, Vite, Three.js, GSAP, and Framer Motion.
- **Dattamsha Data Labs:** [repository](https://github.com/Suraj1812/Dattamsha-Data-Labs). Its manifest supports React, TypeScript, Vite, Framer Motion, and Express.
- **Cricket Connect AI and Fashion Pattern Lab:** retained from the original portfolio. The cards describe the visible product website and interface; they do not claim a specific model implementation, technology stack, or commercial result. Fashion Pattern Lab's freelance delivery period was subsequently confirmed by the owner in the October 2026 update above.
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

Role dates are stored as year/month values. Completed roles include their final calendar month; current roles show elapsed months through the current month boundary. The total merges employment intervals so simultaneous roles are counted once. The owner corrected NEXUS SP Solutions to December 2025 through July 2026, then added Fashion Pattern Lab (August–October 2026) and WellM (October 2026–present). As of October 2026 the total is 45 months (3 years 9 months), including the internship. WellM shows "Less than a month" in its joining month; October's freelance/current-role overlap is counted once. The current month uses Asia/Kolkata time, and client-side displays refresh on page load, minute checks, and tab/window focus, so ongoing roles can update without rebuilding a static deployment. The professional-role count is derived from the same experience data.

## Demo availability

Links were checked during implementation. AMZE returned 404 and is retained as an archived entry. AIPedia and ChatApp use source links instead of unavailable demos. Local Agent uses its source link rather than implying that a frontend-only deployment is a functioning full-stack demo. Filer's public preview requires Google sign-in. The final ten additions use source links because their complete deployed workflows were not verified in that audit. HTTP 403 responses and timeouts are not treated as definitive proof that a deployment is dead.
