---
type: decision
updated: 2026-11-27
sources: [raw/sessions/2026-11-27-ver3-redesign-build.md]
---
# Versioning and archives

**Decision:** the newest site is always at `/`; each earlier version is archived at `/vN` and kept out of search results. Future versions follow the same pattern.

| URL | What it is | Where it lives |
|---|---|---|
| `/` | newest site (ver 3.0 once launched; ver 2.0 on `main` today) | `src/app/(site)/` |
| `/v2` | frozen copy of ver 2.0 with its own root layout | `src/app/v2/`, assets `public/v2/`, git tag `v2` |
| `/v1` | original Vite site (base `/v1/`) | built output in `public/v1/`, served by the rewrite `/v1` -> `/v1/index.html` in `next.config.ts` |

## Protection rules
- Never edit `public/v1`, `public/v2` or `src/app/v2` except for real bug fixes. Every build phase ends with `git diff --stat redesign-v3 -- public/v1 public/v2 src/app/v2` and it must print nothing.
- The archives must not load new global CSS, fonts, metadata or providers from the new site (separate root layouts).
- Both archives are noindex: a meta tag in v2 and an `X-Robots-Tag: noindex, nofollow` header for `/v1`, `/v1/*`, `/v2` and `/v2/*` set in `next.config.ts` (added in Phase 9). They are deliberately not Disallowed in `robots.ts`, so crawlers can still see the noindex.
- The redirects `/about-me` -> `/#about` and `/contact-me` -> `/#contact` match only those exact paths, so `/v2/about-me` and `/v2/contact-me` still work.
- ESLint ignores `public/**` (the minified v1 bundle).

## Repos and hosting
GitHub repo `the-KW22/LKW-PortfolioWebsite` (the old ver-1.0 repo was deleted; the ver-2.0 repo was renamed to this). Vercel: see [[deployment-vercel]].

## Known leftover
The ver 2.0 archive still serves its own old résumé PDF at `/v2/document/LeowKaiWen-Resume.pdf`; it may contain a phone number (see [[open-follow-ups]]).

Related: [[ver3-redesign]], [[site-structure]].
