// Home page sections in order (design spec section 4). Phase 2 sections must use these ids on
// their root <section> elements: the header ruler, the menu and the anchor redirects
// (/about-me -> /#about, /contact-me -> /#contact) all read this list.
export interface HomeSection {
  id: string;
  num: string;
  label: string;
}

export const homeSections: HomeSection[] = [
  { id: "hero", num: "01", label: "Index" },
  { id: "about", num: "02", label: "About" },
  { id: "projects", num: "03", label: "Projects" },
  { id: "experience", num: "04", label: "Experience" },
  { id: "stack", num: "05", label: "Stack" },
  { id: "services", num: "06", label: "Services" },
  { id: "contact", num: "07", label: "Contact" },
];

// DRAFT: short line shown in the menu side panel (owner approves copy in Phase 7).
export const menuCopy = {
  sayHi: "Have a role, a freelance job or a wild idea? I'd love to hear it.", // DRAFT
};
