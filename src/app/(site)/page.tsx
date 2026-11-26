import type { Metadata } from "next";
import { homeSections } from "@/content/sections";
import { MotionKit } from "@/components/shell/MotionKit";

import { SITE_URL as siteUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "Leow Kai Wen — Full Stack Developer",
  description:
    "Portfolio of Leow Kai Wen, a fresh graduate Full Stack Developer from Kuala Lumpur, Malaysia. Building modern web applications with Next.js, React, TypeScript, and Tailwind CSS.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Leow Kai Wen — Full Stack Developer",
    description:
      "Fresh graduate Full Stack Developer from Kuala Lumpur. Crafting responsive web apps, clean APIs, and modern digital experiences.",
    url: siteUrl,
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Leow Kai Wen — Full Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leow Kai Wen — Full Stack Developer",
    description:
      "Fresh graduate Full Stack Developer from Kuala Lumpur. Crafting responsive web apps, clean APIs, and modern digital experiences.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function Home() {
  const sameAs: string[] = [];
  if (process.env.NEXT_PUBLIC_GITHUB_URL) sameAs.push(process.env.NEXT_PUBLIC_GITHUB_URL);
  if (process.env.NEXT_PUBLIC_LINKEDIN_URL) sameAs.push(process.env.NEXT_PUBLIC_LINKEDIN_URL);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Leow Kai Wen",
    url: siteUrl,
    email: "kwenleow@gmail.com",
    jobTitle: "Full Stack Developer",
    description:
      "Fresh graduate Full Stack Developer from Kuala Lumpur, Malaysia.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kuala Lumpur",
      addressCountry: "MY",
    },
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Full Stack Development",
    ],
    sameAs,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Leow Kai Wen Portfolio",
    url: siteUrl,
    author: {
      "@type": "Person",
      name: "Leow Kai Wen",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* PLACEHOLDER (Phase 1): one tall section per home section so the ruler, menu and anchors
          can be tried. Phase 2 replaces each with the real section, keeping the same ids. */}
      {homeSections.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className="relative flex min-h-svh flex-col justify-center px-[5vw] py-32"
        >
          <p className="mono-label mb-6 text-mute">
            {s.num} — {s.label}
          </p>
          <h2 className="font-display text-[clamp(40px,7vw,110px)] leading-[0.95] font-black tracking-display">
            {s.label}
          </h2>
          <p className="mt-6 max-w-md text-mute">Placeholder. The real section is built in Phase 2.</p>
          {i === 0 ? <MotionKit /> : null}
        </section>
      ))}
    </>
  );
}
