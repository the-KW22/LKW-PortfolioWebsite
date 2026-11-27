---
type: decision
updated: 2026-11-27
sources: [raw/sessions/2026-11-27-ver3-redesign-build.md, raw/sessions/2026-11-27-hero-scene-rebuild.md]
---
# Ver 3.0 owner decisions

Decisions made by the owner while designing and reviewing [[ver3-redesign]].

## Positioning and content
- Headline "Full-Stack Developer | AI Engineer". Five projects only ([[projects-showcase]]). No CGPA or language levels, no phone number on the site, employer NM Media named with generic project names and no client names.
- **No CV download and no `/resume`** (decided 2026-11-26): CV v5 contains a phone number.
- **No years** shown on projects. **No LinkedIn** button (none exists). **No reply-time line.**
- **AI-agent method** (directing coding agents while owning architecture, review, tests and deployment) is stated **only in About**; project pages use neutral wording such as "Product decisions, architecture, review, tests and releases".
- CoreEx is shown publicly with its GitHub and invite-only demo links. Moonwave, Brickly and PetCare are design exercises with sample content (not client work); their three public repo links stay. AsteroidUI links to its live site.
- CoreEx stats: **49 MCP tools, 30 tagged releases (dated "as of November 2026"), 14 ADRs**, verified from the repo; CV v5 (44 / 24 / 13) is stale.
- Tech stack keeps all tools but has no "used in" hover.
- The About paragraph's unlit words start at about 30 percent opacity (was 13 percent) for contrast.

## Design and performance
- Dark only; violet and lime; Atlas + kinetic warp + X-ray concept. Sound, terminal mode and Konami code cut from v1; no testimonials, blog or awards.
- Performance: effects win on desktop and laptop; speed wins on phones.
- Experimental `globalNotFound` was accepted to style the 404 with two root layouts.

## Hero (2026-11-27)
- Chosen direction: **"Dust → Blueprint → Build"** (D+A), without the "LKW" stage. Dust streams into the product blueprint, lines draw on, surfaces build, and the cursor X-ray lens reveals the wireframe with lime data packets. Scroll scatters it toward the Atlas. Other directions are kept only in the hero lab ([[2026-11-27-hero-scene-rebuild]]).
- **Preloader removed** (the first-visit 0 → 100 counter), so the dust gathering is the first thing visitors see.
- Tech chips are a row under the intro. Floating CSS chips were removed everywhere.
- No grid floor in WebGL mode. The CSS fallback hero (grid floor and glow) is kept.

## Contact
Form needs only two env vars ([[contact-form]]); a rate-limit service is optional.

## Not yet decided
Placeholders do not fail the production build; they are listed by `npm run check:launch` instead (decide before launch). See [[open-follow-ups]] for the issues the owner raised on 2026-11-27.
