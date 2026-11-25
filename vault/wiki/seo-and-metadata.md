---
type: feature
updated: 2026-11-25
sources: [raw/sessions/2026-11-25-lint-webp-cleanup.md]
---
# SEO and metadata

- Site URL comes from `NEXT_PUBLIC_SITE_URL` (fallback `https://leowkaiwen.dev`). Title template `%s | Leow Kai Wen`.
- Per-page metadata with canonical URLs, OpenGraph and Twitter cards (`/og-image.png`, 1200x630) on Home and Projects.
- Home emits JSON-LD: `Person` (email `kwenleow@gmail.com`; `sameAs` from `NEXT_PUBLIC_GITHUB_URL` and `NEXT_PUBLIC_LINKEDIN_URL`) and `WebSite`.
- `sitemap.ts` lists 4 URLs; `lastModified` is the constant `LAST_MODIFIED` (2026-11-25). **Bump it when content changes.**
- `robots.ts` is present. The env vars exist in Vercel ([[deployment-vercel]]).
