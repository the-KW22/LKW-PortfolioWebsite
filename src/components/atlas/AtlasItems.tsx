import type { CSSProperties, ReactNode } from "react";
import { BOARD_CENTRE, projectPlacements, textureItems, titlePlacement, type Placement } from "@/content/atlas";
import { site } from "@/content/site";
import type { Project, Tech } from "@/content/types";

/** Up to `max` tags; AI tags are kept first in line so the lime ones always show. Original order is kept. */
export function cardTags(stack: Tech[], max = 5): { tags: Tech[]; more: number } {
  if (stack.length <= max) return { tags: stack, more: 0 };
  const ai = stack.filter((t) => t.ai).slice(0, 2);
  const rest = stack.filter((t) => !ai.includes(t)).slice(0, max - ai.length);
  const keep = new Set([...ai, ...rest]);
  return { tags: stack.filter((t) => keep.has(t)), more: stack.length - keep.size };
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

function Item({
  id,
  at,
  children,
  decorative = true,
  className = "",
  card = false,
}: {
  id: string;
  at: Placement;
  children: ReactNode;
  decorative?: boolean;
  className?: string;
  card?: boolean;
}) {
  const style: CSSProperties = {
    transform: `translate3d(${at.x}px, ${at.y}px, ${at.z}px) translate(-50%, -50%) rotate(${at.r}deg)`,
  };
  return (
    <div
      className={`atlas-item ${className}`}
      style={style}
      data-atlas-item={id}
      data-x={at.x}
      data-y={at.y}
      data-card={card ? "" : undefined}
      aria-hidden={decorative ? true : undefined}
    >
      {children}
    </div>
  );
}

/** Dotted-grid placeholder until real screenshots arrive (spec 7.1). TODO(owner): screenshots, assets checklist. */
function Thumb({ index }: { index: number }) {
  return (
    <div className="atlas-thumb" data-placeholder="screenshot" aria-hidden="true" style={{ filter: `hue-rotate(${index * 55}deg)` }}>
      <div className="atlas-thumb-ui">
        <i className="side" />
        <i className="bar" />
        <i className="c1" />
        <i className="c2" />
        <i className="c3" />
      </div>
    </div>
  );
}

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const { tags, more } = cardTags(project.stack);
  const at = projectPlacements[project.slug] ?? {
    x: 600 + index * 600,
    y: 400,
    z: 30,
    r: 0,
  };
  return (
    <Item id={project.slug} at={at} decorative={false} card>
      {/* Real link: works without JS and for crawlers; the warp provider adds the kinetic transition on a plain click. */}
      <a
        href={`/projects/${project.slug}`}
        data-warp="enter"
        data-warp-name={project.name}
        className="atlas-card"
        data-cursor="label"
        data-cursor-label="OPEN"
        data-atlas-card={project.slug}
        draggable={false}
        aria-label={`${project.name}, project ${index + 1} of ${total}. ${project.tagline}`}
      >
        <Thumb index={index} />
        <span className="atlas-card-row">
          <span className="atlas-card-name">{project.name}</span>
          <span className="mono-label text-mute">{pad2(project.order)}</span>
        </span>
        <span className="atlas-card-tag">{project.tagline}</span>
        {tags.length > 0 && (
          <span className="atlas-tags">
            {tags.map((t) => (
              <span key={t.name} className={t.ai ? "atlas-chip is-ai" : "atlas-chip"}>
                {t.name}
              </span>
            ))}
            {more > 0 && <span className="atlas-chip">+{more}</span>}
          </span>
        )}
      </a>
    </Item>
  );
}

/** Every item that sits on the 3600x2400 board. Only the project cards are focusable and exposed. */
export function AtlasItems({ projects }: { projects: Project[] }) {
  const copy = site.availabilityCopy[site.availability].toLowerCase();
  return (
    <>
      <Item id="title" at={titlePlacement} className="atlas-title">
        <p className="mono-label text-mute">03 — {projects.length} builds — drag to explore</p>
        <p className="atlas-title-h">
          Personal
          <br />
          <em>projects</em>
        </p>
      </Item>

      {projects.map((p, i) => (
        <ProjectCard key={p.slug} project={p} index={i} total={projects.length} />
      ))}

      {textureItems.map((t) => {
        switch (t.kind) {
          case "note":
            return (
              <Item key={t.id} id={t.id} at={t.at}>
                <div className="atlas-note">{t.text}</div>
              </Item>
            );
          case "availability":
            return (
              <Item key={t.id} id={t.id} at={t.at}>
                <div className="atlas-note is-lime">{site.atlasNote[site.availability]}</div>
              </Item>
            );
          case "code":
            return (
              <Item key={t.id} id={t.id} at={t.at}>
                <pre className="atlas-code">{t.lines.join("\n")}</pre>
              </Item>
            );
          case "terminal":
            return (
              <Item key={t.id} id={t.id} at={t.at}>
                <pre className="atlas-code">
                  {`$ whoami\n${site.headline.split("|").map((s) => s.trim().toLowerCase()).join(", ")}\n$ status\n${copy}`}
                </pre>
              </Item>
            );
          case "polaroid":
            return (
              <Item key={t.id} id={t.id} at={t.at}>
                {/* Plain anchor on purpose: /v1 is a static build outside the Next router. */}
                <a href={t.href} tabIndex={-1} draggable={false} className="atlas-polaroid" data-cursor="label" data-cursor-label="OPEN">
                  <span className="ph">ver 1.0</span>
                  {t.caption}
                </a>
              </Item>
            );
        }
      })}
    </>
  );
}

export { BOARD_CENTRE };
