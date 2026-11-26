# Portfolio ver 3.0: design and interaction spec

Status: **approved direction (v1 of ver 3.0), 2026-11-26.** This is the build spec for whoever implements the site. Read it together with `docs/v3-implementation-plan.md` (phases, tech, content rules) and `docs/v3-assets-checklist.md` (what the owner still has to supply).

The reference mockups are the source of truth for look and feel. Open them with the local static server (`.claude/launch.json`, config `mockup-static`, port 3070), because they load GSAP and three from `node_modules`:

| Mockup | What it shows |
|---|---|
| `docs/mockups/home.html` | **Main reference.** The full home page, header, menu, cursor, atlas, warp transition, case-study page with X-ray |
| `docs/mockups/atlas-flow.html` | Earlier, atlas-only version of the flow (same warp and X-ray) |
| `docs/mockups/concepts.html` | The six concepts considered; the chosen mix is Atlas + Kinetic Type + X-ray |
| `docs/mockups/signal-hero.html` | First hero exploration (3D knowledge graph); not used, kept for reference |

The mockups are throwaway code. Rebuild the behaviour properly in Next.js; do not copy the mockup code wholesale. Placeholder content in them (fake screenshots, X-ray text, "—" stats) must not ship.

---

## 1. Concept

**"Designed on top, engineered below."** A bold, experimental site that still feels calm and premium, like a high-end studio.

Three signature ideas carry the whole site:

1. **Atlas:** personal projects live on an infinite, draggable 3D board, like a studio desk.
2. **Kinetic warp:** opening a project sends its name flying at the viewer in layers of type until it fills the screen, then the case study appears.
3. **X-ray:** on case-study pages the cursor is a lens that reveals the engineering underneath (wireframes, components, data flow). Pressing **X** turns the whole page to X-ray.

Everything else (cursor tilt, scroll scenes, header, menu) supports these three.

Audience: recruiters and interviewers (must find facts in seconds), plus future freelance and custom-build clients, plus award juries (Awwwards scores design 40%, usability 30%, creativity 20%, content 10%). Usability is not optional: every effect has a fast, accessible path.

## 2. Visual system

**Theme:** dark only.

**Colour tokens** (CSS variables, Tailwind 4 theme):

| Token | Value | Use |
|---|---|---|
| `--bg` | `#07070a` | Page background |
| `--card` | `#0f0f16` | Cards, panels |
| `--ink` | `#ecebf3` | Main text |
| `--mute` | `#8b8a99` | Secondary text, labels |
| `--line` | `#1f1e29` | Hairlines, borders |
| `--violet` | `#8b7bff` | Primary accent: highlights, italic accent words, warp colour |
| `--lime` | `#c6f432` | Secondary accent, used sparingly: AI-related items, live status, X-ray, primary CTA |

Rule: lime marks "AI" or "live" things and the X-ray layer; violet is the brand accent. Check contrast for any text on these colours (WCAG AA).

**Typography** (all free, via `next/font/google`):

| Role | Font | Notes |
|---|---|---|
| Display and body | Inter Tight (300–900) | Headlines at 800–900, tight tracking (about -0.05em) |
| Accent | Instrument Serif (regular and italic) | One accent word per headline, in violet italic ("I design and *build*") |
| Labels and code | JetBrains Mono | Uppercase micro labels, 11px, tracking 0.08em; coordinates, indexes, code |

A custom display face or logo font may replace Inter Tight later (see assets checklist).

**Recurring details:** section index labels (`03 — Personal projects`), coordinate readouts, dotted grid backgrounds, pill tags, 1px borders, 14–18px radii on cards.

## 3. Global elements

### 3.1 Preloader
- Huge counter `000%` → `100%` (bottom left, violet `%`), small mono label top left.
- Then the panel slides up (expo in-out, about 1s) and the hero headline lines rise in from a mask.
- The counter reflects real readiness (fonts and hero assets), finishes as soon as they are ready, and is capped at 1.2s total.
- Show only on the first visit of a session (sessionStorage). Skip it on repeat visits, with reduced motion, and on direct hits to `/projects/*`. Must not delay content for crawlers or users without JS: render the page underneath and overlay the loader client-side.

