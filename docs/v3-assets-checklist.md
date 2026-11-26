# Portfolio ver 3.0: assets and content checklist

Things the owner (Kai Wen) supplies or approves. The build can start without them: use clearly marked placeholders, and never ship a placeholder or an invented fact. Tick items off as they arrive.

Where files go: put images in `public/images/projects/<slug>/` (WebP, about 1600px wide for screenshots) unless the implementation plan says otherwise.

## 1. Brand

- [ ] **Logo** (replaces the "LKW" tile in the header, the menu and the favicon). Ideally SVG, plus a square version for the favicon and app icon.
- [ ] **Favicon and app icons** (can be generated from the logo).
- [ ] **Open Graph image** for the home page (1200×630), or approve one generated from the hero.
- [ ] Decision: keep Inter Tight + Instrument Serif, or use a custom display font (licence file needed if paid).

## 2. Copy to write or approve

- [ ] Hero intro sentence (draft: "I take products from idea to production: interfaces, APIs, databases and the AI that ties them together.").
- [ ] About statement paragraph (draft in `docs/mockups/home.html`).
- [ ] Services: title and one or two lines for each of the four cards.
- [ ] Tech stack: final list and grouping (starts from CV v5 "Technical Skills"), and which projects use each tech.
- [ ] Contact: reply-time line, and the destination email for the form.

## 3. Links

- [ ] GitHub profile URL (CV has `github.com/the-KW22`).
- [ ] LinkedIn URL.
- [ ] Latest CV PDF (CV v5 `Leow-Kai-Wen-CV.pdf`, or newer), served at `/resume`.
- [ ] Live and GitHub links for each project (decide which repos are public).

## 4. Per project

For each project: screenshots, story content, stats and X-ray notes. "X-ray notes" are the engineering facts shown under the cursor lens: component names over UI regions, data flow, queries, security rules, performance notes. They must be accurate.

### CoreEx (lead)
- [ ] 5 to 8 screenshots, about 1600px wide, privacy-checked (no personal notes, emails or tokens). Suggested: notes editor, knowledge graph, search, Chat with tools, Career module, MCP token screen.
- [ ] One hero screenshot for the 3D plate and the atlas card thumbnail.
- [ ] X-ray notes for the hero screenshot and gallery screens.
- [ ] Architecture diagram check (Browser → Next.js → Spring Boot API → Postgres + pgvector; MCP server; Claude API).
- [ ] Confirm stats: 44 MCP tools, 24 releases, 13 ADRs (re-check against the repo before launch).
- [ ] Decision: how to mention the invite-only demo (default: "Invite-only demo, request access" + GitHub link).

### AsteroidUI (in progress)
- [ ] 3 to 5 screenshots (or approve capturing them from `asteroid-ui.vercel.app`).
- [ ] Real stats (number of components, registry items) to replace the "—" placeholders.
- [ ] X-ray notes.

### Moonwave, Brickly, PetCare (web designs)
- [ ] Screenshots and short videos (some exist in `public/v2`; confirm reuse).
- [ ] Year, role and a short description for each (Brickly's old description was a copy of Moonwave's; needs rewriting).
- [ ] Stats, or remove the stats row for these three.
- [ ] X-ray notes (for example section structure, animation techniques, components).

## 5. Atlas board extras

- [ ] Approve or replace the texture items on the board: the quote note ("Ship small, write the ADR, then ship again."), the code snippets, the "ver 1.0" polaroid image, the easter-egg notes.
- [ ] Optional: real sketches, whiteboard photos or notes to scatter on the board.

## 6. Services and accounts

- [ ] Resend account, API key in `.env.local` and Vercel env only (never in chat or git), and whether to verify `lkw22studio.com` as the sender domain.
- [ ] Optional: sound files for the sound toggle (or approve generated ones).

## 7. Later (not in v1 of ver 3.0)

- Testimonials, blog, awards: not planned for now.
- Update the CV's portfolio link to `https://lkw22studio.com` after launch.
