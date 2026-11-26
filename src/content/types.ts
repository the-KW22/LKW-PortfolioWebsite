// Content model for portfolio ver 3.0. All copy lives in src/content.
//
// Markers (grep for them before launch):
// - `DRAFT`: wording written by the agent, waiting for the owner's approval (Phase 7).
// - `TODO(owner)`: a fact or asset the owner still has to supply. Never fill these with guesses.

export type Availability = "open" | "freelance-only" | "closed";

export interface SiteConfig {
  url: string;
  name: string;
  brand: string;
  headline: string;
  location: string;
  timezone: string;
  email: string;
  links: {
    github: string;
    linkedin: string | null;
    resume: string;
  };
  availability: Availability;
  availabilityCopy: Record<Availability, string>;
  /** Note on the atlas board, per availability value (review decision 14). */
  atlasNote: Record<Availability, string>;
  replyTime: string | null;
  pastVersions: { label: string; href: string }[];
}

/** One technology tag. `ai` tags render in lime (spec section 2). */
export interface Tech {
  name: string;
  ai?: boolean;
}

export interface Stat {
  value: string;
  label: string;
}

/** A picture or video on a case-study page. `src: null` renders a generated placeholder plate. */
export interface Media {
  /** Public path under /images/projects/<slug>/, or null while the owner has not supplied it. */
  src: string | null;
  alt: string;
  width: number;
  height: number;
  /** When set, the media is a looping muted video (lazy-loaded) and `src` is its poster image. */
  video?: string;
  /** Marks a real screenshot as a placeholder-quality stand-in. Rare; prefer src: null. */
  note?: string;
}

export interface GalleryScreen {
  media: Media;
  caption: string;
}

export interface StorySection {
  id: "problem" | "approach" | "decisions" | "outcome";
  title: string;
  /** The key sentence; revealed word by word on scroll. */
  lead: string;
  paragraphs: string[];
  /** true = agent-written or unknown text the owner must replace (shown with a DRAFT tag). */
  draft: boolean;
}

export interface Decision {
  title: string;
  body: string;
  draft: boolean;
}

export interface DiagramNode {
  id: string;
  label: string;
  sub?: string;
  /** Centre, in a 0-100 grid (x = left to right, y = top to bottom). */
  x: number;
  y: number;
  ai?: boolean;
}

export interface DiagramLink {
  from: string;
  to: string;
  label?: string;
  /** AI links draw in lime. */
  ai?: boolean;
}

export interface Diagram {
  description: string;
  nodes: DiagramNode[];
  links: DiagramLink[];
}

export interface CaseStudy {
  hero: Media;
  /** Pinned-gallery screens. Empty = no gallery section. */
  gallery: GalleryScreen[];
  story: StorySection[];
  decisions: Decision[];
  /** null = no architecture section. */
  diagram: Diagram | null;
}

export type ProjectCategory = "full-stack" | "component-library" | "web-design";

export interface Project {
  slug: string;
  /** Display order on the atlas, list view and case-study counter ("01 / 05"). */
  order: number;
  name: string;
  category: ProjectCategory;
  status: "live" | "in-progress";
  /** null until the owner confirms it. */
  year: number | null;
  tagline: string;
  summary: string;
  role: string;
  stack: Tech[];
  links: {
    live: string | null;
    liveNote?: string;
    github: string | null;
  };
  /** Real numbers only. null = no stats row. */
  stats: Stat[] | null;
  /** X-ray depth for v1 (spec review decision 5). */
  xray: "deep" | "simple" | "none";
  caseStudy: CaseStudy;
}

export interface ExperienceProject {
  id: string;
  name: string;
  stack: Tech[];
  points: string[];
  /** Key numbers shown in lime. Each must carry its own qualifier in `label`. */
  highlights?: Stat[];
}

export interface ExperienceEntry {
  id: string;
  kind: "work" | "education";
  role: string;
  organisation: string;
  /** Display string, e.g. "May 2026 – Oct 2026". */
  period: string;
  points: string[];
  projects?: ExperienceProject[];
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: Tech[];
}
