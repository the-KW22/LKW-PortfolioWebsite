"use client";

import { useRef } from "react";
import { useMagnetic } from "./useMagnetic";
import { cn } from "@/lib/utils";

/** Wrap a button or link: the wrapper moves toward the pointer, the child stays a normal element. */
export function Magnetic({
  children,
  className,
  x,
  y,
}: {
  children: React.ReactNode;
  className?: string;
  x?: number;
  y?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useMagnetic(ref, { x, y });
  return (
    <span ref={ref} className={cn("inline-flex", className)}>
      {children}
    </span>
  );
}
