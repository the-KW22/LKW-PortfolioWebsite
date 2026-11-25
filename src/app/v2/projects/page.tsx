import type { Metadata } from "next";
import ProjectCarouselSection from "@/app/v2/_components/sections/projects/ProjectCarouselSection";
import ProjectHero from "@/app/v2/_components/sections/projects/ProjectHero";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://leowkaiwen.dev";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore projects built by Leow Kai Wen — full-stack web apps, interactive UIs, and digital tools built with Next.js, React, TypeScript, and modern web technologies.",
  alternates: { canonical: `${siteUrl}/v2/projects` },
  openGraph: {
    title: "Projects — Leow Kai Wen",
    description:
      "Full-stack web applications and interactive UIs built with Next.js, React, and TypeScript by Leow Kai Wen.",
    url: `${siteUrl}/v2/projects`,
    images: [
      {
        url: `${siteUrl}/v2/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Projects by Leow Kai Wen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Leow Kai Wen",
    description:
      "Full-stack web applications and interactive UIs built with Next.js, React, and TypeScript by Leow Kai Wen.",
    images: [`${siteUrl}/v2/og-image.png`],
  },
};

export default function Projects() {
  return (
    <>
      <ProjectHero />
      <ProjectCarouselSection />
    </>
  )
}