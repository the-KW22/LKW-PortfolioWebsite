---
type: architecture
updated: 2026-11-25
sources: [raw/sessions/2026-11-25-lint-webp-cleanup.md]
---
# Deployment (Vercel)

Team `thekw22s-projects`, project `lkw-portfolio-website-v2`.

Env var **names** present for production, preview and development: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_LINKEDIN_URL` (values are encrypted and were not inspected). They feed [[seo-and-metadata]]. Analytics and Speed Insights are wired in `layout.tsx`.
