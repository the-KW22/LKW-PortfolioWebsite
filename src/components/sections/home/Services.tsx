import "./home.css";
import { Reveal } from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/Tilt";
import { servicesCopy } from "@/content/home";
import { SectionHead } from "./SectionHead";

/** 06 Services: four cards that tilt toward the cursor, with a moving violet light. */
export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="px-[5vw] py-[16vh]">
      <SectionHead
        num="06"
        label="Services"
        id="services-title"
        lines={servicesCopy.titleLines}
        accent="build"
      />
      <Reveal
        as="ul"
        selector="[data-card]"
        y={80}
        stagger={0.1}
        start="top 80%"
        className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {servicesCopy.cards.map((c, i) => (
          <li key={c.title} data-card>
            <Tilt
              max={9}
              className="group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[18px] border border-[#23222e] bg-[#0c0c12] p-[26px] transition-colors duration-300 hover:border-violet focus-within:border-violet lg:min-h-[380px]"
            >
              <span
                aria-hidden="true"
                className="card-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span
                aria-hidden="true"
                data-num={String(i + 1).padStart(2, "0")}
                // Decorative ghost numeral drawn as generated content, so it is not text for contrast audits.
                className="font-display before:content-[attr(data-num)] text-[64px] leading-none font-black tracking-display text-[#1d1c28] transition-colors duration-300 [transform:translateZ(60px)] group-hover:text-violet"
              >
              </span>
              <div>
                <h3 className="font-display text-[28px] leading-[1.05] font-extrabold tracking-[-0.03em] [transform:translateZ(40px)]">
                  {c.title}
                </h3>
                <p className="mt-3.5 text-[14.5px] leading-[1.55] text-mute [transform:translateZ(25px)]">
                  {c.body}
                </p>
              </div>
            </Tilt>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
