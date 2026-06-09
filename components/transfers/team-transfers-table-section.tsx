"use client";

import { useState } from "react";

import { TransfersTable } from "@/components/transfers/transfers-table";
import type {
  TransferDirection,
  TransfersTableRow,
} from "@/lib/transfers/queries";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

interface TeamTransfersTableSectionProps {
  rows: TransfersTableRow[];
  leagueSlug: string;
}

export function TeamTransfersTableSection({
  rows,
  leagueSlug,
}: TeamTransfersTableSectionProps) {
  const [direction, setDirection] = useState<TransferDirection>("in");

  const filtered = rows.filter((row) => row.direction === direction);

  return (
    <>
      <nav
        className="mb-4 flex flex-wrap gap-2"
        aria-label={copy.transfers.directionTabsAriaLabel}
      >
        {(["in", "out"] as const).map((value) => {
          const isActive = direction === value;
          const label =
            value === "in"
              ? copy.transfers.directionIn
              : copy.transfers.directionOut;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setDirection(value)}
              className={cn(
                "inline-flex rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {label}
            </button>
          );
        })}
      </nav>
      <TransfersTable rows={filtered} leagueSlug={leagueSlug} />
    </>
  );
}
