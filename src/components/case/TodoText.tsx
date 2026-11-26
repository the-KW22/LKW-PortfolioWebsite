import { isTodo } from "@/content/projects/media";

/**
 * Renders a content string. Text that still needs the owner (`TODO(owner): ...`) is shown as a
 * clearly marked placeholder chip instead of raw marker text.
 */
export function TodoText({ text, className }: { text: string; className?: string }) {
  if (!isTodo(text)) return <span className={className}>{text}</span>;
  const note = text.replace(/^\s*TODO\(owner\):?\s*/, "");
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1 text-base font-normal tracking-normal">
      <span className="mono-label rounded-full border border-dashed border-lime/70 px-2.5 py-1 text-lime">
        Owner to write
      </span>
      {note ? <span className="text-mute italic">{note}</span> : null}
    </span>
  );
}

/** Small tag for agent-written text awaiting the owner's approval. */
export function DraftTag() {
  return (
    <span className="mono-label ml-3 rounded-full border border-dashed border-[#3a3950] px-2 py-0.5 align-middle text-mute">
      Draft
    </span>
  );
}
