import Link from "next/link";

/**
 * Sticky bar under the fixed header (blend mode difference): back link, counter, X-ray slot.
 * It sits below the header (which is 76-84px tall) so the logo and Menu button stay reachable.
 */
export function CaseTopBar({ order, total, name }: { order: number; total: number; name: string }) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="sticky top-[76px] z-40 mt-[76px] flex items-center justify-between gap-4 px-[5vw] py-3 text-white mix-blend-difference sm:top-[84px] sm:mt-[84px]">
      <Link
        href="/projects"
        className="mono-label rounded-md py-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        ← Back to projects
      </Link>
      <p className="mono-label hidden sm:block" aria-label={`Project ${order} of ${total}: ${name}`}>
        <span aria-hidden="true">
          {pad(order)} / {pad(total)} — {name}
        </span>
      </p>
      {/*
        Phase 5 slot: the "X-ray [X]" toggle (aria-pressed) mounts here, only for projects with a
        bones layer. The kinetic warp (out to the atlas / into the next project) also hooks the
        links in this bar and in NextProject. Until then these are ordinary links.
      */}
      <div data-xray-slot className="min-w-[1px] sm:min-w-[110px]" />
    </div>
  );
}
