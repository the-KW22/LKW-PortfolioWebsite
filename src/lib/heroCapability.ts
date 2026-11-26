// Decides whether this device gets the WebGL hero. Phones, touch, low-power and no-WebGL devices
// keep the CSS hero. Pure browser checks, call only on the client.

type NavigatorHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/** `?hero=css` forces the CSS hero, `?hero=gl` skips the power heuristics (testing aid). */
function override(): "css" | "gl" | null {
  const v = new URLSearchParams(window.location.search).get("hero");
  return v === "css" || v === "gl" ? v : null;
}

export function deviceCanRunHeroScene(): boolean {
  const o = override();
  if (o === "css") return false;
  const nav = navigator as NavigatorHints;
  if (o !== "gl") {
    if (nav.connection?.saveData) return false;
    if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4) return false;
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  }
  // WebGL support itself is not probed here (a throwaway context can starve the real one):
  // HeroScene creates the renderer in a try/catch and reports a failure back to Hero.
  return true;
}
