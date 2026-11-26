import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { projects } from "@/content/projects";

export const alt = `${site.name}: ${site.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share card for / (and any page without its own image). Same style as the case-study cards:
// bg #07070a, dotted grid, violet #8b7bff headline, lime #c6f432 accent.
export default function Image() {
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
          <span>PORTFOLIO</span>
          <span style={{ color: "#c6f432" }}>{site.brand.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 170, fontWeight: 900, lineHeight: 0.95, letterSpacing: -8, color: "#8b7bff" }}>
            {site.name}
          </div>
          <div style={{ fontSize: 44, marginTop: 28, color: "#ecebf3", maxWidth: 1000 }}>{site.headline}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#8b8a99" }}>
          <span>{site.location}</span>
          <span>{projects.length} case studies</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