### 3.2 Header (the "ruler")
Fixed, three zones, transparent with blurred pill backgrounds:
- **Left: logo.** A small square tile with "LKW" and a lime scan line moving down through it. Next to it the text "LKW22 Studio", which scrambles (decode effect) into "Leow Kai Wen" on hover and back on leave. The final logo will replace the tile (assets checklist).
- **Centre: section ruler.** A bar with fine tick marks and one number per home section (01–07). A glowing lime marker moves continuously with scroll progress across sections. The current section name decodes above the marker when the section changes. Clicking a number scrolls to that section. On inner pages the ruler shows the case-study sections instead.
- **Right:** live Kuala Lumpur clock (`HH:MM:SS GMT+8`) with a pulsing lime dot and "Open to work", then a **Menu** button.
- Below 768px: ruler hidden; logo + Menu only.

### 3.3 Menu
- Full-screen overlay that opens as a circle growing from the Menu button (clip-path, about 0.9s).
- Faint lime grid background. Left: huge links (Index, About, Projects, Experience, Stack, Services, Contact) with mono index numbers; links rise in with stagger; on hover the letters skew and turn violet with a small per-letter delay.
- Header status ("Open to work"), the atlas note, the contact line and hero chips read from one flag: `availability: 'open' | 'freelance-only' | 'closed'` in `src/content/site.ts`, with copy per value. The copyright year is computed.
- Right: a short "say hi" line, GitHub, LinkedIn, and "Past versions: v1 · v2".
- Esc closes. Focus is trapped while open and returns to the button on close.

### 3.4 Cursor
- Small lime dot plus a lagging ring.
- Ring grows over links and buttons; over the atlas it becomes a filled lime circle reading **DRAG**, over a project card **OPEN**; on case-study screenshots it becomes the **X-ray lens** (about 260px ring).
- Hidden on touch devices; native cursor restored for text inputs. Never hide the cursor when `prefers-reduced-motion` is on (use the native cursor then).

### 3.5 Magnetic buttons
Primary buttons, pills and the Menu button pull slightly toward the cursor and spring back (elastic ease).

### 3.6 Smooth scroll
Lenis driving GSAP ScrollTrigger (one scroll system for the whole site). Disabled with reduced motion.

### 3.7 Sound (out of scope for v1)
Cut from the first launch (review decision 10). No sound toggle in the header. May return after launch: off by default, subtle UI sounds only, never autoplay.

### 3.8 Easter eggs
- Notes hidden at the far edges of the atlas ("You found the edge of the map").
- A note in the atlas: "press X inside any project".
- **X** key toggles full X-ray on case-study pages that have a bones layer. It is ignored when focus is in an input, textarea, select or contenteditable, when the menu is open, or when a modifier key is held.
- Out of scope until after launch: terminal mode, Konami code.

## 4. Home page (`/`)

One scrolling page. Order and ruler numbers:

| # | Section | Ruler label |
|---|---|---|
| 01 | Hero | Index |
| 02 | About | About |
| 03 | Personal projects (Atlas) | Projects |
| 04 | Experience | Experience |
| 05 | Tech stack | Stack |
| 06 | Services | Services |
| 07 | Contact + footer | Contact |

### 01 Hero
- Full viewport. Bottom-left content: mono eyebrow (lime dot, "Leow Kai Wen", "Full-stack developer", "AI engineer"), three-line headline "I design / and *build* / whole products.", one-sentence intro, button **See projects** (lime, solid; the CV button was dropped on 2026-11-26).
- Background scene: a violet perspective grid floor receding to a horizon with a soft violet glow, and floating tech chips (Claude API, MCP, pgvector in lime; Next.js, Spring Boot, PostgreSQL, TypeScript in neutral) at different depths.
- **Cursor tilt:** the whole scene rotates toward the cursor (about ±10° X, ±14° Y, smoothed); chips shift by depth (parallax).
- **Scroll:** headline lifts and fades; the floor flattens (rotateX 72° → 84°).
- **Build:** this is the one WebGL scene on the home page (React Three Fiber): grid floor shader, chips as HTML or sprites, subtle depth of field. Static image fallback for mobile, low-power devices and reduced motion.

