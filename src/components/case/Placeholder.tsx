import type { Media } from "@/content/types";

/**
 * Generated stand-in for a screenshot the owner has not supplied. Deliberately unlike a real
 * screenshot: hatched, dashed, with a "Screenshot coming" label, so it can never pass as content.
 */
export function Placeholder({ media, label }: { media: Media; label: string }) {
  return (
    <div
      role="img"
      aria-label={media.alt}
      data-placeholder
      className="relative grid w-full place-items-center overflow-hidden bg-[#0b0b12]"
      style={{
        aspectRatio: `${media.width} / ${media.height}`,
        backgroundImage:
          "radial-gradient(#24232f 1px, transparent 1px), repeating-linear-gradient(135deg, transparent 0 14px, rgba(139,123,255,0.05) 14px 15px)",
        backgroundSize: "28px 28px, auto",
      }}
    >
      <div aria-hidden="true" className="absolute inset-3 rounded-xl border border-dashed border-[#3a3950]" />
      <span
        aria-hidden="true"
        className="font-display px-6 text-center text-[clamp(32px,7vw,110px)] leading-none font-black tracking-display text-ink/[0.09] select-none"
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className="mono-label absolute bottom-5 left-5 rounded-full border border-dashed border-lime/70 bg-bg/70 px-3 py-1.5 text-lime"
      >
        Screenshot coming
      </span>
    </div>
  );
}
