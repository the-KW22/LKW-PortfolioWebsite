# Hero scene rebuild plan (Issue #1)

Status: draft for owner review, 2026-11-27. Nothing here is built yet.

## 1. What the owner chose

Direction **D+A "Dust → Blueprint → Build"** from the hero lab (`docs/mockups/hero-lab/da-particles-to-blueprint.html`), with the "LKW" letter stage removed:

1. Scattered violet dust streams straight into the outline of a product blueprint in the upper right (app window with UI blocks, API boxes, a database cylinder, an AI node, joined by connector lines).
2. Thin violet lines draw on over the dust outline.
3. The parts build: solid surfaces fade in.
4. The cursor becomes an **X-ray lens**: inside it the surfaces disappear and you see the wireframe with lime data packets flowing along the connections.
5. Scrolling scatters the particles outward and fades the product as the Atlas section arrives.

No 000 → 100 counter in the scene. The warp tunnel (B), terrain (C) and monolith (E) are not used.

Why it fits: the scene acts out the headline ("I design and build whole products"), previews the X-ray idea used on case studies, and hands off to the Atlas on scroll.

## 2. Rules that stay

- The headline stays real DOM text and the largest contentful paint. The canvas never holds the headline.
- Phones, touch, low-power devices, reduced motion, no WebGL and context loss keep the CSS hero (`Hero.tsx`, `heroCapability.ts`). The scene only loads after the preloader and first idle moment, as now.
- 95% of frames under 20 ms on the owner's reference laptop. No layout shift when the canvas mounts.
- `/v1` and `/v2` untouched.

## 3. Design of the build

### Files

| File | Change |
|---|---|
| `src/components/sections/home/heroBlueprint.ts` (new) | Pure data and maths, no three.js: blueprint outlines in local units, connector routes, `sampleBlueprint(n)` (particle targets along the outlines), route lengths for packets. Unit-tested with `node --test`. |
| `src/components/sections/home/heroBlueprint.test.ts` (new) | Sampling returns `n` points, all on an outline; routes have positive length; deterministic with a seed. |
| `src/components/sections/home/HeroScene.tsx` | Keep the shell (Canvas, own `WebGLRenderer` in try/catch, context-loss fallback, error boundary, pointer and visibility tracking, `frameloop` pause off-screen, `onReady` after 3 frames). Replace the `Scene` contents: grid floor, glow quad and 7 chip planes go; particles, lines, surfaces and packets come in (below). |
| `src/components/sections/home/Hero.tsx` | Tech chips: in WebGL mode, show them as a DOM row under the intro (as in the mockup; real text, crisp, accessible), so the `sr-only` list can go. Entrance timings retimed to the scene. Mark the scene area for the custom cursor lens (see Lens). |
| `src/content/home.ts` | Chips keep their labels and `ai` flag. The `x/y/z` positions stay only if the CSS fallback keeps floating chips (decision 3). |
| `src/components/sections/home/home.css` | Only if the fallback changes (decision 3). |

### Scene parts (one renderer, one scene, one camera)

| Part | How | Draw calls |
|---|---|---|
| Dust → blueprint | ~30k `Points`, one `ShaderMaterial`. Attributes: scatter position, target position, per-particle delay, seed. The morph, curved travel arc, idle drift and scroll scatter all run in the vertex shader from uniforms (`uMorph`, `uScatter`, `uTime`, lens position). No per-particle CPU work per frame. About 6% of particles lime. | 1 |
| Blueprint lines | `LineSegments` with a per-vertex "draw order" attribute; `uDraw` reveals them in order. Brighter inside the lens. | 1 |
| Built surfaces | About 8 to 10 flat meshes sharing one shader that fades in by `uBuild` and discards fragments inside the lens circle (screen space). | ~10 |
| Data packets | One small `Points` (or instanced quads) moved along the connector routes; only visible inside the lens. | 1 |

About 13 draw calls, no postprocessing. Glow comes from additive blending, as in the mockup. Bloom is a later option only if frame time allows.

### Timeline (driven from when the preloader finishes)

| Time | Event |
|---|---|
| 0 | Canvas mounted and ready (fades in as now). |
| 0.3 to 2.3 s | Dust streams into the blueprint. |
| ~0.6 s | Headline lines rise (existing GSAP entrance, retimed). |
| ~2.0 s | Lines draw on. |
| ~2.9 s | Surfaces build. |
| ~4.2 s | Lens fully active. |

The mockup's timeline constants are the starting point. They live as named constants at the top of `HeroScene.tsx`.

### Lens

