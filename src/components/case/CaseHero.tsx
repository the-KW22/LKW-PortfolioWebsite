import type { Project } from "@/content/types";
import { SplitText } from "@/components/motion/SplitText";
import { StackList } from "./StackList";
import { TodoText } from "./TodoText";

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="mono-label mb-2 text-mute">{label}</dt>
      <dd className="text-[15px] leading-relaxed text-[#c9c8d6]">{children}</dd>
    </div>
  );
}

/** Case-study label, giant title (letters rise in) and the meta row: role, what, stack, links. */
export function CaseHero({ project }: { project: Project }) {
  const { links } = project;
  const hasLink = links.live || links.github;
  return (
    <div className="px-[5vw] pt-[6vh]">
      <p className="mono-label text-mute">
        Case study{project.year ? ` — ${project.year}` : ""}
        {project.status === "in-progress" ? <span className="ml-3 text-lime">In progress</span> : null}
      </p>
      <SplitText
        as="h1"
        text={project.name}
        waitForPreloader
        by="chars"
        className="font-display mt-[4vh] block text-[clamp(52px,15vw,230px)] leading-[0.86] font-black tracking-[-0.06em]"
      />
      <dl className="mt-10 grid gap-8 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
        <Meta label="Role">
          <TodoText text={project.role} />
        </Meta>
        <Meta label="What">{project.tagline}</Meta>
        <Meta label="Stack">
          {project.stack.length ? (
            <StackList stack={project.stack} />
          ) : (
            <TodoText text="TODO(owner): stack" />
          )}
        </Meta>
        <Meta label="Links">
          {hasLink ? (
            <span className="flex flex-col items-start gap-1.5">
              {links.live ? (
                <a
                  href={links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-violet focus-visible:text-violet"
                >
                  Live site ↗
                </a>
              ) : null}
              {links.liveNote ? <span className="text-sm text-mute">{links.liveNote}</span> : null}
              {links.github ? (
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-violet focus-visible:text-violet"
                >
                  GitHub ↗
                </a>
              ) : null}
            </span>
          ) : (
            <TodoText text="TODO(owner): links" />
          )}
        </Meta>
      </dl>
    </div>
  );
}
