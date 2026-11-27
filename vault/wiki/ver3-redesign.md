---
type: architecture
updated: 2026-11-27
sources: [raw/sessions/2026-11-27-ver3-redesign-build.md]
---
# Ver 3.0 redesign

**Goal:** a CV-worthy, Awwwards-level personal site that also brings in freelance and custom-build work. Positioning: **Full-Stack Developer | AI Engineer**. No deadline. Lives on branch `redesign-v3` (pushed; the live site is still ver 2.0 until launch, see [[open-follow-ups]]). Older versions: [[versioning-and-archives]].

## Concept
"Designed on top, engineered below." Three signature ideas:
1. **Atlas**: personal projects on a draggable 3D board (DOM + CSS 3D, cards are real links; list view and a phone full-screen map as fallbacks).
2. **Kinetic warp**: opening a project sends its name flying at the viewer, then the case study opens; Back returns to the same Atlas spot.
3. **X-ray**: on case studies the cursor is a lens revealing wireframes and engineering notes; the X key toggles the full view. Deep X-ray only on CoreEx and AsteroidUI.

## Look
Dark only. Violet `#8b7bff` (brand) and lime `#c6f432` (AI, live status, X-ray). Fonts: Inter Tight, Instrument Serif (accent word), JetBrains Mono (labels). No portrait, no 3D laptop. Sound, terminal mode and Konami code were cut from v1.

## Home page (one scroll, section ids in `src/content/sections.ts`)
Hero (WebGL grid floor with cursor tilt, CSS fallback) -> About -> Personal projects (Atlas) -> Experience -> Tech stack (3D ring on desktop, grid elsewhere) -> Services -> Contact -> footer. Header is a "ruler" section scanner with a KL clock; menu is full screen; custom cursor, magnetic buttons, preloader (first visit only), Lenis + GSAP ScrollTrigger as the only scroll system.

## Stack and layout
Next.js App Router, React 19, Tailwind 4, GSAP, Lenis, three + @react-three/fiber (hero only, lazy loaded). New site in `src/app/(site)/`; components in `src/components/{shell,motion,atlas,case,xray,warp,sections/home}`; typed content in `src/content` (projects, experience, skills, home copy, site config). See [[site-structure]].

## Rules
- Performance: on desktop and laptop effects win (optimise, never cut); on phones speed wins (Lighthouse mobile Performance 90+, LCP under 2.5 s, CLS under 0.1).
- Content honesty: no invented facts, no client names, no phone number; markers `DRAFT` and `TODO(owner)` in `src/content`. `npm run check:launch` lists what is unfinished.
- Decisions: [[ver3-owner-decisions]]. How it was built: [[ver3-build-process]]. Projects: [[projects-showcase]]. Contact: [[contact-form]].

## Docs in the repo
`docs/v3-implementation-plan.md`, `docs/v3-design-spec.md`, `docs/v3-design-spec-review.md`, `docs/v3-assets-checklist.md`, `docs/v3-owner-todo.md`, `docs/v3-qa-report.md`, `docs/reference.md`, mockups in `docs/mockups/` (`home.html` is the approved reference).
