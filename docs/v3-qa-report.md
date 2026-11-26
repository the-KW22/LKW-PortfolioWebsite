# ver 3.0 Phase 9: Polish and QA report

Branch `claude/v3-phase-9-polish-42074c`, tested on a production build (`next build` + `next start`) with Chromium 156 driven by Playwright. Nothing was pushed or merged. Phase 10 (launch) was not started.

How to re-run every check (needs a running production server, for example `npm run build && npx next start -p 3947`):

```powershell
$env:BASE_URL = "http://localhost:3947"
npm run qa:flows      # status codes, robots, sitemap, JSON-LD, 404, contact form, phone atlas dialog
npm run qa:keyboard   # Tab order, focus styles, menu dialog, X-ray key, preloader skip
$env:REDUCED = "1"; npm run qa:axe   # axe on settled (reduced-motion) pages; leave REDUCED unset for animated state
npm run qa:layout     # overflow at 375/768/1280/1920, reduced-motion state, JS weight
node scripts/qa/archives.mjs   # /v1 and /v2 load, no errors, noindex
npm run check:launch  # the launch gate (exits 1 while anything remains)
```

## 1. What was built

| Area | Result |
|---|---|
| Metadata | `src/lib/seo.ts` builds one complete `metadata` object (title, description, canonical, Open Graph, Twitter) for `/`, `/projects` and every case study, so they are consistent (Next.js replaces rather than merges `openGraph`, which had dropped `siteName` and `locale` on inner pages). Canonical is `https://lkw22studio.com` plus path. Description no longer says "fresh graduate"; it is built from `site.ts` and the About copy. Viewport gets `themeColor` and `colorScheme: dark`. |
| Open Graph image | `src/app/(site)/opengraph-image.tsx` for `/` (same style as the case-study cards: dot grid, violet name, lime brand). `/projects` inherits it. The old static `public/og-image.png` is no longer referenced by v3 (v2 still uses it; left alone). |
| robots | `robots.ts` allows the site and lists the sitemap. `/v1` and `/v2` are kept out of the index by `noindex` (the v2 meta tag already existed; `next.config.ts` now also sends `X-Robots-Tag: noindex, nofollow` for `/v1`, `/v1/*`, `/v2`, `/v2/*` and `/resume`, without touching any archive file). They are deliberately not `Disallow`ed: a crawler that cannot fetch a page never sees its noindex. |
| Sitemap | Unchanged and verified: `/`, `/projects` and the five case studies (7 URLs). |
| JSON-LD | `/` has `Person` (name, job title = `site.headline`, email, location, `sameAs` from `site.links`) and `WebSite`, linked by `@id`. No phone number. LinkedIn is `null`, so `sameAs` has GitHub only. Case studies keep `CreativeWork`; `/projects` keeps `ItemList`. All use one escaping helper. |
| 404 | Unknown slugs (`/projects/nope`) are now a hard 404 (`dynamicParams = false`) and unknown routes (`/nope`) use a styled `global-not-found` (needs `experimental.globalNotFound`, because the app has two root layouts). Both return HTTP 404 with `noindex`, a heading, `lang`, a `main` landmark and links to `/` and `/projects`. `(site)/not-found.tsx` is kept as the in-shell variant. |
| Error pages | `(site)/error.tsx` and a self-contained `src/app/global-error.tsx` (inline styles, no fonts or providers, retry button focused). In-shell pages share `StatusPage`, which moves focus to the heading on mount. |
| Loading | No `loading.tsx`. Every route is prerendered, and a root `loading.tsx` turned the unknown-slug 404 into a streamed 200 (soft 404). I tested that and removed it. |
| `/resume` | See section 4. |
| Footer | "Built with Next.js, GSAP and Three.js". |
| Console greeting | `ConsoleHello`: one `console.log` line for developers (name, "press X on any case study", email, GitHub). Renders nothing. |
| Launch gate | `npm run check:launch` (section 6). |

## 2. Accessibility audit

### axe-core (WCAG 2.0/2.1 A and AA plus best practices), routes `/`, `/projects`, `/projects/coreex`, `/projects/petcare`, `/resume`, `/nope`, at 1280 and 375

Settled state (`REDUCED=1`, so animations are at rest): **0 violations on all 12 route/width combinations** (first run: 20 to 40 violating nodes per page).

