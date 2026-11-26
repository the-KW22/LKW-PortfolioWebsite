"use client";

import { useRef } from "react";
import { useScramble } from "@/components/motion/useScramble";

/** Email as a big link; the address decodes on hover and keyboard focus. */
export function MailLink({ email }: { email: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const run = useScramble();
  return (
    <a
      href={`mailto:${email}`}
      onPointerEnter={() => run(ref.current, email)}
      onFocus={() => run(ref.current, email)}
      className="inline-block border-b border-[#3a3950] pb-2 text-[clamp(24px,3vw,46px)] font-semibold tracking-[-0.02em] break-all transition-colors hover:text-lime focus-visible:text-lime"
    >
      <span ref={ref}>{email}</span>
    </a>
  );
}
