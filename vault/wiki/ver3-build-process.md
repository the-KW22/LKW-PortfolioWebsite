---
type: how-to
updated: 2026-11-27
sources: [raw/sessions/2026-11-27-ver3-redesign-build.md, raw/sessions/2026-11-27-issues-2-to-10.md]
---
# Ver 3.0 build process

One planning session designs and orchestrates; **separate coding sessions** each build one phase in their own git worktree (under `.claude/worktrees/`), then stop. The owner reviews in a preview, then approves a `--no-ff` merge into `redesign-v3`. The planning session itself does not write site code.

## Phases
| Phase | Scope | Merge commit |
|---|---|---|
| 0 | foundation, typed content, tokens, redirects | `d670d9e` |
| 1 | shell: header, menu, cursor, preloader, Lenis, motion kit | `6a47898` |
| 2 | home sections (plus cursor fix `19e0791`) | `04b38e2` |
| 3 | Atlas | `0fef7cc` |
| 4 | case-study engine | `22d782b` |
| 5 | warp and X-ray | `8b2a7d6` |
| 6 | WebGL hero | `3c72cbe` |
| 8 | contact form ([[contact-form]]) | `3f4219d` |
| 7 | content drafts and fact check | `893262e` |
| 9 | SEO, error pages, a11y, launch gate, QA | `44e5d73` |
| - | owner decisions ([[ver3-owner-decisions]]) | `50264b9` |
| 10 | launch: merge to `main`, update CV link | not done |

## Per-phase check by the planner (before asking to merge)
1. `git log redesign-v3..<branch>` and `git diff --stat redesign-v3 <branch>`.
2. Archive diff empty: `git diff --stat redesign-v3 <branch> -- public/v1 public/v2 src/app/v2` ([[versioning-and-archives]]).
3. `package.json` diff (no unexplained dependencies) and a scan for secrets and the phone number before pushing.
4. Run the branch in the preview and look at it; then merge and run `tsc`, tests and build on the merged code.

## Issue sessions (2026-11-27)
GitHub issues #2 to #10 used a smaller loop than the phases: the main agent reproduced each bug with a scratch Playwright script (headless Chromium via `scripts/qa/browser.mjs`, dev server on port 3200), found the cause and wrote a brief. A Haiku subagent implemented each fix in its own commit. The main agent reviewed the diff, re-ran the measurement, and ran `npx eslint src scripts`, `npx tsc --noEmit`, `npm test` and `npm run build`. See [[2026-11-27-issues-2-to-10]].

## Gotchas
- **Preview server:** a `.claude/launch.json` entry (`v3-dev`, port 3100) runs the worktree's `next dev`; the app stops idle servers, restart when needed. `.claude/` is git-ignored.
- **Worktree reuse:** coding sessions often reuse an old worktree folder name, so check `git worktree list` for the real branch. A removed worktree makes its path vanish.
- **Messaging a finished session:** an archived session must be unarchived, and a workspace can require trust approval only the owner can give; start a fresh session instead.
- **Lint noise:** repo-wide `npm run lint` in the main checkout scans nested worktrees (about 86,000 problems). Use `npx eslint src scripts`.
- **Windows Git Bash:** `git show <ref>:<path>` needs `MSYS_NO_PATHCONV=1`. A stale `.next` breaks `tsc` after route changes ([[code-quality]]).
- **Lighthouse** was blocked by the permission system in coding sessions; run it on the Vercel preview ([[open-follow-ups]]).

Related: [[ver3-redesign]].
