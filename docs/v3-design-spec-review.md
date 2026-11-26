# Portfolio ver 3.0: design spec review (owner interview)

Date: 2026-11-26. Reviewed: `docs/v3-design-spec.md`, with `docs/v3-implementation-plan.md` and `docs/v3-assets-checklist.md` for context. Format: each question, the owner's (Kai Wen's) answer, and the change it implies to the spec. "Spec change" lists are written as instructions for editing the spec. All decisions below have been applied to the spec.

## Summary of decisions

| # | Topic | Decision |
|---|---|---|
| 1 | Performance vs effects | Effects win on desktop and laptop; speed wins on phones |
| 2 | Warp rules | DOM/CSS layers, hard cap, always skippable |
| 3 | Preloader | Real progress, max 1.2s, first visit only |
| 4 | About stats | Kept as specced (no captions); see risk note |
| 5 | X-ray scope | Deep X-ray on CoreEx and AsteroidUI only |
| 6 | X-ray on touch | Toggle button plus draggable lens |
| 7 | Input conflicts | Scoped shortcuts |
| 8 | Tech ring | Build for desktop, judged by the owner |
| 9 | Contact infra | Honeypot, min-fill-time, rate limit (Upstash optional; in-memory fallback, see decision 9 note) |
| 10 | Scope cuts | Sound, terminal mode, Konami cut from v1 |
| 11 | Copy ownership | Agent drafts, owner approves in one pass |
| 12 | Test device | Left to the agent (see risk note) |
| 13 | Missing states | Minimal set specified now |
| 14 | Stale claims | One availability flag in content |

---

## 1. Performance versus effects

**Q:** Spec §7 makes Lighthouse mobile Performance 90+ a hard target, but the home page has a WebGL hero, pinned 3D scenes, Lenis, a preloader and a live clock. If they conflict, which wins?

**A:** Budget wins; effects degrade. (Recommended option.) **Revised by the owner afterwards (2026-11-26):** effects win on desktop and laptop; speed wins only on phones.

**Spec change (§7):**
- Desktop and laptop: the full effects always ship. Lighthouse desktop and LCP/CLS are tracked but are not a gate; slowness is fixed by optimising, not by cutting effects. Animations must still run smoothly.
- Phones and low-power devices: Lighthouse mobile Performance 90+, LCP under 2.5s and CLS under 0.1 are enforced. They get the static hero image and the grid and list fallbacks, and any effect that breaks these limits is degraded or cut on mobile only.

## 2. Warp rules

**Q:** The warp takes about 1.2s plus navigation. The spec doesn't cover direct links, Back/Forward, slow routes, repeat clicks, or tab switches. It also says "canvas or WebGL overlay" while §7 allows only one WebGL canvas.

**A:** DOM/CSS layers, hard cap, always skippable. (Recommended option.)

**Spec change (§5.1, §7):**
- Build the 16 type layers as DOM/CSS, not a canvas. This keeps the "one WebGL canvas on home" rule true.
- The warp runs only for in-site clicks. Direct links to `/projects/[slug]` load normally.
- Browser Back/Forward, any key press, or a second click fast-forwards straight to the destination.
- Navigation starts at the warp midpoint so total time stays about 1.2s. If the route is slow, the page waits behind the violet flood.
- If the tab is hidden mid-warp, complete immediately.
- Reduced motion keeps the simple crossfade.

## 3. Preloader

**Q:** Keep the fake 000→100% counter (about 2s)?

**A:** Real progress, max 1.2s, first visit only. (Recommended option.)

**Spec change (§3.1):**
- The counter reflects actual readiness (fonts and hero assets), finishes as soon as they are ready, and is capped at 1.2s (replaces "about 2s").
- Skip it on repeat visits in the same session, with reduced motion, and on direct hits to `/projects/*`.
- Content stays in the DOM underneath from the start.

## 4. About stats

**Q:** The four counters mix employer work, a personal project and a graduation year, and "90%+" was measured on replayed real conversations. How should they be shown? The owner was then challenged to accept at least a caption on the 90% figure.

**A:** Keep as specced, no caption, "accept the risk".

