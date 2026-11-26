import type { XrayLayer } from "@/content/types";
import { DraftTag, TodoText } from "@/components/case/TodoText";

const KIND: Record<string, string> = { flow: "Data flow", data: "Data", security: "Security", build: "Build" };

/**
 * The X-ray information as plain text, for keyboard and screen-reader users and for anyone with
 * JavaScript off (review decision 6). A native disclosure: reachable by Tab, opens with Enter or
 * Space, and the notes are real text.
 */
export function XrayNotes({ layer, className }: { layer: XrayLayer; className?: string }) {
  return (
    <details className={className ?? "mt-4 rounded-xl border border-line bg-card/60 px-4 py-3"}>
      <summary className="mono-label cursor-pointer rounded-md py-1 text-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime">
        Show the engineering notes
        <span className="sr-only">: {layer.title}</span>
      </summary>
      <div className="mt-3 text-sm leading-relaxed text-[#c9c8d6]">
        <p className="mono-label text-mute">
          {layer.title}
          <DraftTag />
        </p>
        {layer.boxes.length > 0 ? (
          <p className="mt-3">
            <span className="mono-label text-mute">Regions: </span>
            {layer.boxes.map((b) => b.label).join(", ")}.
          </p>
        ) : null}
        <ul className="mt-3 space-y-2">
          {layer.notes.map((note, i) => (
            <li key={i} className="flex gap-3">
              <span className="mono-label w-20 shrink-0 pt-0.5 text-lime">{KIND[note.kind]}</span>
              <TodoText text={note.text} />
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
