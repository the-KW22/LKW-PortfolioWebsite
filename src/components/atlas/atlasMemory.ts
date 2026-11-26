// Where the visitor was when they left the Atlas for a case study, so "Back to projects" can return
// to the same place with the camera where they left it (design spec 5.1, review decision 2).
// Held in sessionStorage (per tab) plus one module variable for the hand-over to the next mount.

export interface AtlasCamera {
  x: number;
  y: number;
  z: number;
  mode: "pinned" | "inline" | "fullscreen";
}

export interface AtlasMemory {
  /** Page the visitor left: "/" (the home Atlas or its list view) or "/projects". */
  path: string;
  scrollY: number;
  cam: AtlasCamera | null;
}

const KEY = "lkw-atlas-return";
let getCamera: (() => AtlasCamera) | null = null;
let pending: AtlasCamera | null = null;

/** The mounted AtlasBoard registers how to read its camera target. Returns the unregister function. */
export function registerAtlasCamera(read: () => AtlasCamera): () => void {
  getCamera = read;
  return () => {
    if (getCamera === read) getCamera = null;
  };
}

/** Call just before leaving a page that shows the Atlas or the project list. */
export function rememberAtlas(path: string) {
  const mem: AtlasMemory = { path, scrollY: Math.round(window.scrollY), cam: getCamera ? getCamera() : null };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(mem));
  } catch {
    /* storage blocked: Back simply goes to /projects */
  }
}

export function peekAtlasMemory(): AtlasMemory | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const m = JSON.parse(raw) as AtlasMemory;
    return m && (m.path === "/" || m.path === "/projects") && Number.isFinite(m.scrollY) ? m : null;
  } catch {
    return null;
  }
}

/** The warp hands the saved camera to the next AtlasBoard that mounts. */
export function queueAtlasCamera(cam: AtlasCamera | null) {
  pending = cam;
}

/** AtlasBoard reads this on mount. Only a camera saved in the same mode is applied. */
export function takeAtlasCamera(mode: AtlasCamera["mode"]): AtlasCamera | null {
  // Not consumed here: React strict mode mounts twice. The warp clears it with queueAtlasCamera(null).
  return pending && pending.mode === mode ? pending : null;
}
