import { cn } from "@/lib/utils";

interface HouseAdProps {
  height: number;
  className?: string;
}

export function HouseAd({ height, className }: HouseAdProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/40 px-4 text-center",
        className,
      )}
      style={{ height }}
      role="img"
      aria-label="Χώρος διαφήμισης"
    >
      <p className="text-sm text-muted-foreground">Χώρος διαφήμισης</p>
    </div>
  );
}
