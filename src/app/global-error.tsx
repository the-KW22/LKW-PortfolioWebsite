"use client";

// Last-resort fallback when the root layout itself fails. It replaces the whole document, so it is
// self-contained: inline styles only, no fonts, no providers, nothing from the app shell.
export default function GlobalError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  const link = { color: "#ecebf3", textDecoration: "underline", textUnderlineOffset: 4, background: "none", border: 0, padding: 0, font: "inherit", cursor: "pointer" } as const;
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#07070a", color: "#ecebf3", fontFamily: "system-ui, sans-serif" }}>
        <title>Something went wrong | Leow Kai Wen</title>
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "8rem 5vw" }}>
          <p style={{ color: "#c6f432", fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Unexpected error
          </p>
          <h1 style={{ fontSize: "clamp(44px, 9vw, 130px)", lineHeight: 0.95, margin: "1.5rem 0 0", fontWeight: 900, letterSpacing: "-0.04em" }}>
            Something went <em style={{ color: "#8b7bff", fontFamily: "Georgia, serif", fontWeight: 400 }}>wrong</em>
          </h1>
          <p style={{ color: "#8b8a99", maxWidth: 420, marginTop: 24 }}>The site hit an unexpected problem. You can try again or go back to the home page.</p>
          <p style={{ display: "flex", gap: 24, marginTop: 40, fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            <button type="button" onClick={unstable_retry} style={link} autoFocus>
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- document outside the app shell: a full load is intended */}
            <a href="/" style={link}>
              Go home
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
