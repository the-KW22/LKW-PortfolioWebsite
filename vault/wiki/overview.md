---
type: overview
updated: 2026-11-27
sources: [raw/sessions/2026-11-25-lint-webp-cleanup.md, raw/sessions/2026-11-27-ver3-redesign-build.md, raw/sessions/2026-11-27-agent-workflow.md]
---
# Overview

Personal portfolio of Leow Kai Wen (Full-Stack Developer | AI Engineer, Kuala Lumpur). Repo: `the-KW22/LKW-PortfolioWebsite` (local folder `portfolio-website-ver-2.0`). Deployed on Vercel ([[deployment-vercel]]).

## Status (2026-11-27)
- **Live (`main`, lkw22studio.com):** still ver 2.0 until launch.
- **In progress:** ver 3.0 on branch `redesign-v3` (pushed, preview building): a one-page Atlas / warp / X-ray site. See [[ver3-redesign]], [[ver3-build-process]], [[ver3-owner-decisions]].
- **Archives:** ver 1.0 at `/v1` and ver 2.0 at `/v2`, noindex ([[versioning-and-archives]]).

## Stack
Next.js 16.2.1 (Turbopack, App Router), React 19.2.4, TypeScript, Tailwind CSS 4, GSAP, Lenis (smooth scroll), motion, three + @react-three/fiber (ver 3.0 hero only), Vercel Analytics and Speed Insights. Ver 3.0 uses Inter Tight, Instrument Serif and JetBrains Mono via `next/font`; ver 2.0 used Nunito Sans and Chroma Sans (local, now `public/v2/font`).

## Rules for working here
- `AGENTS.md`: this Next.js version has breaking changes; read `node_modules/next/dist/docs/` before writing code.
- `AGENTS.md` also holds the agent workflow (ponytail for all coding, Haiku/Sonnet routing); `CLAUDE.md` just imports it. See [[agent-workflow]].
- Contact email on the site is `kwenleow@gmail.com`; `the.kw22me@gmail.com` is the account used for projects. No phone number on the site.
- Never edit `/v1` or `/v2` files except real bug fixes ([[versioning-and-archives]]).

See [[site-structure]], [[projects-showcase]], [[seo-and-metadata]], [[contact-form]], [[image-pipeline]], [[code-quality]], [[open-follow-ups]].

## History
- 2026-11-27: previously described as a "fresh-graduate Full Stack Developer" on `main` (ver 2.0 only). The stack line no longer lists `ogl` (it is not a direct dependency in `package.json`) or the shadcn-style `ui/` folder (ver 2.0 components moved into the `/v2` archive or were deleted in ver 3.0 Phases 0 and 1). See [[2026-11-27-ver3-redesign-build]].
