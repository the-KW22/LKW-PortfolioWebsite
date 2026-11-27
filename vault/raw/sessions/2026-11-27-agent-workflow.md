# Session 2026-11-27: agent workflow in AGENTS.md

Raw session record. Immutable once written. Short session; only docs were changed, no site code.

## Request
Owner asked for a workflow for all agents: (1) all coding work uses the `ponytail` skill; (2) choose Sonnet 5.5 or Haiku 5.5 subagents by task complexity. Owner also asked how industry coding agents work, to learn from it.

## What changed
- `AGENTS.md` (repo root): added an "Agent workflow" section after the `nextjs-agent-rules` block (outside the managed block so it is not overwritten).
- `CLAUDE.md` (repo root): first written with the workflow, then, at the owner's request, reduced to the single line `@AGENTS.md`. AGENTS.md is the one source of truth.

## Decisions
- **Ponytail for all coding.** Main agent invokes it before coding; every subagent brief must say "use the ponytail skill".
- **Pipeline:** Understand -> Plan -> Implement -> Verify -> Review -> Report. Main agent owns verification (lint, build, preview) and the report; never trust a subagent's "done".
- **Model routing:**
  - Trivial (typo, one-line tweak): main agent directly.
  - Simple (single-file edit, bulk replace, small docs, lookups): Haiku 5.5 subagent.
  - Standard (multi-file feature, bug needing diagnosis, refactor, tests): Sonnet 5.5 subagent.
  - Hard (architecture, unclear bug, security): main agent, or Sonnet with a plan from main; mandatory review.
- Unsure between tiers: pick the higher one. A Haiku result that fails verification once is escalated to Sonnet, not retried.
- Parallelize only independent tasks on different files; two writers never share a file.
- Review (`ponytail-review` / `code-review`) required from medium tasks up; not mandatory for trivial or simple.
- Never commit, push or publish unless the owner asks.

## Industry practice discussed (for learning)
Loop used by Claude Code, Cursor, Devin, Copilot Agent: understand (search, read, project rules) -> plan (often human-approved) -> small implement steps -> verify with real feedback (tests, compiler, linter, browser) -> separate review -> PR with summary, human merges. Patterns: orchestrator plus cheaper workers, fresh context per subagent, per-task branch or worktree isolation, tight permissions on risky actions, same CI guardrails as humans, rules stored in files like `CLAUDE.md`, and evals (for example SWE-bench) tracking pass rate and cost.

## Left undone
- Workflow not yet exercised on a real task; routing thresholds untested.
- Review is not mandatory for every tier (owner can ask for stricter).
- Nothing committed.
