import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/Hero";
import { About } from "@/components/sections/home/About";
import { Projects } from "@/components/sections/home/Projects";
import { Experience } from "@/components/sections/home/Experience";
import { TechStack } from "@/components/sections/home/TechStack";
import { Services } from "@/components/sections/home/Services";
import { Contact } from "@/components/sections/home/Contact";

import { SITE_URL, site } from "@/content/site";
import { SITE_DESCRIPTION, SITE_NAME, jsonLdString, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ description: SITE_DESCRIPTION, path: "/" });

export default function Home() {
  // Everything below comes from src/content/site.ts. No phone number, by design.
  const sameAs = [site.links.github, site.links.linkedin].filter((u): u is string => !!u);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: site.name,
    url: SITE_URL,
    email: site.email,
    jobTitle: site.headline,
    description: SITE_DESCRIPTION,
    address: { "@type": "PostalAddress", addressLocality: "Kuala Lumpur", addressCountry: "MY" },
    sameAs,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en",
    author: { "@id": `${SITE_URL}/#person` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(websiteSchema) }} />
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
