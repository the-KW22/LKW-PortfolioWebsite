# Session 2026-11-27: GitHub issues #5, #6, #7, #11 and a drag-cursor fix

Raw session record. Immutable once written. Follows `2026-11-27-issues-2-to-10.md` in the same project (those issues left #5, #6, #7 and #11 open).

## Request
The owner took the four remaining open issues one at a time. For each one the agent read the issue and the code, proposed directions, and the owner picked one before anything was built. Then the owner asked for one more fix (the drag cursor), a push, and this wiki entry.

## How the work was done
- Each issue followed: read the issue (`gh issue view`) and the current code, propose options, the owner picks, build, verify, owner asks to commit and close.
- The **main agent wrote all the code itself**; no Haiku or Sonnet subagent was used. `AGENTS.md` routes standard work to a Sonnet subagent, so this departs from it. The `ponytail` skill was loaded for the first piece of coding.
- Checks each time: `npx eslint` on the touched folders (or all of `src`), `npm run build` (22/22 static pages), and a look in the preview browser (dev server `site-dev`, port 3200) at desktop width, and at 375px for the layout changes.
- Not run: `ponytail-review` / `code-review` (AGENTS.md requires review from medium tasks up), unit tests, Playwright scripts.
- Commits were made only when the owner asked, one per issue; the owner asked for each issue to be closed with a GitHub comment.

## Issues
### #5 Experience: NM Media project cards — commit 347c3bd
- Before: five identical tiles in a 2-column grid, each showing only `points[0]` of the project (Patient Portal and Social Media Platform had 3 bullets, others 2, so most CV content was hidden).
- Owner picked **"B: pinned case-file"** over expandable cards.
- New `src/components/sections/home/ProjectCaseFile.tsx`, used by `Experience.tsx` for the NM Media job (the old `ProjectTile` is removed). On desktop (min-width 768px and no reduced motion, via `gsap.matchMedia`) the block pins at "top 14%" for 70% of a viewport per project; a rail on the left lists the five projects and scroll swaps the active project on the right. Rail buttons scroll to a project with `useScroll().scrollTo`. Each panel shows the project name, every CV bullet, the highlight in large lime type with its qualifier directly beneath, and the stack chips (AI tools lime).
- Below 768px, with reduced motion, or before JS runs: no pin, no rail, five stacked cards with full content (the pinned mode is switched on by a `data-pinned` attribute set only while the media query matches).
- Verified at 1024px: scrolling moved the active project 0 to 4 and released after the last; a rail click jumped to project 3; hash landing on `/#experience` was correct. At 375px: no pin, five cards, no horizontal overflow.
- Elite Expo and TARUMT entries unchanged.

### #6 Tech Stack: settled grid — commit 913aeff
- Owner liked the 3D ring and only wanted the plain grid after it improved. Agent proposed five ideas; the owner chose **1 (dwell), 2 (cards) and 4 (cursor glow)**, not 3 (staggered landing) or 5 (closing line).
- `useTechRing.ts`: pin length is now 260% (`RING_SCROLL` 220 + `DWELL` 40); the ring progress is rescaled by 260/220 so the ring and settle are unchanged, then the finished grid holds for the extra 40% before the pin releases.
- `TechStack.tsx`: each group is a bordered card (`relative isolate p-4`) with a lime count next to the label ("Languages 7"); the AI group has a lime-tinted border. The card chrome and glow layer is a `data-ring-fade` span, so it fades in with the labels once tiles have settled. Cursor glow: `--mx` and `--my` CSS variables set on the card from `onPointerMove` (fine pointer only), driving a radial gradient. `SpotlightCard` was not used because it is v2-styled and re-renders per move. Stage gap 4 and card padding 4 so six cards fit a 768px screen (stage bottom at 743 of 768).
- Verified: card chrome opacity 0 at 30% of the pin, 0.34 at 70%, 1 at 90% and still 1 at 97% (dwell). Mobile after a real reload: no pin spacer, no tile transforms, chrome opacity 1, no overflow. (A first mobile check was wrong because a same-URL navigation did not reload the page.)
- Skipped: making the AI card span two columns (six groups in three columns would leave a gap).

### #7 Services: bento grid — commit 448fdbe
- Owner said the section was boring (four text-only cards in one row, no imagery) and not like the rest of the site. Agent proposed A (alternating rows with a diagram each) and B (bento grid); the owner chose **B: bento grid**. Agent avoided a fourth pinned section, since Atlas, Experience and Tech Stack already pin.
- `Services.tsx`: 3 columns on desktop (web wide `md:col-span-2`, AI tall `lg:row-span-2`, motion and build single; build spans 2 at tablet), 2 on tablet, 1 on mobile. Tilt kept at `max={4}`, the `card-shine` hover light kept.
- New `ServiceArt.tsx`: four hand-coded SVG diagrams (web: browser, API with lock, database with flowing dashed lines; AI: message, draft, score, gate diamond, then send/hold/escalate pills lighting in turn; motion: floating parallax layers and orbit glints; build: a dashed slot that a lime piece drops into). CSS keyframes `svc-*` in `home.css`; strokes use `currentColor` so the tile recolours them on hover. Reduced motion: `animation: none`, static diagrams.
- `src/content/home.ts` cards gained `id` and `tags`. Tags use only CV skills: Next.js, Spring Boot, PostgreSQL, Supabase / LLM APIs, RAG and LLM evaluation, MCP servers / React, Astro, Tailwind CSS / REST APIs, Fastify, Docker. All copy remains marked `// DRAFT`.
- Fix during verification: the orbit group rotated about the wrong origin when `transform-box: view-box` was used; changed to `fill-box` with two symmetric glints. The AI diagram is capped to `max-h-72` below desktop because it was huge at 375px.
- Verified: 4 cards and 4 SVGs, layout as intended at the 1024px preview, no horizontal overflow at 375px.

### #11 Atlas background — commit 220cdc1
- Agent proposed five ideas; the owner chose the **recommended set**: static light pools, blueprint markings, grain and two parallax layers (not the optional cursor light, not zone labels, which would need the owner's wording).
- New `src/components/atlas/AtlasBackdrop.tsx`, rendered inside `.atlas-board` before the items. Two far layers pushed back in 3D: light pools at `translateZ(-180px)` (inset -400px) and dust specks at `translateZ(-420px)` (inset -700px), built from gradients only, no animation (parallax comes from the camera panning under the stage perspective of 1600px). A board-plane SVG with rulers (ticks every 50px, labels every 300px) along the top and left, registration crosshairs on a 600px grid with coordinate labels, and lime corner brackets. CSS in `globals.css`: a coarse 280px violet grid under the dot grid, a stronger board border (`#2a2840`) with an inset glow, a screen-fixed vignette and a tiled feTurbulence grain at 5% opacity inside the stage. Far layers and grain are hidden below 1024px and on coarse pointers.
- Verified: intro, settled and top-left-corner views rendered as intended (brackets, rulers and dust beyond the board edge visible at the corner).
- **Not measured: frame times.** The preview pane was hidden and the browser throttled animation frames, so an A/B scripted-pan measurement timed out. The two far layers are about 4400x3200 and 5000x3800 px; if dragging stutters on real hardware, drop `.atlas-far-dust` first, then `.atlas-far-light`.
- Found while checking: the home page is wider than the viewport (`scrollWidth` 1425 against 1024). Hiding the Atlas, the layers, the markings, the vignette and the grain did not change it; the cause is outside this change (the hero's `.hero-floor` is `-right-1/2`). Pre-existing and not fixed.
- A cold dev load of `/#stack` and `/#services` landed in the wrong place once each (dev compile timing); a normal reload landed correctly. Not investigated further.

### Drag cursor fix (no issue number) — commit 8156816
- Owner: the solid "DRAG" cursor blocked the view of the header ruler and the Atlas content.
- New cursor variant `drag` (type in `cursorStore.ts`, `data-cursor="drag"` handled in `Cursor.tsx`, exported `DRAG_ARROWS = "‹ ›"`): a 44px transparent ring with a lime border and lime arrows; the centre dot is transparent. Used on the header ruler (`Header.tsx`), the Atlas stage and the drag override in `AtlasBoard.tsx`. The solid lime disc remains for the OPEN label on project cards and the polaroid; the lens cursor is unchanged.
- Verified by hovering the Atlas and the ruler in the preview (computed variant `drag`, 44px, lime border); a real drag was not performed.

## Closing and push
- Closed on GitHub with a comment each: #5, #6, #7, #11. With the earlier session, issues #1 to #11 are all closed.
- Wiki commit `0e4fe94` (the previous session's notes) was committed first, as a separate commit, at the owner's request to commit the working tree.
- Pushed `redesign-v3` to origin (`bc610d9..8156816`), six commits: 347c3bd, 0e4fe94, 913aeff, 448fdbe, 220cdc1, 8156816. No pull request was opened; `main` is untouched.

## Left undone / follow-ups
- Atlas frame times unmeasured (see #11); check on a real desktop, including while dragging.
- Not tested: a real reduced-motion preference, tablet widths, real touch, Safari and Firefox, very short laptop screens for the pinned case-file and tech grid; Lighthouse on the Vercel preview.
- Services, Tech Stack and Experience copy is still marked `DRAFT` for the owner's review at the content pass.
- Home page horizontal overflow from the hero floor (pre-existing, see #11).
- No code review (`ponytail-review` or `code-review`) was run on any of these changes.
- Launch (Phase 10, merge `redesign-v3` into `main`) is still pending; the owner was asked whether to open a PR and did not answer.