Fixed:
- **Label in name** (WCAG 2.5.3, every page): logo link, section ruler links (`aria-label="Go to Index"` vs visible "01"), case-study ruler and X-ray toggle. Names now contain the visible text (`01 Index`, `LKW22 Studio, home`, `X-ray` + description via `aria-describedby`).
- **Links distinguishable without colour** (footer and menu "v1 · v2"): now underlined.
- **`aria-label` on a `<p>`** (case-study top bar) replaced by visually hidden text.
- **Heading order** (decision cards were `h4` under an `h2`): now `h3`.
- **Scrollable region without keyboard access**: the architecture diagram wrapper is now a focusable labelled region (the pinned gallery already was).
- **Contrast**: ruler numerals `#5e5d6e` (3.1:1) now `text-mute` (5.9:1); form placeholders `#4b4a5b` (2.3:1) now `text-mute`; the 64px ghost numerals on service cards (1.15:1, decorative) are drawn as generated content so they are no longer text. All other tokens pass on `#07070a` (mute 5.9, violet 6.4, lime 14, ink 16).
- **Phones, scroll-lit text**: the dim start of the About/case-study reading effect is 0.13 opacity (1.3:1). On phones (< 768px) it now starts at 0.4 (ink, 3.3:1) and 0.65 for violet words (3.1:1), so large text keeps 3:1 at every moment. Desktop is unchanged.

### Not fixed, on purpose (all transient animation states, only seen when axe runs mid-animation)
| Finding | Why left |
|---|---|
| Scroll-lit reading text at 0.13 opacity on desktop (`/` and case studies, 44 nodes in the animated run) | The owner's rule is that desktop effects never get weaker. The text is fully legible once lit; with reduced motion it is never dimmed. **Owner decision:** raising the desktop floor to 0.4 (one constant in `SplitText.tsx`) would remove this finding at the cost of a gentler effect. |
| Tech-stack 3D ring tiles dimmed by depth (14 nodes on `/`) | Depth fade is part of the ring effect; focusing any tile jumps to the flat grid at full opacity, and reduced motion / touch / < 1024px use the grid. |
| "Needs review" items (hero chips over the WebGL canvas, blurred header, `mix-blend` case top bar, footer wordmark, placeholder plates) | axe cannot compute colours over canvas, blur or blend modes. Their text colours were checked by hand against the tokens; the footer wordmark and placeholder watermarks are decorative and `aria-hidden`. |

### Landmarks, headings, `lang`, skip link, focus
`<html lang="en">`; skip link is the first Tab stop (verified on `/projects` and case studies; on `/` after the preloader); one `main` (`#main`, focusable target), `header`, `footer`, labelled `nav`s; the Menu is `role="dialog" aria-modal`. Every Tab stop on `/` (68 stops), `/projects`, a case study at 1280 and 375, `/resume` and `/nope` has a visible focus style: global lime 2px outline everywhere except the contact-form fields, which use a lime bottom border; that is now thickened to 2px (`focus:shadow`). Link purposes were reviewed: external links carry the arrow and every `target="_blank"` link has `rel="noopener noreferrer"` (CaseHero, Contact, Menu; the unused legacy `MediaCarousel` is the only other one).

## 3. Keyboard-only and screen-reader pass

Automated keyboard run (`qa:keyboard`): **0 problems.**
- Menu: opens with Enter, focus moves inside; Tab cycles Menu button and menu links and never escapes; Esc closes and focus returns to `#menu-button`.
- Atlas (desktop): five project cards, then Zoom in/out, Recenter, List view are tab stops; (phone) *Explore the map* opens a labelled dialog, focus moves in, Esc closes, focus returns to the button (`qa:flows`).
- Tech stack: 38 tile buttons in DOM order (long but reachable; focus flattens the ring).
- Contact form: empty submit marks 3 fields `aria-invalid`, focus moves to the first bad one, all fields labelled, status is `role="status"` and focused on result.
- Case study: X key toggles X-ray (`aria-pressed` true), Esc turns it off; the toggle ignores input fields per spec.
- Preloader: never blocks. Without JS it is `display:none`; with JS a CSS failsafe hides it at 4s; the page underneath is always in the DOM. New: **Tab, Enter, Space or Escape ends it immediately** (it was 1104 ms from key press to gone, including the 0.9s exit animation).
- Footer wordmark bug found and fixed: the animated wordmark painted over the footer links, so mouse clicks on "v1", "v2" and "Back to top" hit the wordmark. It is now `pointer-events-none` (same for the ruler marker).

