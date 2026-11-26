import type { Tech } from "@/content/types";
import { cn } from "@/lib/utils";

/** Technology pills. AI technologies render in lime (design spec section 2). */
export function StackList({ stack, className }: { stack: Tech[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Technologies">
      {stack.map((t) => (
        <li
          key={t.name}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium",
            t.ai ? "border-lime/50 text-lime" : "border-[#2a2935] text-ink",
          )}
        >
          {t.name}
        </li>
      ))}
    </ul>
  );
}
