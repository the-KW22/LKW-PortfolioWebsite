// Layout and copy for the Atlas board (design spec section 4, "03 Personal projects").
// Board coordinates are the item CENTRE in board pixels; z is the CSS translateZ depth in px.
// Only facts from the CV and repos appear here. Items are decorative unless they are a project card.

export const BOARD = { w: 3600, h: 2400 } as const;
export const BOARD_CENTRE = { x: BOARD.w / 2, y: BOARD.h / 2 } as const;

export interface Placement {
  x: number;
  y: number;
  z: number;
  /** degrees */
  r: number;
}

/** Where each project card sits, by slug. A project without an entry is placed on a fallback grid. */
export const projectPlacements: Record<string, Placement> = {
  coreex: { x: 1000, y: 800, z: 60, r: -1.5 },
  asteroidui: { x: 2600, y: 760, z: 40, r: 1.5 },
  moonwave: { x: 2700, y: 1660, z: 30, r: -1.5 },
  brickly: { x: 940, y: 1680, z: 50, r: 1.5 },
  petcare: { x: 1800, y: 1980, z: 20, r: -1 },
};

export const titlePlacement: Placement = { x: BOARD_CENTRE.x, y: BOARD_CENTRE.y - 20, z: 0, r: 0 };

export type TextureItem =
  | { id: string; kind: "note"; text: string; at: Placement }
  | { id: string; kind: "availability"; at: Placement }
  | { id: string; kind: "code"; lines: string[]; at: Placement }
  | { id: string; kind: "terminal"; at: Placement }
  | { id: string; kind: "polaroid"; caption: string; href: string; at: Placement };

export const textureItems: TextureItem[] = [
  {
    id: "quote",
    kind: "note",
    // DRAFT: a generic working motto in the owner's voice. Owner to confirm or replace (Phase 7).
    text: "Ship small, write down why, then ship again.",
    at: { x: 1700, y: 520, z: 90, r: -3 },
  },
  { id: "availability", kind: "availability", at: { x: 2420, y: 2080, z: 110, r: 3 } },
  {
    id: "snippet-search",
    kind: "code",
    // Illustrative sketch, labelled as such on the board. Not copied from a repo.
    lines: [
      "// illustrative sketch",
      "@Tool(name = \"search_notes\")",
      "List<Note> search(String q) {",
      "  var v = embed(q);   // pgvector",
      "  return repo.nearest(v, 8);",
      "}",
    ],
    at: { x: 420, y: 1200, z: 70, r: 2 },
  },
  { id: "terminal", kind: "terminal", at: { x: 3120, y: 1120, z: 40, r: -2 } },
  {
    id: "polaroid-v1",
    kind: "polaroid",
    caption: "Where it started",
    href: "/v1",
    at: { x: 3040, y: 1900, z: 80, r: 5 },
  },
  {
    id: "egg-x",
    kind: "note",
    text: "Secret: press X inside any project.",
    at: { x: 3260, y: 2200, z: 30, r: -4 },
  },
  {
    id: "egg-edge",
    kind: "note",
    text: "You found the edge of the map. Hi.",
    at: { x: 220, y: 200, z: 30, r: 4 },
  },
  {
    id: "egg-corner",
    kind: "note",
    text: "Nothing here either. Keep looking.",
    at: { x: 3380, y: 220, z: 20, r: -3 },
  },
];

/** Zoom limits and the intro camera. */
export const ZOOM = { min: 0.3, max: 1.6, introFrom: 2.3, rest: 0.78 } as const;
