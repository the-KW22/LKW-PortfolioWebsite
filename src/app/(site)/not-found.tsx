import type { Metadata } from "next";
import Link from "next/link";
import { StatusPage, statusLink } from "@/components/shell/StatusPage";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <StatusPage
      label="Error 404"
      title="Page not"
      accent="found"
      actions={
        <>
          <Link href="/" className={statusLink}>
            Go home
          </Link>
          <Link href="/projects" className={statusLink}>
            View projects
          </Link>
        </>
      }
    >
      <p>This page does not exist. It may have moved, or the address may have a typo.</p>
    </StatusPage>
  );
}
