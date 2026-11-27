---
type: decision
updated: 2026-11-27
sources: [raw/sessions/2026-11-27-ver3-redesign-build.md, raw/sessions/2026-11-27-hero-scene-rebuild.md, raw/sessions/2026-11-27-issues-2-to-10.md, raw/sessions/2026-11-27-issues-5-6-7-11-redesign.md]
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

## Issue defaults (2026-11-27)
Defaults the main agent picked where the issue left details open; the owner accepted them by proceeding ([[2026-11-27-issues-2-to-10]]).
- Ruler (#2): live scrub with no snapping.
- Atlas scroll cue (#4): bottom-centre, bobbing lime arrow. Hidden during the zoom-out intro, fades in after it and out at about 90% of the pin. Not shown in the phone map, list view or below 1024px. No bob with reduced motion. The owner was told it is subtle; not changed.

## Section rebuild choices (2026-11-27, later session)
Each option was proposed and the owner picked one ([[2026-11-27-issues-5-6-7-11-redesign]]).
- **#5 Experience:** pinned case-file (B), not expandable cards.
- **#6 Tech Stack:** keep the ring; add the held grid, group cards and cursor glow (ideas 1, 2, 4). Not chosen: staggered per-group landing, a closing line under the grid.
- **#7 Services:** bento grid (B), not alternating rows. Reason given: four text-only cards in one row looked too ordinary for the site. A fourth pinned section was avoided on purpose.
- **#11 Atlas background:** light, blueprint markings, grain and parallax layers. Not chosen: a cursor-following light. Zone labels need the owner's wording and are not added.
- **Drag cursor:** hollow ring instead of the solid DRAG disc, because it hid the ruler and board content.
- Services, Tech Stack and Experience copy stays marked `DRAFT` for the Phase 7 content pass.

## Contact
Form needs only two env vars ([[contact-form]]); a rate-limit service is optional.

## History
- 2026-11-27: "#5, #6 and #7 skipped for now, #11 not started" is out of date; all four were done in a later session (see above).

## Not yet decided
Placeholders do not fail the production build; they are listed by `npm run check:launch` instead (decide before launch). See [[open-follow-ups]] for the issues the owner raised on 2026-11-27.
