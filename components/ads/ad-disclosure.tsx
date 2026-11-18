import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

interface AdDisclosureProps {
  className?: string;
}

export function AdDisclosure({ className }: AdDisclosureProps) {
  return (
    <p
      className={cn(
        "text-muted-foreground text-xs font-medium tracking-wide uppercase",
        className,
      )}
      aria-label={copy.ads.aria.ad}
    >
      {copy.ads.aria.ad}
    </p>
  );
}
