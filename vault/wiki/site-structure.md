---
type: architecture
updated: 2026-11-27
sources: [raw/sessions/2026-11-25-lint-webp-cleanup.md, raw/sessions/2026-11-27-ver3-redesign-build.md]
---
# Site structure

## Ver 3.0 (branch `redesign-v3`, `src/app/(site)/`)
- `/`: one-page home (Hero, About, Personal projects/Atlas, Experience, Tech stack, Services, Contact, footer). Section ids in `src/content/sections.ts`.
- `/projects`: plain list of the five projects. `/projects/[slug]`: statically generated case studies (coreex, asteroidui, moonwave, brickly, petcare) with a generated `opengraph-image` each.
- `/robots.txt`, `/sitemap.xml` (7 URLs: `/`, `/projects`, five case studies), a generated home `opengraph-image`.
- Error pages: styled `not-found`, `error`, `global-error` and `global-not-found` (experimental `globalNotFound` because the app has two root layouts).
- `/about-me` and `/contact-me` permanently redirect to `/#about` and `/#contact`. A `/resume` route was added in Phase 9 and removed again on 2026-11-26 ([[ver3-owner-decisions]]).
- Archives: `/v1` (rewrite to static build) and `/v2` (`src/app/v2`) ([[versioning-and-archives]]).

Component folders (`src/components`): `shell/` (header, menu, cursor, preloader, footer), `motion/` (reveal, split text, counter, tilt, magnetic, scramble, scroll provider), `atlas/`, `case/` (case-study sections), `xray/`, `warp/`, `sections/home/`. Typed content lives in `src/content`; contact logic in `src/lib/contact` ([[contact-form]]). Overview of the design: [[ver3-redesign]].

## Ver 2.0 (live on `main` until launch; frozen copy at `/v2`)
Routes (`src/app`): `/`, `/about-me`, `/projects`, `/contact-me`, `/robots.txt`, `/sitemap.xml`, plus `error.tsx`, `loading.tsx`, `not-found.tsx`. The former `/testing` route was removed on 2026-11-25.

Layout (`layout.tsx`): `PageTransitionProvider` wraps `Nav`, `LenisProvider` (children) and `Footer`; `SpeedInsights` and `Analytics` follow.

Components: `layout/` (Nav, Footer, HomeClient, IntroAnimation, DecorativeAnimation/Element, LenisProvider, PageTransitionProvider, SkillMarquee), `sections/{home,about,contact,projects}/`, `ui/` (GridScan, Dither, Silk, Particles, LightRays, BorderGlow, CurvedLoop, MediaCarousel, TextType, icon-cloud, ...). GridScan is used by `app/error.tsx` and `sections/contact/Contact.tsx` ([[gridscan-webcam-removal]]). In `redesign-v3` these live in `src/app/v2/_components` as the archive; most were deleted from `src/components`.

## History
- 2026-11-27: ver 3.0 routes and folders added; the ver 2.0 section above now describes `main` and the `/v2` archive. See [[2026-11-27-ver3-redesign-build]].
