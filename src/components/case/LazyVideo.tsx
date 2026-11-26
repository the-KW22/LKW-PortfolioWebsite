"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Looping muted video that only loads and plays while on screen. The poster (a real frame) is what
 * no-JS visitors, crawlers and reduced-motion users see; with reduced motion the video never plays.
 */
export function LazyVideo({
  src,
  poster,
  alt,
  width,
  height,
}: {
  src: string;
  poster: string;
  alt: string;
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (el.preload !== "auto") el.preload = "auto";
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "100px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.pause();
    };
  }, [reduced]);

  return (
    <video
      ref={ref}
      className="block h-auto w-full"
      width={width}
      height={height}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
