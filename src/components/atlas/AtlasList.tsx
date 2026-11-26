import type { Project } from "@/content/types";
import { pad2 } from "./AtlasItems";

/** Plain, fast list of all projects. Server-rendered, so it is also the no-JS view. */
export function AtlasList({ projects }: { projects: Project[] }) {
  return (
    <ol className="mt-8 max-w-5xl border-b border-line" aria-label="All projects">
      {projects.map((p) => (
        <li key={p.slug} className="border-t border-line">
          <a
            href={`/projects/${p.slug}`}
            data-warp="enter"
            data-warp-name={p.name}
            data-cursor="label"
            data-cursor-label="OPEN"
            className="grid grid-cols-[44px_1fr] items-baseline gap-x-4 gap-y-1 py-4 transition-colors hover:text-violet sm:grid-cols-[60px_1.1fr_1.6fr_0.8fr]"
          >
            <span className="mono-label text-mute">{pad2(p.order)}</span>
            <span className="font-display text-[clamp(22px,2.6vw,40px)] leading-tight font-extrabold tracking-[-0.03em]">
              {p.name}
            </span>
            <span className="col-start-2 text-sm text-mute sm:col-start-auto">{p.tagline}</span>
            <span className="mono-label col-start-2 text-mute sm:col-start-auto sm:text-right">
              {p.stack[0]?.name ?? p.category.replace("-", " ")}
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}