### 02 About
- Statement paragraph in Instrument Serif that lights up word by word as you scroll (scrubbed opacity), one violet italic word ("production").
- Four fact counters that count up on enter. Only facts from the CV: **90%+** messages auto-answered (AI auto-reply platform), **80+** patients on the portal, **30** CoreEx tagged releases (dated), **2025** graduation year.

### 03 Personal projects (Atlas)
- Tall section (about 280vh) with a sticky full-viewport stage.
- **Intro scrubbed by scroll:** the camera starts zoomed in on the title card "Personal *projects*" and pulls back while the board tilts back about 14°; items fade in from the centre outward.
- **Board:** about 3600×2400px, dotted grid. Items: the 5 project cards (thumbnail, name, number, tagline, stack tags with AI tags in lime), plus texture items (quote note, lime "Open to full-time, freelance and custom builds" note, code snippets, a "ver 1.0" polaroid linking to `/v1`, easter-egg notes). Items sit at different Z depths and slight rotations.
- **Interaction:** drag to pan with inertia; the board tilts with drag velocity **and** with cursor position. Zoom with +/− buttons, keyboard +/− when the atlas has focus, and Ctrl+wheel only while the pointer is over the atlas stage (elsewhere native browser zoom is untouched; plain wheel keeps scrolling the page). Recenter button, minimap with viewport frame, coordinate and zoom readout.
- **List view** toggle: a plain, fast list of all projects (number, name, tagline, main tech). Also the default on small screens.
- Clicking a card (click = less than about 6px of movement) runs the warp into that project.
- **Build:** DOM + CSS 3D (crisp text, real links, accessible), not WebGL. Project cards are real `<a href="/projects/[slug]">` links so they work without JS and for crawlers. Keyboard: Tab moves between cards and pans the board to the focused card.
- **Mobile (below 768px):** show list or swipeable cards by default, with an "Explore the map" button that opens the atlas full screen (touch drag only inside that mode, so it never blocks page scroll).

### 04 Experience
- Section title "Where I've *shipped*".
- Vertical timeline: a violet line draws itself with scroll; each node turns lime when reached.
- The auto-reply figure on the About counters is shown without a caption (owner decision), so the AI Auto-Reply Platform tile and the NM Media entry must state that the rate was measured on replayed real conversations. Owner reviews this at Phase 7. No unqualified claim may appear anywhere it can be questioned.
- Entries (from CV v5): Junior Software Developer at NM Media (May–Oct 2026) with four or five project tiles (AI Auto-Reply Platform, Patient Portal, Social Media Platform, Marketing Sites and Blog Admin, WhatsApp Community Scheduler) where key numbers are lime; IT Intern at Elite Expo (Jun–Dec 2025); B.Sc. Software Engineering at TARUMT (2021–2025).
- No client names. Generic project names only.

### 05 Tech stack (new, not in the mockup yet)
- Title idea: "The *stack* I build with".
- Grouped by category (Languages, Frontend, Backend, Data, AI, DevOps and tools), content from CV v5 "Technical Skills".
- Interaction: tiles enter with a scramble-decode of their label; [REMOVED 2026-11-26: the hover "Used in" feature was dropped; tiles are plain labels] hovering a tech highlights which projects use it ("Used in: CoreEx, Patient Portal") and can deep-link to the atlas card.
- **Decided:** build the 3D ring for desktop: tiles on a slowly rotating 3D ring or cylinder scrubbed by scroll while the section is pinned, flattening into the grid at the end. Below 1024px, on touch and with reduced motion, show the plain grid. Ring and grid use the same data; tiles are real focusable elements in DOM order; "Used in: ..." works on tap and keyboard focus. The owner judges the ring at the Phase 2 checkpoint and may swap it for the grid; the agent reports fps, CLS and Lighthouse numbers there to support that call.
- No percentage bars or skill levels.

