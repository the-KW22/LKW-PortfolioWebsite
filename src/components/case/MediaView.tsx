import Image from "next/image";
import type { Media } from "@/content/types";
import { Placeholder } from "./Placeholder";
import { LazyVideo } from "./LazyVideo";

/** One image, video or generated placeholder. Always has alt text and fixed dimensions (no layout shift). */
export function MediaView({
  media,
  label,
  sizes = "(min-width: 1024px) 88vw, 100vw",
  priority = false,
}: {
  media: Media;
  /** Project name, shown on the placeholder plate. */
  label: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!media.src) return <Placeholder media={media} label={label} />;
  if (media.video) {
    return <LazyVideo src={media.video} poster={media.src} alt={media.alt} width={media.width} height={media.height} />;
  }
  return (
    <Image
      src={media.src}
      alt={media.alt}
      width={media.width}
      height={media.height}
      sizes={sizes}
      priority={priority}
      className="block h-auto w-full"
    />
  );
}