**Spec change:** None to §4 02 About. The row stays as written (four counters, short labels).

**Risk note for the agent and owner:** `docs/v3-implementation-plan.md` §2 flag 4 and §5 require honest, qualified claims. Because the counter carries no caveat, the NM Media experience entry and the AI Auto-Reply Platform tile must state the "replayed conversations" basis in their own text, so the number is never shown unqualified anywhere it can be questioned. Add this as a rule to spec §4 04 Experience and to the Phase 7 owner review.

## 5. X-ray scope

**Q:** X-ray needs accurate, owner-approved "bones" for every marked screenshot. Moonwave, Brickly and PetCare have thin engineering content. What is the v1 scope?

**A:** Deep X-ray on CoreEx and AsteroidUI only. (Recommended option.)

**Spec change (§5.3, assets checklist §4):**
- CoreEx and AsteroidUI get the lens and the X toggle on the hero plus two or three more screens each.
- Moonwave, Brickly and PetCare get simple section and technique annotations on one hero screenshot, or none. Where a page has no bones layer, the top-bar X-ray toggle is hidden and the X key does nothing.
- Remove the X-ray notes line from the Moonwave, Brickly and PetCare items in the assets checklist, or mark it optional.

## 6. X-ray on touch

**Q:** The lens follows a cursor that doesn't exist on touch devices. How does X-ray work there?

**A:** Toggle button plus drag the lens. (Recommended option.)

**Spec change (§3.4, §5.3):**
- On touch, the top-bar "X-ray" button switches the screenshot to a fixed-radius lens that follows a finger drag on the screenshot only. The page scrolls normally everywhere else. A second tap on the button turns it off.
- The plain-text "Show the engineering notes" disclosure is always available on every device.

## 7. Input conflicts

**Q:** Ctrl+wheel zoom hijacks browser zoom, and the X key fires while typing or with the menu open.

**A:** Scoped shortcuts. (Recommended option.)

**Spec change (§4 03, §3.8, §5.3):**
- Ctrl+wheel zooms the atlas only while the pointer is over the atlas stage. Elsewhere, native browser zoom is untouched. The +/− buttons stay, and keyboard +/− works when the atlas has focus.
- The X key is ignored when focus is in an input, textarea, select or contenteditable, when the menu is open, or when any modifier key is held.
- The X-ray toggle exposes `aria-pressed`.

## 8. Tech stack ring

**Q:** The 3D ring is "recommended" in §5 but "decide after a prototype" in §8, and it adds a second pinned scene next to the atlas. What gets built, and what is the cut rule?

**A:** Build the ring for desktop. The cut rule is "judged by eye by you" (the owner), not a measured gate.

**Spec change (§4 05, §8):**
- Resolve §8: the ring is built for desktop. The grid is the fallback below 1024px, on touch, and with reduced motion.
- The owner reviews the ring at the Phase 2 checkpoint and decides whether it stays or is replaced by the grid.
- Required either way: the tile data model is the same for ring and grid, tiles are real focusable elements in DOM order, and the "Used in: ..." highlight works with tap and keyboard focus.

**Risk note:** The suggested measured gate (55+ fps on the reference device, no added CLS, desktop Lighthouse within 3 points of grid-only) was declined. The agent should still report those numbers at the checkpoint so the owner's judgment has data behind it.

## 9. Contact form infrastructure

**Q:** The "simple rate limit" does nothing on stateless Vercel functions, and Resend only mails the owner until a domain is verified. Destination email and reply-time line are still blank.

**A:** Honeypot, minimum fill time, and an Upstash Redis rate limit. (Recommended option.)

