# Vault schema: portfolio-website-ver-2.0 wiki

An LLM-maintained wiki (Karpathy "LLM wiki" pattern) for this repo. Open `vault/` as an Obsidian vault.
The repo's own `CLAUDE.md`/`AGENTS.md` still apply to code; this file only governs the vault.

## Layers

| Layer | Path | Owner | Rule |
|---|---|---|---|
| Raw sources | `raw/` | human + capture | **Immutable.** Never edit after it is written. Add new files instead. |
| Wiki | `wiki/` | LLM | Compiled, cross-linked markdown. The LLM writes and maintains all of it. |
| Schema | `CLAUDE.md` | human + LLM | This file. Change only when conventions change. |

`raw/sessions/` holds one file per working session, named `YYYY-MM-DD-short-slug.md`.

## Page format (wiki/)

- Filename: `kebab-case.md`. Title is an `# H1`.
- Frontmatter on every page:
  ```yaml
  ---
  type: overview | architecture | decision | feature | asset | how-to | source
  updated: YYYY-MM-DD
  sources: [raw/sessions/....md]
  ---
  ```
- Link with Obsidian wikilinks: `[[page-name]]`. Link liberally; every page should have at least one inbound link from `index.md`.
- State facts, not narration. When a new source contradicts a page, update the page and note the change under a `## History` heading at the bottom.
- Cite sources in frontmatter `sources:`; use `(see [[source-page]])` inline when a claim is non-obvious.

## Operations

### Ingest (raw file -> wiki)
1. Read the raw file in full.
2. Create `wiki/sources/<same-slug>.md` (type `source`): a short summary of the raw file, linking to the pages it touched.
3. Create or update the relevant topic pages (decisions, features, assets...). Touch only what the source supports.
4. Update `wiki/index.md` (add new pages, refresh one-line descriptions).
5. Append an entry to `wiki/log.md`: `## [YYYY-MM-DD] ingest | <slug>` plus a bullet list of pages created/updated.
6. Never modify the raw file.

### Query
Read `wiki/index.md` first, then the pages it points to. Answer from the wiki; cite pages. If the answer is a useful synthesis, file it back as a new page and log it.

### Lint (wiki health check)
Look for: pages missing from the index, broken `[[links]]`, contradictions between pages, claims no source supports, stale `updated:` dates, orphan pages. Fix or list them; log as `## [date] lint | ...`.

## What to capture in a session file

What was asked, what changed (files/paths), decisions and the reason, measured results, things deliberately left undone, and open follow-ups. Keep it factual; no secrets, tokens, or env var values (names only).