**Screen reader:** no screen reader (NVDA, VoiceOver, TalkBack) could be run here. What was checked instead: axe accessible-name rules, heading outline, landmark list, `aria-live` regions and the sr-only copies used by split text. A real NVDA/VoiceOver pass by the owner is still recommended before launch.

## 4. `/resume`

There is no `public/resume.pdf`. Behaviour now: the Hero "Download CV" button, the Contact "CV" pill and the Menu "CV (PDF)" link are **hidden** (flag `NEXT_PUBLIC_HAS_RESUME`, set in `next.config.ts` from whether the file exists at build time). `/resume` still exists for old links: a styled "Résumé on request" page with an email link and a way home, `noindex`. **When the owner puts the chosen PDF at `public/resume.pdf` and rebuilds, the buttons return and `/resume` redirects to it.** Nothing was guessed: `public/document/LeowKaiWen-Resume.pdf` exists (used by ver 2.0), but the plan says CV v5 should be served, so that choice is the owner's.

## 5. Reduced motion (real emulation, `prefers-reduced-motion: reduce`, desktop 1280)
Verified in the browser: no preloader, no Lenis, no WebGL canvas (static hero), native cursor (`cursor: auto`, no custom cursor elements), zero running CSS animations, nothing stuck at opacity 0, after a full scroll no scroll-lit word is still dimmed and no split unit is transformed, the Atlas shows as the list (5 links), the tech stack as the grid. Code review of every component that animates found each gated by `useMotion`, `useReducedMotion` or a media query; the legacy `src/components/ui/*` effect components are not imported anywhere in v3.

## 6. `npm run check:launch` (today's output, exit code 1)

```
✗ TODO(owner) / DRAFT markers in src/content: 125
✓ Markers that can reach visitors from components/app code: 0
✗ Screenshot placeholders ("Screenshot coming") in project content: 10
✓ Markers in public text files: 0
✗ CV file at public/resume.pdf: missing
NOT READY: 136 items remaining.
```

Per-file counts are printed (`--verbose` lists every line): `home.ts` 28, `coreex.ts` 25, `asteroidui.ts` 18, `moonwave.ts` 12, `brickly.ts` 11, `petcare.ts` 10, `xray.ts` 8, `site.ts` 8, and a few more. It scans `src/content`, components, app code (not `/v2`), `lib`, `hooks` and public text files (not `v1`, `v2`, images). Comments are stripped for code (so docs that mention a marker are not counted); in content every marker counts, including `// DRAFT` comments and `draft: true`. Components that only render a marker for unfinished content (`TodoText`, `CaseHero`, `Placeholder`, `XrayFrame`) are allow-listed, otherwise the gate could never pass. Not wired into `npm run build`. The Phase 7 session is rewriting content, so these numbers will change.

## 7. Layout, hero fallbacks, performance

- **Overflow**: no horizontal overflow at 375, 768, 1280 or 1920 on `/`, `/projects`, `/projects/coreex`, `/projects/moonwave`, `/resume`, `/nope`, after one fix. At 1920 the tilted hero plate on case studies stretched the page to 2005px (horizontal scrollbar) until it flattened; the overview section now uses `overflow-x: clip` (clip, not hidden, so sticky and Lenis still work).
- **Hero**: WebGL canvas present at 768, 1280, 1920 with a mouse; absent at 375 (touch) and with reduced motion (static hero).
- **JS weight of `/`** (production, uncompressed bytes transferred as scripts): desktop 1591 KB in 22 files, of which one 658 KB chunk (168 KB gzip) is the lazy three.js hero (loaded after first paint, desktop and fine pointer only); phone 772 KB in 19 files (largest: 227 KB React/Next runtime, 107 KB, 78 KB). Nothing was cut on desktop. For phones, the 772 KB is the thing to watch in Lighthouse mobile; the likely candidates are GSAP + ScrollTrigger + Lenis (needed for the shell) and the Atlas code. I did not change the split.
- **Console errors**: only `/_vercel/insights` and `/_vercel/speed-insights` 404s, which exist only on Vercel. One real bug found with this check: case-study JSON-LD had lost its `type="application/ld+json"` in my first edit and threw "Unexpected token ':'"; fixed and re-verified.
- **Lighthouse could not be run.** `npx lighthouse` was blocked by the permission system and I did not work around it. Steps for the owner on the Vercel preview URL: open the preview in Chrome (Incognito, extensions off) → DevTools → Lighthouse → Mode: Navigation, Device: Mobile → tick all four categories → Analyze; run it on `/`, `/projects` and `/projects/coreex`. Or: `npx lighthouse https://<preview-url>/ --preset=perf --form-factor=mobile --view`. Targets (spec 7): mobile Performance 90+, Accessibility 95+, Best Practices 95+, SEO 100, LCP < 2.5 s, CLS < 0.1. Desktop scores are tracked, not gated.
- **Safari and Firefox were not tested** (Chromium only). The things most likely to differ: `inert`, `overflow-x: clip`, backdrop blur, CSS 3D in the Atlas and WebGL context creation. Please smoke-test them on the preview.

