import Image from "next/image";

/**
 * The photo library is gitignored (client media lives in Drive); a slot's src
 * is null on any machine without it. Render the photograph when it exists and
 * an honest tonal field when it does not — never a broken image, never a
 * faked one (the photo-batch rule: do not fake the gap).
 *
 * Fill-positioned: parents are relative containers.
 */
export function MediaOrField({
  src,
  alt,
  sizes,
  priority = false,
  className = "object-cover",
  fieldClass = "bg-evergreen/40",
}: {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  fieldClass?: string;
}) {
  if (!src) {
    return (
      <div
        aria-hidden
        data-placeholder="media-field"
        className={`absolute inset-0 ${fieldClass}`}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
