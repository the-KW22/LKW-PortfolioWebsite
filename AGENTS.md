<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent workflow (applies to every agent, main or sub)

## Rules
1. **All coding work uses the `ponytail` skill** (smallest change that fully solves the task). Main agent invokes it before coding; every subagent prompt must say "use the ponytail skill".
2. **Read before write.** Read the relevant `node_modules/next/dist/docs/` guide and the files you will touch.
3. **Verify before claiming done.** Run `npm run lint` and `npm run build` (plus tests if present); for UI changes, check in the preview browser. Report failures plainly.
4. **Never commit, push, or publish unless the user asks.**

## Pipeline
`Understand → Plan → Implement → Verify → Review → Report`

| Stage | Who | Notes |
|---|---|---|
| Understand | main (or Explore agent for wide searches) | Locate files, find existing patterns |
| Plan | main (Plan agent only if architecture-level) | Skip for trivial edits |
| Implement | subagent by tier below | Give each a self-contained brief: files, goal, done-criteria |
| Verify | main | Lint, build, preview. Never trust a subagent's "done" without checking |
| Review | `ponytail-review` / `code-review` | Required for medium and above |
| Report | main | What changed, what was verified, what was not |

## Model routing by complexity

| Tier | Examples | Who does it |
|---|---|---|
| **Trivial** | Typo, copy change, one-line style tweak, rename | Main agent directly, no subagent |
| **Simple** | Single-file edit, add a static section, bulk find/replace, formatting, small docs, file lookups | **Haiku 5.5** subagent (`model: "haiku"`) |
| **Standard** | Multi-file feature, new component, bug fix needing diagnosis, refactor, tests, content-heavy page | **Sonnet 5.5** subagent (`model: "sonnet"`) |
| **Hard** | Architecture change, tricky bug with unclear cause, security-sensitive, cross-cutting redesign | Main agent (or Sonnet with a plan written by main), then mandatory review |

Rules of thumb:
- Unsure between two tiers → pick the higher one. A failed Haiku run costs more than a Sonnet run.
- If a Haiku result fails verification once, escalate that task to Sonnet; do not retry Haiku.
- Parallelize only independent tasks touching different files. Two writers never touch the same file.
- Subagent brief must include: goal, exact files, constraints, "use the ponytail skill", how to verify. It must not commit.
- Main agent owns the final verification and the user-facing report.
