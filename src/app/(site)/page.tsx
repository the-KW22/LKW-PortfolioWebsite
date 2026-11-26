import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/Hero";
import { About } from "@/components/sections/home/About";
import { Projects } from "@/components/sections/home/Projects";
import { Experience } from "@/components/sections/home/Experience";
import { TechStack } from "@/components/sections/home/TechStack";
import { Services } from "@/components/sections/home/Services";
import { Contact } from "@/components/sections/home/Contact";

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
      {/* Section ids come from src/content/sections.ts; the ruler and menu depend on them. */}
      <Hero />
      <About />
      <Projects />
      <Experience />
      <TechStack />
      <Services />
      <Contact />
    </>
  );
}
