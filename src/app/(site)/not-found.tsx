import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col justify-center px-[5vw] py-32">
      <p className="mono-label mb-6 text-lime">Error 404</p>
      <h1 className="font-display text-[clamp(48px,9vw,150px)] leading-[0.9] font-black tracking-display">
        Page not <em className="font-serif font-normal text-violet">found</em>
      </h1>
      <p className="mt-6 max-w-md text-mute">
        This page does not exist. It may have moved, or the address may have a typo.
      </p>
      <div className="mono-label mt-10 flex gap-6">
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
