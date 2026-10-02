# Additional portfolio project evidence

Nine distinct public non-fork repositories were checked on 2026-10-02. They are outside the existing 21 portfolio entries. README files, package/dependency manifests and implementation files were inspected. Each year is taken from GitHub created_at metadata, not inferred from README wording.

These entries intentionally contain source links only. No new live deployment or complete runtime workflow was verified in this audit. Icons reference existing portfolio artwork. No personal contribution, measured outcome or production-adoption claim was added.

## SastaAI

- Repository: https://github.com/Suraj1812/SastaAI
- Metadata: https://api.github.com/repos/Suraj1812/SastaAI
- Verified created_at: `2026-10-01T08:35:07Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/SastaAI/blob/main/README.md
- Implementation: https://github.com/Suraj1812/SastaAI/blob/main/package.json
- Implementation: https://github.com/Suraj1812/SastaAI/blob/main/lib/research.ts
- Implementation: https://github.com/Suraj1812/SastaAI/blob/main/backend/main.py

The portable engine retrieves Wikipedia source text and selects excerpts. The Python backend contains optional OpenAI responses synthesis. Do not describe default keyless mode as LLM-generated reasoning.

## WebIntel

- Repository: https://github.com/Suraj1812/WebIntel
- Metadata: https://api.github.com/repos/Suraj1812/WebIntel
- Verified created_at: `2026-04-28T04:25:10Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/WebIntel/blob/main/README.md
- Implementation: https://github.com/Suraj1812/WebIntel/blob/main/package.json
- Implementation: https://github.com/Suraj1812/WebIntel/blob/main/src/services/reports/pipeline.ts
- Implementation: https://github.com/Suraj1812/WebIntel/blob/main/src/services/openai/report-insights.ts
- Implementation: https://github.com/Suraj1812/WebIntel/blob/main/scraper_service/app/analyzer.py

The scan pipeline creates saved Prisma reports and calls the scraping service. OpenAI insights have a heuristic fallback. Repository claims of production readiness were not repeated.

## concierge-automation

- Repository: https://github.com/Suraj1812/concierge-automation
- Metadata: https://api.github.com/repos/Suraj1812/concierge-automation
- Verified created_at: `2026-03-23T08:08:25Z`; default branch: `codex/ai-concierge-production-hardening`; `fork: false`.
- README: https://github.com/Suraj1812/concierge-automation/blob/codex/ai-concierge-production-hardening/README.md
- Implementation: https://github.com/Suraj1812/concierge-automation/blob/codex/ai-concierge-production-hardening/package.json
- Implementation: https://github.com/Suraj1812/concierge-automation/blob/codex/ai-concierge-production-hardening/src/modules/integrations/openai.service.ts
- Implementation: https://github.com/Suraj1812/concierge-automation/blob/codex/ai-concierge-production-hardening/src/modules/conversations/service.ts
- Implementation: https://github.com/Suraj1812/concierge-automation/blob/codex/ai-concierge-production-hardening/src/modules/integrations/pdf.service.ts
- Implementation: https://github.com/Suraj1812/concierge-automation/blob/codex/ai-concierge-production-hardening/src/modules/integrations/razorpay.service.ts

The default branch is codex/ai-concierge-production-hardening, not main. This is a backend API/worker repository with actual OpenAI completion calls; no customer or admin UI is claimed.

## Svastra

- Repository: https://github.com/Suraj1812/Svastra
- Metadata: https://api.github.com/repos/Suraj1812/Svastra
- Verified created_at: `2026-06-16T08:40:54Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/Svastra/blob/main/README.md
- Implementation: https://github.com/Suraj1812/Svastra/blob/main/frontend/package.json
- Implementation: https://github.com/Suraj1812/Svastra/blob/main/requirements.txt
- Implementation: https://github.com/Suraj1812/Svastra/blob/main/app/database.py
- Implementation: https://github.com/Suraj1812/Svastra/blob/main/app/workflow/service.py

The repository explicitly presents a demonstrator/MVP transition baseline. Workflow code generates tasks, persists clinical events and exposes scoped patient/provider tasks. No medical accuracy, clinical adoption or compliance certification is claimed.

## Mini-LLM

- Repository: https://github.com/Suraj1812/Mini-LLM
- Metadata: https://api.github.com/repos/Suraj1812/Mini-LLM
- Verified created_at: `2026-03-15T05:39:08Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/Mini-LLM/blob/main/README.md
- Implementation: https://github.com/Suraj1812/Mini-LLM/blob/main/requirements.txt
- Implementation: https://github.com/Suraj1812/Mini-LLM/blob/main/model.py
- Implementation: https://github.com/Suraj1812/Mini-LLM/blob/main/train.py
- Implementation: https://github.com/Suraj1812/Mini-LLM/blob/main/service.py

