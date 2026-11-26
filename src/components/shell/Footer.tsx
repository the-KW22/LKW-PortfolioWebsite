import { site } from "@/content/site";

// Placeholder footer landmark for the Phase 1 shell. Phase 2 replaces it with the full footer
// (giant wordmark, "Built with ...", back to top).
export function Footer() {
  return (
    <footer className="mono-label flex flex-wrap items-center justify-between gap-3 border-t border-line px-[5vw] py-6 text-mute">
      <span>
        © {new Date().getFullYear()} {site.name}
      </span>
      <span>
        Past versions:{" "}
        {site.pastVersions.map((v, i) => (
          <span key={v.href}>
            {i > 0 ? " · " : null}
            {/* Plain <a>: separate documents, not routes of this app. */}
            <a href={v.href} className="text-ink hover:text-violet">
              {v.label}
            </a>
          </span>
        ))}
      </span>
    </footer>
  );
}
