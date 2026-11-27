import { BOARD } from "@/content/atlas";

// Static decoration behind the Atlas items: blueprint markings on the board plane, plus two far layers
// (light pools, dust) pushed back in 3D. Nothing here animates: depth comes from the camera panning
// under the stage perspective, so far layers drift slower than the board for free. All aria-hidden.
const MARK_STEP = 600;
const xs = Array.from({ length: BOARD.w / MARK_STEP + 1 }, (_, i) => i * MARK_STEP);
const ys = Array.from({ length: BOARD.h / MARK_STEP + 1 }, (_, i) => i * MARK_STEP);
const label = (n: number) => String(n).padStart(4, "0");

function Markings() {
  return (
    <svg
      className="atlas-marks"
      width={BOARD.w}
      height={BOARD.h}
      viewBox={`0 0 ${BOARD.w} ${BOARD.h}`}
      aria-hidden="true"
    >
      <defs>
        <pattern id="atlas-tick-x" width="50" height="16" patternUnits="userSpaceOnUse">
          <path d="M0.5 10V16" />
        </pattern>
        <pattern id="atlas-tick-x-major" width="300" height="16" patternUnits="userSpaceOnUse">
          <path d="M0.5 0V16" />
        </pattern>
        <pattern id="atlas-tick-y" width="16" height="50" patternUnits="userSpaceOnUse">
          <path d="M10 0.5H16" />
        </pattern>
        <pattern id="atlas-tick-y-major" width="16" height="300" patternUnits="userSpaceOnUse">
          <path d="M0 0.5H16" />
        </pattern>
      </defs>
      {/* Rulers along the top and left edges. */}
      <g className="atlas-ruler">
        <rect x="40" y="26" width={BOARD.w - 80} height="16" fill="url(#atlas-tick-x)" />
        <rect x="40" y="26" width={BOARD.w - 80} height="16" fill="url(#atlas-tick-x-major)" />
        <rect x="26" y="40" width="16" height={BOARD.h - 80} fill="url(#atlas-tick-y)" />
        <rect x="26" y="40" width="16" height={BOARD.h - 80} fill="url(#atlas-tick-y-major)" />
        {Array.from({ length: BOARD.w / 300 - 1 }, (_, i) => (i + 1) * 300).map((x) => (
          <text key={`x${x}`} x={x + 8} y="66">{label(x)}</text>
        ))}
        {Array.from({ length: BOARD.h / 300 - 1 }, (_, i) => (i + 1) * 300).map((y) => (
          <text key={`y${y}`} x="62" y={y + 4}>{label(y)}</text>
        ))}
      </g>
      {/* Registration crosshairs on a coarse grid. */}
      <g className="atlas-cross">
        {xs.slice(1, -1).flatMap((x) =>
          ys.slice(1, -1).map((y) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
              <path d="M-14 0H14M0 -14V14" />
              <circle r="5" />
              <text x="14" y="-10">{label(x)} · {label(y)}</text>
            </g>
          )),
        )}
      </g>
      {/* Lime corner brackets: a deliberate board edge. */}
      <path
        className="atlas-brackets"
        d={`M22 110V22H110 M${BOARD.w - 110} 22H${BOARD.w - 22}V110 M${BOARD.w - 22} ${BOARD.h - 110}V${BOARD.h - 22}H${BOARD.w - 110} M110 ${BOARD.h - 22}H22V${BOARD.h - 110}`}
      />
    </svg>
  );
}

export function AtlasBackdrop() {
  return (
    <>
      <div className="atlas-far atlas-far-light" aria-hidden="true" />
      <div className="atlas-far atlas-far-dust" aria-hidden="true" />
      <Markings />
    </>
  );
}
