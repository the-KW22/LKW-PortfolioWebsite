---
type: architecture
updated: 2026-11-25
sources: [raw/sessions/2026-11-25-lint-webp-cleanup.md]
---
# Site structure

## Routes (`src/app`)
`/` (Home), `/about-me`, `/projects`, `/contact-me`, `/robots.txt`, `/sitemap.xml`, plus `error.tsx`, `loading.tsx`, `not-found.tsx`. The former `/testing` route was removed on 2026-11-25.

## Layout (`layout.tsx`)
`PageTransitionProvider` wraps `Nav`, `LenisProvider` (children) and `Footer`; `SpeedInsights` and `Analytics` follow.

## Components (`src/components`)
- `layout/`: Nav, Footer, HomeClient, IntroAnimation, DecorativeAnimation/Element, LenisProvider, PageTransitionProvider, SkillMarquee.
- `sections/{home,about,contact,projects}/`: page sections (FeaturedProjects, HeroSection, FaqAccordion, Contact, ProjectHero, ProjectCarouselSection, ...).
- `ui/`: reusable visuals (GridScan, Dither, Silk, Particles, LightRays, BorderGlow, CurvedLoop, MediaCarousel, TextType, icon-cloud, ...).

GridScan is used by `app/error.tsx` and `sections/contact/Contact.tsx` ([[gridscan-webcam-removal]]).
