---
type: how-to
updated: 2026-11-27
sources: [raw/sessions/2026-11-25-lint-webp-cleanup.md, raw/sessions/2026-11-27-ver3-redesign-build.md, raw/sessions/2026-11-27-agent-workflow.md]
---
# Code quality

## Ver 3.0 (branch `redesign-v3`, tip `50264b9`)
- Checks: `npx tsc --noEmit` clean, `npx eslint src scripts` clean, `npm test` (Node's built-in runner, 13 tests for the contact form logic), `npm run build` passes.
- Scripts added in Phase 9 (dev-only deps `playwright-core` and `@axe-core/playwright`): `qa:axe`, `qa:keyboard`, `qa:layout`, `qa:flows`, and `check:launch` (lists remaining `TODO(owner)` / `DRAFT` markers and placeholders; not part of the build). Report: `docs/v3-qa-report.md`.
- Accessibility: axe shows 0 violations at rest on the tested routes; some contrast findings remain only in transient animation states. Keyboard pass found no problems.
- **Pitfall (fixed):** `gsap.to(targets, { overwrite: true })` also kills `gsap.quickTo` tweens on the same targets; use `overwrite: "auto"` ([[2026-11-27-ver3-redesign-build]]).
- **Lint gotcha:** repo-wide `npm run lint` in the main checkout scans `.claude/worktrees/*` and reports about 86,000 problems; lint `src scripts` instead ([[ver3-build-process]]).
- Still untested: Lighthouse, Safari, Firefox, real touch devices, a real screen reader ([[open-follow-ups]]).

Agent verification steps and review rules: [[agent-workflow]].

## Ver 2.0 code (now frozen in `src/app/v2` and live on `main`)
State at 2026-11-25: `npx eslint` 0 problems, `npx tsc --noEmit` clean, `next build` passes.

Intentional lint suppressions (4): `@next/next/no-img-element` in MediaCarousel (MediaSlide and DetailModal screenshot) and ProjectCarousel (keep object-cover and natural-height sizing); `react-hooks/exhaustive-deps` in the GridScan renderer effect (rebuilding the WebGL context on every prop change is wrong).

Refactors to check visually: CurvedLoop drag cursor, BorderGlow/Dither/GridScan/icon-cloud state derivation, MediaCarousel modal, Nav, IntroAnimation.

## Gotcha
After deleting a route, stale `.next/types/validator.ts` breaks `tsc` and `build`. Fix: delete `.next` (it is gitignored).

## History
- 2026-11-27: added the ver 3.0 section; the ver 2.0 section is unchanged but its files now live under `src/app/v2/_components`.
