import type { Metadata } from "next";
import Contact from "@/app/v2/_components/sections/contact/Contact";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://leowkaiwen.dev";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Leow Kai Wen — available for junior software engineering roles, freelance projects, and collaborations. Reach out via email or the contact form.",
  alternates: { canonical: `${siteUrl}/v2/contact-me` },
  openGraph: {
    title: "Contact — Leow Kai Wen",
    description:
      "Available for junior engineering roles, freelance projects, and collaborations. Get in touch via email or the contact form.",
    url: `${siteUrl}/v2/contact-me`,
    images: [
      {
        url: `${siteUrl}/v2/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Contact Leow Kai Wen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Leow Kai Wen",
    description:
      "Available for junior engineering roles, freelance projects, and collaborations. Get in touch via email or the contact form.",
    images: [`${siteUrl}/v2/og-image.png`],
  },
};

export default function ContactMe(){
    return(
        <>
            <Contact />
        </>
    )
}