import { copy } from "@/lib/copy";

export function TransfersUnavailable() {
  return (
    <div className="border-border bg-muted/30 rounded-lg border px-4 py-8 text-center">
      <p className="text-sm font-medium">
        {copy.transfers.temporarilyUnavailable}
      </p>
      <p className="text-muted-foreground mt-1 text-sm">
        {copy.transfers.temporarilyUnavailableHint}
      </p>
    </div>
  );
}
