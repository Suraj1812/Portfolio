# Final portfolio project batch evidence

Ten additional distinct public repositories were checked on 2026-10-02 against the existing 30 project source URLs. All are non-fork repositories with substantive implementation files. Repository README files, dependency manifests and actual core code were inspected. No app or data file was edited.

Each entry is source-only: live deployment status and end-to-end runtime behavior were not verified in this audit. Years use GitHub created_at. Product descriptions avoid repository claims of production readiness, quantified outcomes or invented contributions.

## Instagram

- Repository: https://github.com/Suraj1812/Instagram
- Metadata: https://api.github.com/repos/Suraj1812/Instagram
- Verified created_at: `2026-09-04T17:27:43Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/Instagram/blob/main/README.md
- Implementation: https://github.com/Suraj1812/Instagram/blob/main/package.json
- Implementation: https://github.com/Suraj1812/Instagram/blob/main/src/services/supabaseClient.ts
- Implementation: https://github.com/Suraj1812/Instagram/blob/main/src/db/repositories/postRepository.ts
- Implementation: https://github.com/Suraj1812/Instagram/blob/main/src/services/localAuth.ts
- Implementation: https://github.com/Suraj1812/Instagram/blob/main/src/services/mediaStorage.ts

The root README and permission copy describe a local-only app, but the current implementation imports Supabase, invokes RPCs for feeds, authenticates through Supabase and uploads files to storage. Entry follows actual code, not the stale README. No network-free or SQLite-only claim is made.

## shot-explorer-app

- Repository: https://github.com/Suraj1812/shot-explorer-app
- Metadata: https://api.github.com/repos/Suraj1812/shot-explorer-app
- Verified created_at: `2026-09-02T08:04:01Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/shot-explorer-app/blob/main/README.md
- Implementation: https://github.com/Suraj1812/shot-explorer-app/blob/main/package.json
- Implementation: https://github.com/Suraj1812/shot-explorer-app/blob/main/src/App.jsx
- Implementation: https://github.com/Suraj1812/shot-explorer-app/blob/main/api/generate.js

The interface performs real canvas previews and calls a server-side Gemini generateContent endpoint when configured. Canvas fallback performs local framing, not proven novel-view synthesis. No camera-reconstruction capability is claimed.

## ChadWallet

- Repository: https://github.com/Suraj1812/ChadWallet
- Metadata: https://api.github.com/repos/Suraj1812/ChadWallet
- Verified created_at: `2026-06-21T08:36:51Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/ChadWallet/blob/main/README.md
- Implementation: https://github.com/Suraj1812/ChadWallet/blob/main/package.json
- Implementation: https://github.com/Suraj1812/ChadWallet/blob/main/src/services/birdeye.service.ts
- Implementation: https://github.com/Suraj1812/ChadWallet/blob/main/src/components/trading/trading-panel.tsx

Actual BirdEye fetching, token detail mapping and quote UI exist. The trading panel explicitly says Preview quote / Connect execution later, so this entry is a prototype without transaction-execution claims. Configured integrations were not exercised.

## Indian-Tourism

- Repository: https://github.com/Suraj1812/Indian-Tourism
- Metadata: https://api.github.com/repos/Suraj1812/Indian-Tourism
- Verified created_at: `2026-05-30T03:13:12Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/Indian-Tourism/blob/main/README.md
- Implementation: https://github.com/Suraj1812/Indian-Tourism/blob/main/package.json
- Implementation: https://github.com/Suraj1812/Indian-Tourism/blob/main/src/search/placeSearch.js
- Implementation: https://github.com/Suraj1812/Indian-Tourism/blob/main/public/js/app.js
- Implementation: https://github.com/Suraj1812/Indian-Tourism/blob/main/src/services/wikipediaService.js

Actual FlexSearch indexing, Leaflet maps and Wikipedia summary API enrichment are implemented. Place storage is local records and files; no SQL database or trained AI model is claimed.

## GB-OrderFlow

- Repository: https://github.com/Suraj1812/GB-OrderFlow
- Metadata: https://api.github.com/repos/Suraj1812/GB-OrderFlow
- Verified created_at: `2026-03-31T03:38:37Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/GB-OrderFlow/blob/main/README.md
- Implementation: https://github.com/Suraj1812/GB-OrderFlow/blob/main/package.json
- Implementation: https://github.com/Suraj1812/GB-OrderFlow/blob/main/server/services/dealer-portal.service.ts
- Implementation: https://github.com/Suraj1812/GB-OrderFlow/blob/main/server/services/head-office.service.ts
- Implementation: https://github.com/Suraj1812/GB-OrderFlow/blob/main/server/core/csv.ts

Order creation validates catalogue selections. Approval/rejection and export methods exist. CSV generation performs schema validation and deterministic formatting. No business adoption or production throughput claim is made.

## Guess-Where

- Repository: https://github.com/Suraj1812/Guess-Where
- Metadata: https://api.github.com/repos/Suraj1812/Guess-Where
- Verified created_at: `2026-04-16T04:08:44Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/Guess-Where/blob/main/README.md
- Implementation: https://github.com/Suraj1812/Guess-Where/blob/main/client/package.json
- Implementation: https://github.com/Suraj1812/Guess-Where/blob/main/server/package.json
- Implementation: https://github.com/Suraj1812/Guess-Where/blob/main/server/src/game/room-manager.ts
- Implementation: https://github.com/Suraj1812/Guess-Where/blob/main/server/src/game/scoring.ts
- Implementation: https://github.com/Suraj1812/Guess-Where/blob/main/client/src/components/CanvasBoard.tsx

