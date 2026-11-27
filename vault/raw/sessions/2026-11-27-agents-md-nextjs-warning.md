# Session 2026-11-27: why AGENTS.md says "This is NOT the Next.js you know"

Raw session record. Immutable once written. Short Q&A session; no files changed outside the vault.

## Request
Owner asked why `AGENTS.md` says "This is NOT the Next.js you know", then asked how to resolve it. Owner then said it is fine as is and asked to record and ingest this session.

## Findings
- `AGENTS.md` and `CLAUDE.md` were added in the first commit `801420c` (2026-03-25, "Initial commit from Create Next App"). `create-next-app` generates both by default (`--agents-md`, on by default). `CLAUDE.md` is `@AGENTS.md`.
- The heading is a warning aimed at AI coding agents, not an error. The project runs `next` 16.2.1, newer than most models' training data. Next.js ships version-matched docs at `node_modules/next/dist/docs/` (folders `01-app`, `02-pages`, `03-architecture`, `04-community`), and the block tells agents to read them before writing code. Next.js's own guide is `node_modules/next/dist/docs/01-app/02-guides/ai-agents.md`.
- The block is wrapped in `<!-- BEGIN:nextjs-agent-rules -->` / `<!-- END:nextjs-agent-rules -->`; these markers let Next.js tooling find and update the block. The owner's workflow section sits outside the markers.
- The documented official wording for existing projects is a plain "Next.js: ALWAYS read docs before coding" text; the committed heading is a more dramatic variant from the generator's version. The repo has no later edits to that block.
- Correction made in-session: the assistant first said the file had no markers; that was wrong, the working file has them.

## Decision
No change. Owner chose to keep the block as is. Options that were offered and not taken: reword the heading neutrally (keep the markers), or remove the block (not recommended: agents would fall back on older Next.js patterns).

## Left undone / follow-ups
None. Working-tree `AGENTS.md` still shows the owner's uncommitted workflow section.
