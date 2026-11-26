import type { Media } from "../types";

/** A missing screenshot. Renders as a generated "Screenshot coming" plate, never as real content. */
export function placeholderMedia(alt: string, width = 1600, height = 900): Media {
  return { src: null, alt, width, height };
}

/** A real full-width screenshot copied into public/images/projects/<slug>/. */
export function shot(path: string, alt: string, width = 1600, height = 771): Media {
  return { src: path, alt, width, height };
}

/** True for text that still needs the owner (starts with the TODO(owner) marker). */
export const isTodo = (s: string | null | undefined): boolean =>
  !!s && s.trimStart().startsWith("TODO(owner)");
