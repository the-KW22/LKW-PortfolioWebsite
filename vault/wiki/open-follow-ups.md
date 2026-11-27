---
type: how-to
updated: 2026-11-27
sources: [raw/sessions/2026-11-25-lint-webp-cleanup.md, raw/sessions/2026-11-27-ver3-redesign-build.md, raw/sessions/2026-11-27-agent-workflow.md, raw/sessions/2026-11-27-hero-scene-rebuild.md, raw/sessions/2026-11-27-issues-2-to-10.md]
---
# Open follow-ups

## Ver 3.0 before launch (owner)
- Supply CoreEx and AsteroidUI screenshots; re-align the X-ray boxes in `src/content/projects/xray.ts` to them. Approve the drafted case-study text and X-ray notes; full list in `docs/v3-owner-todo.md` and by `npm run check:launch` ([[image-pipeline]], [[projects-showcase]]).
- Add `RESEND_API_KEY` and `CONTACT_TO_EMAIL` to Vercel (Preview and Production), then send one real test message ([[contact-form]], [[deployment-vercel]]).
- On the Vercel preview: run Lighthouse (mobile and desktop), test Safari, Firefox and a real phone.
- Launch (Phase 10): merge `redesign-v3` into `main`, confirm lkw22studio.com serves it, update the CV link and the CoreEx numbers (49 / 30 / 14) in the CV ([[ver3-build-process]]).
- Check whether the ver 2.0 archive's PDF `/v2/document/LeowKaiWen-Resume.pdf` contains a phone number ([[versioning-and-archives]]).

## GitHub issues (the-KW22/LKW-PortfolioWebsite)
- #1 hero R3F scene: closed 2026-11-27. Still to check: real GPU or laptop, Safari, Firefox, a real touch device; Lighthouse on the Vercel preview. Open from the hero review: the CSS cursor ring lags 0.45 s behind the shader lens, so they can drift on fast moves (item 4, not fixed); device thresholds in `heroCapability.ts` are unchanged ([[ver3-owner-decisions]]).
- `npm run lint` fails on stale `.claude/worktrees/*/.next` output (pre-existing). It should ignore `.claude/worktrees`.
- Closed 2026-11-27, each with a GitHub comment: #2 draggable ruler (`0697674`), #3 Atlas intro fit (`5c8dd37`), #4 Atlas scroll cue (`fb34355`), #8 menu fits one screen (`2ea4981`), #9 menu links land on the section (`0aa3fd4`), #10 Screens gallery scroll (`bc610d9`). Details: [[2026-11-27-issues-2-to-10]].
- Still open: #5 rebuild Experience cards, #6 rebuild Tech Stack, #7 rebuild Services (skipped for now by the owner, see [[ver3-owner-decisions]]); #11 Atlas background enhancement (not started).
- Not tested on real hardware: Safari, Firefox, a real trackpad, a touch tablet, the owner's laptop. The #4 cue may need to be bolder (owner's call).
- `redesign-v3` pushed to origin (50264b9..bc610d9).

## Ver 2.0 items (live site and `/v2`)
- Browser check: Home, Projects, Contact, 404; project screenshots; refactored animations ([[code-quality]]).
- Delete the unreferenced `images/promote-images/*`.
- `next.config.ts` had no image config; `shadcn` and duplicate `lucide` were cleaned up in ver 3.0 Phase 0 (not on `main`).

## Agent workflow (2026-11-27)
- [[agent-workflow]] was used for issues #2 to #10 (Haiku fixes, each re-verified by the main agent); tune the Haiku/Sonnet thresholds after more tasks. Review is not mandatory for trivial and simple tiers.

## History
- 2026-11-27: replaced "Commit `2896cdc` is not pushed" (it is in the history pushed with `redesign-v3`); removed the item about listing extra Vercel projects (ver 3.0 features CoreEx, AsteroidUI, Moonwave, Brickly and PetCare; the Portfolio Landing Page, `landing-page-design01`, was deliberately dropped). See [[2026-11-27-ver3-redesign-build]].
- 2026-11-27: "#1 not committed and not closed" is out of date. #1 is closed and `redesign-v3` is pushed (50264b9..bc610d9). See [[2026-11-27-issues-2-to-10]].
