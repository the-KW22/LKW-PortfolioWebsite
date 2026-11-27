# Portfolio ver 3.0: what only the owner can supply or approve

Generated at the end of Phase 7 (2026-11-26) and updated the same day with the owner decisions below. Everything below is something I could not fill honestly from the repos, the CV or the ver 2.0 site. Every sentence I drafted is marked `DRAFT` in `src/content` (find them with `grep -rn "DRAFT" src/content`); on the pages they show a "Draft" tag. Missing facts are marked `TODO(owner)` (`grep -rn "TODO(owner)" src/content`).

Order is by what blocks launch first.

## Owner decisions, 2026-11-26

Decided after reading the Phase 7 and Phase 9 reports, and applied in the same session:

1. **No CV on the site.** Removed the hero "Download CV" button, the contact CV pill, the menu CV link, the `/resume` route (it now returns the styled 404), its noindex header, `src/lib/resume.ts`, the `NEXT_PUBLIC_HAS_RESUME` flag and the resume check in `check:launch`. The PDF in ver 2.0's folder stays in the archive.
2. **About paragraph dim text** now starts at opacity 0.3 on desktop (was 0.13). Phones keep their higher start (0.4, violet word 0.65).
3. **CoreEx stats:** 49 MCP tools, 30 tagged releases (dated "as of November 2026" in the stat label, outcome text and About counter), 14 ADRs. Old 44 / 24 / 13 figures fixed in the plan, checklist and spec.
4. **Years hidden:** every project's `year` is `null`; nothing renders a year (case-study label, JSON-LD `dateCreated`).
5. **CoreEx is approved for public showing,** with its GitHub and invite-only demo links.
6. **Web designs** (Moonwave, Brickly, PetCare) are described as self-initiated design and build exercises with sample content, not client work. The three repo links stay. No LinkedIn exists, so the button stays hidden.
7. **AI coding agents wording only in About.** The case studies, roles, story text and project cards use neutral wording ("Product decisions, architecture, review, tests and releases"). CoreEx's MCP server for AI agents stays, since it is a product feature.
8. **Tech stack** keeps every tool, but the hover/focus/tap "Used in" feature is gone: tiles are plain list items (no tab stops, no hint line, no result panel) in both the ring and the grid.
9. **AsteroidUI** links `https://asteroid-ui.vercel.app` as "Live site" with an "In progress" label next to GitHub.
10. **Contact:** no reply-time line (`site.replyTime` stays `null`, nothing renders).

## 1. Still open

1. **CoreEx Edge Function name.** The career wiki says an Edge Function name must change before a repo goes public. Please confirm that is done.
2. **Keep the 90%+ About counter without a caption** (decided in review decision 4; the basis is stated in Experience). No action unless you changed your mind.

## 2. Facts to supply

**CoreEx**
- Why it exists, in your words (the Problem lead is my reading of the README).
- What you learned and what you would change (Outcome).
- Whether the demo-access wording "Invite-only demo, request access" is what you want.

**AsteroidUI**
- Why you are building it and for whom (Problem).
- Where it is heading next, in one sentence (Outcome).
- What the contract panels (ButtonContract, ParticleContract) show, so the X-ray note can describe them.

**Moonwave, Brickly, PetCare** (for each)
- Approach: why this layout, what the animation does, and for Moonwave what Nano Banana and Kling each produced.
- Brickly only: were AI image or video tools used for the hero? If so add them to its stack.
- PetCare only: was the Figma design your own? Which parts animate?
- Outcome and what you learned (one sentence each).
- Stack check: your CV lists GSAP and Framer Motion for the three sites. The repos show GSAP and Motion only in Brickly. I used what the repos show.

## 3. Screenshots to supply

Put WebP files, about 1600 px wide, in `public/images/projects/<slug>/`. Check each for personal notes, emails, tokens and real names before saving. Do not use anything from CoreEx's `portfolio-screenshots` folder until it has had that check.

| Project | Filename | Size | Shows |
|---|---|---|---|
| CoreEx | `coreex-hero.webp` | 1600 x 900 | Main screen: items page with the command palette and chat dock (hero and atlas thumbnail) |
| CoreEx | `coreex-editor.webp` | 1600 x 900 | Notes editor with save status |
| CoreEx | `coreex-graph.webp` | 1600 x 900 | Knowledge graph |
| CoreEx | `coreex-search.webp` | 1600 x 900 | Search by words and by meaning |
| CoreEx | `coreex-chat.webp` | 1600 x 900 | Chat reading notes with sources |
| CoreEx | `coreex-tokens.webp` | 1600 x 900 | MCP access tokens screen (hide the token value) |
| CoreEx | `coreex-career.webp` (optional) | 1600 x 900 | Applications board |
| AsteroidUI | `asteroidui-hero.webp` | 1600 x 900 | Component catalog |
| AsteroidUI | `asteroidui-detail.webp` | 1600 x 900 | A component page with live examples |
| AsteroidUI | `asteroidui-registry.webp` | 1600 x 900 | Install command and registry items |

Moonwave, Brickly and PetCare already have media. After CoreEx and AsteroidUI screenshots arrive, the X-ray boxes and notes in `src/content/projects/xray.ts` must be re-aligned to the real screens (their positions are estimates).

AsteroidUI: you may instead approve me capturing these from the live site.

## 4. Approvals (read and OK, or edit)

- All `DRAFT` case-study text in the five project files: taglines, summaries, roles, story sections, decisions, diagram descriptions.
- All X-ray notes in `xray.ts` (each is marked draft, sourced to a README or ADR in a comment).
- About statement (now "full-stack developer and AI engineer", matching the headline), the About counters, the hero line, the four Services cards, contact copy.
- Alt text and captions I wrote for the Moonwave, Brickly and PetCare images.
- The "self-initiated exercise with sample content" lines now in the Moonwave, Brickly and PetCare briefs.

## 5. Corrections to make elsewhere

- **Your CV** (outside this repo, not edited) says 13 ADRs and 24 releases for CoreEx. The repo has 14 ADRs, 30 tagged releases (as of November 2026) and 49 MCP tools. Update the CV when you next issue it, and change its portfolio link to `https://lkw22studio.com` after launch.
