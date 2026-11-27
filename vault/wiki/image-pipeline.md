---
type: decision
updated: 2026-11-27
sources: [raw/sessions/2026-11-25-lint-webp-cleanup.md, raw/sessions/2026-11-27-ver3-redesign-build.md]
---
# Image pipeline (WebP)

**Decision:** all site and project imagery is WebP.

- 2026-11-25: 35 PNG/JPG files in `public/images` converted with `sharp` at quality 85, dimensions unchanged. 32,284,982 B -> 3,334,924 B (-89.7%). Originals deleted; 32 paths updated.
- **Keep as PNG/ICO:** social previews and favicons (`og-image.png`, `icons/*`).
- New images: export as WebP (lossy ~85; lossless for tiny logos with transparency if lossy is larger). Avoid committing multi-MB full-page screenshots.

## Ver 3.0
- Ver 2.0's images, video, icons, documents and fonts moved to `public/v2/*` for the `/v2` archive; the ver 1.0 build is in `public/v1`.
- Project media for the new site lives in `public/images/projects/<slug>/`, rendered with `next/image` (WebP); videos are lazy loaded with a poster image (`LazyVideo`). Moonwave, Brickly and PetCare media were copied from ver 2.0 (alt text and captions written from the images); the new site never references `public/v2` paths.
- Still to supply: CoreEx and AsteroidUI screenshots (about 1600 x 900 WebP, names listed in `docs/v3-owner-todo.md`), privacy-checked. CoreEx's `portfolio-screenshots` folder must not be used until it has been checked ([[open-follow-ups]]).
- Ver 2.0 only: `images/promote-images/*` is unreferenced; MediaCarousel and ProjectCarousel use plain `<img>` with `no-img-element` suppressed ([[code-quality]]).

Related: [[projects-showcase]], [[ver3-redesign]].

## History
- 2026-11-27: `public/images` as described on 2026-11-25 now belongs to ver 2.0 (`public/v2/images`); `public/images/projects/` is new. See [[2026-11-27-ver3-redesign-build]].
