"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotion } from "@/hooks/useMotion";
import { useReveal } from "@/components/motion/Reveal";
import { experience } from "@/content/experience";
import { experienceCopy } from "@/content/home";
import type { ExperienceEntry } from "@/content/types";
import { ProjectCaseFile } from "./ProjectCaseFile";
import { SectionHead } from "./SectionHead";

function Job({ e }: { e: ExperienceEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { selector: "[data-job-in]", y: 40, stagger: 0.07, start: "top 75%" });
  return (
    <div
      ref={ref}
      data-job
      className="group relative grid gap-3 pb-[11vh] md:grid-cols-[240px_1fr] md:gap-[4vw]"
    >
      {/* Timeline node: violet ring, lime once the line has reached it. */}
      <span
        aria-hidden="true"
        className="absolute top-2.5 -left-[44px] size-3.5 rounded-full border-2 border-violet bg-bg transition-[background,border-color,box-shadow] duration-300 group-data-[on=true]:border-lime group-data-[on=true]:bg-lime group-data-[on=true]:shadow-[0_0_16px_var(--lime)]"
      />
      <p className="mono-label pt-2 text-mute">{e.period}</p>
      <div>
        <h3
          data-job-in
          className="font-display text-[clamp(26px,3.2vw,50px)] leading-none font-extrabold tracking-[-0.035em]"
        >
          {e.role}{" "}
          <span className="block font-serif text-[0.7em] font-normal tracking-normal text-mute italic sm:inline">
            at {e.organisation}
          </span>
        </h3>
        {e.points.length > 0 ? (
          <ul className="mt-6 grid max-w-3xl gap-2 text-[15px] leading-normal text-[#b9b8c6]">
            {e.points.map((pt) => (
              <li key={pt} data-job-in>
                {pt}
              </li>
            ))}
          </ul>
        ) : null}
        {e.projects ? (
          <ProjectCaseFile projects={e.projects} />
        ) : null}
      </div>
    </div>
  );
}

/** 04 Experience: a violet line draws itself with scroll, each node turns lime when reached. */
export function Experience() {
  const tl = useRef<HTMLDivElement>(null);
  useMotion(tl, () => {
    const el = tl.current;
    if (!el) return;
    const line = el.querySelector<HTMLElement>("[data-tl-line]");
    const jobs = gsap.utils.toArray<HTMLElement>("[data-job]", el);
    if (line) {
      gsap.set(line, { scaleY: 0, transformOrigin: "top" });
      gsap.to(line, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 60%", end: "bottom 60%", scrub: true },
      });
    }
    jobs.forEach((j) =>
      ScrollTrigger.create({
        trigger: j,
        start: "top 60%",
        onEnter: () => j.setAttribute("data-on", "true"),
        onLeaveBack: () => j.removeAttribute("data-on"),
      }),
    );
    return () => jobs.forEach((j) => j.removeAttribute("data-on"));
  }, []);

  return (
    <section id="experience" aria-labelledby="experience-title" className="px-[5vw] pt-[20vh] pb-[14vh]">
      <SectionHead
        num="04"
        label="Experience"
        id="experience-title"
        lines={experienceCopy.titleLines}
        accent="shipped"
      />
      <div ref={tl} className="relative pl-[46px]">
        <span aria-hidden="true" className="absolute top-0 bottom-0 left-2 w-0.5 bg-line" />
        <span
          aria-hidden="true"
          data-tl-line
          className="absolute top-0 bottom-0 left-2 w-0.5 bg-violet"
        />
        {experience.map((e) => (
          <Job key={e.id} e={e} />
        ))}
      </div>
    </section>
  );
}
