import type { Stat } from "@/content/types";
import { Counter } from "@/components/motion/Counter";

/** Big counters. Renders nothing when a project has no stats (never a row of dashes). */
export function StatRow({ stats }: { stats: Stat[] | null }) {
  if (!stats || stats.length === 0) return null;
  return (
    <section
      id="stats"
      data-case-section
      data-case-label="Numbers"
      aria-label="Key numbers"
      className="px-[5vw] py-[14vh]"
    >
      <dl className="grid gap-10 sm:grid-cols-3 sm:gap-5">
        {stats.map((s) => {
          const n = /^\d+$/.test(s.value) ? Number(s.value) : null;
          return (
            <div key={s.label} className="flex flex-col-reverse justify-end border-t border-line pt-6">
              <dt className="mt-2 text-mute">{s.label}</dt>
              <dd className="font-display text-[clamp(72px,10vw,150px)] leading-none font-black tracking-display">
                {n !== null ? <Counter value={n} /> : s.value}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
