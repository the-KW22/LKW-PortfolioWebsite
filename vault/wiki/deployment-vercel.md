---
type: architecture
updated: 2026-11-27
sources: [raw/sessions/2026-11-25-lint-webp-cleanup.md, raw/sessions/2026-11-27-ver3-redesign-build.md]
---
# Deployment (Vercel)

Team `thekw22s-projects`, project `lkw-portfolio-website`. Domain `lkw22studio.com` (and a www redirect) follows `main`. Pushing any other branch creates a preview deployment protected by Vercel SSO, so only the owner can open it; it does not change the live site.

- 2026-11-27: `redesign-v3` was pushed (`a1f5f8d..50264b9`) and Vercel started a preview build for commit `50264b9`.
- The CV still links `lkw-portfolio-website-v2.vercel.app` (old alias); update it to `https://lkw22studio.com` after launch ([[open-follow-ups]]).

## Environment variable names (values are never read here)
- Existing for production, preview and development: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_LINKEDIN_URL`. They fed ver 2.0's [[seo-and-metadata]].
- Needed for the ver 3.0 contact form on Preview and Production: `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (optional extras in [[contact-form]]). Not yet added as of 2026-11-27, so the form shows its "nothing was sent" message on the preview until they are.

Analytics and Speed Insights are wired in the layout. Launch (merge to `main`) is described in [[ver3-build-process]].

## History
- 2026-11-27: the project name was recorded as `lkw-portfolio-website-v2` on 2026-11-25; deployments now report `lkw-portfolio-website`. Contact variables added to the list. See [[2026-11-27-ver3-redesign-build]].