## 8. Archive protection
`git diff --stat redesign-v3 -- public/v1 public/v2 src/app/v2` printed nothing (empty). Production build: `/v1`, `/v2`, `/v2/projects`, `/v2/about-me`, `/v2/contact-me` all return 200, keep their robots `noindex, nofollow` meta tag, now also send the `X-Robots-Tag` header, still use their own Nunito fonts, and had no page errors or failed requests. Exception, pre-existing and not mine: `/v1` requests two illustrations from `illustrations.popsy.co` whose certificate is invalid (`ERR_CERT_COMMON_NAME_INVALID`), so two images are missing in ver 1.0; I cannot touch `public/v1`.
Two root-level additions that apply app-wide, both inert for the archives unless the root layout itself crashes: `src/app/global-error.tsx` (replaces the document on a root-layout crash, so on `/v2` too) and `global-not-found.tsx` (only for URLs that match no route; `/v2/*` pages with `notFound()` keep their own `v2/not-found.tsx`). Neither is loaded by `/v1` or `/v2` in normal operation, and nothing global (CSS, fonts, providers, scripts) was added to them: the fonts moved to `src/lib/fonts.ts` for the v3 layout and the new 404 only.

## 9. Dependencies
Added as **devDependencies only**: `playwright-core` (drives the Chromium that is already installed, no browser download) and `@axe-core/playwright` (axe-core engine). Both are used only by `scripts/qa/*`. No runtime dependency changed. New npm scripts: `check:launch`, `qa:axe`, `qa:keyboard`, `qa:layout`, `qa:flows`.

## 10. What remains

| Severity | Item | Owner |
|---|---|---|
| High (launch blocker) | 125 `TODO(owner)`/`DRAFT` markers and 10 screenshot placeholders in `src/content` (see section 6) | Owner + Phase 7 |
| High (launch blocker) | CV: choose and add `public/resume.pdf`, rebuild | Owner |
| Medium | Real screen-reader pass (NVDA or VoiceOver) and Safari/Firefox smoke test on the preview | Owner |
| Medium | Run Lighthouse mobile on the Vercel preview (steps above); watch the 772 KB phone JS | Owner |
| Medium | Decide whether to raise the desktop dim floor of the scroll-lit text (0.13 → 0.4) to clear the last axe contrast finding | Owner |
| Low | `next build` intermittently failed with Turbopack "next/font/google queries have exactly one entry" (3 of about 10 builds, always the next build succeeded without changes; I could not reproduce it deterministically). Re-run if CI shows it. | Watch |
| Low | `error.tsx` and `global-error.tsx` compile and are in the build (`_global-error.html`) but were not triggered at runtime (no safe way to throw in a production build) | Owner can test in dev |
| Low | `/v1` shows two missing illustrations (third-party certificate); a fix means editing `public/v1` | Owner decision |
| Low | `src/components/ui/*` (Dither, GridScan, Silk, MediaCarousel, …) are unused leftovers from ver 2.0; deleting them is a cleanup for a later phase | Later |
| Info | LinkedIn URL is `null`, so JSON-LD `sameAs` has GitHub only. Add it in `site.ts` and it appears everywhere | Phase 7 |
| Info | `site.ts` headline reads "Full-Stack Developer \| AI Engineer"; metadata and JSON-LD follow it. Previous metadata said "fresh graduate"; I dropped that wording | Owner confirm |

## 11. Needs a decision from the owner
1. Which PDF becomes `/resume` (CV v5 per the plan, or the existing `public/document/LeowKaiWen-Resume.pdf`)?
2. Keep the desktop scroll-lit text at 0.13 opacity (full effect, one known axe finding) or raise it to 0.4?
3. OK with `experimental.globalNotFound` for the unknown-route 404 (the only way to style it with two root layouts)?
