# Portfolio ver 3.0: implementation plan

Status: **approved for build, 2026-11-26.** Nothing in the new site is built yet. Written 2026-11-25 after reading the current site, the `personal-things` career wiki, the latest CV (`Master CV v5`, 2026-11-19), the CoreEx repo and the AsteroidUI repo; updated 2026-11-26 with the approved design.

**Companion documents:**
- `docs/v3-design-spec.md`: the look, sections and interactions to build (source of truth for design).
- `docs/v3-assets-checklist.md`: logo, screenshots, X-ray notes, copy and links the owner still supplies.
- `docs/reference.md`: design reference analysis.
- `docs/mockups/home.html`: the approved home page mockup (open via the `mockup-static` server on port 3070).

---

## 1. Goal

A site you can link from your CV so an interviewer can, within two minutes:

1. Understand who you are and what role you want (hero, one line, project button).
2. See proof: real, shipped, well-explained projects (case studies).
3. See your work history and skills at a glance (experience page).
4. Contact you easily (working form + direct links).

It must also work as personal branding: a unique, award-level site (aiming at Awwwards standards) that brings in freelance and custom-build enquiries. **Updated 2026-11-26:** the owner chose a bold, motion-rich design (see the design spec), so effects are a feature, but every effect has a fast, accessible path (list view, reduced motion, real links) and content stays accurate.

**Positioning (taken from your own CV v5):** *Software Engineer, Full-Stack and AI Applications.* Your site currently says "Full Stack Developer"; the CV headline is stronger and should match so the CV and the site tell the same story. This is a decision for you (see section 10).

---

## 2. What I found in your materials

### Strengths to lead with
- **Production work** (May to Oct 2026, Junior Software Developer): AI auto-reply platform (over 90% auto-reply rate on replayed real conversations), patient portal (80+ patients, booking with Google Calendar and Zoom), Instagram analytics and scheduling platform, SEO marketing sites with blog admin, WhatsApp community scheduler.
- **CoreEx**: a full-stack product you run yourself: Spring Boot API, Next.js frontend, Postgres with row-level security, pgvector semantic search, an MCP server with 49 tools, 14 ADRs, 30 tagged releases (as of November 2026), CI, Testcontainers tests. Strongest single proof of engineering practice.
- **AsteroidUI**: a component library with a shadcn-compatible registry, tested against independent Next.js and Vite consumers. Live at `asteroid-ui.vercel.app`.
- **Honest working method:** you direct AI coding agents and own architecture, review, tests and deployment. Your CV already says this plainly; the site should too (see the guardrails below).

### Things you must decide or confirm (flags)
1. **Stale privacy notes.** The career wiki says CoreEx "is private and public portfolio use is not approved" and that screenshots are private. But GitHub shows both **CoreEx and AsteroidUI as public**, CoreEx's README links a live demo, and you asked me to put both on the site. I'll treat this as approved, but please confirm CoreEx specifically, because the wiki also says an Edge Function name must change before any repo goes public.
2. **Employer and client names.** The wiki says employer, client and compensation details are private unless you approve. Your CV already names NM Media Sdn. Bhd. and uses generic project names (patient portal, auto-reply platform), and never names the clinic. **Plan:** same on the site: employer named, client names never.
3. **Contact details.** The CV has a phone number and `kwenleow@gmail.com`. **Plan:** show the email and links on the site; do **not** publish the phone number unless you say so (it gets scraped).
4. **Authorship honesty.** The wiki says: do not describe yourself as having hand-written AI-agent-written code, and do not state a contribution percentage. **Plan:** use your CV's wording ("directed AI coding agents, owned architecture, review, tests and deployment") on every project and the about page.
5. **Numbers I will not use** unless you confirm them: hours spent, user counts for CoreEx, CGPA, language proficiency levels (CV review lists CGPA and levels as still open).
6. **Unverified claim to avoid:** "RAG" is in your CV skills but no project demonstrates it. I'll list it on the site only if you want it, since interviewers may ask.
7. **CV link.** Your CV's portfolio link points to `lkw-portfolio-website-v2.vercel.app`. After launch it should point to `lkw22studio.com`. The old Vercel alias keeps working.

