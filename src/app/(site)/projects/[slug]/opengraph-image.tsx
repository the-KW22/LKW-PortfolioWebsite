import { ImageResponse } from "next/og";
import { getProject, projects } from "@/content/projects";

export const alt = "Case study by Leow Kai Wen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// Simple typographic card in the site colours (bg #07070a, violet #8b7bff, lime #c6f432).
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  const name = p?.name ?? "Project";
  const tagline = p?.tagline ?? "";
  const stack = (p?.stack ?? []).slice(0, 5).map((t) => t.name).join("  ·  ");
  const num = p ? `${String(p.order).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}` : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07070a",
          backgroundImage: "radial-gradient(#24232f 2px, transparent 2px)",
          backgroundSize: "40px 40px",
          color: "#ecebf3",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, letterSpacing: 4, color: "#8b8a99" }}>
          <span>CASE STUDY  {num}</span>
          <span style={{ color: "#c6f432" }}>LKW22 STUDIO</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: name.length > 9 ? 150 : 190, fontWeight: 900, lineHeight: 0.95, letterSpacing: -8, color: "#8b7bff" }}>
            {name}
          </div>
          <div style={{ fontSize: 38, marginTop: 24, color: "#ecebf3", maxWidth: 980 }}>{tagline}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#8b8a99" }}>
          <span>{stack}</span>
          <span>Leow Kai Wen</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
