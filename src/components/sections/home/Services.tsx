import "./home.css";
import { Reveal } from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/Tilt";
import { servicesCopy } from "@/content/home";
import { SectionHead } from "./SectionHead";
import { ServiceArt } from "./ServiceArt";

// Bento placement: 3 columns on desktop (web wide, AI tall), 2 on tablet, 1 on mobile.
const span = {
  web: "md:col-span-2",
  ai: "lg:row-span-2",
  motion: "",
  build: "md:col-span-2 lg:col-span-1",
} as const;

/** 06 Services: a bento grid of four tiles, each with a line-art diagram of what it delivers. */
export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="px-[5vw] py-[16vh] lg:flex lg:h-svh lg:min-h-[600px] lg:flex-col lg:pt-[11svh] lg:pb-[4svh]">
      <SectionHead
        num="06"
        label="Services"
        id="services-title"
        lines={servicesCopy.titleLines}
        accent="build"
        tight
      />
      <Reveal
        as="ul"
        selector="[data-card]"
        y={80}
        stagger={0.1}
        start="top 80%"
        className="grid list-none gap-4 md:grid-cols-2 lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:grid-rows-[repeat(2,minmax(0,1fr))] lg:gap-[clamp(8px,1.6svh,16px)]"
      >
        {servicesCopy.cards.map((c, i) => (
          <li key={c.id} data-card className={`lg:min-h-0 ${span[c.id as keyof typeof span]}`}>
            <Tilt
              max={4}
              className="group relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[18px] border border-[#23222e] bg-[#0c0c12] p-[26px] lg:min-h-0 lg:p-[clamp(12px,2.2svh,26px)] transition-colors duration-300 hover:border-violet focus-within:border-violet"
            >
              <span
                aria-hidden="true"
                className="card-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span
                aria-hidden="true"
                data-num={String(i + 1).padStart(2, "0")}
                // Generated content, so the numeral is not text for contrast audits.
                className="mono-label before:content-[attr(data-num)] text-mute"
              />
              <div className="my-5 max-h-72 min-h-40 flex-1 lg:my-[1.2svh] lg:max-h-none lg:min-h-0">
                <ServiceArt id={c.id as keyof typeof span} />
              </div>
              <h3 className="font-display text-[28px] leading-[1.05] lg:text-[clamp(18px,3.2svh,28px)] font-extrabold tracking-[-0.03em]">
                {c.title}
              </h3>
              <p className="mt-3 max-w-xl text-[14.5px] leading-[1.55] lg:mt-[0.8svh] lg:text-[clamp(12px,1.9svh,14.5px)] lg:leading-[1.4] text-mute">{c.body}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5 lg:mt-[1.2svh]" aria-label="Tools">
                {c.tags.map((t) => (
                  <li key={t} className="rounded-full border border-[#2a2935] px-2.5 py-0.5 text-[11px] text-[#b9b8c6]">
                    {t}
                  </li>
                ))}
              </ul>
            </Tilt>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
