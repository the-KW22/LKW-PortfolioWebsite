---
type: feature
updated: 2026-11-27
sources: [raw/sessions/2026-11-25-lint-webp-cleanup.md, raw/sessions/2026-11-27-ver3-redesign-build.md]
---
# SEO and metadata

## Ver 3.0 (branch `redesign-v3`)
- Site URL default is `https://lkw22studio.com` (`SITE_URL` in `src/content/site.ts`; shared metadata helper in `src/lib/seo.ts`).
- Home and `/projects` and every case study have a title, description, canonical, Open Graph and Twitter card. Generated `opengraph-image` for the home page and for each project.
- JSON-LD: `Person` (name, job title, links from `site.ts`, no phone number) and `WebSite` on the home page; `CreativeWork` per case study.
- `sitemap.ts` is generated from content: `/`, `/projects` and the five case studies (7 URLs). `robots.ts` allows the new site and does not Disallow the archives.
- Archives `/v1` and `/v2` stay out of the index via noindex (meta tag in v2, `X-Robots-Tag` header in `next.config.ts`) ([[versioning-and-archives]]).
- Year, phone number and CV link are intentionally absent ([[ver3-owner-decisions]]).
- Lighthouse has not been run yet ([[open-follow-ups]]).

## Ver 2.0 (live on `main`)
- Site URL comes from `NEXT_PUBLIC_SITE_URL` (fallback `https://leowkaiwen.dev`). Title template `%s | Leow Kai Wen`.
- Per-page metadata with canonical URLs, OpenGraph and Twitter cards (`/og-image.png`, 1200x630) on Home and Projects.
- Home emits JSON-LD: `Person` (email `kwenleow@gmail.com`; `sameAs` from `NEXT_PUBLIC_GITHUB_URL` and `NEXT_PUBLIC_LINKEDIN_URL`) and `WebSite`.
- `sitemap.ts` lists 4 URLs; `lastModified` is the constant `LAST_MODIFIED`. **Bump it when content changes.** `robots.ts` is present. The env vars exist in Vercel ([[deployment-vercel]]).

## History
- 2026-11-27: ver 3.0 changed the default site URL from `leowkaiwen.dev` to `lkw22studio.com`, replaced the 4-URL sitemap with a 7-URL generated one and added generated OG images. See [[2026-11-27-ver3-redesign-build]].
