---
type: how-to
updated: 2026-11-25
sources: [raw/sessions/2026-11-25-lint-webp-cleanup.md]
---
# Code quality

State at 2026-11-25: `npx eslint` 0 problems, `npx tsc --noEmit` clean, `next build` passes.

## Intentional lint suppressions (4)
- `@next/next/no-img-element`: MediaCarousel (MediaSlide and DetailModal screenshot) and ProjectCarousel. Reason: keep object-cover and natural-height sizing.
- `react-hooks/exhaustive-deps`: GridScan renderer effect. Reason: rebuilding the WebGL context on every prop change is wrong; other values apply in an update effect.

## Refactors to check visually
CurvedLoop drag cursor (now state on pointerdown), BorderGlow/Dither/GridScan/icon-cloud state derivation, MediaCarousel modal (unused media-index state removed), Nav (unused sublink state removed), IntroAnimation (`onComplete` via ref).

## Gotcha
After deleting a route, stale `.next/types/validator.ts` breaks `tsc` and `build`. Fix: delete `.next` (it is gitignored).