---

## 3. Site map

**Updated 2026-11-26** to the approved one-page design:

| Route | Purpose |
|---|---|
| `/` | One scrolling page: 01 Hero, 02 About, 03 Personal projects (Atlas), 04 Experience, 05 Tech stack, 06 Services, 07 Contact + footer (details in the design spec, section 4) |
| `/projects` | Plain list of all 5 projects (same as the atlas "list view"); no-JS and crawler-friendly fallback |
| `/projects/[slug]` | Case study per project, opened with the kinetic warp; X-ray layer |
| ~~`/resume`~~ | Removed on 2026-11-26 (owner decision: no CV on the site) |
| `/v1`, `/v2` | Frozen archives (already done), noindex |

There are no separate About, Experience or Contact pages any more. Old URLs `/about-me` and `/contact-me` get permanent redirects to `/#about` and `/#contact`, so existing links keep working.

---

## 4. Projects (5) and case-study outline

Each case study uses one template: **Summary, My role, Problem, Solution (features), Stack, Architecture or decisions, Challenges and what I learned, Outcome, Links** (live, GitHub), plus a screenshot gallery.

| # | Project | Category | Angle | Material available |
|---|---|---|---|---|
| 1 | **CoreEx** (lead) | Full-stack | Production architecture and engineering discipline: per-user data isolation, RLS, OpenAPI-generated client, MCP server, ADRs, CI, releases | README, 14 ADRs, user guide, wiki note. **Screenshots: you will provide** |
| 2 | **AsteroidUI** (in progress) | Component library | Design-system thinking: nine components, shadcn registry, consumer verification in Next.js and Vite | README, CONTEXT (Particles, Asteroid, Galaxy tiers), live site. Needs a few screenshots |
| 3 | **Moonwave** | Web design | Scroll-driven animation, hero design | Existing video and full-page screenshot |
| 4 | **Brickly** | Web design | Luxury real-estate marketing site | Existing video and screenshot. Description must be rewritten (currently a copy of Moonwave's) |
| 5 | **Pet Shop (PetCare)** | Web design | Template with services, packages, booking form | Existing screenshots |

Removed from the new site as you asked: Mini Series (4 apps) and Portfolio Landing Page. They stay only in `/v2`.

**Work experience** (NM Media) appears on `/experience` as five generic project entries, matching CV v5, rather than as full case studies, because client details are private. If you want one of them (for example the auto-reply platform) as a case study, I would write it without client names.

Honesty rules for CoreEx: say "invite-only live demo"; say it was built with AI agents under your direction. **Correction after review:** the career wiki says Chat and Proposals are not shipped, but the repo shows they have since merged (chat module in the frontend and backend, PRs #289-#399: page-aware Chat, Proposals with approval, Chat that reads Assets). Before writing the case study I will check every feature against the live app and the repo, not the wiki. CoreEx therefore supports the "RAG" claim: Notes are chunked and embedded (pgvector, Supabase `gte-small`), retrieved by similarity, and used to ground Chat and the evidence-only Career AI (ADR 0013).

---

## 5. Technical approach

**Keep:** Next.js 16 (App Router), React 19, TypeScript, Tailwind 4, Vercel Analytics and Speed Insights, `next/font`.

**Change:**
- **Content as typed data.** `src/content/projects/*.ts` (metadata) plus `*.mdx` (long-form case study body), `src/content/experience.ts`, `src/content/skills.ts`. Adding a project = adding files; sitemap, cards and pages generate from them. Uses `@next/mdx` (documented in `node_modules/next/dist/docs/01-app/02-guides/mdx.md`).
- **Dynamic route** `projects/[slug]` with `generateStaticParams` and `generateMetadata`. In this Next version `params` is a Promise, so pages `await params`.
- **One animation approach.** Replace per-component copy-pasted GSAP set-then-reveal with one small reveal helper (CSS or `motion`), with `prefers-reduced-motion` respected. Remove dependencies nothing uses (`ogl`, `lucide` which duplicates `lucide-react`, and `postprocessing` unless the 3D scene needs it) and move `shadcn` to devDependencies. **Updated after the design references:** you want 3D and advanced scroll animation, so `three` and `@react-three/fiber` stay for one lazy-loaded hero scene (see `docs/reference.md`, section 4); GSAP ScrollTrigger and SplitText plus Lenis are the scroll system.
- **Contact form with Resend** via a Server Action (`'use server'`, `useActionState`, per `02-guides/forms.md`): server-side validation (zod or manual), honeypot field, simple rate limit, success and error states, email sent to the address you choose. API key only in `RESEND_API_KEY` (Vercel env, `.env.local` locally); the only other required variable is `CONTACT_TO_EMAIL`. `CONTACT_FROM_EMAIL`, `CONTACT_FORM_SECRET` and the Upstash pair are optional (in-memory rate-limit fallback). No `mailto:` fallback needed except as a visible link.
- **SEO:** `metadata` per page, per-project `opengraph-image`, JSON-LD (`Person`, `WebSite`, `CreativeWork` per project), generated `sitemap.ts` from content, canonical URLs on `https://lkw22studio.com` (default `SITE_URL` fixed from the old `leowkaiwen.dev` fallback).
- **Accessibility and quality gates:** semantic landmarks, keyboard-accessible nav, visible focus, colour contrast checks, alt text on all images, reduced-motion, axe check, Lighthouse targets (Performance 90+, Accessibility 95+ on mobile).
- **Images:** WebP via `next/image`; videos only on case-study pages, lazy-loaded with poster images.
- **CV PDF:** none. The owner decided on 2026-11-26 that the site has no CV download and no `/resume` route.
- **Assets and archives:** `/v1` and `/v2` are untouched, except bug fixes.

---

## 6. Design (decided 2026-11-26)

The design is settled and fully described in **`docs/v3-design-spec.md`**. In short: dark only, violet `#8b7bff` + lime `#c6f432`, Inter Tight + Instrument Serif + JetBrains Mono; concept "designed on top, engineered below" with three signatures: the **Atlas** draggable project board, the **kinetic warp** into case studies, and the **X-ray** lens on case-study pages. Plus a WebGL hero with cursor tilt, a ruler-style header, a full-screen menu, a custom cursor, a preloader and scroll-driven sections.

Build notes that affect architecture:
- One WebGL scene (hero) with React Three Fiber, lazy-loaded; the atlas is DOM + CSS 3D so cards stay real, accessible links.
- The warp needs a client transition layer around navigation to `/projects/[slug]` (and back to the atlas at the same camera position).
- Lenis + GSAP ScrollTrigger is the only scroll system; shared hooks for reveal, split text, counters, magnetic, tilt and scramble.
- Mobile and reduced-motion fallbacks are part of each feature, not a later phase.

---

## 7. Phases (each ends with a checkpoint for you to review)

**Updated 2026-11-26** for the approved design. Each phase is sized to be one GitHub issue (or a small group of issues) for a coding agent, and ends with a checkpoint for the owner. Placeholders are allowed while assets are missing (see the assets checklist); none may ship.

| Phase | Work | Verification |
|---|---|---|
| **0. Foundation** | Remove dead code and unused dependencies, align `three` and `@types/three`, fix `SITE_URL` default, content types and folders (`src/content`), redirects (`/about-me` → `/#about`, `/contact-me` → `/#contact`), fonts via `next/font`, design tokens in CSS | `next build`, lint, tsc green; `/v1` and `/v2` still work |
| **1. Shell and global motion** | Layout shell, ruler header, full-screen menu, custom cursor, magnetic buttons, Lenis + ScrollTrigger setup, shared motion hooks (reveal, split text, counter, tilt, scramble), preloader, reduced-motion handling | Header, menu and cursor match `home.html`; keyboard and reduced-motion checks |
| **2. Home sections (static first)** | Hero (CSS version), About, Experience, Tech stack, Services, Contact UI, footer, with scroll animations; content from `src/content` | Browser check at 375, 768, 1280, 1920 px against the mockup |
| **3. Atlas** | Sticky atlas section: board, drag with inertia, cursor and drag tilt, zoom buttons and Ctrl+wheel, minimap, list view, keyboard support, mobile "Explore the map" mode, cards as real links | Drag, click, keyboard and touch all work; no scroll blocking on mobile |
| **4. Case-study engine** | `/projects`, `/projects/[slug]` (MDX), page layout from spec section 5.2, 3D plate, stats, pinned gallery, architecture diagram, next project, metadata and OG images | Sample page renders; metadata correct |
| **5. Warp and X-ray** | Kinetic warp transition into and out of case studies (returns to the same atlas position), X-ray lens and full X-ray toggle, accessible text version of X-ray notes | Transition smooth at 60 fps on a mid laptop; reduced motion uses crossfade |
| **6. WebGL hero** | React Three Fiber hero scene (grid floor, depth chips, cursor tilt), lazy-loaded, paused off screen, static fallback | Lighthouse mobile still 90+ |
| **7. Content** | Write all 5 case studies with real facts (drafts for owner review), add screenshots and X-ray notes as they arrive, tech-stack data | Owner reviews every claim; no invented numbers |
| **8. Contact** | Resend server action, validation, honeypot, rate limit, success and error states | Real test email received |
| **9. Polish and QA** | Sound toggle (optional), easter eggs, SEO, JSON-LD, sitemap, a11y (axe), Lighthouse, 404 and error pages, cross-browser check, Impeccable design review if installed | Lighthouse and axe results shown to the owner |
| **10. Launch** | Preview review on the Vercel preview URL, then merge `redesign-v3` into `main`; `lkw22studio.com` serves it; update CV link | Production smoke test of `/`, `/projects/*`, `/v1`, `/v2`, form |

Commit per phase on `redesign-v3` (or one branch and PR per issue), so any phase can be reviewed or rolled back. Phases 2 to 6 can partly run in parallel once phase 1 is done.

---

## 8. Risks

- **Content is the real bottleneck.** The strongest claims need your confirmation; unverified numbers will be left out rather than guessed.
- **Motion versus performance and usability.** The design is heavy on motion; on desktop and laptop the effects win (optimise, don't cut), while on phones the Lighthouse targets in the design spec (section 7) are hard requirements. Accessibility targets apply everywhere, and every effect needs its mobile and reduced-motion fallback.
- **Atlas on touch devices** can block page scrolling if built carelessly; the spec requires a separate full-screen map mode on mobile.
- **Resend:** free tier limits and domain verification (sending from your own domain needs DNS records; otherwise Resend's test sender only mails your own account address). Plan to verify `lkw22studio.com` in Resend.
- **Private details in screenshots** (CoreEx data, emails). Each screenshot needs a quick privacy check before it goes public.

---

## 9. What I need from you

Moved to **`docs/v3-assets-checklist.md`** (logo, screenshots, X-ray notes, copy, links, Resend). Design references are done.

## 10. Decisions (answered 2026-11-25)

1. **Headline:** "Full-Stack Developer | AI Engineer". (Note: CV v5 says "Software Engineer | Full-Stack and AI Applications"; update the CV to match so both tell the same story.)
2. **CoreEx public approval:** approved. Still open: whether to mention the invite-only demo account on the page (default: say "invite-only, request a demo" and link GitHub).
3. **NM Media:** employer named, five generic project entries, no client names. Approved.
4. **Phone number:** stays off the site. Approved.
5. **RAG:** keep. CoreEx has retrieval and grounded AI (see section 4).
6. **CGPA and languages:** not included.
7. **Light and dark themes:** dark only (decided 2026-11-26).
8. **Branch** renamed to `redesign-v3`. Done.
9. **Design direction (2026-11-26):** Atlas + kinetic warp + X-ray, violet and lime, no portrait, no 3D laptop; see the design spec.
10. **Home sections (2026-11-26):** Hero, About, Personal projects, Experience, Tech stack, Services, Contact. No testimonials, blog or awards for now.
11. **Extras wanted:** preloader, page transitions, optional sound, easter eggs. No AI chat on the site.
12. **Implementation:** done by a separate coding agent from these documents.
