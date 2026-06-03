import { Fragment } from "react";

import type { StandingsTableRow } from "@/lib/standings/queries";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const t = copy.standings.table;

interface StandingsTableProps {
  rows: StandingsTableRow[];
  className?: string;
  /** Ranks after which to render a thicker phase separator (e.g. Super League 4 and 8). */
  phaseBreaksAfterRanks?: number[];
}

function hasExtendedStats(rows: StandingsTableRow[]): boolean {
  return rows.some(
    (r) =>
      r.played !== undefined ||
      r.won !== undefined ||
      r.drawn !== undefined ||
      r.lost !== undefined,
  );
}

function phaseSeparatorLabel(rank: number): string {
  if (rank === 4) return copy.standings.phaseSeparatorPlayoffs;
  if (rank === 8) return copy.standings.phaseSeparatorPlayouts;
  return "";
}

export function StandingsTable({
  rows,
  className,
  phaseBreaksAfterRanks,
}: StandingsTableProps) {
  const phaseBreaks = new Set(phaseBreaksAfterRanks ?? []);
  const extended = hasExtendedStats(rows);

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {copy.standings.emptySync}
      </p>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[320px] text-sm" aria-label={t.ariaLabel}>
        <thead>
          <tr className="border-b border-border text-left text-[11px] text-muted-foreground">
            <th className="pb-2 pr-2 font-medium w-10">{t.rank}</th>
            <th className="pb-2 pr-2 font-medium">{t.team}</th>
            {extended ? (
              <>
                <th className="pb-2 px-1 font-medium text-center w-8">
                  {t.played}
                </th>
                <th className="pb-2 px-1 font-medium text-center w-8">
                  {t.won}
                </th>
                <th className="pb-2 px-1 font-medium text-center w-8">
                  {t.drawn}
                </th>
                <th className="pb-2 px-1 font-medium text-center w-8">
                  {t.lost}
                </th>
              </>
            ) : null}
            <th className="pb-2 pl-2 font-medium text-right w-12">
              {t.points}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <Fragment key={row.rank}>
              <tr className="border-b border-border/60 last:border-0">
                <td className="py-2 pr-2 tabular-nums text-muted-foreground">
                  {row.rank}
                </td>
                <td className="py-2 pr-2 font-medium">{row.team}</td>
                {extended ? (
                  <>
                    <td className="py-2 px-1 text-center tabular-nums">
                      {row.played ?? "—"}
                    </td>
                    <td className="py-2 px-1 text-center tabular-nums">
                      {row.won ?? "—"}
                    </td>
                    <td className="py-2 px-1 text-center tabular-nums">
                      {row.drawn ?? "—"}
                    </td>
                    <td className="py-2 px-1 text-center tabular-nums">
                      {row.lost ?? "—"}
                    </td>
                  </>
                ) : null}
                <td className="py-2 pl-2 text-right font-medium tabular-nums">
                  {row.points}
                </td>
              </tr>
              {phaseBreaks.has(row.rank) ? (
                <tr
                  key={`phase-${row.rank}`}
                  className="border-b-2 border-border"
                  aria-hidden={phaseSeparatorLabel(row.rank) === ""}
                >
                  <td colSpan={extended ? 8 : 3}>
                    <span className="sr-only">
                      {phaseSeparatorLabel(row.rank)}
                    </span>
                  </td>
                </tr>
              ) : null}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
