"use client";

import Link from "next/link";
import { useEffect } from "react";
import { StatusPage, statusLink } from "@/components/shell/StatusPage";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      label="Unexpected error"
      title="Something went"
      accent="wrong"
      actions={
        <>
          <button type="button" onClick={unstable_retry} className={statusLink}>
            Try again
          </button>
          <Link href="/" className={statusLink}>
            Go home
          </Link>
          <Link href="/projects" className={statusLink}>
            View projects
          </Link>
        </>
      }
    >
      <p>An unexpected error occurred. You can try again or go back.</p>
      {error.digest ? <p className="mono-label mt-2">ID: {error.digest}</p> : null}
    </StatusPage>
  );
}
