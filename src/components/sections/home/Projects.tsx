import { projects } from "@/content/projects";

/**
 * 03 Personal projects. PLACEHOLDER (Phase 2): keeps the section id and the tall sticky layout slot
 * (about 280vh, spec section 4) so the ruler and anchors already behave. The draggable Atlas is
 * built in Phase 3; this plain list of the real projects is the no-JS and mobile fallback it will
 * replace. Items are not links yet because the case-study routes arrive in Phase 4.
 */
export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative md:h-[280vh]">
      <div className="px-[5vw] py-[14vh] md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center md:overflow-hidden md:py-0">
        <p className="mono-label text-mute">03 — {projects.length} builds</p>
        <h2
          id="projects-title"
          className="mt-4 font-display text-[clamp(52px,9vw,150px)] leading-[0.85] font-black tracking-display"
        >
          Personal
          <br />
          <em className="font-serif font-normal italic text-violet tracking-[-0.02em]">projects</em>
        </h2>
        <p
          data-placeholder="atlas"
          className="mono-label mt-6 inline-block max-w-max rounded-full border border-dashed border-lime/60 px-3 py-2 text-lime"
        >
          Placeholder — the draggable Atlas board is built in Phase 3
        </p>
        <ol className="mt-8 max-w-4xl border-b border-line">
          {projects.map((p) => (
            <li
              key={p.slug}
              className="grid grid-cols-[48px_1fr] items-baseline gap-x-4 border-t border-line py-4 sm:grid-cols-[60px_1fr_1fr]"
            >
              <span className="mono-label text-mute">{String(p.order).padStart(2, "0")}</span>
              <span className="font-display text-[clamp(22px,2.6vw,40px)] leading-tight font-extrabold tracking-[-0.03em]">
                {p.name}
              </span>
              <span className="col-start-2 text-sm text-mute sm:col-start-auto">{p.tagline}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