**Spec change (§4 07, plan Phase 8, assets checklist §2 and §6):**
- Hidden honeypot field, a time-to-submit check, and a rate limit of 3 submissions per hour per IP using Upstash Redis (free tier; env vars set in Vercel and `.env.local` only).
- If `lkw22studio.com` is not verified in Resend by Phase 8, mail goes from Resend's test sender to the owner's own address, and the visible `mailto:` link stays.
- Destination email and the reply-time line (draft: "I reply within 2 working days") live in one content file. The owner still needs to supply both (assets checklist §2).
- Add the Upstash account and keys to the assets checklist §6.
- **Owner update (Phase 8):** Upstash is now optional. The form needs only `RESEND_API_KEY` and `CONTACT_TO_EMAIL`. Without Upstash a best-effort in-memory limiter (3/hour and 6/day per visitor, 40/day sitewide, per server instance, reset on cold start) is used; setting both Upstash variables switches to the shared limit. The sender defaults to Resend's test sender, so `CONTACT_TO_EMAIL` must be the Resend account's own address until a domain is verified. This overrides the Upstash requirement above.

## 10. Scope cuts

**Q:** Which polish items are required for the first launch?

**A:** Cut sound, terminal mode and Konami from v1. (Recommended option.)

**Spec change (§3.7, §3.8, §8, plan Phase 9):**
- Sound (§3.7), the terminal mode and the Konami code are out of scope until after launch. There is no sound toggle in the header.
- Launch includes: minimap, scramble-decode, magnetic buttons, the X-key easter egg and the edge-of-map notes.
- Remove "Whether sound ships in v1" from §8, and the sound assets item from the checklist (§6) or move it to "Later".

## 11. Copy ownership

**Q:** Who owns the copy that is still draft (hero intro, About statement, Services, tech grouping, reply line)?

**A:** The agent drafts, the owner approves in one pass. (Recommended option.)

**Spec change (§8, plan Phase 7):**
- All copy lives in `src/content/*.ts`. Each draft string carries a `DRAFT` marker.
- A build-time check fails the production build if any `DRAFT` marker remains.
- The owner reviews all copy together at the Phase 7 checkpoint, in their own voice.

## 12. Test device and pass rules

**Q:** "Smooth at 60 fps on a mid laptop" and the four viewport checks have no reference hardware or pass rule. What should they be?

**A:** Leave it to the agent.

**Spec change (§7):** Add a short "How we verify" paragraph so the agent has something concrete: reference device is the owner's laptop in Chrome with a 4x CPU slowdown trace for the warp and atlas drag; Lighthouse mobile runs against the Vercel preview URL; Safari and Firefox get a smoke check only.

**Risk note:** This was the owner's call to leave open. The suggested rule above is the reviewer's recommendation, not an owner decision. It needs the owner's confirmation before it goes into the spec, because "leave to the agent" makes Phase 5's "smooth at 60 fps" untestable.

## 13. Missing states

**Q:** The spec has no loading, error, empty or not-found states. What is the rule?

**A:** Specify a minimal set now. (Recommended option.)

**Spec change (new §7.1 "States"):**
- Styled 404 and error pages in the dark system, with links home and to `/projects`.
- An unknown project slug calls `notFound()`.
- A missing screenshot shows a dotted-grid placeholder card (never a broken image) and fails the production build.
- JS off: all content is visible, the atlas shows as the list, and the contact form falls back to a plain POST or to the visible `mailto:` link.
- Form success and error messages appear inline and are announced through `aria-live`.

## 14. Stale, time-sensitive claims

**Q:** "Open to work", the atlas "open to..." note and similar claims go stale when the owner gets a job. What controls them?

**A:** One content flag. (Recommended option.)

**Spec change (§3.2, §4, plan §5):**
- `src/content/site.ts` holds `availability: 'open' | 'freelance-only' | 'closed'` plus the copy for each value.
- The header status, the atlas note, the contact line and the hero chips read from it. The copyright year is computed.

---

## Still open (not yet decided in the interview)

- Mobile atlas "Explore the map": exact close control, and whether the minimap shows in that mode.
- Atlas keyboard model for the non-project board items (suggested: they are decorative and `aria-hidden`, and only the five project cards are in the tab order).
- Header ruler and menu contents on inner pages (case-study sections vs home sections).
- Web-design case studies (Moonwave, Brickly, PetCare): whether the stats row is removed (assets checklist already allows this).
- Asset blockers still on the owner: logo, CoreEx screenshots and X-ray notes, contact email, Resend and Upstash accounts.