The current repository is Draw Clash, a drawing game, although its GitHub description retains older country-guessing wording. Socket.IO stroke, undo and clear events are implemented with room management and speed/order scoring. Current code and README support the drawing-game entry.

## fomio

- Repository: https://github.com/Suraj1812/fomio
- Metadata: https://api.github.com/repos/Suraj1812/fomio
- Verified created_at: `2026-04-08T11:57:42Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/fomio/blob/main/README.md
- Implementation: https://github.com/Suraj1812/fomio/blob/main/package.json
- Implementation: https://github.com/Suraj1812/fomio/blob/main/prisma/schema.prisma
- Implementation: https://github.com/Suraj1812/fomio/blob/main/features/posts/server.ts
- Implementation: https://github.com/Suraj1812/fomio/blob/main/app/api/posts/feed/route.ts
- Implementation: https://github.com/Suraj1812/fomio/blob/main/app/api/upload/route.ts

Actual PostgreSQL models, cursor feeds, database post/like/comment operations and Cloudinary upload routes exist. The source requires configured services; no deployed workflow was verified.

## ConversionLens

- Repository: https://github.com/Suraj1812/ConversionLens
- Metadata: https://api.github.com/repos/Suraj1812/ConversionLens
- Verified created_at: `2026-03-29T03:07:41Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/ConversionLens/blob/main/README.md
- Implementation: https://github.com/Suraj1812/ConversionLens/blob/main/backend/package.json
- Implementation: https://github.com/Suraj1812/ConversionLens/blob/main/dashboard/package.json
- Implementation: https://github.com/Suraj1812/ConversionLens/blob/main/backend/src/repositories/eventRepository.js
- Implementation: https://github.com/Suraj1812/ConversionLens/blob/main/backend/src/services/analyticsService.js
- Implementation: https://github.com/Suraj1812/ConversionLens/blob/main/shopify/shoplytics.custom-pixel.js

The repository brands its current application Shoplytics. Actual SQL event insertion/aggregation, funnel calculation and Shopify event posting are implemented. This is one entry, not two projects.

## SmartClinic

- Repository: https://github.com/Suraj1812/SmartClinic
- Metadata: https://api.github.com/repos/Suraj1812/SmartClinic
- Verified created_at: `2026-03-16T13:07:46Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/SmartClinic/blob/main/README.md
- Implementation: https://github.com/Suraj1812/SmartClinic/blob/main/smart_clinic/__manifest__.py
- Implementation: https://github.com/Suraj1812/SmartClinic/blob/main/smart_clinic/models/appointment.py
- Implementation: https://github.com/Suraj1812/SmartClinic/blob/main/smart_clinic/controllers/main.py
- Implementation: https://github.com/Suraj1812/SmartClinic/blob/main/smart_clinic/security/security.xml
- Implementation: https://github.com/Suraj1812/SmartClinic/blob/main/docker-compose.yml

The Odoo module implements patient/doctor/appointment models, website routes and overlap checks. It requires an Odoo runtime. The manifest attributes its generated module to OpenAI Codex; no personal hand-written contribution claim is added.

## Nexus-Store

- Repository: https://github.com/Suraj1812/Nexus-Store
- Metadata: https://api.github.com/repos/Suraj1812/Nexus-Store
- Verified created_at: `2025-12-27T06:57:19Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/Nexus-Store/blob/main/README.md
- Implementation: https://github.com/Suraj1812/Nexus-Store/blob/main/Backend/Store/package.json
- Implementation: https://github.com/Suraj1812/Nexus-Store/blob/main/Frontend/Store/package.json
- Implementation: https://github.com/Suraj1812/Nexus-Store/blob/main/Backend/Store/prisma/schema.prisma
- Implementation: https://github.com/Suraj1812/Nexus-Store/blob/main/Backend/Store/src/user/cart/cart.service.ts
- Implementation: https://github.com/Suraj1812/Nexus-Store/blob/main/Backend/Store/src/admin/products/products.service.ts

The source includes distinct storefront/admin apps and a NestJS backend with substantial commerce models and services. Year is 2025 from created_at. Redis/RabbitMQ appear in README infrastructure but are not included as implemented application features in this entry.

## Logo assets

Six raw repository image URLs returned HTTP 200 with image MIME types. Exact project id/url mapping is saved in `/tmp/portfolio-logo-candidates.json`. No branded static image was found for Shot Explorer, Indian Tourism DB, Draw Clash or SmartClinic; those can retain the existing artwork fallback.

- instagram-mobile: https://raw.githubusercontent.com/Suraj1812/Instagram/main/assets/logo.png
- chadwallet: https://raw.githubusercontent.com/Suraj1812/ChadWallet/main/public/logo/dark.png
- gb-orderflow: https://raw.githubusercontent.com/Suraj1812/GB-OrderFlow/main/public/gb-orderflow-logo.svg
- fomio: https://raw.githubusercontent.com/Suraj1812/fomio/main/public/logo.png
- conversionlens: https://raw.githubusercontent.com/Suraj1812/ConversionLens/main/dashboard/public/logo-mark.svg
- nexus-store: https://raw.githubusercontent.com/Suraj1812/Nexus-Store/main/Frontend/Store/public/logo.png
