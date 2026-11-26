import type { CaseStudy } from "@/content/types";
import { isTodo } from "@/content/projects/media";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { DecisionCallout } from "./DecisionCallout";
import { DraftTag, TodoText } from "./TodoText";

/** Problem, approach, decisions, outcome. The key sentence lights up word by word as you scroll. */
export function StorySections({ story, decisions }: Pick<CaseStudy, "story" | "decisions">) {
  return (
    <div id="story" data-case-section data-case-label="Story" className="px-[5vw] py-[8vh]">
      {story.map((s, i) => (
        <section
          key={s.id}
          aria-labelledby={`story-${s.id}`}
          className="grid gap-6 border-t border-line py-[10vh] lg:grid-cols-[minmax(160px,1fr)_3fr] lg:gap-[4vw]"
        >
          <h2 id={`story-${s.id}`} className="mono-label text-mute lg:pt-3">
            <span className="mr-3 text-ink">{String(i + 1).padStart(2, "0")}</span>
            {s.title}
            {s.draft && !isTodo(s.lead) ? <DraftTag /> : null}
          </h2>
          <div>
            {isTodo(s.lead) ? (
              <p className="font-display text-[clamp(22px,2.6vw,36px)] leading-snug font-bold">
                <TodoText text={s.lead} />
              </p>
            ) : (
              <SplitText
                as="p"
                mode="scrub"
                text={s.lead}
                className="font-display text-[clamp(26px,3.6vw,56px)] leading-[1.12] font-bold tracking-[-0.03em]"
              />
            )}
            {s.paragraphs.map((p, k) => (
              <Reveal key={k} as="p" className="mt-6 max-w-2xl text-lg leading-relaxed text-mute" y={24}>
                {p}
              </Reveal>
            ))}
            {s.id === "decisions" && decisions.length ? (
              <ul className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="Decisions">
                {decisions.map((d, k) => (
                  <DecisionCallout key={d.title} decision={d} index={k} />
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  );
}
