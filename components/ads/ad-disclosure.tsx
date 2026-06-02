import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

interface AdDisclosureProps {
  className?: string;
}

export function AdDisclosure({ className }: AdDisclosureProps) {
  return (
    <p
      className={cn(
        "text-xs font-medium tracking-wide text-muted-foreground uppercase",
        className,
      )}
      aria-label={copy.ads.aria.ad}
    >
      {copy.ads.aria.ad}
    </p>
  );
}
