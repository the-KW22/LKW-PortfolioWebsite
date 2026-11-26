# Design reference analysis

Written 2026-11-25 from the 7 reference screenshots you supplied. Purpose: turn them into design decisions for ver 3.0. These are my own observations; nothing here is copied from the references.

Your stated interests: **scroll-triggered animation, 3D effects (if possible), advanced component animation.**

---

## 1. The seven references

| # | Reference | Mode and palette | Type | Layout and signature moves |
|---|---|---|---|---|
| 1 | **Studio / 01** (character animation studio) | Light grey-green ground, near-black, peach and cyan blocks, magenta accents | Ultra-bold condensed caps headlines, tiny spaced caps labels, handwritten annotations | Giant headline beside an oversized character that overlaps the next band; full-width **ticker band** (cyan); **colour-blocked sections** (cream, black, peach, light); numbered "Selected work" 01/02/03; technical annotation marks (crosshairs, barcode, corner ticks) |
| 2 | **CodeNova** (developer template) | Near-black with **lime** accent | Very large heavy sans, "first word white, second word lime" | Portrait hero with floating tech-icon chips; about block with stat cards; **skill bars**; services grid; portfolio grid; resume/history; testimonials; pricing; blog; contact form |
| 3 | **Portfolio** (editorial, UI/UX designer) | Black and deep burgundy, champagne type | Huge high-contrast **serif** headline cropped behind the portrait, script signature | Photo overlaps giant type; thin-bordered panel grid; 3 selected projects with browser mockups; numbered process; tools grid; quotes |
| 4 | **Nova Studio** (agency) | Warm cream, black, peach/tan accent | Friendly rounded sans | Rounded pill "chips", soft cards, a **pill-shaped dark stats bar**, **wavy section dividers** between light and dark sections, carousel arrows, form embedded in the contact band |
| 5 | **Chompkit** (collectible figures shop) | Black, **lime**, orange, cream paper | Graffiti/brush display type | Torn-paper edges, sticker-style cards, loud illustration; far from a developer context |
| 6 | **Dikshant** (2D animator) | Near-black, **purple** with lime and orange | Hand-drawn lettering | Character illustration, showreel video panel, doodles and scribbles; playful |
| 7 | **Abdullah Tariq** (software dev / AI engineer) | Off-white, black, **lime-green** accent | Bold grotesque, headline with one green word | Portrait hero with a large soft green circle; role line of four titles; 3-number stat row; "trusted by" logo strip; four expertise cards; 3 project cards with tags; one **featured case study** with metric trio; **tech-stack tile grid**; capability bars; horizontal **journey timeline**; contact band |

## 2. What the references have in common

1. **A big, confident type-led hero.** Name or one-line pitch at 5 to 10 rem, one word set in the accent colour or outlined. (1, 2, 3, 7)
2. **Lime or green accent on dark or light.** It appears in 4 of 7 (2, 5, 6, 7). You currently use flame orange. This is a real choice to make (see section 5).
3. **Two buttons in the hero:** a solid primary ("View my work") and a ghost secondary ("Download CV"). (2, 3, 7)
4. **Numbered sections and projects** (01, 02, 03) and small spaced-caps eyebrow labels. (1, 3, 7)
5. **Selected work as 3 large cards** with category tags, plus "view all". (1, 3, 4, 6, 7)
6. **Structured sections in a repeated order:** hero, stats, selected work, skills/tools, process or experience, contact band, footer.
7. **Colour-blocked bands** or alternating section backgrounds so the long page has rhythm. (1, 4)
8. **A ticker/marquee band** of keywords. (1)
9. **Rounded containers with 1px borders and pill tags.** (3, 4, 7)
10. **Tech stack shown as an icon-tile grid.** (2, 7)
11. **A closing "Let's build something" band** with large type, email, and a button. (1, 2, 3, 4, 6, 7)

## 3. What fits you, and what does not

### Take
- **From 7 (Abdullah Tariq):** the closest match to your role (full-stack plus AI). Take the structure: role line, expertise cards, 3 project cards, **one featured case study with a metric trio** (use CoreEx), tech-stack tiles, journey timeline, closing band with Download CV.
- **From 2 (CodeNova):** the dark and lime energy, the "two-tone name" headline, floating tech-icon chips around the hero.
- **From 1 (Studio / 01):** the **ticker band**, **colour-blocked sections**, numbered selected work, tiny technical annotations (crosshairs, ticks, coordinates). These suit an engineer and are cheap to build.
- **From 4:** the **wavy divider** between light and dark bands, and the dark pill stats bar.
- **From 3:** the **oversized type cropped behind a portrait** if you want to use a photo; a numbered "how I work" process.

### Leave
- **Fabricated social proof.** Several references show fake stats ("100+ clients", "98% satisfaction", "5 star reviews"), testimonials, client logos ("Trusted by Google, Meta, Microsoft") and pricing tiers. Do not copy these. They would be untrue for you, and interviewers spot them. Our stat row will use only facts you can defend: for example 44 MCP tools, 24 releases, 13 ADRs for CoreEx.
- **Skill percentage bars** (2, 7). They are meaningless to engineers ("TypeScript 85%"). Use a grouped tech-stack grid instead.
- **Pricing, blog, "services for clients"** sections. You are job hunting, not selling services.
- **5 and 6 (illustration-heavy toy and animator sites).** They need custom character art, which we don't have, and they signal "illustrator", not "engineer". The only things worth borrowing are their energy: sticker-like cards and playful micro-details, used sparingly.

## 4. Your three motion goals, mapped to concrete ideas

