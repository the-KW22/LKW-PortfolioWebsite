---
type: how-to
updated: 2026-11-27
sources: [raw/sessions/2026-11-25-lint-webp-cleanup.md, raw/sessions/2026-11-27-ver3-redesign-build.md]
---
# Open follow-ups

## Ver 3.0 before launch (owner)
- Supply CoreEx and AsteroidUI screenshots; re-align the X-ray boxes in `src/content/projects/xray.ts` to them. Approve the drafted case-study text and X-ray notes; full list in `docs/v3-owner-todo.md` and by `npm run check:launch` ([[image-pipeline]], [[projects-showcase]]).
- Add `RESEND_API_KEY` and `CONTACT_TO_EMAIL` to Vercel (Preview and Production), then send one real test message ([[contact-form]], [[deployment-vercel]]).
- On the Vercel preview: run Lighthouse (mobile and desktop), test Safari, Firefox and a real phone.
- Launch (Phase 10): merge `redesign-v3` into `main`, confirm lkw22studio.com serves it, update the CV link and the CoreEx numbers (49 / 30 / 14) in the CV ([[ver3-build-process]]).
- Check whether the ver 2.0 archive's PDF `/v2/document/LeowKaiWen-Resume.pdf` contains a phone number ([[versioning-and-archives]]).

## GitHub issues (the-KW22/LKW-PortfolioWebsite)
- #1 enhance the hero R3F scene.
- Raised 2026-11-27 to discuss and fix: #2 draggable header ruler; #3 Atlas first view misaligned on laptops (bug); #4 persistent "keep scrolling" cue in the Atlas; #5 rebuild Experience cards; #6 rebuild Tech Stack; #7 rebuild Services; #8 menu fits one laptop screen without scrolling; #9 menu does not navigate to the right section (bug); #10 scroll lag in the project Screens section (bug); #11 Atlas background enhancement.

## Ver 2.0 items (live site and `/v2`)
- Browser check: Home, Projects, Contact, 404; project screenshots; refactored animations ([[code-quality]]).
- Delete the unreferenced `images/promote-images/*`.
- `next.config.ts` had no image config; `shadcn` and duplicate `lucide` were cleaned up in ver 3.0 Phase 0 (not on `main`).

## History
- 2026-11-27: replaced "Commit `2896cdc` is not pushed" (it is in the history pushed with `redesign-v3`); removed the item about listing extra Vercel projects (ver 3.0 features CoreEx, AsteroidUI, Moonwave, Brickly and PetCare; the Portfolio Landing Page, `landing-page-design01`, was deliberately dropped). See [[2026-11-27-ver3-redesign-build]].
