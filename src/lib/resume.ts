/**
 * True when the owner has put the CV at public/resume.pdf (detected at build time in next.config.ts).
 * Until then the CV buttons are hidden and /resume shows an honest fallback page. See docs/v3-qa-report.md.
 */
export const HAS_RESUME = process.env.NEXT_PUBLIC_HAS_RESUME === "1";
