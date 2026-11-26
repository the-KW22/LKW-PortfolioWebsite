import type { Decision } from "@/content/types";
import { DraftTag } from "./TodoText";

/** A card for one engineering decision: what was chosen and why it matters. */
export function DecisionCallout({ decision, index }: { decision: Decision; index: number }) {
  return (
    <li className="rounded-2xl border border-line bg-card p-6">
      <p className="mono-label text-lime">Decision {String(index + 1).padStart(2, "0")}</p>
      <h4 className="font-display mt-3 text-xl leading-tight font-extrabold tracking-[-0.02em]">
        {decision.title}
        {decision.draft ? <DraftTag /> : null}
      </h4>
      <p className="mt-2 text-mute">{decision.body}</p>
    </li>
  );
}