### 06 Services
- Title "What I can *build* for you". Four cards: Web apps and SaaS; AI features and automation; Sites with motion; Custom builds.
- Cards tilt in 3D toward the cursor with a moving violet light; their big index number turns violet on hover; content layers sit at different Z depths.

### 07 Contact and footer
- Huge headline "Let's build / something *great.*" rising from masks.
- Left: email as a big link (decode effect on hover), GitHub and LinkedIn pills (no CV, 2026-11-26), location and reply-time line.
- Right: form (Resend server action, see plan). Fields: reason chips (A full-time role, Freelance, A custom build, Just saying hi), name, email, message, Send. Success and error states inline and announced via `aria-live`.
- Spam protection: hidden honeypot, a minimum time-to-submit check, and a rate limit of 3 submissions per hour (6 per day) per visitor, hashed IP. It uses Upstash Redis when both Upstash variables are set; otherwise a best-effort in-memory limiter per server instance. Env vars live in Vercel and `.env.local` only; only `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are required. If `lkw22studio.com` is not verified in Resend by Phase 8, send from Resend's test sender to the owner's address; the visible `mailto:` link stays. Destination email and reply-time line (draft: "I reply within 2 working days") come from one content file.
- Footer: giant "LKW22" wordmark (gradient fill) rising with scroll; copyright, "Past versions: v1 · v2", "Built with Next.js, GSAP and Three.js", back to top.
- No phone number anywhere.

## 5. Project case-study page (`/projects/[slug]`)

Real routes (SEO, shareable links). Opened from the atlas, the list view, or the "Next project" link.

### 5.1 Kinetic warp transition
- Built as DOM/CSS layers, not a canvas (keeps "one WebGL canvas on home" true). Runs only for in-site clicks; direct links load normally. Browser Back/Forward, any key press or a second click fast-forwards to the destination. Navigation starts at the warp midpoint so total time stays about 1.2s; a slow route waits behind the violet flood. If the tab is hidden mid-warp, complete immediately.
- On click: the project name (uppercase, Inter Tight 900) appears as about 16 layers receding into depth; layers rush toward the viewer with accelerating ease (about 1.2s); outline layers in white, every fourth filled violet; the last part floods the screen violet with the name in dark ink scaling up.
- Then navigate to the route; the overlay fades out and the title letters rise in.
- Back to projects: the same warp in reverse, returning to the atlas at the same camera position.
- Build as a client transition layer around navigation (canvas or WebGL overlay). Reduced motion: a simple crossfade.

### 5.2 Page layout
1. Sticky top bar (blend mode difference): "← Back to projects", `01 / 05 — CoreEx`, "X-ray [X]" toggle.
2. Hero: case-study label (year hidden since 2026-11-26), giant title (letters rise in), meta row (Role, What, Stack, Links).
3. Main screenshot on a 3D plate that starts tilted back (about 38° rotateX, scale 0.82) and flattens as you scroll.
4. Stats row with counters (real numbers only; CoreEx: 49 MCP tools, 30 tagged releases as of November 2026, 14 ADRs).
5. Story sections (problem, approach, decisions, outcome) with word-by-word reveal on the key sentences.
6. Pinned horizontal gallery of screenshots scrubbed by vertical scroll.
7. Architecture diagram whose connection lines draw on scroll (CoreEx: Browser → Next.js → Spring Boot API → Postgres + pgvector; MCP server; Claude API; AI links in lime).
8. "Next project" block: huge name, hover violet, warps into the next project.

### 5.3 X-ray
- Every screenshot or diagram marked as X-ray-capable has two layers: the real image on top, and a "bones" layer below: a lime grid, dashed boxes around UI regions labelled with component names, and short mono notes (data flow, queries, security rules).
- The cursor lens (circle, about 130px radius) reveals the bones layer through a clip-path that follows the cursor.
- **X** key or the top-bar toggle opens the bones layer over everything with a circle wipe; press again to close. The toggle exposes `aria-pressed`.
- **Scope for v1:** CoreEx and AsteroidUI get the lens and toggle on the hero plus two or three more screens each. Moonwave, Brickly and PetCare get simple section and technique annotations on one hero screenshot, or none; where a page has no bones layer the toggle is hidden and the X key does nothing.
- **Touch:** the top-bar "X-ray" button switches the screenshot to a fixed-radius lens that follows a finger drag on the screenshot only; the page scrolls normally elsewhere. A second tap turns it off.
- The bones content must be real and accurate for each project (owner supplies or approves; see assets checklist). Keyboard and screen-reader users get the same information as plain text (for example a "Show the engineering notes" disclosure).

## 6. Motion rules

- Easing: `expo.out` for reveals, `power2.in` for the warp, elastic only for magnetic spring-back.
- Durations: reveals 0.9–1.3s with 0.05–0.12s stagger; hover 0.25–0.45s.
- Nothing is hidden by default in HTML: content is visible without JS, and animations start from a JS-applied state.
- **`prefers-reduced-motion`:** no preloader counter, no warp (crossfade), no tilt, no parallax, no scrubbed 3D, static hero image, native cursor, Lenis off.
- Animation logic lives in a few shared hooks and components (reveal, split text, counter, magnetic, tilt, scramble), not copied per section.

## 7. Performance and accessibility targets

- **Desktop and laptop: effects win.** The full experience always ships on desktop and laptop (WebGL hero, atlas, warp, X-ray, scroll scenes). Desktop Lighthouse scores and LCP/CLS are tracked, but they are not a gate and never a reason to cut an effect. Fix slowness by optimising (lazy-loading, preloading, smaller assets, fewer draw calls), not by removing effects. Animations must still run smoothly (see "How we verify" below).
- **Phones: speed wins.** Lighthouse mobile on `/`: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 100; LCP under 2.5s and CLS under 0.1. Phones and low-power devices get the static hero and the grid and list fallbacks. Any effect that breaks these limits on mobile degrades or is cut there only.
- One WebGL canvas on the home page (hero), lazy-loaded, paused when off screen or the tab is hidden, device pixel ratio capped at 2.
- Atlas renders only while its section is in view.
- All interactive items reachable by keyboard with visible focus; menu focus trap; skip link; landmarks; alt text on all screenshots.
- Responsive checks at 375, 768, 1280 and 1920px.
- **How we verify (pending owner confirmation, review decision 12):** reference device is the owner's laptop in Chrome with a 4x CPU slowdown trace for the warp and atlas drag (95% of frames under 20ms); Lighthouse mobile runs on the Vercel preview URL; Safari and Firefox get a smoke check only.

### 7.1 States
- Styled 404 and error pages in the dark system, with links home and to `/projects`. An unknown project slug calls `notFound()`.
- A missing screenshot shows a dotted-grid placeholder card (never a broken image) and fails the production build.
- JS off: all content is visible, the atlas shows as the list, and the contact form falls back to a plain POST or the visible `mailto:` link.
- Form success and error messages are inline and announced via `aria-live`.

## 8. Open design items (decide during the build)

- Copy (hero intro, About statement, Services cards, tech grouping, reply line): the agent drafts in `src/content/*.ts`, each string marked `DRAFT`; the production build fails while any marker remains; the owner reviews all copy in one pass at Phase 7.
- Final logo and whether to use a custom display font.
- Still undecided: mobile "Explore the map" close control and minimap; atlas keyboard model for non-project items (suggest decorative and `aria-hidden`, only the five cards in tab order); ruler and menu contents on inner pages; whether the stats row is dropped for the three web-design projects. See `docs/v3-design-spec-review.md`.