Actual PyTorch causal attention, feed-forward transformer blocks and AdamW training are implemented. This is a small experimental GPT-style model, not a frontier or pretrained production LLM.

## Vacati-Intelligence-Console

- Repository: https://github.com/Suraj1812/Vacati-Intelligence-Console
- Metadata: https://api.github.com/repos/Suraj1812/Vacati-Intelligence-Console
- Verified created_at: `2026-05-22T11:11:36Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/Vacati-Intelligence-Console/blob/main/README.md
- Implementation: https://github.com/Suraj1812/Vacati-Intelligence-Console/blob/main/package.json
- Implementation: https://github.com/Suraj1812/Vacati-Intelligence-Console/blob/main/src/lib/ai/rag-pipeline.ts
- Implementation: https://github.com/Suraj1812/Vacati-Intelligence-Console/blob/main/src/lib/ai/chunking.ts
- Implementation: https://github.com/Suraj1812/Vacati-Intelligence-Console/blob/main/src/lib/ai/vector-store.ts
- Implementation: https://github.com/Suraj1812/Vacati-Intelligence-Console/blob/main/src/lib/ai/providers/ollama.ts

Ingestion embeds document chunks. The implementation combines cosine and lexical scores, supports in-memory/pgvector stores, and makes real Ollama streaming calls. Other provider adapters exist but are not presented as tested live services.

## Resume-Extractor

- Repository: https://github.com/Suraj1812/Resume-Extractor
- Metadata: https://api.github.com/repos/Suraj1812/Resume-Extractor
- Verified created_at: `2026-04-03T11:47:55Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/Resume-Extractor/blob/main/README.md
- Implementation: https://github.com/Suraj1812/Resume-Extractor/blob/main/frontend/package.json
- Implementation: https://github.com/Suraj1812/Resume-Extractor/blob/main/backend/requirements.txt
- Implementation: https://github.com/Suraj1812/Resume-Extractor/blob/main/backend/app/services/ner.py
- Implementation: https://github.com/Suraj1812/Resume-Extractor/blob/main/backend/app/services/parser.py

NERService lazily loads Hugging Face token-classification models and performs pipeline inference. Parser postprocessing and rule-based fallbacks produce structured editable results. No extraction accuracy percentage is claimed.

## Axe

- Repository: https://github.com/Suraj1812/Axe
- Metadata: https://api.github.com/repos/Suraj1812/Axe
- Verified created_at: `2026-05-02T11:59:34Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/Axe/blob/main/README.md
- Implementation: https://github.com/Suraj1812/Axe/blob/main/package.json
- Implementation: https://github.com/Suraj1812/Axe/blob/main/src/store/editor-store.ts
- Implementation: https://github.com/Suraj1812/Axe/blob/main/src/components/three/EditorCanvas.tsx
- Implementation: https://github.com/Suraj1812/Axe/blob/main/src/server/services/dataStore.ts

The editor store includes scene objects, keyframes, interface blocks, history and playback state. Actual React Three Fiber canvas and MongoDB/local-JSON persistence are implemented.

## SpendWise

- Repository: https://github.com/Suraj1812/SpendWise
- Metadata: https://api.github.com/repos/Suraj1812/SpendWise
- Verified created_at: `2026-03-19T11:16:16Z`; default branch: `main`; `fork: false`.
- README: https://github.com/Suraj1812/SpendWise/blob/main/README.md
- Implementation: https://github.com/Suraj1812/SpendWise/blob/main/mobile/package.json
- Implementation: https://github.com/Suraj1812/SpendWise/blob/main/server/package.json
- Implementation: https://github.com/Suraj1812/SpendWise/blob/main/server/src/db.ts
- Implementation: https://github.com/Suraj1812/SpendWise/blob/main/server/src/routes/expenses.ts
- Implementation: https://github.com/Suraj1812/SpendWise/blob/main/server/src/utils/insights.ts

Actual Expo React Native screens and Express expense routes exist. Storage is a validated local JSON file, so no SQL/MongoDB database claim is made. CSV export is implemented in the expense routes.
