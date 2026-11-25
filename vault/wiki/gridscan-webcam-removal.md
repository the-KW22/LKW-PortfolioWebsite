---
type: decision
updated: 2026-11-25
sources: [raw/sessions/2026-11-25-lint-webp-cleanup.md]
---
# GridScan webcam removal

**Decision:** remove the optional webcam face-tracking mode and the `face-api.js` dependency.

**Why:** no caller enabled it (`error.tsx` and `Contact.tsx` never passed `enableWebcam`), yet the package was statically imported, so every visitor downloaded it. It also fetched model weights from a CDN when used.

**What changed:** deleted the `enableWebcam`, `showPreview` and `modelsPath` props, the model-loading and detection effects, the preview UI and the median/centroid helpers; uninstalled `face-api.js`. GridScan still reacts to mouse, gyro (`enableGyro`) and click-scan (`scanOnClick`). To bring face tracking back, add it behind a dynamic `import()`.
