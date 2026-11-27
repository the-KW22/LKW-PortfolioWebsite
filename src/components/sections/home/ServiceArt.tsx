// Line-art diagrams for the Services bento tiles. Decorative (aria-hidden); the animations are CSS
// keyframes in home.css (.svc-*) and are switched off there for prefers-reduced-motion, leaving the
// drawn diagram. Strokes use currentColor so the tile can recolour them on hover; lime marks the live part.
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const T = { fill: "currentColor", fontSize: 9, fontFamily: "var(--font-mono, monospace)", textAnchor: "middle" } as const;

function Web() {
  return (
    <svg viewBox="0 0 400 150" aria-hidden="true" className="svc-art size-full">
      <g {...S}>
        <rect x="10" y="20" width="120" height="110" rx="8" />
        <path d="M10 40h120" />
        <path d="M24 29h.1M34 29h.1M44 29h.1" strokeWidth="4" />
        <rect x="22" y="52" width="60" height="8" rx="4" />
        <rect x="22" y="68" width="96" height="30" rx="6" />
        <rect x="22" y="106" width="40" height="12" rx="6" />
        <rect x="165" y="45" width="70" height="60" rx="8" />
        <path d="M185 45v-8a15 15 0 0 1 30 0v8" />
        <path d="M300 55v40c0 8 18 14 40 14s40-6 40-14V55" />
        <ellipse cx="340" cy="55" rx="40" ry="12" />
        <path d="M300 75c0 8 18 14 40 14s40-6 40-14" />
      </g>
      <g {...S} stroke="var(--lime)" strokeDasharray="4 6" className="svc-flow">
        <path d="M130 75h35" />
        <path d="M235 75h65" />
      </g>
      <text x="200" y="79" {...T}>API</text>
      <text x="340" y="34" {...T} fill="var(--lime)">DB</text>
    </svg>
  );
}

function Ai() {
  return (
    <svg viewBox="0 0 200 300" aria-hidden="true" className="svc-art size-full">
      <g {...S}>
        <rect x="60" y="8" width="80" height="26" rx="13" />
        <rect x="50" y="62" width="100" height="30" rx="8" />
        <rect x="50" y="120" width="100" height="30" rx="8" />
        <path d="M100 178l32 26-32 26-32-26z" />
      </g>
      <g {...S} strokeDasharray="4 6" className="svc-flow">
        <path d="M100 34v28M100 92v28M100 150v28" />
        <path d="M100 230v15H32v11M100 230v26M100 230v15h68v11" />
      </g>
      <text x="100" y="81" {...T}>draft</text>
      <text x="100" y="139" {...T}>score</text>
      <text x="100" y="207" {...T}>gate</text>
      {(["send", "hold", "escalate"] as const).map((l, i) => (
        <g key={l} className="svc-out" style={{ animationDelay: `${i * 1.3}s` }}>
          <rect x={4 + i * 68} y="256" width="56" height="24" rx="12" {...S} />
          <text x={32 + i * 68} y="272" {...T} fontSize={8}>{l}</text>
        </g>
      ))}
      <circle cx="100" cy="21" r="5" fill="var(--lime)" className="svc-packet" />
    </svg>
  );
}

function Motion() {
  return (
    <svg viewBox="0 0 220 150" aria-hidden="true" className="svc-art size-full">
      <g {...S}>
        <g className="svc-float" style={{ animationDelay: "-2s" }} opacity=".4">
          <rect x="50" y="22" width="140" height="86" rx="10" />
        </g>
        <g className="svc-float" style={{ animationDelay: "-1s" }} opacity=".7">
          <rect x="35" y="36" width="140" height="86" rx="10" />
        </g>
        <g className="svc-float">
          <rect x="20" y="50" width="140" height="86" rx="10" stroke="var(--lime)" />
          <path d="M36 70h50M36 84h80M36 98h30" />
        </g>
      </g>
      <g transform="translate(110 75) scale(1 .3)">
        <g className="svc-spin">
          <circle r="100" {...S} strokeDasharray="2 6" />
          <circle cx="100" r="9" fill="var(--lime)" />
          <circle cx="-100" r="9" fill="var(--lime)" />
        </g>
      </g>
    </svg>
  );
}

function Build() {
  return (
    <svg viewBox="0 0 220 150" aria-hidden="true" className="svc-art size-full">
      <g {...S}>
        <rect x="12" y="55" width="62" height="40" rx="7" />
        <rect x="146" y="55" width="62" height="40" rx="7" />
        <rect x="92" y="55" width="36" height="40" rx="7" strokeDasharray="3 5" opacity=".6" />
        <path d="M74 75h18M128 75h18" />
        <path d="M30 70h26M30 80h14M164 70h26M164 80h14" />
      </g>
      <g className="svc-snap">
        <rect x="92" y="55" width="36" height="40" rx="7" {...S} stroke="var(--lime)" fill="var(--bg, #08080c)" />
        <path d="M102 75h16M110 67v16" {...S} stroke="var(--lime)" />
      </g>
    </svg>
  );
}

const ART = { web: Web, ai: Ai, motion: Motion, build: Build };

export function ServiceArt({ id }: { id: keyof typeof ART }) {
  const Art = ART[id];
  return <Art />;
}
