import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { redirect } from "next/navigation";
import { site } from "@/content/site";
import { StatusPage, statusLink } from "@/components/shell/StatusPage";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${site.name}.`,
  robots: { index: false, follow: true },
};

/**
 * Stable CV address. When the owner drops the file at public/resume.pdf, this route redirects to it
 * (checked at build time). Until then it shows an honest fallback instead of a 404, and the CV
 * buttons elsewhere are hidden. Which PDF to publish is the owner's call, so nothing is picked.
 */
export default function ResumePage() {
  if (existsSync(join(process.cwd(), "public", "resume.pdf"))) redirect("/resume.pdf");

  return (
    <StatusPage
      label="Résumé"
      title="Résumé"
      accent="on request"
      actions={
        <>
          <a href={`mailto:${site.email}`} className={statusLink}>
            Email me
          </a>
          <Link href="/#about" className={statusLink}>
            About me
          </Link>
          <Link href="/" className={statusLink}>
            Go home
          </Link>
        </>
      }
    >
      <p>The PDF is not published here yet. Email me and I will send the latest version.</p>
    </StatusPage>
  );
}
