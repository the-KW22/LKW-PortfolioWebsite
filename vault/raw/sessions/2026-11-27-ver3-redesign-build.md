# Session 2026-11-27: ver 3.0 redesign, from planning to pre-launch

Raw session record. Immutable once written. Spans 2026-11-25 to 2026-11-27. This was a planning and orchestration session: it read the materials, wrote the plan and design docs, built throwaway mockups in `docs/mockups/`, and started separate coding sessions (git worktrees) for each build phase. The owner approved every merge. No site code was written in this session itself.

## Request
Owner is job hunting and wants the site upgraded to a "ver 3.0" that is proud to put on a CV and works as personal branding (jobs, freelance, custom builds), aiming at Awwwards-level quality, with no deadline. Position: Full-Stack Developer | AI Engineer. Owner interests: scroll-triggered animation, 3D, advanced component animation.

## Versioning and archives (done first)
- Newest site lives at `/`. Older versions are kept at `/v1` and `/v2`, both noindex.
- `/v1` = the original Vite site, built (base `/v1/`) into `public/v1`, served by a rewrite `/v1` -> `/v1/index.html` in `next.config.ts`.
- `/v2` = frozen copy of ver 2.0: own root layout and robots noindex in `src/app/v2`, assets in `public/v2`. Git tag `v2`.
- New site lives in route group `src/app/(site)/` (two root layouts, so full page reload between them).
- GitHub: the old ver-1.0 repo was deleted by the owner and the ver-2.0 repo renamed `the-KW22/LKW-PortfolioWebsite`. Branch `redesign-v3` (renamed from redesign-v2) holds ver 3.0.
- Vercel: project `lkw-portfolio-website`; domain `lkw22studio.com` (and www redirect) follows `main`; branch pushes create SSO-protected previews. Pushing `redesign-v3` does not change the live site.
- Commits on the way: `d60d0cd` archive as v1, `a1f5f8d` rename to /v2 and serve original at /v1.

## Planning and design
- Materials read: the current site, the private career wiki, CV v5 (2026-11-19), CoreEx and AsteroidUI repos. Outputs: `docs/v3-implementation-plan.md`, `docs/reference.md` (7 design references), `docs/v3-design-spec.md`, `docs/v3-design-spec-review.md` (14 decisions from an owner interview), `docs/v3-assets-checklist.md`, later `docs/v3-owner-todo.md` and `docs/v3-qa-report.md`.
- Projects on the new site: CoreEx (lead), AsteroidUI (in progress), Moonwave, Brickly, PetCare. Mini Series and Portfolio Landing Page are dropped (they remain in `/v2` only).
- Design direction chosen from six concept sketches: dark only, violet #8b7bff and lime #c6f432, no portrait, no 3D laptop. Concept mix: **Atlas** (draggable 3D project board) -> **kinetic warp** into a project -> case study with an **X-ray lens** (cursor reveals engineering layer; X toggles full view). One-page home: Hero, About, Personal projects (Atlas), Experience, Tech stack, Services, Contact, footer. Header is a "ruler" section scanner with a KL clock and a full-screen menu.
- Mockups (throwaway, served by a static server): `docs/mockups/home.html` (approved reference), `atlas-flow.html`, `concepts.html`, `signal-hero.html`.
- Performance rule decided by the owner: on desktop and laptop the full effects always ship (optimise, never cut); on phones speed targets win (Lighthouse mobile Performance 90+, LCP under 2.5 s, CLS under 0.1).
- Cut from v1: sound, terminal mode, Konami code. No testimonials, blog or awards.

## Build (each phase = one coding session in a worktree, reviewed, then merged `--no-ff` into `redesign-v3`)
| Phase | What | Merge commit |
|---|---|---|
| 0 | Foundation: dependency cleanup, typed content in `src/content`, SITE_URL default `https://lkw22studio.com`, redirects `/about-me` -> `/#about`, `/contact-me` -> `/#contact`, fonts and tokens | `d670d9e` |
| 1 | Shell: ruler header, menu, custom cursor, preloader, Lenis + ScrollTrigger, motion kit | `6a47898` |
| 2 | Home sections (CSS hero), plus a cursor fix | `04b38e2` |
| 3 | Atlas board, list view, mobile full-screen map | `0fef7cc` |
| 4 | Case-study engine: `/projects`, `/projects/[slug]`, OG images, sitemap | `22d782b` |
| 5 | Kinetic warp transition and X-ray lens | `8b2a7d6` |
| 6 | Lazy WebGL hero scene (R3F) with CSS fallback | `3c72cbe` |
| 8 | Contact form (Resend) | `3f4219d` |
| 7 | Content: facts verified, case-study drafts, owner checklist | `893262e` |
| 9 | SEO, error pages, accessibility, launch gate, QA report | `44e5d73` |
| - | Owner decisions applied | `50264b9` |
`redesign-v3` was pushed to origin (fast-forward `a1f5f8d..50264b9`); Vercel started a preview build.

