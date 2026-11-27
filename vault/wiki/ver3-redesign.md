---
type: architecture
updated: 2026-11-27
sources: [raw/sessions/2026-11-27-ver3-redesign-build.md, raw/sessions/2026-11-27-hero-scene-rebuild.md, raw/sessions/2026-11-27-issues-2-to-10.md, raw/sessions/2026-11-27-issues-5-6-7-11-redesign.md]
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
Hero (dust-to-blueprint WebGL scene with an X-ray lens cursor, CSS fallback; see [[ver3-owner-decisions]]) -> About -> Personal projects (Atlas) -> Experience -> Tech stack (3D ring on desktop, grid elsewhere) -> Services -> Contact -> footer. Header is a "ruler" section scanner with a KL clock; menu is full screen; custom cursor, magnetic buttons, no preloader, Lenis + GSAP ScrollTrigger as the only scroll system.

## Stack and layout
Next.js App Router, React 19, Tailwind 4, GSAP, Lenis, three + @react-three/fiber (hero only, lazy loaded). New site in `src/app/(site)/`; components in `src/components/{shell,motion,atlas,case,xray,warp,sections/home}`; typed content in `src/content` (projects, experience, skills, home copy, site config). See [[site-structure]].

## Interaction details (2026-11-27)
- Header ruler: dragging along it scrubs the page live, with no snapping. A plain click still jumps smoothly. Hidden below 768px.
- Menu: link size scales with height as well as width, so the full menu fits one laptop screen without scrolling.
- Menu links and `/#id` links land on the section top, from the home page, inside the Atlas and from case studies.
- Atlas intro: the start zoom fits the title card to the screen, so it is no longer cropped on narrow laptops.
- Atlas: the "Scroll to continue" cue shows at the bottom of the pinned Atlas on desktop widths (1024px and up) only.
- Case-study Screens gallery: in desktop pinned mode the wheel scrolls the page again.

## Section rebuilds (2026-11-27, later session)
Direction for each was proposed and picked by the owner ([[ver3-owner-decisions]]); details in [[2026-11-27-issues-5-6-7-11-redesign]].
- **Experience (04):** the NM Media job shows its five projects as a pinned case-file. On desktop (768px and up, motion allowed) a rail lists the projects and scroll swaps the full detail on the right; below that, with reduced motion or before JS, they are plain stacked cards. Component `ProjectCaseFile.tsx`.
- **Tech stack (05):** the 3D ring is unchanged. The pin is 40% longer so the settled grid is held before it releases, and each group is a bordered card with a count (AI card tinted lime) with a soft cursor glow on fine pointers.
- **Services (06):** a bento grid (web wide, AI tall) with a hand-coded animated SVG diagram per tile and CV-only stack chips. Animations stop with reduced motion. Component `ServiceArt.tsx`.
- **Atlas background:** static light pools and dust on two far 3D layers (parallax from camera panning), a board-plane SVG with rulers, crosshairs and lime corner brackets, a coarse grid, a vignette and grain. Component `AtlasBackdrop.tsx`. Far layers and grain are off below 1024px and on touch.
- **Drag cursor:** the header ruler and the Atlas use a hollow 44px lime ring with arrows (`data-cursor="drag"`) so it does not cover content; the solid disc stays for the OPEN label on cards.

## Rules
- Performance: on desktop and laptop effects win (optimise, never cut); on phones speed wins (Lighthouse mobile Performance 90+, LCP under 2.5 s, CLS under 0.1).
- Content honesty: no invented facts, no client names, no phone number; markers `DRAFT` and `TODO(owner)` in `src/content`. `npm run check:launch` lists what is unfinished.
- Decisions: [[ver3-owner-decisions]]. How it was built: [[ver3-build-process]]. Projects: [[projects-showcase]]. Contact: [[contact-form]].

## Docs in the repo
`docs/v3-implementation-plan.md`, `docs/v3-design-spec.md`, `docs/v3-design-spec-review.md`, `docs/v3-assets-checklist.md`, `docs/v3-owner-todo.md`, `docs/v3-qa-report.md`, `docs/reference.md`, mockups in `docs/mockups/` (`home.html` is the approved reference), hero lab in `docs/mockups/hero-lab/`, hero plan in `docs/v3-hero-scene-plan.md`.

## History
- 2026-11-27: the hero is no longer a WebGL grid floor with cursor tilt. It is the dust-to-blueprint scene (see [[ver3-owner-decisions]]). The preloader (first visit only) was removed. See [[2026-11-27-hero-scene-rebuild]].
