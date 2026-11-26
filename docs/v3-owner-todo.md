# Portfolio ver 3.0: what only the owner can supply or approve

Generated at the end of Phase 7 (2026-11-26). Everything below is something I could not fill honestly from the repos, the CV or the ver 2.0 site. Every sentence I drafted is marked `DRAFT` in `src/content` (find them with `grep -rn "DRAFT" src/content`); on the pages they show a "Draft" tag. Missing facts are marked `TODO(owner)` (`grep -rn "TODO(owner)" src/content`).

Order is by what blocks launch first.

## 1. Decisions (answer these first)

1. **CoreEx on a public site.** The career wiki still says CoreEx is private and screenshots are private; GitHub shows the repo as public and the README links the demo. Is it approved to feature? (The wiki also says an Edge Function name must change before a repo goes public: please confirm that is done.)
2. **Year per project.** I filled 2026 for all five from git history (CoreEx first commit and v0.1.0 on 2026-10-28; AsteroidUI commits 2026-10-13 to 10-18; Moonwave repo created 2026-04-17; Brickly 2026-04-18; PetCare 2026-01-25). These show on the pages as plain text, so please confirm or correct.
3. **Link the three web-design repos?** Public repos exist with the live URL as their homepage: `the-KW22/music-studio-web-design` (Moonwave), `real-estate-web-design` (Brickly), `pet-shop-web-template` (PetCare). I linked them as DRAFT. Remove a link if you do not want it shown.
4. **AI-agent wording.** CoreEx says "directing AI coding agents (Claude Code, Codex)", taken from your CV and README. I used the same wording for AsteroidUI (its repo has an `AGENTS.md`). For Moonwave, Brickly and PetCare I wrote "designed and built" and did not claim agents. Tell me if any of these should change.
5. **"Fictional" / "sample content".** The Moonwave, Brickly and PetCare screenshots show invented studios, agents, prices and reviews. I described them as design exercises with sample content, not client work. Confirm that is accurate.
6. **Tech-stack "Used in" mappings.** "LLM APIs" points to CoreEx and the three NM Media projects that use OpenAI, Groq or Claude. "RAG and LLM evaluation" points to CoreEx (notes chunked, embedded and retrieved to ground Chat) and the AI Auto-Reply Platform (replies grounded in each client's knowledge base; 90%+ measured by replay). Cursor, AntiGravity and "Next.js API routes" have no project mapping yet. Approve, or tell me which projects to use.
7. **Keep the 90%+ About counter without a caption** (you decided this in review decision 4; the basis is stated in Experience). No action unless you changed your mind.
8. **Stats that will go stale.** "30 tagged releases" is a snapshot (CoreEx was at v0.23.1 on 2026-11-25). Keep a fixed number with the date in the outcome text, or drop the stat before launch?

## 2. Facts to supply

**CoreEx**
- Why it exists, in your words (the Problem lead is my reading of the README).
- What you learned and what you would change (Outcome).
- Whether the demo-access wording "Invite-only demo, request access" is what you want.

**AsteroidUI**
- Why you are building it and for whom (Problem).
- Where it is heading next, in one sentence (Outcome).
- What the contract panels (ButtonContract, ParticleContract) show, so the X-ray note can describe them.
- Confirm `asteroid-ui.vercel.app` is the public address you want shown. Its README says public release is still later work.

**Moonwave, Brickly, PetCare** (for each)
- The brief: self-set exercise or for someone? (the lead of "The brief" is `TODO(owner)` on all three).
- Approach: why this layout, what the animation does, and for Moonwave what Nano Banana and Kling each produced.
- Brickly only: were AI image or video tools used for the hero? If so add them to its stack.
- PetCare only: was the Figma design your own? Which parts animate?
- Outcome and what you learned (one sentence each).
- Stack check: your CV lists GSAP and Framer Motion for the three sites. The repos show GSAP and Motion only in Brickly. I used what the repos show.

**Site-wide**
- LinkedIn URL (`src/content/site.ts`), or confirm there is none.
- Reply-time line, for example "I reply within 2 working days", or leave it out.

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

## 5. Corrections to make elsewhere

- **Your CV** says 13 ADRs and 24 releases for CoreEx. The repo now has 14 ADRs and 30 tagged releases, and 49 MCP tools. Update the CV when you next issue it, and change its portfolio link to `https://lkw22studio.com` after launch.
- **`docs/v3-implementation-plan.md` and `docs/v3-assets-checklist.md`** still quote 44 MCP tools, 24 releases and 13 ADRs. I did not edit them (outside my scope).
