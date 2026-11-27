# Session 2026-11-27: hero scene rebuild (GitHub Issue #1)

Raw session record. Immutable once written.

## Request
Owner asked the agent to study the whole project, then work through the open GitHub issues one by one, starting with Issue #1 ("Enhance the home page hero React Three Fiber scene"): propose hero scene variants that make a big first impression, prototype them, then plan and build the chosen one.

## Exploration (hero lab)
- Five directions proposed: A Blueprint → Build (product blueprint draws then builds; X-ray lens shows wireframe and lime data), B Warp arrival (light-speed tunnel braking onto the grid), C Living signal terrain (cursor ripples on a moving terrain), D One-system particles (dust forms "LKW" then a stack map), E Monolith (half-glass, half-wireframe slab).
- Combos built: A+B, B+C, D+A, and later B+D+A.
- Prototypes are standalone HTML in `docs/mockups/hero-lab/` with a gallery `index.html`, served from the repo root (three.js via import map from `/node_modules`). Built by Sonnet and Haiku subagents; main agent checked each in the browser.
- Notes from review: B+C had the strongest warp tunnel; B and A+B tunnels were weaker; C and B+C needed a chip-size/horizon fix (done); E's glass had a harsh highlight.

## Decisions (owner, 2026-11-27)
- Chosen direction: **D+A "Dust → Blueprint → Build"**, without the "LKW" stage: dust streams straight into the product blueprint, lines draw on, surfaces build, then the cursor X-ray lens reveals the wireframe with lime data packets. Scroll scatters it toward the Atlas.
- **Remove the site preloader** (first-visit 0 → 100 counter) entirely, so the dust gathering is the first thing visitors see.
- Defaults accepted for the other open choices: tech chips as a DOM row under the intro; no grid floor in WebGL mode; CSS fallback hero kept (grid floor + glow).
- After review: floating CSS chips removed everywhere (they duplicated the new chip row on phones and the desktop fallback).

## What changed (uncommitted on `redesign-v3`)
- Plan: `docs/v3-hero-scene-plan.md`.
- Preloader removed: deleted `src/components/shell/Preloader.tsx` and `preloaderStore.ts`; removed the inline preload script and `<Preloader />` from `src/app/(site)/layout.tsx` and its CSS from `globals.css`; `Reveal` lost `waitForPreloader`; `SplitText`/`CaseHero` now use `waitForWarp` (keeps the case-study title waiting for the kinetic warp); QA scripts `keyboard.mjs`, `layout.mjs`, `axe.mjs` updated; note added to `docs/v3-design-spec.md`.
- New `src/components/sections/home/heroBlueprint.ts` (+ `heroBlueprint.test.ts`): blueprint outlines, sampling, lines, surfaces, packet routes, seeded PRNG; no three.js.
- `HeroScene.tsx` rewritten: 30k-point dust morph, blueprint lines, built surfaces, lime packets; 4 draw calls, no postprocessing; one-time remeasure after mount; existing fallbacks kept (renderer try/catch, context loss, error boundary, pause off-screen).
- Lens uses the site's custom cursor `lens` variant (one ring, lime "X-RAY" label, 260px); the shader lens radius matches (130px). Lens appears only after a mouse move and after the scene's lens fade, never over links/buttons, and releases when scrolled away.
- `Hero.tsx`: chip row under the intro, floating chips and their parallax removed, entrance retimed (headline 0.6s). `src/content/home.ts`: chips are label + `ai` only.

## Measured / verified
- `eslint src scripts`, `tsc --noEmit`, `npm test` (17/17), `npm run build` pass. Plain `npm run lint` still fails only on stale `.claude/worktrees/*/.next` output (pre-existing).
- Headless Chromium screenshots at 1280x800, 1440x900, 1920x1080, 2560x1080: blueprint upper right, clear of the headline. p95 frame time about 17 ms (software rendering, not representative of a real GPU).
- `?hero=css`, reduced motion and a 375px phone: no canvas, CSS hero, chip row present, no page errors.
- Lens behaviour: default cursor before a mouse move; lens over the blueprint; hover cursor over "See projects"; default after scrolling away.

## Left undone / follow-ups
- Not tested on a real GPU / the owner's laptop, Safari, Firefox, or a real touch device. Lighthouse not measured on the Vercel preview.
- The CSS cursor ring lags 0.45s while the shader lens follows faster, so they can drift apart on fast moves (review item 4, not fixed).
- Device thresholds in `heroCapability.ts` unchanged.
- `npm run lint` should ignore `.claude/worktrees` (pre-existing).
- Nothing committed; Issue #1 not closed.
