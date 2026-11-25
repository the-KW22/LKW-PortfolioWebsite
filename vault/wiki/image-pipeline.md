---
type: decision
updated: 2026-11-25
sources: [raw/sessions/2026-11-25-lint-webp-cleanup.md]
---
# Image pipeline (WebP)

**Decision:** all site and project imagery in `public/images` is WebP.

- 2026-11-25: 35 PNG/JPG files converted with `sharp` at quality 85, dimensions unchanged. 32,284,982 B -> 3,334,924 B (-89.7%). Originals deleted; 32 paths in `ProjectCarouselSection.tsx` updated.
- **Keep as PNG/ICO:** `public/og-image.png` and `public/icons/*` (social previews and favicons need them).
- New images: export as WebP (lossy ~85; lossless for tiny logos with transparency if lossy is larger). Avoid committing multi-MB full-page screenshots.
- Unreferenced: `images/promote-images/*`.
- MediaCarousel and ProjectCarousel render plain `<img>` with `no-img-element` suppressed ([[code-quality]]). Moving to `next/image` would add optimization but changes object-cover sizing.
