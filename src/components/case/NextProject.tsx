import Link from "next/link";
import type { Project } from "@/content/types";

/** Closing block: huge name of the next project, violet on hover. */
export function NextProject({ next }: { next: Project }) {
  return (
    <section
      id="next"
      data-case-section
      data-case-label="Next"
      aria-label="Next project"
      className="border-t border-line px-[5vw]"
    >
      {/* Phase 5: this link starts the kinetic warp into the next project. Plain link until then. */}
      <Link
        href={`/projects/${next.slug}`}
        data-cursor="label"
        data-cursor-label="OPEN"
        className="group flex min-h-[70svh] flex-col justify-center rounded-lg"
      >
        <span className="mono-label text-mute">Next project</span>
        <span className="font-display mt-4 block text-[clamp(52px,13vw,220px)] leading-[0.9] font-black tracking-[-0.06em] transition-colors duration-300 group-hover:text-violet group-focus-visible:text-violet">
          {next.name} <span aria-hidden="true">→</span>
        </span>
        <span className="mt-4 max-w-md text-mute">{next.tagline}</span>
      </Link>
      <Link
        href="/projects"
        className="mono-label mb-16 inline-block rounded-md py-2 text-mute transition-colors hover:text-violet focus-visible:text-violet"
      >
        ← All projects
      </Link>
    </section>
  );
}
