---
type: feature
updated: 2026-11-27
sources: [raw/sessions/2026-11-25-lint-webp-cleanup.md, raw/sessions/2026-11-27-ver3-redesign-build.md]
---
# Projects showcase

## Ver 3.0 (five projects)
Data: `src/content/projects/*.ts` (typed, with case-study text, media, X-ray notes in `xray.ts`). Shown in the Atlas, the list view, `/projects` and `/projects/[slug]`.

| # | Project | Category | Notes |
|---|---|---|---|
| 1 | **CoreEx** (lead) | full-stack | Next.js + Spring Boot, Postgres RLS, pgvector, MCP server, Claude API. Verified stats: **49 MCP tools, 30 tagged releases (as of November 2026), 14 ADRs**. GitHub and invite-only demo links shown. Deep X-ray. |
| 2 | **AsteroidUI** | component library | In progress; 9 components, 11 registry items; links GitHub `the-KW22/AsteroidUI` and live `asteroid-ui.vercel.app`. Deep X-ray. |
| 3 | **Moonwave** | web design | Design exercise with sample content; GitHub repo link kept. |
| 4 | **Brickly** | web design | Same. |
| 5 | **PetCare** | web design | Same; simple X-ray. |

Rules: no years shown; the AI-agent method is stated only in About ([[ver3-owner-decisions]]). CoreEx and AsteroidUI screenshots are still to be supplied; placeholders say "Screenshot coming" ([[open-follow-ups]]). Images: [[image-pipeline]].

## Ver 2.0 (live on `main`, and at `/v2`)
Data in `src/components/sections/projects/ProjectCarouselSection.tsx` (now `src/app/v2/_components/...`). Eight projects: **Mini Series** (Mini Expenses Tracker, Mini Dashboard, Mini Weather, Mini Subscription Manager) and **Web Design** (Moonwave, Brickly, Pet Shop Website Design, Portfolio Landing Page). Home `FeaturedProjects` showed two categories. Vercel projects not listed on that site: core-ex, asteroid-ui, real-estate-web-design, music-studio-web-design, landing-page-design01, pet-shop-web-template.

## History
- 2026-11-27: ver 3.0 drops the Mini Series and the Portfolio Landing Page (they remain only in `/v2`) and adds CoreEx and AsteroidUI. The CV's CoreEx numbers (44 / 24 / 13) were replaced by repo-verified ones. See [[2026-11-27-ver3-redesign-build]], [[ver3-redesign]].
