import Link from "next/link";
import { XrayToggle } from "@/components/xray/XrayToggle";

/**
 * Sticky bar under the fixed header (blend mode difference): back link, counter, X-ray toggle.
 * It sits below the header (which is 76-84px tall) so the logo and Menu button stay reachable.
 * "Back to projects" is a real link to /projects; the warp provider turns a plain click into the
 * reverse warp back to where the visitor left the Atlas (data-warp="back").
 */
export function CaseTopBar({
  order,
  total,
  name,
  hasXray,
}: {
  order: number;
  total: number;
  name: string;
  hasXray: boolean;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="sticky top-[76px] z-40 mt-[76px] grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-[5vw] py-3 text-white mix-blend-difference sm:top-[84px] sm:mt-[84px]">
      <Link
        href="/projects"
        data-warp="back"
        data-warp-name={name}
        className="mono-label justify-self-start rounded-md py-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        ← Back to projects
      </Link>
      <p className="mono-label hidden sm:block">
        <span className="sr-only">{`Project ${order} of ${total}: ${name}`}</span>
        <span aria-hidden="true">
          {pad(order)} / {pad(total)} — {name}
        </span>
      </p>
      <div data-xray-slot className="col-start-3 justify-self-end">
        {hasXray ? <XrayToggle /> : null}
      </div>
    </div>
  );
}
