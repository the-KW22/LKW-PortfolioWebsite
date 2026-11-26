"use client";

import Link from "next/link";
import { useEffect } from "react";

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
    <section className="flex min-h-svh flex-col justify-center px-[5vw] py-32">
      <p className="mono-label mb-6 text-lime">Unexpected error</p>
      <h1 className="font-display text-[clamp(48px,9vw,150px)] leading-[0.9] font-black tracking-display">
        Something went <em className="font-serif font-normal text-violet">wrong</em>
      </h1>
      <p className="mt-6 max-w-md text-mute">
        An unexpected error occurred. You can try again or go back.
        {error.digest ? <span className="mono-label mt-2 block">ID: {error.digest}</span> : null}
      </p>
      <div className="mono-label mt-10 flex gap-6">
        <button type="button" onClick={unstable_retry} className="text-ink underline-offset-4 hover:text-violet hover:underline">
          Try again
        </button>
        <Link href="/" className="text-ink underline-offset-4 hover:text-violet hover:underline">
          Go home
        </Link>
        <Link href="/projects" className="text-ink underline-offset-4 hover:text-violet hover:underline">
          View projects
        </Link>
      </div>
    </section>
  );
}
