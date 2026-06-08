import Image from "next/image";

import { cn } from "@/lib/utils";

type EntityLogoSize = "xs" | "sm" | "md";

const sizeClasses: Record<EntityLogoSize, string> = {
  xs: "size-4",
  sm: "size-5",
  md: "size-6",
};

const pixelSizes: Record<EntityLogoSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
};

interface EntityLogoProps {
  src?: string | null;
  alt: string;
  fallback: string;
  size?: EntityLogoSize;
  className?: string;
}

export function EntityLogo({
  src,
  alt,
  fallback,
  size = "sm",
  className,
}: EntityLogoProps) {
  const boxClass = cn(
    "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-sm bg-muted/40",
    sizeClasses[size],
    className,
  );

  if (src) {
    const px = pixelSizes[size];
    return (
      <span className={boxClass}>
        <Image
          src={src}
          alt={alt}
          width={px}
          height={px}
          className="size-full object-contain"
          unoptimized={src.endsWith(".svg")}
        />
      </span>
    );
  }

  return (
    <span className={boxClass} aria-hidden={alt === ""}>
      <span className="text-[10px] leading-none sm:text-[11px]">
        {fallback}
      </span>
    </span>
  );
}
