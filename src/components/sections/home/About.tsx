import { SplitText } from "@/components/motion/SplitText";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { aboutCopy } from "@/content/home";

/** 02 About: statement that lights up word by word, then four CV facts that count up. */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="px-[5vw] pt-[22vh] pb-[18vh]">
      <p className="mono-label flex items-center gap-[18px] text-mute">
        <b className="font-medium text-lime">02</b>
        <span id="about-title">About</span>
      </p>
      <SplitText
        as="p"
        by="words"
        mode="scrub"
        text={aboutCopy.statement}
        accent={aboutCopy.accent}
        className="mt-10 block max-w-[1250px] font-serif text-[clamp(30px,4.6vw,72px)] leading-[1.1]"
      />
      <Reveal selector="[data-fact]" stagger={0.1} className="mt-[12vh] grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {aboutCopy.facts.map((f) => (
          <div key={f.label} data-fact className="border-t border-line pt-[18px]">
            <Counter
              value={f.value}
              suffix={f.suffix}
              from={f.from}
              className={`block font-display text-[clamp(46px,5vw,84px)] leading-none font-black tracking-display ${f.ai ? "text-lime" : ""}`}
            />
            <p className="mt-2 text-sm leading-normal text-mute">{f.label}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