- The pointer is already tracked on the whole hero section. The shader gets the lens centre in device pixels and a radius.
- The site already has a custom cursor with a `lens` variant (`cursorStore.ts`, `data-cursor="lens"`). Use it so there is one ring, not two, and match the shader radius to it. Before the lens is active (and outside the hero) the cursor stays the default.
- The lime "X-RAY" label from the mockup sits on the ring.
- With no mouse movement yet, the lens rests over the blueprint so first-time visitors see what it does.

### Scroll

- Same source as now (`window.scrollY` read in `useFrame`, which Lenis drives). Progress 0 to 1 over the hero height: particles scatter outward and down toward the Atlas, lines and surfaces fade, the scene pauses when the hero leaves the viewport (existing IntersectionObserver).

### Layout

- The blueprint sits in the upper right and is framed from the viewport aspect so it never covers the bottom-left headline. Check at 1280, 1440, 1920 and an ultrawide.
- Pixel ratio capped at 2 (as now).

## 4. Fallbacks (unchanged behaviour)

| Case | Result |
|---|---|
| Phone, touch, below 768px | CSS hero |
| Reduced motion | CSS hero |
| Low power (`heroCapability.ts`) or save-data | CSS hero |
| No WebGL, renderer throws, context lost | CSS hero (existing try/catch, boundary and `webglcontextlost` handler) |
| `?hero=css` / `?hero=gl` | Testing overrides, kept |

## 5. Known follow-ups folded in (from the issue)

- Add a one-time remeasure after mount, against the canvas staying at 300x150.
- Review the device thresholds (4+ cores, 4+ GB memory, 768px+, no save-data). The scene is light, so keep them unless measurements say otherwise.
- Measure Lighthouse and loading on the Vercel preview.
- Test Safari, Firefox, a real touch device, real reduced motion and the owner's laptop.

## 6. Build steps and who does them (AGENTS.md routing)

| Step | Work | Who |
|---|---|---|
| 0 | Remove the preloader (section 8). Separate from the scene work, touches different files, can run first or in parallel with step 1 | Sonnet subagent |
| 1 | `heroBlueprint.ts` + test: port outlines, sampling and routes from the mockup | Sonnet subagent |
| 2 | `HeroScene.tsx` scene rewrite + `Hero.tsx` chip row, lens cursor, entrance timing (same agent, the files depend on each other) | Sonnet subagent, after step 1 |
| 3 | Verify: `npm run lint`, `npm run build`, `npm test`; preview at 1280/1440/1920; `?hero=css`, reduced motion, phone width; frame-time sample in the browser; no console errors | Main agent |
| 4 | Review (`ponytail-review`), required for this size of change | Main agent |
| 5 | Owner review on the Vercel preview; then the measurements in section 5 | Owner + main agent |

Nothing is committed or pushed unless the owner asks.

## 7. Decisions for the owner

1. **Site preloader counter. Decided 2026-11-27: remove it.** The dust gathering becomes the first thing a visitor sees. See section 8.
2. **Tech chips.** Show them as a row under the intro (recommended, matches the mockup), or as small labels on the blueprint parts?
3. **Phone / fallback hero.** Keep today's CSS grid floor with floating chips, or replace it with a static drawing of the blueprint so phones see the same idea (small extra work, no WebGL)?
4. **Grid floor.** The mockup has no floor. Keep it that way (recommended), or keep a very faint version of today's floor under the blueprint?

## 8. Preloader removal (decided 2026-11-27)

The first-visit 0 → 100 counter goes away completely, so the page and the hero scene start at once. What changes:

| File | Change |
|---|---|
| `src/components/shell/Preloader.tsx` | Delete. |
| `src/components/shell/preloaderStore.ts` | Delete (`whenPreloaderDone`, `usePreloaderDone`, `markPreloaderDone`, the 4 s failsafe). |
| `src/app/(site)/layout.tsx` | Remove the `<Preloader />` mount and the inline `PRELOAD_SCRIPT` (the `data-preload` attribute and the `lkw-preloaded` session flag go with it). |
| `src/app/(site)/globals.css` | Remove the `html[data-preload="1"] #preloader` rules. |
| `src/components/motion/Reveal.tsx`, `SplitText.tsx` | Remove the `waitForPreloader` option; animations start as they do on later visits today. |
| `src/components/case/CaseHero.tsx` | Drop `waitForPreloader`. |
| `src/components/sections/home/Hero.tsx` | Headline entrance and scene loading no longer wait for the preloader (scene still waits for `load` + idle). |
| `scripts/qa/keyboard.mjs`, `scripts/qa/layout.mjs` | Remove the preloader checks and the `lkw-preloaded` init script. |
| Docs and wiki | Note the change in `docs/v3-design-spec.md` (preloader line) and the vault wiki owner decisions. |

Check after: no flash of unstyled or hidden content on a fresh session, headline still the LCP, keyboard QA still passes, `/projects/*` unaffected (it never showed the preloader).
