import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { contactCopy } from "@/content/home";
import { HAS_RESUME } from "@/lib/resume";
import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";
import { MailLink } from "./MailLink";
import { pill } from "./ui";

/** 07 Contact: headline, email and links on the left, the form (UI only in Phase 2) on the right. */
export function Contact() {
  const [l1, l2] = contactCopy.headline;
  return (
    <section id="contact" aria-labelledby="contact-title" className="overflow-hidden px-[5vw] pt-[18vh] pb-[10vh]">
      <p className="mono-label flex items-center gap-[18px] text-mute">
        <b className="font-medium text-lime">07</b>
        <span>Contact</span>
      </p>
      <h2
        id="contact-title"
        className="mt-[30px] font-display text-[clamp(52px,13vw,220px)] leading-[0.84] font-black tracking-[-0.06em]"
      >
        <SplitText text={l1} as="span" mode="rise" className="block pb-[0.08em]" />
        <SplitText text={l2} as="span" mode="rise" accent={contactCopy.accent} className="block pb-[0.08em]" />
      </h2>
      <div className="mt-[10vh] grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-[6vw]">
        <Reveal selector="[data-c-in]" stagger={0.1}>
          <p data-c-in className="mono-label mb-3.5 text-mute">
            {contactCopy.emailLabel}
          </p>
          <div data-c-in>
            <MailLink email={site.email} />
          </div>
          <div data-c-in className="mt-7 flex flex-wrap gap-2.5">
            <a href={site.links.github} className={pill} rel="noopener noreferrer" target="_blank">
              GitHub ↗
            </a>
            {/* TODO(owner): LinkedIn URL (assets checklist section 3). Hidden until it exists. */}
            {site.links.linkedin ? (
              <a href={site.links.linkedin} className={pill} rel="noopener noreferrer" target="_blank">
                LinkedIn ↗
              </a>
            ) : null}
            {HAS_RESUME ? (
              <a href={site.links.resume} className={pill}>
                CV ↗
              </a>
            ) : null}
          </div>
          <p data-c-in className="mt-10 max-w-sm leading-relaxed text-mute">
            {contactCopy.availabilityLine[site.availability]}
            <br />
            Based in {site.location} (GMT+8).
            {/* TODO(owner): reply-time line (site.replyTime) */}
            {site.replyTime ? ` ${site.replyTime}` : null}
          </p>
        </Reveal>
        <ContactForm />
      </div>
    </section>
  );
}
