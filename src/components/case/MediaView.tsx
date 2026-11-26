import Image from "next/image";
import type { Media } from "@/content/types";
import { XrayFrame } from "@/components/xray/XrayFrame";
import { Placeholder } from "./Placeholder";
import { LazyVideo } from "./LazyVideo";

/**
 * One image, video or generated placeholder. Always has alt text and fixed dimensions (no layout
 * shift). When the media carries an X-ray layer it is wrapped in an <XrayFrame> (lens and bones).
 */
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
  const picture = !media.src ? (
    <Placeholder media={media} label={label} />
  ) : media.video ? (
    <LazyVideo src={media.video} poster={media.src} alt={media.alt} width={media.width} height={media.height} />
  ) : (
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
  return media.xray ? <XrayFrame layer={media.xray}>{picture}</XrayFrame> : picture;
}
