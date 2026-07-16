import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

interface HouseAdProps {
  height: number;
  className?: string;
}

export function HouseAd({ height, className }: HouseAdProps) {
  return (
    <div
      className={cn(
        "border-border bg-muted/40 flex w-full items-center justify-center overflow-hidden rounded-lg border border-dashed px-4 text-center",
        className,
      )}
      style={{ height }}
      role="img"
      aria-label={copy.ads.aria.adSlot}
    >
      <p className="text-muted-foreground text-sm">
        {copy.ads.houseAdPlaceholder}
      </p>
    </div>
  );
}
