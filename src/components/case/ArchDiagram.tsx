"use client";

import { useRef } from "react";
import type { Diagram } from "@/content/types";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/hooks/useMotion";

const W = 1000;
const H = 520;
const NODE_W = 190;
const NODE_H = 70;

/** Line between two node rectangles, clipped to their borders. */
function edge(a: { cx: number; cy: number }, b: { cx: number; cy: number }) {
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const t = Math.min(
    dx === 0 ? Infinity : NODE_W / 2 / Math.abs(dx),
    dy === 0 ? Infinity : NODE_H / 2 / Math.abs(dy),
  );
  return { x1: a.cx + dx * t, y1: a.cy + dy * t, x2: b.cx - dx * t, y2: b.cy - dy * t };
}

/**
 * Architecture diagram. The lines draw as the section scrolls into view (scrubbed). Without JS or
 * with reduced motion the finished diagram is shown. A text list of the connections sits below, so
 * the same information is available to screen readers and on narrow screens.
 */
export function ArchDiagram({ diagram, name }: { diagram: Diagram; name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = new Map(
    diagram.nodes.map((n) => [n.id, { cx: (n.x / 100) * W, cy: (n.y / 100) * H, ai: !!n.ai, label: n.label }]),
  );

  useMotion(
    ref,
    () => {
      const el = ref.current;
      if (!el) return;
      const lines = gsap.utils.toArray<SVGElement>("[data-line]", el);
      const dots = gsap.utils.toArray<SVGElement>("[data-dot]", el);
      const nodes = gsap.utils.toArray<SVGElement>("[data-node]", el);
      gsap.set(lines, { strokeDashoffset: 1 });
      gsap.set(dots, { opacity: 0 });
      gsap.set(nodes, { opacity: 0.25 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 55%", scrub: 1 },
      });
      tl.to(nodes, { opacity: 1, stagger: 0.12, duration: 0.5 }, 0);
      tl.to(lines, { strokeDashoffset: 0, stagger: 0.25, duration: 1 }, 0.2);
      tl.to(dots, { opacity: 1, stagger: 0.25, duration: 0.2 }, 1.1);
    },
    [diagram],
  );

  return (
    <div ref={ref}>
      <div className="overflow-x-auto rounded-2xl border border-line bg-card">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`${name} architecture: ${diagram.description}`}
          className="block h-auto w-full min-w-[720px]"
        >
          {diagram.links.map((l, i) => {
            const a = pos.get(l.from);
            const b = pos.get(l.to);
            if (!a || !b) return null;
            const e = edge(a, b);
            const colour = l.ai ? "var(--lime)" : "var(--violet)";
            return (
              <g key={i}>
                <line
                  data-line
                  x1={e.x1}
                  y1={e.y1}
                  x2={e.x2}
                  y2={e.y2}
                  pathLength={1}
                  stroke={colour}
                  strokeWidth={2}
                  strokeDasharray={1}
                  strokeDashoffset={0}
                  strokeLinecap="round"
                />
                <circle data-dot cx={e.x2} cy={e.y2} r={5} fill={colour} />
              </g>
            );
          })}
          {diagram.nodes.map((n) => {
            const cx = (n.x / 100) * W;
            const cy = (n.y / 100) * H;
            return (
              <g key={n.id} data-node>
                <rect
                  x={cx - NODE_W / 2}
                  y={cy - NODE_H / 2}
                  width={NODE_W}
                  height={NODE_H}
                  rx={14}
                  fill="#0b0b12"
                  stroke={n.ai ? "var(--lime)" : "#2d2c3a"}
                  strokeWidth={1.5}
                />
                <text
                  x={cx}
                  y={n.sub ? cy - 4 : cy + 6}
                  textAnchor="middle"
                  fill="var(--ink)"
                  fontSize={20}
                  fontWeight={700}
                  style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}
                >
                  {n.label}
                </text>
                {n.sub ? (
                  <text
                    x={cx}
                    y={cy + 19}
                    textAnchor="middle"
                    fill="var(--mute)"
                    fontSize={13}
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}
                  >
                    {n.sub}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      <ul className="mono-label mt-6 grid gap-2 sm:grid-cols-2" aria-label="Connections">
        {diagram.links.map((l, i) => (
          <li key={i} className={l.ai ? "text-lime" : "text-mute"}>
            {pos.get(l.from)?.label} → {pos.get(l.to)?.label}
            {l.ai ? " (AI)" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