The installed `gsap` (3.14) already includes **ScrollTrigger, SplitText, ScrambleText, DrawSVG, Flip, Observer, MorphSVG and ScrollSmoother**, so these ideas need no new paid library. `lenis` (smooth scroll), `motion`, `three`, `@react-three/fiber` and `@react-three/postprocessing` are installed too.

### A. Scroll-triggered animation
1. **Hero text reveal:** SplitText splits the headline into lines or characters that rise from a mask; the accent word wipes in.
2. **Pinned "selected work" section:** the 3 featured projects stack as sticky cards; as you scroll, each card scales and fades back while the next slides over it.
3. **Horizontal scroll gallery** inside a case study: a pinned section scrubbing screenshots sideways.
4. **Scrubbed counters** in the stat row (numbers count up as the row enters).
5. **Parallax and clip-path image reveals** on project covers; screenshots unmask on scroll.
6. **Timeline that draws itself** (DrawSVG line plus nodes lighting up) for the experience journey.
7. **Velocity-linked marquee:** the keyword ticker speeds up and reverses with scroll speed (Lenis velocity).
8. **Section colour transitions:** background shifts between dark and light bands as sections cross a scroll point.
9. **Scroll progress indicator** and section index (01 / 05) in the nav.

### B. 3D effects (choose one hero feature plus a few cheap ones)
1. **Hero 3D scene** (React Three Fiber): for example a procedural object (glass or wireframe shape, or orbiting tech-stack icons on 3D rings) that reacts to the cursor and to scroll. Procedural means no model file is needed. A custom GLB model (a laptop or device) is possible if you have or want one.
2. **3D device mockup** in case studies: a laptop or phone whose screen texture is the project screenshot, rotating as you scroll. Good fit for CoreEx and the web designs.
3. **CSS 3D tilt cards** (project cards and stat tiles tilt toward the cursor with a moving highlight). Very cheap and works everywhere.
4. **Floating tech chips** (like reference 2) as CSS 3D layers with parallax depth.
5. **Rules for 3D** so it helps instead of hurting: load it lazily (dynamic import), render only when visible, cap device pixel ratio, pause when the tab is hidden, and show a static image on phones, low-power devices and `prefers-reduced-motion`. One 3D scene on the home page; others stay CSS.

### C. Advanced component animation
1. **Magnetic buttons** (pull toward the cursor).
2. **Text scramble / decode** on hover for nav links and labels (ScrambleText), suits the developer feel.
3. **Spotlight and border-glow cards** (we already have SpotlightCard and BorderGlow in `/v2`; rebuild cleaner).
4. **Shared-layout transitions:** project card to case-study page (Flip or View Transitions) so the cover image morphs into the page header.
5. **Command palette (Ctrl+K)** to jump between pages and projects. A nice detail for a developer audience.
6. **Animated architecture diagram** for CoreEx: SVG lines draw between boxes (browser, Next.js, Spring Boot API, Postgres, MCP, Claude API) as you scroll, matching your README diagram.
7. **Tabbed stack explorer:** a tab bar with animated pill and content crossfade (motion `layoutId`).
8. **Animated stat counters, marquee, and a custom cursor** (small, optional).
9. **Page transitions:** a short overlay or wipe between routes, respecting reduced motion.

## 5. Suggested visual directions (pick one, or mix)

**A. "Signal" — dark and lime (recommended).** Near-black ground, lime accent, heavy grotesque headline with one accent word, ticker band, numbered projects, tech-stack tiles. Closest to references 2 and 7 and the most natural stage for 3D and glow effects.

**B. "Studio" — light colour-block.** Warm light-grey ground, near-black type, colour-blocked bands (black, cream, one accent), condensed bold caps headings, technical annotation marks, wavy or hard-edged dividers. Closest to references 1 and 4. More editorial and distinctive; 3D reads well on the light ground as a soft object.

**C. "Light tech" — clean white and lime.** Closest to reference 7. The safest and most recruiter-friendly, but the least distinctive.

My pick is **A for the home page with B-style colour blocks on a few bands** (one light "About" band keeps the page from feeling uniformly dark), with the lime accent. Light and dark theme toggle can be added afterwards because tokens are variables.

## 6. Performance and quality guardrails

- 3D and scroll effects must not hurt Lighthouse: target **Performance 90+ and Accessibility 95+** on mobile for the home page.
- **One scroll system:** Lenis smooth scroll driving GSAP ScrollTrigger (already how `/v2` works), not several competing libraries.
- All motion respects `prefers-reduced-motion`; content must be readable and usable with animations off.
- No content hidden until JavaScript animates it in (the current `/v2` sections start invisible via `gsap.set`, which flashes or breaks without JS; the new approach reveals with CSS classes that default to visible).
- Keep the animation code in a few reusable hooks and components, not copy-pasted per section.
- `three` is pinned at 0.168 while `@types/three` is 0.183; align them when we touch 3D.

## 7. Questions to settle before design starts

1. **Direction:** A, B, C, or a mix?
2. **Accent colour:** lime (what most of your references use) or keep your current flame orange? I'd go lime.
3. **Portrait photo:** do you want a photo in the hero (references 2, 3, 4, 7 all use one)? If yes, I'll leave a designed slot and you provide it; if not, the hero stays type and 3D only.
4. **3D scope:** is a procedural hero scene plus 3D device mockups enough, or do you have or want a specific 3D model?
5. **Theme:** dark only, or dark and light toggle?
6. **How bold:** reference 1 and 7 are both rich in sections; do you want a long, immersive home page, or a tighter one with details on inner pages?