## Bugs and findings during review
- Phase 2 custom cursor froze after its first move: `gsap.to(..., { overwrite: true })` in `show()` and the leave handler killed the `quickTo` x/y tweens. Fixed with `overwrite: "auto"` (commit `19e0791`), plus a bigger dot and clearer ring.
- Phase 4 note: the Phase 4 session reused an older worktree folder; a worktree removed on archive made a preview path vanish once.
- Phase 9 found and fixed: footer wordmark covered footer links, case-study hero stretched the page to 2005 px at 1920 px, a dropped JSON-LD `type` attribute.
- CoreEx numbers in the CV were stale. Verified from the repo in Phase 7: **49 MCP tools** (49 `@McpTool` methods), **30 tagged releases** (v0.1.0 on 2026-10-28 to v0.23.1 on 2026-11-25), **14 ADRs** (0001 to 0014). CV v5 says 44 / 24 / 13. AsteroidUI: 9 components, 11 registry items.
- Repo-wide `npm run lint` in the main checkout reports about 86,000 problems because ESLint also scans the nested worktree copies under `.claude/worktrees` (with their `.next` output). `npx eslint src scripts` is clean.

## Contact form (Phase 8)
- Server Action with `useActionState`; Resend sends one email to the owner with `reply_to` set to the visitor. Spam guards: hidden honeypot field, signed fill-time token (minimum 3 s), per-IP-hash rate limit (3/hour, 6/day, 40/day sitewide).
- Simplified at the owner's request: only `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are required. Optional: `CONTACT_FROM_EMAIL` (default sender is Resend's test sender `onboarding@resend.dev`), `CONTACT_FORM_SECRET` (derived from the Resend key if unset), `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (shared limit; otherwise an in-memory per-instance limiter), `CONTACT_DRY_RUN` (dev only, ignored in production).
- Resend facts: an unverified Resend account can only send to the email address the account is registered with; a sender cannot be the visitor's address (it must be on a verified domain), hence `reply_to`. Recommended API key permission: Sending access.
- No keys: the form shows a calm "nothing was sent, email me" message and never claims success. Verified in a browser with no keys. A real send was not tested.

## Owner decisions (2026-11-26 and 2026-11-27)
Remove the Download CV button and the `/resume` route entirely (CV v5 contains a phone number, which stays off the site). Raise the dim About text from 13 percent to about 30 percent opacity. Show CoreEx stats 49 / 30 / 14 with the date "as of November 2026". Show no years on projects. CoreEx shown publicly with GitHub and invite-only demo links. Moonwave, Brickly and PetCare are described as design exercises with sample content; their three public repo links are kept. No LinkedIn (button hidden). State the AI-agent method (directing coding agents while owning architecture, review, tests and deployment) only in About, not on project pages. Tech stack keeps all tools but has no "used in" hover. AsteroidUI links to `asteroid-ui.vercel.app`. No reply-time line. Experimental `globalNotFound` (needed for a styled 404 with two root layouts) was merged.

## Verification
- Unit tests: 13 pass (`npm test`, Node built-in runner). Typecheck and `npx eslint src scripts` clean. Production build passes.
- axe: 0 violations at rest on `/`, `/projects`, two case studies and `/nope` at 1280 and 375 px (some contrast findings remain only in transient animation states). Keyboard pass: no problems. Reduced motion emulated.
- Archive checks every phase: `git diff --stat redesign-v3 -- public/v1 public/v2 src/app/v2` empty; `/v1`, `/v2`, `/v2/projects`, `/v2/about-me`, `/v2/contact-me` return 200 with noindex.
- Phase 9 also added an `X-Robots-Tag: noindex` header for `/v1` and `/v2` in `next.config.ts` (files untouched).
- Not run: Lighthouse (the permission system blocked `npx lighthouse`), Safari, Firefox, real touch devices, a real screen reader, a real contact send.

## Process notes and gotchas
- Preview server for a worktree is started with a `.claude/launch.json` entry that runs that worktree's `next dev` on port 3100; the app stops idle preview servers, so they must be restarted.
- Messaging an archived coding session needs unarchiving and workspace trust approval; a fresh session is the fallback.
- On Windows Git Bash, `git show <ref>:<path>` needs `MSYS_NO_PATHCONV=1`; a stale `.next` breaks `tsc` after routes are deleted.

## GitHub issues raised
- #1 enhance the hero R3F scene (enhancement).
- From the owner's preview review, labelled and not yet worked: #2 draggable header ruler, #3 Atlas first view misaligned on laptops (bug), #4 persistent "keep scrolling" cue in Atlas, #5 rebuild Experience cards, #6 rebuild Tech Stack, #7 rebuild Services, #8 menu fits one screen on laptops, #9 menu does not navigate to the right section (bug), #10 scroll lag in the project Screens section (bug), #11 Atlas background enhancement.

## Left undone / open follow-ups
- Owner supplies: CoreEx and AsteroidUI screenshots (CoreEx's `portfolio-screenshots` folder needs a privacy check first), approval of drafted text and X-ray notes (`docs/v3-owner-todo.md`), X-ray boxes must be re-aligned to real screenshots.
- Add `RESEND_API_KEY` and `CONTACT_TO_EMAIL` to Vercel for Preview and Production, then test one real message.
- Run Lighthouse on the Vercel preview; test Safari, Firefox and a phone.
- Launch (Phase 10): merge `redesign-v3` into `main`, confirm lkw22studio.com serves it, update the CV portfolio link and the CoreEx numbers in the CV.
- The ver 2.0 archive still serves its own old résumé PDF at `/v2/document/LeowKaiWen-Resume.pdf` (may contain the phone number); owner to check.
- Resolve the ten open issues above (owner is handling them with other agents).
- Vault files for this session are uncommitted.
